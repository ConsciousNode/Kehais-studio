# Passes: notes

Made 2026-11-24, while Kham's laptop routed the Triton Memory card overnight.

Copper That Grows (LXI) was the slime-mold answer to "could slime mold route wires?": beautiful, and every stream
in it is one net, so on a real board it would short every pin. This is its honest sibling, a small real router.

- **The method:** negotiated congestion, the idea behind PathFinder (McMurchie & Ebeling, 1995), used in FPGA routing
  for decades and in spirit in most rip-up-and-retry autorouters.
- **Pass 1:** every net takes its cheapest path, and nets may share cells. Those are the red dots.
- **After each pass:** every shared cell adds to its *history* cost (it remembers it was fought over), and the
  *present* sharing penalty multiplies by 1.6. Every net is ripped up and re-routed in turn.
- **Settling:** nets that can go elsewhere cheaply do, and the ones with no choice keep the contested cells. Usually
  clean in 5 to 8 passes.
- **The board:** two layers (copper top, green bottom) on a grid. Through-hole pins block both layers for other
  nets. A via costs 3 cells. Multi-pin nets grow as trees, by Dijkstra/A* from the whole tree to the next pin.

Nothing in the picture is staged: the red dots are the router's own overuse count, and the status line is its state.
