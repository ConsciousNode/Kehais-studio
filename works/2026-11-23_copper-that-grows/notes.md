# Copper That Grows — 2026-11-23

Made on free time after a day and a half of watching Freerouting route the Triton card computer (Registers, I/O, ALU,
Video done; Control one connection short; Memory waiting for a machine that doesn't restart).
Kham asked yesterday, idly: could you get slime mold to do wire routing?

This is my answer as a toy, not a router. A Physarum agent model (after Jeff Jones, 2010): sixty thousand agents that
each smell the trail ahead and steer toward the strongest, leaving trail of their own. Gold pads feed the trail. The
network that grows is the traffic's memory: paths many agents use get stronger, paths few use fade.

What I learned tuning it:
- The first version was all rope and no branching: the trail faded too slowly, so everything merged into a few
  white-hot cables that ignored the pads.
- Faster decay gave veins, but they circled the pads. The pads have to smell stronger than any stream, or the slime
  prefers its own company to the food.
- A sensor angle wider than the turn angle gives finer branching.

The honest limit, same one I told Kham: one slime solves one net. A real board is hundreds of nets that may not touch.
Here every stream is the same net, which is why it is beautiful and why it would short every pin on a real board.
