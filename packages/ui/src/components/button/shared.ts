// Shared internals for the 8 audited button component sets (docs/audit/buttons.md).
//
// Confirmed by the audit and used directly, unmodified:
// - the 8 families' exact `size`/`type`/`state` enum values (§2) — implemented per-family in
//   each sibling file, casing preserved exactly, including the documented inconsistencies.
// - one exact styling binding: new_blue/xs/Primary/Default -> fill Color/primary/500, text
//   Color/white/950, radius/custom/xs (6), sizing/icon/14, web/Body/11 Semibold (§8, §10).
// - the 6 focus-ring colors + shared ring geometry (0-blur, 3px-spread ring) (§6).
//
// NOT confirmed by the audit (§11): padding/gap attribution, layout direction, icon-slot
// mechanism, and per-size/per-type/per-state visual treatment beyond the one binding above.
// Where this file must still produce *something* renderable for the other confirmed enum
// values, it derives a minimal, consistent treatment from already-confirmed token values only
// (e.g. reusing a ramp's own 600/700 step for hover/soft treatments) — never a fabricated color.
// Every such derivation is called out in packages/ui/src/components/button/README.md.

import type { CSSProperties } from "react";
import { color, focusRingColor, radius, type ColorRamp } from "@shikho/tokens";

export type ButtonSizeScaleA = "xs" | "sm" | "md" | "lg" | "xl";
export type ButtonSizeScaleB = "xs" | "sm" | "md" | "lg" | "xxl";

/** Confirmed only for `xs` (radius/custom/xs = 6, docs/audit/buttons.md §8). Other steps reuse
 * the general confirmed `radius` scale from @shikho/tokens by rank, not independently verified
 * for Buttons. */
export const radiusForSizeA: Record<ButtonSizeScaleA, number> = {
  xs: radius.xs,
  sm: radius.sm,
  md: radius.md,
  lg: radius.lg,
  xl: radius.xl,
};

export const radiusForSizeB: Record<ButtonSizeScaleB, number> = {
  xs: radius.xs,
  sm: radius.sm,
  md: radius.md,
  lg: radius.lg,
  xxl: radius["2xl"],
};

// Padding/gap were bound somewhere in the audited instance's subtree (spacing/0, spacing/4,
// spacing/6) but never attributed to a specific side (§11) — @shikho/tokens does not implement
// a spacing category yet either. This is a minimal, unconfirmed structural placeholder only.
const paddingForSize: Record<ButtonSizeScaleA | ButtonSizeScaleB, string> = {
  xs: "0.25rem 0.5rem",
  sm: "0.375rem 0.625rem",
  md: "0.5rem 0.75rem",
  lg: "0.5rem 0.875rem",
  xl: "0.625rem 1rem",
  xxl: "0.625rem 1.25rem",
};

// Only "Caption 1" (11px / 16px line-height / 600 weight) is confirmed, for the xs instance
// (§10). Typography is not yet implemented in @shikho/tokens, so this is hardcoded from the
// audit's literal value and applied uniformly across sizes, since no other size was confirmed.
export const buttonTypography: CSSProperties = {
  fontSize: 11,
  lineHeight: "16px",
  fontWeight: 600,
  letterSpacing: 0,
};

/** docs/audit/buttons.md §6 — confirmed color + geometry (0-blur, 3px-spread ring) per name. */
export const focusRingBoxShadow = {
  primary: `0 0 0 3px ${focusRingColor.primary}`,
  secondary: `0 0 0 3px ${focusRingColor.secondary}`,
  // Corrected per the approved focus.danger fix (docs/token-normalization-decisions.md §10) —
  // Figma's own `outline/focus_danger` still points at the secondary alpha color; this does not.
  danger: `0 0 0 3px ${focusRingColor.danger}`,
  success: `0 0 0 3px ${focusRingColor.success}`,
  gray: `0 0 0 3px ${focusRingColor.gray}`,
  transparent: `0 0 0 3px ${color.black[200]}`, // outline/focus_transparent = Color/black/200
} as const;

export type FocusRingName = keyof typeof focusRingBoxShadow;

export type Emphasis = "solid" | "soft" | "outline" | "text";

/**
 * Derives a fill/text/border style from a single confirmed color ramp and an emphasis mode.
 * Only "solid" is confirmed by the audit (new_blue/Primary -> ramp[500] fill, white text).
 * "soft"/"outline"/"text" are a derived, minimal treatment reusing the *same ramp's* own real
 * steps (50/100/200/300/600/700) — not independently confirmed per docs/audit/buttons.md §11.
 */
export function emphasisStyle(ramp: ColorRamp, emphasis: Emphasis, hover: boolean): CSSProperties {
  switch (emphasis) {
    case "solid":
      return {
        backgroundColor: hover ? ramp[600] : ramp[500],
        color: color.white[950],
        border: "1px solid transparent",
      };
    case "soft":
      return {
        backgroundColor: hover ? ramp[200] : ramp[100],
        color: ramp[700],
        border: "1px solid transparent",
      };
    case "outline":
      return {
        backgroundColor: hover ? ramp[50] : "transparent",
        color: ramp[600],
        border: `1px solid ${ramp[300]}`,
      };
    case "text":
      return {
        backgroundColor: hover ? ramp[50] : "transparent",
        color: ramp[600],
        border: "1px solid transparent",
      };
  }
}

export const buttonBaseClassName =
  "inline-flex items-center justify-center gap-1 font-semibold whitespace-nowrap " +
  "cursor-pointer select-none transition-colors outline-none " +
  "disabled:cursor-not-allowed disabled:opacity-50 " +
  "focus-visible:shadow-[var(--btn-focus-ring)]";

export interface ButtonStyleArgs {
  size: ButtonSizeScaleA | ButtonSizeScaleB;
  radiusScale: "A" | "B";
  emphasisColor: CSSProperties;
  focusRing: FocusRingName;
  isFocusVariant: boolean;
}

export function buildButtonStyle({
  size,
  radiusScale,
  emphasisColor,
  focusRing,
  isFocusVariant,
}: ButtonStyleArgs): CSSProperties {
  const radiusValue =
    radiusScale === "A"
      ? radiusForSizeA[size as ButtonSizeScaleA]
      : radiusForSizeB[size as ButtonSizeScaleB];

  return {
    ...buttonTypography,
    ...emphasisColor,
    borderRadius: radiusValue,
    padding: paddingForSize[size],
    ["--btn-focus-ring" as string]: focusRingBoxShadow[focusRing],
    ...(isFocusVariant ? { boxShadow: focusRingBoxShadow[focusRing] } : {}),
  };
}
