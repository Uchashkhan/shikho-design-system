import { type CSSProperties, type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { color, elevation, radius } from "@shikho/tokens";

// docs/audit/tooltips.md §2, §14 — tooltip: exactly one Figma variant property, `direction` (8
// values). Casing/spelling preserved verbatim, including the confirmed typo: `botom_left`/
// `botom_right` are missing the second "t" in "bottom", while `bottom_center` in the same
// property's value set is spelled correctly (§10, §11).
export type TooltipDirection =
  | "botom_left"
  | "top_left"
  | "botom_right"
  | "top_right"
  | "bottom_center"
  | "top_center"
  | "left_center"
  | "right_center";

export interface TooltipAction {
  label: ReactNode;
  onClick?: () => void;
}

export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  direction: TooltipDirection;
  /** Confirmed boolean-gated content slot (§14), SemiBold/13/20, `Text/gray-950`. */
  heading?: ReactNode;
  /** Confirmed boolean-gated content slot (§14), Medium/12/16, `Text/gray-700`. */
  description?: ReactNode;
  /** Confirmed `button1` — a gray/secondary action (§14). Row only renders if this and/or
   * `primaryAction` is supplied. */
  secondaryAction?: TooltipAction;
  /** Confirmed `button2` — the primary/500-filled action (§14). */
  primaryAction?: TooltipAction;
}

// docs/audit/tooltips.md §14 — confirmed: the outer wrapper is a FIXED 240px width (not a
// max-width as previously assumed when no deep audit existed) — height is left to content.
const TIP_WIDTH = 240;

// docs/audit/tooltips.md §14 — confirmed exact per-direction layout: whether the wrapper stacks
// vertically (pointer above/below the tip) or horizontally (pointer beside it), which edge of the
// `tip` box omits its border (the edge touching the pointer, so the two visually fuse), and how
// the tip/pointer are cross-aligned within the wrapper.
type Axis = "vertical" | "horizontal";
interface DirectionLayout {
  axis: Axis;
  pointerFirst: boolean; // pointer appears before the tip in DOM (pointer above/left of tip)
  omitBorder: "top" | "bottom" | "left" | "right";
  crossAlign: "flex-start" | "center" | "flex-end";
}

// docs/audit/tooltips.md §8 — spacing/8 is present in this component's own confirmed spacing
// export (not attributed to a specific side, same limitation as every sparsely-audited component
// in this library). Used here as the gap between the tooltip and its anchor. This anchor-relative
// offset is NOT part of the confirmed internal tip+pointer composition below (§14) — Figma's
// `direction` variants only define that internal tip+pointer visual, not how the whole unit
// attaches to a trigger element, so exactly where to place the tooltip relative to its anchor
// remains as unconfirmed/derived as it was before this pass.
//
// IMPORTANT: this mapping is the OPPOSITE of the naive "placement=top means tooltip renders above
// the anchor" convention used by most tooltip libraries (and used by this component's own
// pre-rebuild implementation). It's derived instead from the newly confirmed pointer geometry
// (§14): `top_*`'s pointer is drawn pointing UP, at the top of the tip+pointer stack — for that
// pointer to visually touch its anchor (the whole reason a tooltip has a pointer), the anchor
// must be ABOVE the tooltip, meaning the tooltip itself renders BELOW the anchor. Symmetrically,
// `botom_*`/`bottom_center`'s pointer points DOWN at the bottom of the stack, so the tooltip
// renders ABOVE the anchor; `left_center`'s pointer points left, so the tooltip renders to the
// anchor's RIGHT; `right_center`'s points right, so the tooltip renders to the anchor's LEFT.
const ANCHOR_GAP = 8;

function anchorOffsetFor(direction: TooltipDirection): CSSProperties {
  const gap = ANCHOR_GAP;
  switch (direction) {
    case "top_left":
      return { top: `calc(100% + ${gap}px)`, left: 0 };
    case "top_right":
      return { top: `calc(100% + ${gap}px)`, right: 0 };
    case "top_center":
      return { top: `calc(100% + ${gap}px)`, left: "50%", marginLeft: -TIP_WIDTH / 2 };
    case "botom_left":
      return { bottom: `calc(100% + ${gap}px)`, left: 0 };
    case "botom_right":
      return { bottom: `calc(100% + ${gap}px)`, right: 0 };
    case "bottom_center":
      return { bottom: `calc(100% + ${gap}px)`, left: "50%", marginLeft: -TIP_WIDTH / 2 };
    case "left_center":
      return { left: `calc(100% + ${gap}px)`, top: "50%", transform: "translateY(-50%)" };
    case "right_center":
      return { right: `calc(100% + ${gap}px)`, top: "50%", transform: "translateY(-50%)" };
  }
}

const DIRECTION_LAYOUT: Record<TooltipDirection, DirectionLayout> = {
  // "top_*" — anchor sits above the tooltip; the tooltip renders below it, pointer at its own
  // top edge pointing up at the anchor (confirmed: pointer-then-tip, tip's top border omitted).
  top_left: { axis: "vertical", pointerFirst: true, omitBorder: "top", crossAlign: "flex-start" },
  top_center: { axis: "vertical", pointerFirst: true, omitBorder: "top", crossAlign: "center" },
  top_right: { axis: "vertical", pointerFirst: true, omitBorder: "top", crossAlign: "flex-end" },
  // "botom_*"/"bottom_center" — anchor sits below the tooltip; tip renders first, pointer below
  // it pointing down at the anchor (confirmed: tip-then-pointer, tip's bottom border omitted).
  botom_left: { axis: "vertical", pointerFirst: false, omitBorder: "bottom", crossAlign: "flex-start" },
  bottom_center: { axis: "vertical", pointerFirst: false, omitBorder: "bottom", crossAlign: "center" },
  botom_right: { axis: "vertical", pointerFirst: false, omitBorder: "bottom", crossAlign: "flex-end" },
  // Confirmed directly: left_center = pointer-then-tip, tip's left border omitted (pointer sits
  // to the left, pointing left at an anchor on the left). right_center = tip-then-pointer, tip's
  // right border omitted (pointer sits to the right, pointing right at an anchor on the right).
  left_center: { axis: "horizontal", pointerFirst: true, omitBorder: "left", crossAlign: "center" },
  right_center: { axis: "horizontal", pointerFirst: false, omitBorder: "right", crossAlign: "center" },
};

// docs/audit/tooltips.md §14 — the confirmed pointer is a rounded-tip triangle (not a plain
// polygon), downloaded as real SVG source from the `get_design_context` asset URL. Vertical
// placements (top_*/botom_*/bottom_center) use a 16×8 pointer; horizontal placements
// (left_center/right_center) use the same shape rotated to 8×16. `top_*` points up, `botom_*`/
// `bottom_center` points down, `left_center` points left, `right_center` points right.
function Pointer({ axis, pointsTowardStart }: { axis: Axis; pointsTowardStart: boolean }) {
  const width = axis === "vertical" ? 16 : 8;
  const height = axis === "vertical" ? 8 : 16;
  // Confirmed path (bottom_center, pointing down): rotate/flip for the other 3 orientations.
  const rotation = axis === "vertical" ? (pointsTowardStart ? 180 : 0) : pointsTowardStart ? 90 : -90;
  return (
    <svg
      aria-hidden
      width={width}
      height={height}
      viewBox="0 0 16 8"
      fill="none"
      style={{ flexShrink: 0, transform: `rotate(${rotation}deg)` }}
    >
      <path
        d="M3.13511 3.13511C5.04057 5.04057 5.99331 5.99331 7.12743 6.24681C7.70205 6.37526 8.29795 6.37526 8.87257 6.24681C10.0067 5.99331 10.9594 5.04057 12.8649 3.1351L16 0H0L3.13511 3.13511Z"
        fill={color.white[950]}
      />
    </svg>
  );
}

// docs/audit/tooltips.md §14 — the confirmed system-wide "special_drop" 2-layer inset, reused
// exactly as-is from Chip/Tags/DatePicker/Modal/Pagination/SidebarItem/TopNavItem/TableCell.
const restingInsetShadow = `inset 0px 1px 3px -2px ${color.white[50]}, inset 0px -1px 3px -2px rgba(0,0,0,0.07)`;
// docs/audit/tooltips.md §14 — confirmed exact effect on the primary "Got it"-style button.
const primaryButtonInsetShadow = `inset 0px 3px 4px -3px ${color.white[600]}, inset 0px 0px 8px -2px ${color.white[500]}`;

// docs/audit/tooltips.md §14 — confirmed: the wrapper's own drop-shadow is elevation/e3 (a
// 3-layer stack), expressed as a `filter: drop-shadow()` chain rather than `boxShadow` because it
// wraps the pointer's non-rectangular alpha shape too, not just the tip's rectangular box — the
// same blur-minus-spread conversion already used system-wide for `iconShadowFilter` above.
const wrapperShadowFilter = elevation.e3
  .map((l) => `drop-shadow(${l.x}px ${l.y}px ${Math.max(l.blur + l.spread, 0)}px ${l.color})`)
  .join(" ");

/**
 * `tooltip` (docs/audit/tooltips.md §14, ground-truth re-audited via `get_design_context` across
 * all 8 confirmed `direction` values). The previous implementation rendered a bare, contentless
 * box — no heading, no description, no actions, no pointer — because no deep audit had ever been
 * run on this family. This rebuild reproduces the confirmed rich card: a `tip` surface (white
 * fill, 3-sided `gray/100` border omitting the edge that touches the pointer, 16px radius, 12px
 * padding, 16px gap between the text block and the actions row) plus a real rounded-tip pointer
 * triangle, at a fixed 240px width.
 *
 * Must be rendered inside a `position: relative` anchor; `direction` positions the whole
 * tip+pointer unit relative to that anchor using standard CSS, not a portal/floating-UI
 * positioning engine — no anchor/trigger mechanism was confirmed, so nothing beyond plain
 * absolute positioning is implemented.
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ direction, heading, description, secondaryAction, primaryAction, style, ...props }, ref) => {
    const layout = DIRECTION_LAYOUT[direction];
    const showActions = !!(secondaryAction || primaryAction);

    const borderStyle: CSSProperties = {
      borderTop: layout.omitBorder === "top" ? "none" : `1px solid ${color.gray[100]}`,
      borderBottom: layout.omitBorder === "bottom" ? "none" : `1px solid ${color.gray[100]}`,
      borderLeft: layout.omitBorder === "left" ? "none" : `1px solid ${color.gray[100]}`,
      borderRight: layout.omitBorder === "right" ? "none" : `1px solid ${color.gray[100]}`,
    };

    const tip = (
      <div
        data-name="tip"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          padding: 12,
          width: layout.axis === "vertical" ? "100%" : undefined,
          flex: layout.axis === "horizontal" ? "1 0 0" : undefined,
          minWidth: 0,
          background: color.white[950],
          borderRadius: radius.xl,
          overflow: "hidden",
          ...borderStyle,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {heading && (
            <div style={{ fontSize: 13, lineHeight: "20px", fontWeight: 600, color: color.gray[950] }}>
              {heading}
            </div>
          )}
          {description && (
            <div style={{ fontSize: 12, lineHeight: "16px", fontWeight: 500, color: color.gray[700] }}>
              {description}
            </div>
          )}
        </div>
        {showActions && (
          <div style={{ display: "flex", gap: 8, alignItems: "center", width: "100%" }}>
            {secondaryAction && (
              <button
                type="button"
                onClick={secondaryAction.onClick}
                style={{
                  flex: "1 0 0",
                  height: 32,
                  padding: 8,
                  border: "none",
                  borderRadius: radius.sm,
                  background: color.gray[100],
                  boxShadow: restingInsetShadow,
                  fontSize: 12,
                  lineHeight: "16px",
                  fontWeight: 600,
                  color: color.gray[700],
                  cursor: "pointer",
                }}
              >
                {secondaryAction.label}
              </button>
            )}
            {primaryAction && (
              <button
                type="button"
                onClick={primaryAction.onClick}
                style={{
                  flex: "1 0 0",
                  height: 32,
                  padding: 8,
                  border: `1px solid ${color.black[150]}`,
                  borderRadius: radius.sm,
                  background: color.primary[500],
                  boxShadow: primaryButtonInsetShadow,
                  fontSize: 12,
                  lineHeight: "16px",
                  fontWeight: 600,
                  color: color.white[950],
                  cursor: "pointer",
                }}
              >
                {primaryAction.label}
              </button>
            )}
          </div>
        )}
      </div>
    );

    const pointer = <Pointer axis={layout.axis} pointsTowardStart={layout.pointerFirst} />;

    return (
      <div
        ref={ref}
        role="tooltip"
        data-direction={direction}
        style={{
          position: "absolute",
          zIndex: 1,
          width: TIP_WIDTH,
          display: "flex",
          flexDirection: layout.axis === "vertical" ? "column" : "row",
          alignItems: layout.crossAlign,
          filter: wrapperShadowFilter,
          ...anchorOffsetFor(direction),
          ...style,
        }}
        {...props}
      >
        {layout.pointerFirst ? (
          <>
            {pointer}
            {tip}
          </>
        ) : (
          <>
            {tip}
            {pointer}
          </>
        )}
      </div>
    );
  },
);

Tooltip.displayName = "Tooltip";
