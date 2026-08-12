import { type CSSProperties, type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { color, radius } from "@shikho/tokens";

// docs/audit/tags.md §2, §14 — tags: size (lg, md, sm), type (11 values, casing preserved exactly
// including the confirmed space-containing Title Case "Danger Filled"/"Success Filled" — "the
// most severe single-property naming inconsistency confirmed in this entire audit series", §9),
// state (disabled, hover, default — no focus, no drag, unlike Chip).
export type TagSize = "lg" | "md" | "sm";
export type TagType =
  | "info"
  | "warning"
  | "danger"
  | "Danger Filled"
  | "success"
  | "Success Filled"
  | "tertiary"
  | "secondary"
  | "primary_outline"
  | "primary_light"
  | "primary";
export type TagState = "disabled" | "hover" | "default";

// docs/audit/tags.md §14 — confirmed real per-size construction (height/padding/rootGap/radius/
// iconSize/typography/labelPadding), sampled directly at sm/md/lg. The pre-rebuild implementation
// rendered every size at the same height with an identical, size-invariant horizontal-only
// padding and a single 12px font — none of which is what Figma actually does.
//
// Corrected (2026-08-12, re-audited from a `get_metadata`/`get_design_context` sweep across
// ~16 additional variants): `labelPadding` — the text_wrap's own internal horizontal padding —
// was previously hardcoded flat at 2px for every size. It's actually size-dependent and
// non-monotonic: 2px at sm, 4px at md, 2px again at lg (confirmed directly across primary,
// tertiary, secondary, primary_outline, success, and Danger Filled samples at every size) — `md`
// was rendering 2px too little internal padding around its label.
//
// Also confirmed: `sm` has NO icon slot at all — `get_metadata` on every sampled `sm` instance
// (primary, danger, secondary, info, across default/disabled states) shows zero `left_icon`/
// `right_icon` child layers, not just toggled off. `iconSize` below is kept for type-shape
// consistency but is never applied at `sm` — see the `size !== "sm"` guard in the component body.
interface SizeMetrics {
  height: number;
  padding: string;
  rootGap: number;
  radius: number;
  iconSize: number;
  fontSize: number;
  lineHeight: string;
  labelPadding: number;
}

const SIZE_METRICS: Record<TagSize, SizeMetrics> = {
  sm: { height: 20, padding: "0 0.375rem", rootGap: 2, radius: radius.xs, iconSize: 12, fontSize: 11, lineHeight: "16px", labelPadding: 2 },
  md: { height: 24, padding: "0.25rem 0.375rem", rootGap: 0, radius: radius.sm, iconSize: 14, fontSize: 11, lineHeight: "16px", labelPadding: 4 },
  lg: { height: 32, padding: "0.5rem", rootGap: 2, radius: radius.md, iconSize: 16, fontSize: 12, lineHeight: "16px", labelPadding: 2 },
};

// docs/audit/tags.md §9/§14 — confirmed on every icon slot sampled, the same elevation/e2-based
// filter used system-wide.
const iconShadowFilter = "drop-shadow(0px 1px 0.5px rgba(0,0,0,0.04)) drop-shadow(0px 3px 1.5px rgba(0,0,0,0.04))";

// docs/audit/tags.md §14 — confirmed present on every non-disabled instance sampled (all 11
// types) — the same "special_drop" inset already confirmed system-wide, kept even through
// `disabled` (confirmed, §14 — unlike Button/Chip, Tags' disabled state does NOT drop this inset).
const restingInset = `inset 0 1px 3px 0 ${color.white[50]}, inset 0 -1px 3px -2px ${color.black[50]}`;

interface TagVisual {
  background: string;
  border: string;
  textColor: string;
}

// docs/audit/tags.md §14 — confirmed per-type default/hover construction from 11
// get_design_context samples covering all 11 types at md, plus lg/sm size checks and one
// disabled sample. Corrections vs. the pre-rebuild implementation are called out inline.
const TAG_VISUAL: Record<TagType, { default: TagVisual; hover: TagVisual }> = {
  info: {
    default: { background: `${color.info[500]}1f`, border: "none", textColor: color.info[600] },
    // docs/audit/tags.md §8 — confirmed `_alpha_20` exists as the next step for every severity;
    // not independently sampled for `hover` on this type, applied per that confirmed system.
    hover: { background: `${color.info[500]}33`, border: "none", textColor: color.info[600] },
  },
  warning: {
    default: { background: `${color.warning[500]}1f`, border: "none", textColor: color.warning[600] },
    hover: { background: `${color.warning[500]}33`, border: "none", textColor: color.warning[600] },
  },
  danger: {
    default: { background: `${color.danger[500]}1f`, border: "none", textColor: color.danger[600] },
    hover: { background: `${color.danger[500]}33`, border: "none", textColor: color.danger[600] },
  },
  // CORRECTED (docs/audit/tags.md §14 fresh re-check) — previously assumed no confirmed hover
  // existed for solid fills. A direct get_design_context fetch on this exact hover instance shows
  // it DOES: the fill darkens from the ramp's 500 step to its 600 step, border stays borderless.
  "Danger Filled": {
    default: { background: color.danger[500], border: "none", textColor: color.white[950] },
    hover: { background: color.danger[600], border: "none", textColor: color.white[950] },
  },
  success: {
    default: { background: `${color.success[500]}1f`, border: "none", textColor: color.success[600] },
    hover: { background: `${color.success[500]}33`, border: "none", textColor: color.success[600] },
  },
  // CORRECTED — see "Danger Filled" above; same confirmed 500->600 darkening pattern.
  "Success Filled": {
    default: { background: color.success[500], border: "none", textColor: color.white[950] },
    hover: { background: color.success[600], border: "none", textColor: color.white[950] },
  },
  // CORRECTED: previously `color.gray[50]`/`gray[600]` with no border. Confirmed real: white
  // fill with a black/50(4%) border — structurally the neutral analogue of `primary_outline`,
  // not just "secondary but lighter". Hover confirmed directly: fill white -> gray/100.
  tertiary: {
    default: { background: color.white[950], border: `1px solid ${color.black[50]}`, textColor: color.gray[700] },
    hover: { background: color.gray[100], border: `1px solid ${color.black[50]}`, textColor: color.gray[700] },
  },
  secondary: {
    default: { background: color.gray[100], border: "none", textColor: color.gray[700] },
    hover: { background: color.gray[200], border: "none", textColor: color.gray[700] }, // hover not independently sampled — one step darker, §14
  },
  // CORRECTED: previously `backgroundColor: "transparent"` with a fully opaque `primary/500`
  // border. Confirmed real: an opaque white fill and a `primary/500` border at only 24% alpha.
  // hover CORRECTED (§14 fresh re-check): a direct get_design_context fetch shows hover fills with
  // `primary/500_alpha_12` (a light primary tint), not the previously-guessed plain `gray/50`.
  primary_outline: {
    default: { background: color.white[950], border: `1px solid ${color.primary[500]}3d`, textColor: color.primary[600] },
    hover: { background: `${color.primary[500]}1f`, border: `1px solid ${color.primary[500]}3d`, textColor: color.primary[600] },
  },
  primary_light: {
    default: { background: `${color.primary[500]}1f`, border: "none", textColor: color.primary[600] },
    hover: { background: `${color.primary[500]}33`, border: "none", textColor: color.primary[600] }, // confirmed alpha_20 system, §8
  },
  // CORRECTED: previously `border: "1px solid transparent"`. Confirmed real: a black/50(4%)
  // border — the solid `primary` type is NOT borderless, unlike "Danger Filled"/"Success Filled".
  // hover CORRECTED (§14 fresh re-check): confirmed the fill darkens to `primary/600` (not
  // staying at 500 as previously guessed) — the same 500->600 darkening pattern confirmed on
  // "Danger Filled"/"Success Filled" too. Border stays unchanged.
  primary: {
    default: { background: color.primary[500], border: `1px solid ${color.black[50]}`, textColor: color.white[950] },
    hover: { background: color.primary[600], border: `1px solid ${color.black[50]}`, textColor: color.white[950] },
  },
};

// docs/audit/tags.md §14 — confirmed on the one sampled disabled instance (`primary`/md):
// fill `Color/vanilla_gray/100` (#f6f4ef — a genuinely distinct token from the gray ramp's own
// `gray/100`, #f4f4f6), no border regardless of the type's own default border, text `gray/400`.
// Applied uniformly across all 11 types as the confirmed universal disabled recipe.
const disabledVisual: TagVisual = { background: color.vanillaGray[100], border: "none", textColor: color.gray[400] };

export interface TagsProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  size?: TagSize;
  type?: TagType;
  state?: TagState;
  /** Confirmed boolean property, default true (§14). No-op at `size="sm"` — confirmed absent from
   * every sampled `sm` instance, not just toggled off. */
  leftIcon?: boolean;
  /** Confirmed boolean property, default true (§14). No-op at `size="sm"` — see `leftIcon`. */
  rightIcon?: boolean;
  /** Confirmed boolean property, default true (§14). */
  text?: boolean;
  /** Confirmed instance-swap property, `ReactNode | null`, default `null` (§14). */
  selectLeftIcon?: ReactNode | null;
  /** Confirmed instance-swap property, `ReactNode | null`, default `null` (§14). */
  selectRightIcon?: ReactNode | null;
  children?: ReactNode;
}

/**
 * `tags` (docs/audit/tags.md, deep re-audited across 16 size/type/state combinations, §14).
 * Rendered as a `<span>`, not a `<button>` — no interactive states exist for this family (no
 * `focus`, no `drag`, unlike `Chip`).
 */
export const Tags = forwardRef<HTMLSpanElement, TagsProps>(
  (
    {
      size = "md",
      type = "info",
      state = "default",
      leftIcon = true,
      rightIcon = true,
      text = true,
      selectLeftIcon = null,
      selectRightIcon = null,
      children,
      style,
      ...props
    },
    ref,
  ) => {
    const isDisabled = state === "disabled";
    const metrics = SIZE_METRICS[size];
    const visual = isDisabled ? disabledVisual : TAG_VISUAL[type][state === "hover" ? "hover" : "default"];
    // Confirmed absent at `sm` — see the SIZE_METRICS comment above. Icons never render at this
    // size regardless of the leftIcon/rightIcon props, matching every sampled `sm` instance.
    const showIcons = size !== "sm";

    const computed: CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      height: metrics.height,
      gap: metrics.rootGap,
      padding: metrics.padding,
      borderRadius: metrics.radius,
      background: visual.background,
      border: visual.border,
      boxShadow: restingInset,
      whiteSpace: "nowrap",
      ...style,
    };

    const iconStyle: CSSProperties = {
      width: metrics.iconSize,
      height: metrics.iconSize,
      flexShrink: 0,
      filter: iconShadowFilter,
    };

    return (
      <span
        ref={ref}
        data-size={size}
        data-type={type}
        data-state={state}
        aria-disabled={isDisabled || undefined}
        style={computed}
        {...props}
      >
        {showIcons && leftIcon && <span style={iconStyle}>{selectLeftIcon}</span>}
        {text && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: `0 ${metrics.labelPadding / 16}rem`,
              fontSize: metrics.fontSize,
              lineHeight: metrics.lineHeight,
              fontWeight: 600, // web/Body SemiBold — the only weight confirmed for this family, §6
              color: visual.textColor,
            }}
          >
            {children}
          </span>
        )}
        {showIcons && rightIcon && <span style={iconStyle}>{selectRightIcon}</span>}
      </span>
    );
  },
);

Tags.displayName = "Tags";
