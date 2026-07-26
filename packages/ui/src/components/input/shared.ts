// Shared internals for the Input family (docs/audit/input.md, deep re-audit §14 below).
//
// The original implementation deep-audited 2 nodes (input_field/active, field/md/default) but
// then reused that single confirmed baseline as a "neutral" fallback for every other size, type,
// and state — meaning 5 of 7 input_field states, all of dropdown's 9 states, and every field
// size besides md/default never actually matched Figma. A second re-audit (~14 more
// get_design_context calls) now confirms the real per-size and per-state visual construction;
// see docs/audit/input.md §14 for the full findings. Every value below is either cited to that
// section or explicitly marked derived.

import { color, radius } from "@shikho/tokens";

// docs/audit/input.md §14 — confirmed field size ramp (height/padding/gap/icon-size/radius/
// typography), sampled directly at sm/md/lg/xl. Note this is NOT the same numeric progression as
// Buttons' size ramp — Input has its own confirmed padding/gap values at every step.
export type FieldSize = "sm" | "md" | "lg" | "xl";

interface FieldSizeMetrics {
  height: number;
  padding: string;
  gap: number;
  radius: number;
  iconSize: number;
  fontSize: number;
  lineHeight: string;
}

export const FIELD_SIZE_METRICS: Record<FieldSize, FieldSizeMetrics> = {
  sm: { height: 32, padding: "0.5rem", gap: 2, radius: radius.sm, iconSize: 16, fontSize: 12, lineHeight: "16px" },
  md: { height: 40, padding: "0.5rem 0.625rem", gap: 4, radius: radius.md, iconSize: 18, fontSize: 13, lineHeight: "20px" },
  lg: { height: 48, padding: "0.75rem", gap: 6, radius: radius.lg, iconSize: 20, fontSize: 13, lineHeight: "20px" },
  xl: { height: 56, padding: "1rem 0.875rem", gap: 6, radius: radius.xl, iconSize: 24, fontSize: 18, lineHeight: "24px" },
};

// docs/audit/input.md §9/§14 — the icon-slot drop-shadow filter, confirmed present on every icon
// in every Input component sampled (field, input_field, dropdown, input_hint) — the same
// elevation/e2-based pattern used system-wide, but never actually applied in the pre-rebuild code.
export const iconShadowFilter =
  "drop-shadow(0px 1px 0.5px rgba(0,0,0,0.04)) drop-shadow(0px 3px 1.5px rgba(0,0,0,0.04))";

export const fieldRadiusMd = radius.md; // radius/custom/md (10) — §9
export const fieldFillDefault = color.gray[100]; // Color/smoke_med (#f4f4f6) == Color/gray/100
export const fieldTextColorDefault = color.gray[700]; // Text/Gray 700
export const fieldSupportTextColor = color.primary[500]; // Text/Primary 500, field's own supportText
export const innerShadow = `inset 0 1px 3px 0 ${color.black[50]}`; // input_inner_shadow, §6/§9

export const fieldRadiusLg = radius.lg; // radius/custom/lg (12, confirmed for the nested/active field)
export const fieldFillActive = color.white[950]; // Color/smoke_base (#ffffff)
export const activeBorderColor = color.secondary[300]; // outline/Secondary 300 (#f681d7)
export const activeRing = `0 0 0 3px ${color.secondary[500]}3d`; // == Color/Secondary/500_alpha_24
export const labelHintTextColor = color.gray[700]; // Text/Gray 700 (label + hint text)
export const fieldInputTextColor = color.gray[950]; // Text/Gray 950 (field's own input text, nested)

export const fieldIconSize = 18; // sizing/icon/18, field/md/default
export const nestedFieldIconSize = 20; // sizing/icon/20, field nested inside input_field/active

export const typography = {
  fontSize: 13,
  lineHeight: "20px",
  fontWeight: 500,
} as const; // web/Body/13 Medium, confirmed for both original deep audits

export const baseFieldClassName =
  "inline-flex items-center transition-colors outline-none " +
  "disabled:cursor-not-allowed disabled:opacity-50";

// ---------------------------------------------------------------------------------------------
// docs/audit/input.md §14 — confirmed per-state visual construction for input_field / dropdown /
// digit_input, all 3 of which share the same underlying "field" chrome. Sampled directly:
// input_field (all 7 states), dropdown (default/active/disabled/naked), digit_input (the tool
// returned a single synthesized component covering all 7 states in one fetch, since the node
// queried was the full component set rather than one instance).
// ---------------------------------------------------------------------------------------------

export type FieldChromeState =
  | "default"
  | "default_dark"
  | "hover"
  | "filled"
  | "active"
  | "error"
  | "disabled";

export interface FieldChromeStyle {
  background: string;
  border: string;
  boxShadow?: string;
  textColor: string;
  hintColor: string;
}

/**
 * The confirmed fill/border/ring/text combination shared by `input_field`, `dropdown`, and
 * `digit_input`'s field-chrome (docs/audit/input.md §14). `active`/`error` both use the exact
 * same ring color (`Color/Secondary/500_alpha_24`) — confirmed independently on both — differing
 * only in border color (secondary/300 pink vs. danger/300 red). This is a genuine, confirmed
 * Figma detail (the same binding-reuse pattern documented elsewhere as `focus_danger`), not an
 * approximation.
 */
export function fieldChromeStyle(state: FieldChromeState): FieldChromeStyle {
  switch (state) {
    case "default":
      return { background: color.gray[100], border: "none", textColor: color.gray[700], hintColor: color.gray[700] };
    case "default_dark":
    case "hover":
      // docs/audit/input.md §14 — confirmed: hover's fill darkens one step (smoke_high/gray[200])
      // AND its text lightens to gray[600] — a genuine two-property shift, not just a fill change.
      return { background: color.gray[200], border: "none", textColor: color.gray[600], hintColor: color.gray[700] };
    case "filled":
      // Confirmed visually identical to `default` in the sampled instance (§14).
      return { background: color.gray[100], border: "none", textColor: color.gray[700], hintColor: color.gray[700] };
    case "active":
      return {
        background: color.white[950],
        border: `1px solid ${color.secondary[300]}`,
        boxShadow: `0 0 0 3px ${color.secondary[500]}3d`,
        textColor: color.gray[950],
        hintColor: color.gray[700],
      };
    case "error":
      return {
        background: color.white[950],
        border: `1px solid ${color.danger[300]}`,
        boxShadow: `0 0 0 3px ${color.secondary[500]}3d`, // confirmed identical ring to `active`, §14
        textColor: color.gray[700],
        hintColor: color.danger[500],
      };
    case "disabled":
      return { background: color.gray[100], border: "none", textColor: color.gray[400], hintColor: color.gray[400] };
  }
}

/** `default`/`filled` keep the confirmed `input_inner_shadow`; `active`/`error` replace it with
 * their ring (§9/§14 — confirmed absent on the ringed states); `disabled` keeps it (§14). */
export function fieldChromeInnerShadow(state: FieldChromeState): string | undefined {
  return state === "active" || state === "error" ? undefined : innerShadow;
}
