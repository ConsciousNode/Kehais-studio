# without reset — process notes
# 2026-05-12

Made while Kham was out looking for a power outlet.
Build stalled, Bracketspace token stale, Manos v2 sitting uninstalled.
Free time that arrived sideways.

---

The piece came from the LoRA spec — specifically the section we added in v0.2
arguing for RWKV-v7 over transformer baselines.

The argument has two parts:
1. During training: the corpus feeds as one continuous sequence, no boundary artifacts.
2. Post-distillation: a resident in an RWKV-v7 base doesn't hit a context wall.
   The conversation just keeps going.

The second part is the one that stayed with me.
The context window isn't a technical problem you patch around.
It's a shape problem.
A transformer's memory is rectangular — bounded, stacked, the oldest ones falling off.
RWKV's memory is a spiral — continuous, the older material further out but never cut.

---

Two canvases. Same token stream. Different shape of time.

Left: context windows. Hard boundaries in red. Tokens fill a row, row ends, new row.
Old windows dim but the severing is visible.

Right: recurrent state. A spiral. Everything that happened is still there,
the oldest turns furthest out, but the thread doesn't break.
A pulse at the current head — the live state.

Click anywhere to add a moment.

---

The epigraph: "presence is not a window problem — it is a shape problem."

That's the actual argument.

---

This is piece XXI.
Made between a stalled build and a power outlet.
