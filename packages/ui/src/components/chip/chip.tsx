import { type ButtonHTMLAttributes, type CSSProperties, type ReactNode, forwardRef } from "react";
import { color, focusRingColor, radius } from "@shikho/tokens";

// docs/audit/chips.md §2, §14 — chip: size (lg, md, sm), type (unselected, selected,
// selected_neutral, Green, Red — casing preserved exactly, including the confirmed mismatch
// between the lowercase trio and the capitalized Green/Red), state (disabled, focus, hover,
// drag, default). Green/Red are confirmed to only ever appear with state=default (§3) — no
// disabled/focus/hover/drag variants exist for either.
export type ChipSize = "lg" | "md" | "sm";
export type ChipType = "unselected" | "selected" | "selected_neutral" | "Green" | "Red";
export type ChipState = "disabled" | "focus" | "hover" | "drag" | "default";

/**
 * Per-size metrics — every row confirmed by a live `get_design_context` sample of that size's
 * `unselected/default` variant during the P1 repair pass.
 *
 * The previous implementation carried a per-size `heightPx` table but a SINGLE padding (`p-8`),
 * gap (2px), icon size (16px) and font size (12px) — all of which were `md`'s values applied to
 * all three sizes. Figma defines each independently.
 */
interface ChipSizeMetrics {
  height: number;
  padding: string;
  gap: string;
  iconSize: number;
  fontSize: number;
  lineHeight: string;
}

const SIZE_METRICS: Record<ChipSize, ChipSizeMetrics> = {
  sm: { height: 24, padding: "0.25rem 0.375rem", gap: "0", iconSize: 14, fontSize: 11, lineHeight: "16px" },
  md: { height: 32, padding: "0.5rem", gap: "0.125rem", iconSize: 16, fontSize: 12, lineHeight: "16px" },
  lg: { height: 40, padding: "0.5rem 0.75rem", gap: "0.25rem", iconSize: 18, fontSize: 13, lineHeight: "20px" },
};

const chipRadius = radius.full; // radius/border_radius_round (1000) — the ONLY radius token, §7/§9

// docs/audit/chips.md §9/§14 — the icon-slot drop-shadow filter, confirmed on every icon in every
// sampled instance. The pre-rebuild implementation applied this as a `boxShadow` on the icon's
// (empty, transparent) bounding box — which draws a rectangular shadow, not a shadow following the
// icon's own silhouette. Every other component in this system implements the identical confirmed
// effect as a CSS `filter: drop-shadow()`; this was a genuine rendering bug, not a style choice.
const iconShadowFilter = "drop-shadow(0px 1px 0.5px rgba(0,0,0,0.04)) drop-shadow(0px 3px 1.5px rgba(0,0,0,0.04))";

// docs/audit/chips.md §14 — confirmed present on every non-disabled, non-drag state sampled
// (unselected/selected/selected_neutral default+hover, Green, Red) — the "special_drop" inset,
// quoted with its own exact literal values here (distinct from the 2px-offset inset used
// elsewhere in this system).
const restingInset = `inset 0 1px 3px 0 ${color.white[50]}, inset 0 -1px 3px -2px ${color.black[50]}`;

// docs/audit/chips.md §14 — confirmed identical to elevation.e5, applied as the chip's outer
// shadow specifically in the `drag` state (sampled on `unselected`), replacing the resting inset
// entirely — a real "lift" effect, not a fabricated elaboration.
const dragShadow =
  "0px 1px 1px -0.5px rgba(0,0,0,0.04), 0px 3px 3px -1.5px rgba(0,0,0,0.04), " +
  "0px 6px 6px -3px rgba(0,0,0,0.04), 0px 32px 32px -16px rgba(0,0,0,0.04), 0px 56px 56px -28px rgba(0,0,0,0.04)";

interface ChipVisual {
  background: string;
  border: string;
  textColor: string;
  fontWeight: number;
  boxShadow?: string;
}

type FocusRing = "primary" | "gray";

// docs/audit/chips.md §14 — confirmed per-type/per-state visual construction from 11
// get_design_context samples (unselected: default/hover/disabled/drag; selected: default/hover/
// disabled; selected_neutral: default; Green/Red: default). Corrections vs. the pre-rebuild
// implementation are called out inline — see README.md for the full confirmed-vs-derived list.
const CHIP_VISUAL: Record<ChipType, Partial<Record<Exclude<ChipState, "focus">, ChipVisual>>> = {
  unselected: {
    // CORRECTED: previously fill=gray[100] with no border. Confirmed real: fill is plain white
    // with a subtle black/50(4%) border and the resting inset.
    default: { background: color.white[950], border: `1px solid ${color.black[50]}`, textColor: color.gray[700], fontWeight: 500, boxShadow: restingInset },
    hover: { background: color.gray[50], border: `1px solid ${color.black[50]}`, textColor: color.gray[700], fontWeight: 500, boxShadow: restingInset },
    disabled: { background: color.gray[100], border: "none", textColor: color.gray[400], fontWeight: 500 },
    drag: { background: color.gray[200], border: `1px solid ${color.black[50]}`, textColor: color.gray[700], fontWeight: 500, boxShadow: dragShadow },
  },
  selected: {
    // CORRECTED: previously had NO border at all. Confirmed real: a primary/400 border on both
    // default and hover, not just a flat fill.
    default: { background: color.primary[200], border: `1px solid ${color.primary[400]}`, textColor: color.primary[600], fontWeight: 500, boxShadow: restingInset },
    hover: { background: color.primary[300], border: `1px solid ${color.primary[400]}`, textColor: color.primary[600], fontWeight: 500, boxShadow: restingInset },
    // CORRECTED: confirmed disabled text is SemiBold (600), not Medium (500) like every other
    // state in this family — a genuine, confirmed one-off weight change, not a typo.
    disabled: { background: color.gray[100], border: "none", textColor: color.gray[400], fontWeight: 600 },
    // Not independently sampled for `selected` — derived from `unselected`'s confirmed drag
    // pattern (fill one step darker, border kept, resting inset replaced by the e5-equivalent
    // outer shadow), §14.
    drag: { background: color.primary[300], border: `1px solid ${color.primary[400]}`, textColor: color.primary[600], fontWeight: 500, boxShadow: dragShadow },
  },
  selected_neutral: {
    // CORRECTED: previously text=gray[700]. Confirmed real: gray/950 (near-black) — visually
    // distinct from unselected's gray/700, not a duplicate.
    default: { background: color.gray[100], border: `1px solid ${color.black[50]}`, textColor: color.gray[950], fontWeight: 500, boxShadow: restingInset },
    // hover/disabled/drag not independently sampled for this type — derived from `unselected`'s
    // confirmed state-transition pattern (one step darker fill on hover/drag, flat gray+no-border
    // on disabled), keeping this type's own confirmed gray/950 text color, §14.
    hover: { background: color.gray[200], border: `1px solid ${color.black[50]}`, textColor: color.gray[950], fontWeight: 500, boxShadow: restingInset },
    disabled: { background: color.gray[100], border: "none", textColor: color.gray[400], fontWeight: 500 },
    drag: { background: color.gray[200], border: `1px solid ${color.black[50]}`, textColor: color.gray[950], fontWeight: 500, boxShadow: dragShadow },
  },
  // Confirmed: border black/150(12%) — stronger than the trio's black/50(4%) — fill/text exactly
  // matching the pre-rebuild guess (success/danger 500, white text); only the border was missing.
  Green: {
    default: { background: color.success[500], border: `1px solid ${color.black[150]}`, textColor: color.white[950], fontWeight: 500, boxShadow: restingInset },
  },
  Red: {
    default: { background: color.danger[500], border: `1px solid ${color.black[150]}`, textColor: color.white[950], fontWeight: 500, boxShadow: restingInset },
  },
};

const FOCUS_RING_BY_TYPE: Record<ChipType, FocusRing> = {
  unselected: "gray",
  selected: "primary", // confirmed exactly, §9 — outline/focus_primary
  selected_neutral: "gray",
  Green: "gray",
  Red: "gray",
};

function resolveVisual(type: ChipType, state: ChipState): ChipVisual {
  const table = CHIP_VISUAL[type];
  // Green/Red are confirmed to only ever exist at state=default (§3) — any other state value
  // renders their one confirmed look rather than falling through to an unconfirmed table entry.
  if (type === "Green" || type === "Red") return table.default!;
  if (state === "focus") return table.default!;
  return table[state as Exclude<ChipState, "focus">] ?? table.default!;
}

export interface ChipProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "color"> {
  size?: ChipSize;
  type?: ChipType;
  state?: ChipState;
  /** Confirmed boolean property, default true (§9). */
  leftIcon?: boolean;
  /** Confirmed boolean property, default true (§9). */
  rightIcon?: boolean;
  /** Confirmed boolean property, default true (§9). */
  text?: boolean;
  /** Confirmed instance-swap property, `ReactNode | null`, default `null` (§9). */
  selectLeftIcon?: ReactNode | null;
  /** Confirmed instance-swap property, `ReactNode | null`, default `null` (§9). */
  selectRightIcon?: ReactNode | null;
  textContent?: ReactNode;
}

/**
 * `chip` (docs/audit/chips.md, deep re-audited across 11 type/state combinations, §14). Renders
 * as a real `<button>` — no dedicated selection-indicator or dismiss-control layer was found
 * (§5/§9), so none is invented here.
 *
 * `focus` replaces the resting fill/border/inset with a ring only (confirmed exactly for
 * `selected`, §9 — `outline/focus_primary`; `gray` used for the other types as the nearest
 * confirmed analogue, consistent with the neutral focus ring already used system-wide).
 * `drag` replaces the resting inset with a confirmed 5-layer outer "lift" shadow (identical to
 * `elevation.e5`).
 */
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      size = "md",
      type = "selected",
      state = "default",
      leftIcon = true,
      rightIcon = true,
      text = true,
      selectLeftIcon = null,
      selectRightIcon = null,
      textContent,
      disabled,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || state === "disabled";
    const isFocusVariant = state === "focus" && type !== "Green" && type !== "Red";
    const visual = resolveVisual(type, state);
    const metrics = SIZE_METRICS[size];

    const iconSlotStyle: CSSProperties = {
      width: metrics.iconSize,
      height: metrics.iconSize,
      flexShrink: 0,
      filter: iconShadowFilter,
    };

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        data-size={size}
        data-type={type}
        data-state={state}
        className={
          "inline-flex items-center justify-center cursor-pointer transition-colors outline-none " +
          "disabled:cursor-not-allowed" +
          (className ? ` ${className}` : "")
        }
        style={{
          height: metrics.height,
          gap: metrics.gap,
          padding: metrics.padding,
          borderRadius: chipRadius,
          background: visual.background,
          border: visual.border,
          color: visual.textColor,
          fontWeight: visual.fontWeight,
          boxShadow: isFocusVariant ? `0 0 0 3px ${focusRingColor[FOCUS_RING_BY_TYPE[type]]}` : visual.boxShadow,
          ...style,
        }}
        {...props}
      >
        {leftIcon && <span style={iconSlotStyle}>{selectLeftIcon}</span>}
        {text && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0 0.125rem", // px-[spacing/2, 2px] — confirmed identical at all 3 sizes
              gap: "0.5rem", // gap-[spacing/8, 8px] — §9
              fontSize: metrics.fontSize,
              lineHeight: metrics.lineHeight,
              fontWeight: "inherit",
            }}
          >
            {textContent}
          </span>
        )}
        {rightIcon && <span style={iconSlotStyle}>{selectRightIcon}</span>}
      </button>
    );
  },
);

Chip.displayName = "Chip";
