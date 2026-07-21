import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { color, elevation, radius } from "@shikho/tokens";

// docs/audit/button-group.md §2, §3 — button_group: exactly two properties, `size` (xs, sm, md,
// lg, xl — Scale A, matching button_danger/button_success/Greyscale/icon_button rather than the
// xxl-using scale) and `count` (2-6, confirmed range — no count=1, no count=7+). No `type` and
// no `state` property exists on button_group itself; segments are confirmed nested Button-type
// component instances (§11), but no specific sub-family binding was confirmed (unlike Alert's
// button_danger/md/secondary/default). `count` is not modeled as a numeric prop here — it's the
// length of `items`, which is what actually varies at runtime.
export type ButtonGroupSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonGroupItem {
  label: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

// docs/audit/button-group.md §8 — confirmed exact only for xs (px-[spacing/6,6px]
// py-[spacing/4,4px]). sm/md/lg/xl reuse the same padding scale already derived for the
// standalone Button family (packages/ui/src/components/button/shared.ts's paddingForSize) —
// the least-invented option available, since button-group.md never deep-audited those sizes —
// with xs itself replaced by this family's own newly confirmed exact value.
const paddingForSize: Record<ButtonGroupSize, string> = {
  xs: "0.25rem 0.375rem", // py-4 px-6, confirmed exact — §8
  sm: "0.375rem 0.625rem", // derived, reused from the standalone Button family's own scale
  md: "0.5rem 0.75rem",
  lg: "0.5rem 0.875rem",
  xl: "0.625rem 1rem",
};

// docs/audit/button-group.md §14 — Caption 1 / web/Body/11 Semibold, confirmed exact only for
// the xs instance. Applied uniformly across sizes since no other size was deep-audited — the
// same "one confirmed data point, no property to vary it" reasoning already applied to Alert's
// single confirmed severity.
const typography = {
  fontSize: 11,
  lineHeight: "16px",
  fontWeight: 600,
} as const;

const ICON_SIZE = 14; // confirmed — sizing/icon/14, §9/§14
const iconShadow = elevation.e2
  .map((l) => `${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${l.color}`)
  .join(", ");

// docs/audit/button-group.md §14 — outline/Black 50, confirmed applied border color on every
// segment. Matches @shikho/tokens' color.black[50] exactly.
const borderColor = color.black[50];

// docs/audit/button-group.md §14, §17 — the one deep-audited instance's fill (Color/secondary/
// 500) and label colour (text/white-950), applied identically to all three segments. There is no
// `type` property on button_group to vary this by, so this single confirmed data point is
// applied uniformly, the same reasoning already used for Alert's one confirmed severity.
const segmentFill = color.secondary[500];
const segmentText = color.white[950];

export interface ButtonGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  size?: ButtonGroupSize;
  /** Confirmed supported range is 2-6 segments (§5) — not runtime-enforced, just documented. */
  items: ButtonGroupItem[];
}

/**
 * `button_group` (docs/audit/button-group.md, deep-audited at `size=xs, count=3`). Confirmed
 * zero gap both between segments and within each segment's icon/text/icon row (§7, §8) — visible
 * icon-to-label spacing comes from the label's own horizontal padding, not a flex gap. Confirmed
 * corner-radius and border strategy: the first and last segments get outer-corner rounding
 * (`radius.xs`, one side each) plus a full 4-side border; every segment in between gets square
 * corners and only a top/bottom border, letting adjacent segments join seamlessly without
 * overlap tricks (§15, §16). `secondary_button_effect` (the audited inner-shadow overlay, §14)
 * is confirmed present but not implemented here — the same explicit decision already made for
 * every standalone Button family, since `@shikho/tokens` has no effects category yet.
 *
 * See `packages/ui/src/components/button-group/README.md` for the full confirmed-vs-derived
 * breakdown.
 */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ size = "md", items, style, ...props }, ref) => (
    <div
      ref={ref}
      data-size={size}
      style={{
        display: "inline-flex", // Hug, both axes — §9
        alignItems: "flex-start", // items-start, confirmed cross-axis alignment — §6
        ...style,
      }}
      {...props}
    >
      {items.map((item, index) => {
        const isFirst = index === 0;
        const isLast = index === items.length - 1;

        return (
          <div
            key={index}
            data-segment={isFirst ? "first" : isLast ? "last" : "middle"}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0, // shrink-0, confirmed — §9
              padding: paddingForSize[size],
              backgroundColor: segmentFill,
              color: segmentText,
              borderStyle: "solid",
              borderColor,
              // Confirmed border strategy — first/last get a full 4-side border; every segment
              // in between omits left/right entirely so segments join without doubled borders
              // (§16).
              borderWidth: isFirst || isLast ? "1px" : "1px 0",
              // Confirmed corner-radius strategy — outer corners only, one side per end segment,
              // fully square in between (§15).
              borderTopLeftRadius: isFirst ? radius.xs : 0,
              borderBottomLeftRadius: isFirst ? radius.xs : 0,
              borderTopRightRadius: isLast ? radius.xs : 0,
              borderBottomRightRadius: isLast ? radius.xs : 0,
              ...typography,
            }}
          >
            {item.leftIcon && (
              <span
                style={{
                  width: ICON_SIZE,
                  height: ICON_SIZE,
                  flexShrink: 0,
                  boxShadow: iconShadow,
                }}
              >
                {item.leftIcon}
              </span>
            )}
            <span style={{ padding: "0 0.25rem" /* spacing/4, confirmed — §8 */ }}>
              {item.label}
            </span>
            {item.rightIcon && (
              <span
                style={{
                  width: ICON_SIZE,
                  height: ICON_SIZE,
                  flexShrink: 0,
                  boxShadow: iconShadow,
                }}
              >
                {item.rightIcon}
              </span>
            )}
          </div>
        );
      })}
    </div>
  ),
);

ButtonGroup.displayName = "ButtonGroup";
