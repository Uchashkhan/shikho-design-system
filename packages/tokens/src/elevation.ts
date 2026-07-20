// Confirmed exact values only. All six levels (e1-e6) are fully resolved across the audit series —
// each was retrieved from a different file (see the per-level citation below) rather than from a
// single `elevations.md` query. Every layer uses the same shadow color, `elevation/Black 50`
// (#0000000a, 3.9% opacity black), and every offset is purely vertical (x: 0).

export interface ShadowLayer {
  type: "DROP_SHADOW";
  color: string;
  x: number;
  y: number;
  blur: number;
  spread: number;
}

export type ElevationLevel = readonly ShadowLayer[];

const shadowColor = "#0000000a"; // elevation/Black 50 — confirmed identical across every level

function layer(y: number, blur: number, spread: number): ShadowLayer {
  return { type: "DROP_SHADOW", color: shadowColor, x: 0, y, blur, spread };
}

// docs/audit/table.md §3 — the last-resolved level, completing the full e1-e6 set.
export const e1: ElevationLevel = [layer(1, 1, -0.5)];

// docs/audit/elevations.md §2 (confirmed directly, not via incidental binding).
export const e2: ElevationLevel = [layer(3, 3, -1.5), layer(1, 1, -0.5)];

// docs/audit/tooltips.md §8.
export const e3: ElevationLevel = [layer(24, 24, -12), layer(3, 3, -1.5), layer(1, 1, -0.5)];

// docs/audit/date-picker.md §8. Note: breaks the additive-stacking pattern seen elsewhere —
// introduces new values (32, 6) and drops e3's distinctive 24 rather than extending it.
export const e4: ElevationLevel = [
  layer(32, 32, -16),
  layer(6, 6, -3),
  layer(3, 3, -1.5),
  layer(1, 1, -0.5),
];

// docs/audit/button-group.md §11 (also confirmed identically in docs/audit/input.md).
export const e5: ElevationLevel = [
  layer(56, 56, -28),
  layer(32, 32, -16),
  layer(6, 6, -3),
  layer(3, 3, -1.5),
  layer(1, 1, -0.5),
];

// docs/audit/elevations.md §3 (confirmed directly, not via incidental binding).
export const e6: ElevationLevel = [
  layer(64, 64, -32),
  layer(32, 32, -16),
  layer(12, 12, -6),
  layer(6, 6, -3),
  layer(3, 3, -1.5),
  layer(1, 1, -0.5),
];

export const elevation = { e1, e2, e3, e4, e5, e6 };
