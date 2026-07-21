import { type CSSProperties, type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { color, elevation, radius } from "@shikho/tokens";

// docs/audit/tooltips.md §2 — tooltip: exactly one property, `direction` (8 values). No `size`,
// `type`, or `state` property exists. Casing/spelling preserved verbatim, including the
// confirmed typo: `botom_left`/`botom_right` are missing the second "t" in "bottom", while
// `bottom_center` in the same property's value set is spelled correctly (§10, §11).
export type TooltipDirection =
  | "botom_left"
  | "top_left"
  | "botom_right"
  | "top_right"
  | "bottom_center"
  | "top_center"
  | "left_center"
  | "right_center";

// docs/audit/tooltips.md §4 — confirmed bounding-box dimensions. The six vertically-oriented
// placements are 240×152; the two horizontally-oriented ones are 240×144 (an 8px difference).
// No `get_design_context` deep audit was run on this family (§6), so — unlike every other
// component in this library — whether these are Fixed or Hug-driven dimensions was never
// confirmed either way. Width is applied as a max-width (content still determines actual size,
// consistent with how "confirmed Hug height" is treated everywhere else in this library); height
// is left to content entirely, since forcing it would very likely break real usage.
const WIDTH: Record<TooltipDirection, number> = {
  botom_left: 240,
  top_left: 240,
  botom_right: 240,
  top_right: 240,
  bottom_center: 240,
  top_center: 240,
  left_center: 240,
  right_center: 240,
};

// docs/audit/tooltips.md §8 — spacing/8 is present in this component's own confirmed spacing
// export (not attributed to a specific side, same limitation as every sparsely-audited
// component in this library). Used here as the gap between the tooltip and its anchor.
const ANCHOR_GAP = 8;
// spacing/12, likewise present in the export, used as the bubble's own internal padding.
const BUBBLE_PADDING = 12;

/**
 * Positions the tooltip relative to a `position: relative` anchor, using the `direction` value's
 * own evident purpose (placement) — not an invented interaction, just standard CSS for the one
 * property the audit confirms exists. Offsets are built from `spacing/8` (§8).
 */
function positionFor(direction: TooltipDirection): CSSProperties {
  const gap = ANCHOR_GAP;
  switch (direction) {
    case "top_left":
      return { position: "absolute", bottom: `calc(100% + ${gap}px)`, left: 0 };
    case "top_right":
      return { position: "absolute", bottom: `calc(100% + ${gap}px)`, right: 0 };
    case "top_center":
      return {
        position: "absolute",
        bottom: `calc(100% + ${gap}px)`,
        left: "50%",
        transform: "translateX(-50%)",
      };
    case "botom_left":
      return { position: "absolute", top: `calc(100% + ${gap}px)`, left: 0 };
    case "botom_right":
      return { position: "absolute", top: `calc(100% + ${gap}px)`, right: 0 };
    case "bottom_center":
      return {
        position: "absolute",
        top: `calc(100% + ${gap}px)`,
        left: "50%",
        transform: "translateX(-50%)",
      };
    case "left_center":
      return {
        position: "absolute",
        right: `calc(100% + ${gap}px)`,
        top: "50%",
        transform: "translateY(-50%)",
      };
    case "right_center":
      return {
        position: "absolute",
        left: `calc(100% + ${gap}px)`,
        top: "50%",
        transform: "translateY(-50%)",
      };
  }
}

// docs/audit/tooltips.md §7, §9 — no fill, text colour, or radius was confirmed as genuinely
// applied to `tooltip` (no deep audit exists, §6, §13). Unlike Radio/Toggle, there is also no
// sibling audit to cross-reference a real applied value from. These are therefore the most
// lightly-grounded derived values in this library:
// - fill: Color/smoke_base (white) — consistent with every card-like surface elsewhere in the
//   system (Alert, Toast, Field), not independently confirmed for tooltip.
// - text: Text/Gray 950 — the same "primary text" colour used elsewhere in the system.
// - radius: radius/custom/sm (8) — the *only* radius token present in this component's own
//   export (§8), though the audit explicitly could not confirm whether it's genuinely applied
//   or simply unbound in this subtree (§10, §13). Used as the least-invented option available.
const bubbleFill = color.white[950];
const bubbleText = color.gray[950];
const bubbleRadius = radius.sm;

// docs/audit/tooltips.md §8 — elevation/e3 was newly, fully resolved specifically in this
// audit's own context (the first full confirmation of e3 in the whole series), which is at
// least a meaningful signal it belongs here — but §12/§13 stop short of confirming it's
// genuinely applied to the tooltip itself, the same caveat as every other effect token in this
// export. Used as the most defensible choice available, not asserted as confirmed-applied.
const bubbleShadow = elevation.e3
  .map((l) => `${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${l.color}`)
  .join(", ");

export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  direction: TooltipDirection;
  children?: ReactNode;
}

/**
 * `tooltip` (docs/audit/tooltips.md) — the sparsest audit in the library: overview-level only,
 * no `get_design_context` deep audit, and no sibling component to cross-reference an applied
 * visual from (unlike Radio, which could borrow Checkbox's confirmed styling via List). Only
 * the `direction` enum and the two confirmed bounding-box widths are ground truth; fill, text
 * colour, radius, and shadow are all documented derived choices, not confirmed bindings. No
 * arrow/pointer, title, description, or action is rendered — the audit explicitly could not
 * confirm whether any of those exist as internal layers (§5, §13), so none is invented.
 *
 * Must be rendered inside a `position: relative` anchor; `direction` positions the bubble
 * relative to that anchor using standard CSS, not a portal/floating-UI positioning engine —
 * nothing about an anchor/trigger mechanism was confirmed either, so nothing beyond plain
 * absolute positioning is implemented.
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ direction, style, ...props }, ref) => (
    <div
      ref={ref}
      role="tooltip"
      data-direction={direction}
      style={{
        maxWidth: WIDTH[direction],
        padding: BUBBLE_PADDING,
        backgroundColor: bubbleFill,
        color: bubbleText,
        borderRadius: bubbleRadius,
        boxShadow: bubbleShadow,
        fontSize: 12,
        lineHeight: "16px",
        fontWeight: 500,
        zIndex: 1,
        ...positionFor(direction),
        ...style,
      }}
      {...props}
    />
  ),
);

Tooltip.displayName = "Tooltip";
