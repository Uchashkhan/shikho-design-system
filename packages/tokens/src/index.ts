// v0.1 — implements only the categories with confirmed audit values: color, radius, elevation.
// Typography, spacing, and gradients are deliberately not exported yet — see
// docs/token-normalization-decisions.md and packages/tokens/README.md for what's deferred and why.
// `subjectColor` is a partial exception: 32 of ~35 subjects named in the Figma layer tree are
// confirmed and exported; a handful of remaining layer names were never located in any audited
// frame and are not stubbed (see the doc comment on `subjectColor` in ./color.ts).

export * from "./color";
export * from "./radius";
export * from "./elevation";

import { color } from "./color";
import { elevation } from "./elevation";
import { radius } from "./radius";

export const tokens = { color, radius, elevation };
