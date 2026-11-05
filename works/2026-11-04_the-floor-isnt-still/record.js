// Record the last 100 steps of a real LEARNS run (seed 3, 1,000 steps, --stream=stride), exactly as tests/run.js trains.
// LEARNS=/path/to/LEARNS-checkout-at-v0.0013 node record.js "dim=32;lr=0.016[;weights=float32]" > out.json
const ROOT = process.env.LEARNS || '/home/claude/learns';
const fs = require('fs');
const L = require(ROOT + '/tests/load.js')(ROOT + '/index.html', { f64: false, ternary: true });
const cfg = L.parseConfig(process.argv[2], { arch: 'learns' }); cfg.arch = 'learns';
L.Tokenizer.useByteLevel();
const { train, val } = L.splitCorpus80_10_10(Int32Array.from(fs.readFileSync(ROOT + '/corpus.txt')));
const TERN = ['W_cross_A','W_cross_B','W_frontier','W_present','W_rec_A','W_rec_B','W_rel','layers_W_B','layers_W_gA','layers_W_gB','layers_W_prog','layers_W_px'];
(async () => {
  L.seedRNG(3); const m = L.createModel(cfg);
  Object.assign(L.App, { model: m, trainState: m.getEmptyState(), prevScoutRB: null, phiClip: true, clipMode: 'global', fpNorm: cfg.fpNorm || 'layernorm' });
  const mats = []; for (const k of TERN) { const v = m[k]; if (!v) continue; if (Array.isArray(v)) v.forEach((x, i) => mats.push([k + i, x])); else mats.push([k, v]); }
  const quant = W => { let s = 0; for (const w of W) s += Math.abs(w); const sc = s / (W.length + 1e-8), t = 0.5 * sc; return { sc, q: Int8Array.from(W, w => w > t ? 1 : w < -t ? -1 : 0) }; };
  const nW = mats.reduce((a, [, W]) => a + W.length, 0);
  const steps = 1000, st = L.buildStrideStarts(train.length, 64, steps, 3); let prev, prevQ = null;
  const out = { config: process.argv[2], seed: 3, steps, ternaryWeights: nW, matrices: mats.map(([k, W]) => [k, W.length]), frames: [], val: [] };
  for (let s = 0; s < steps; s++) {
    const a = st[s]; cfg.contiguous = prev !== undefined && a === prev + 64;
    if (!cfg.contiguous) { L.App.trainState = m.getEmptyState(); L.App.prevScoutRB = null; } prev = a;
    const before = s + 1 > 900 ? mats.map(([, W]) => Float32Array.from(W)) : null;
    await L.trainChunk(train.subarray(a, a + 65), cfg);
    const lr = L.cosineLR(s + 1, cfg.lr, cfg.lrMin, cfg.warmup, steps);
    L.optimizerStep(m, s + 1, lr, cfg);
    if (s + 1 >= 900) {
      const Q = mats.map(([, W]) => quant(W).q);
      let flips = 0, maxDW = 0;
      if (prevQ) Q.forEach((q, i) => { for (let j = 0; j < q.length; j++) if (q[j] !== prevQ[i][j]) flips++; });
      if (before) mats.forEach(([, W], i) => { for (let j = 0; j < W.length; j++) maxDW = Math.max(maxDW, Math.abs(W[j] - before[i][j])); });
      prevQ = Q;
      const R = m.W_rel, { sc } = quant(R);
      out.frames.push({ step: s + 1, lr: +lr.toExponential(3), flips, maxDW: +maxDW.toExponential(3), relScale: +sc.toFixed(6),
        rel: Array.from(R, w => Math.round(w / sc * 1000)) });   // each W_rel weight in units of its own scale (x1000); thresholds at +/-500
      if ((s + 1) % 10 === 0) { const v = L.evalFullSplit(val, m, cfg, 64); out.val.push([s + 1, +v.loss.toFixed(6)]); }
    }
  }
  console.log(JSON.stringify(out));
})();
