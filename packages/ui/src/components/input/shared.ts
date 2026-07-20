// Shared internals for the Input family (docs/audit/input.md). Two nodes were deep-audited via
// get_design_context (§8 input_field/active, §9 field/md/default) — every numeric value below
// that isn't marked "derived" is quoted directly from one of those two sections. Everything else
// in the family (dropdown, textarea, digit_input, digit_field, and every field size/type/state
// beyond md/default/active) has zero confirmed visual data (§13) and reuses these same confirmed
// values as a neutral baseline — never a fabricated one — documented per-file.

import { color, radius } from "@shikho/tokens";

// docs/audit/input.md §9 — field/md/default.
export const fieldRadiusMd = radius.md; // radius/custom/md (10) — @shikho/tokens' rank-based radius.md
export const fieldFillDefault = color.gray[100]; // Color/smoke_med (#f4f4f6) == Color/gray/100, §7
export const fieldTextColorDefault = color.gray[700]; // Text/Gray 700
export const fieldSupportTextColor = color.primary[500]; // Text/Primary 500, field's own supportText
export const innerShadow = `inset 0 1px 3px 0 ${color.black[50]}`; // input_inner_shadow, §6/§9

// docs/audit/input.md §8 — input_field/active.
export const fieldRadiusLg = radius.lg; // radius/custom/lg (12, confirmed only for the nested/active context)
export const fieldFillActive = color.white[950]; // Color/smoke_base (#ffffff)
export const activeBorderColor = color.secondary[300]; // outline/Secondary 300 (#f681d7)
export const activeRing = `0 0 0 3px ${color.secondary[500]}3d`; // == Color/Secondary/500_alpha_24
export const labelHintTextColor = color.gray[700]; // Text/Gray 700 (label + hint text)
export const fieldInputTextColor = color.gray[950]; // Text/Gray 950 (field's own input text, nested)

// docs/audit/input.md §9 — icon sizing confirmed for field/md/default.
export const fieldIconSize = 18; // sizing/icon/18
// docs/audit/input.md §8 — icon sizing confirmed for the nested field inside input_field/active.
export const nestedFieldIconSize = 20; // sizing/icon/20

export const typography = {
  fontSize: 13,
  lineHeight: "20px",
  fontWeight: 500,
} as const; // web/Body/13 Medium, confirmed for both deep audits

export const baseFieldClassName =
  "inline-flex items-center transition-colors outline-none " +
  "disabled:cursor-not-allowed disabled:opacity-50";
