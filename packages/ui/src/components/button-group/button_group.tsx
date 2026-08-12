import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { color, elevation, radius } from "@shikho/tokens";
import { aiGradientStyle, greyscalePrimaryStyle, iconButtonStyle, rampEmphasisStyle } from "../button/shared";

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

/**
 * P2 repair — the icon slot's `elevation/e2` must be a CSS `filter: drop-shadow()` chain, not a
 * `boxShadow`. Figma exports icon-only vector layers with a filter so the shadow follows the
 * glyph's silhouette; a box-shadow draws a rectangle around the slot's bounding box instead.
 *
 * This is the same bug Chip's re-audit fixed, which was never propagated here. The blur values
 * are e2's blur collapsed with its spread (`blur + spread`), matching `iconShadowFilter` as used
 * by Link, Tags, Switcher, Pagination, Modal and every other icon slot in this library.
 */
const iconShadowFilter = elevation.e2
  .map((l) => `drop-shadow(${l.x}px ${l.y}px ${Math.max(l.blur + l.spread, 0)}px ${l.color})`)
  .join(" ");

// docs/audit/button-group.md §14 — outline/Black 50, confirmed applied border color on every
// segment. Matches @shikho/tokens' color.black[50] exactly.
const borderColor = color.black[50];

// docs/audit/button-group.md §14, §17 — the one deep-audited instance's fill (Color/secondary/
// 500) and label colour (text/white-950), applied identically to all three segments. There is no
// `type` property on button_group to vary this by — this was the single confirmed data point,
// applied uniformly, the same reasoning already used for Alert's one confirmed severity.
//
// Not part of the original Figma audit — a requested addition. `family` reuses the same 8 Button
// families' own confirmed color resolvers (packages/ui/src/components/button/shared.ts) rather
// than inventing new colors, following the "structure + color, not a new type per color" pattern
// requested across this batch of feedback. Only each family's own solid/"primary" treatment is
// reused — ButtonGroup's own confirmed structural conventions (segment-joining, outer-corner-only
// radius, shared borders, no per-segment shadow) are unaffected by `family` and stay exactly as
// confirmed regardless of which family is selected. `new_pink` is the default because its solid
// fill is `color.secondary[500]` — numerically identical to the original confirmed
// `segmentFill`, so the default appearance is unchanged.
export type ButtonGroupFamily =
  | "new_blue"
  | "new_pink"
  | "ai_rounded"
  | "ai_regular"
  | "button_success"
  | "button_danger"
  | "greyscale"
  | "icon_button";

function familyFillAndText(family: ButtonGroupFamily): { background: string; textColor: string } {
  switch (family) {
    case "new_blue":
      return rampEmphasisStyle(color.primary, "solid", "default", "primary");
    case "new_pink":
      return rampEmphasisStyle(color.secondary, "solid", "default", "secondary");
    case "button_success":
      return rampEmphasisStyle(color.success, "solid", "default", "success");
    case "button_danger":
      return rampEmphasisStyle(color.danger, "solid", "default", "danger");
    case "greyscale":
      return greyscalePrimaryStyle("default");
    case "ai_rounded":
    case "ai_regular":
      return aiGradientStyle("Primary", "default");
    case "icon_button":
      return iconButtonStyle("primary", "default");
  }
}

export interface ButtonGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  size?: ButtonGroupSize;
  /** Not part of the original Figma audit — a requested addition, default `"new_pink"` (see
   * above for why that preserves the original confirmed appearance unchanged). All segments
   * always share one family — button_group has no per-segment type/family axis, confirmed or
   * otherwise, so mixing families within one group isn't exposed as an option. */
  family?: ButtonGroupFamily;
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
  ({ size = "md", family = "new_pink", items, style, ...props }, ref) => {
    const { background: segmentFill, textColor: segmentText } = familyFillAndText(family);

    return (
    <div
      ref={ref}
      data-size={size}
      data-family={family}
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
              // `background`, not `backgroundColor` — ai_rounded/ai_regular resolve to a CSS
              // gradient string, which backgroundColor can't hold.
              background: segmentFill,
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
                  filter: iconShadowFilter,
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
                  filter: iconShadowFilter,
                }}
              >
                {item.rightIcon}
              </span>
            )}
          </div>
        );
      })}
    </div>
    );
  },
);

ButtonGroup.displayName = "ButtonGroup";
