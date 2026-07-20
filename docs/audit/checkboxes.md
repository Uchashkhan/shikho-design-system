# Checkboxes Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0"
Frame audited: `Checkboxes` overview (node `66077:29923`), containing two component sets.

Method: `get_metadata` and `get_variable_defs` via Figma MCP (live desktop selection). No deep instance audit (`get_design_context`) was performed for this component family — only the overview-level audit below.
Status: **Audit only.** No code, components, or project configuration were generated. No variable, style, or layer names were renamed or normalized.

---

## 1. Component sets and node IDs

| Name | Node ID |
|---|---|
| `checkbox` | `66077:29941` |
| `checkbox_label` | `66077:30090` |

(Plus an unrelated `overview_sheet_sidebar` instance, `66077:29924`.) **Two true component sets** — unlike the single-set overviews (Tooltips, Alerts, Toasts, Chips, Tags), this one matches the multi-set pattern seen in Buttons, Input, Avatars, List, Switcher, and Sidebar Navigation.

---

## 2. Exposed properties and variant values

- `checkbox`: **`size`** (md, sm), **`shape`** (🟣 icon — a sixth distinct property-icon convention, after 📐 size, ☘️ type, 💡 state, 🐷 face, 🧭 direction) — **sphere, square**, **`state`** — **disabled, indeterminate_disabled, indeterminate, checked_focused, checked, unchecked_focused, hover, unchecked** (8 values)
- `checkbox_label`: **`size`** (sm, md), **`direction`** (🧭 — reusing the same compass icon as `tooltip`'s placement property) — **left, right**

**Confirmed naming/coverage inconsistency in `state`:** only the `focused` variants are explicitly prefixed with the checked-value (`checked_focused`, `unchecked_focused`); `disabled` and `hover` are **not** prefixed, and no `checked_hover` or `checked_disabled` variant exists at all.

---

## 3. Variant counts

- `checkbox`: **32** (2 sizes × 2 shapes × 8 states), confirmed against the full symbol list.
- `checkbox_label`: **4** (2 sizes × 2 directions).
- **Combined total: 36.**

---

## 4. Sizes, shapes, states — confirmed coverage

- **Sizes:** `checkbox` — md (24×24), sm (20×20). `checkbox_label` shares the same two size labels.
- **Shape:** `sphere`, `square` — a genuine, confirmed binary shape choice (round vs. square checkbox).
- **States:** 8 total on `checkbox` (§2), not fully cross-producted with checked/unchecked (§2 inconsistency). `checkbox_label` has no `state` property.
- **Direction:** `left`/`right` on `checkbox_label` only — plausible label-positioning relative to the checkbox itself.

---

## 5. Whether labels, captions, checkmarks, indeterminate indicators, descriptions, and validation states are exposed as properties

- **Labels:** confirmed via the separate `checkbox_label` component set — label positioning (`direction`) is exposed there, distinct from `checkbox` itself.
- **Captions/descriptions:** not exposed as a property on either set; raw Regular/400-weight typography primitives in this subtree hint at a possible description style (matching the pattern confirmed as real in `alert`/`toast`), not confirmed here.
- **Checkmark/indeterminate indicators:** represented via **`state`** values (`checked`, `indeterminate`), not a dedicated boolean/sub-property.
- **Validation states:** none — no `error`/`success`/`warning` state exists on `checkbox`.

---

## 6. True component sets vs. demo compositions

**Both `checkbox` and `checkbox_label` are true, atomic component sets.** No demo compositions or bare instances exist in this selection.

---

## 7. Typography tokens

```
web/Title/22 Semibold, web/Title/76 Semibold, web/Title/32 Medium   ← likely unrelated spillover
web/Body/12 Medium

Primitives without an accompanying named composite:
font/family/primary = "Noto Sans Bengali"
font/size/body_1 = 13
font/line_height/para = 20
font/weight/default/normal = 400
```
The raw Regular/400-weight primitives match the pattern confirmed as a real Regular-weight description text in the `alert`/`toast` deep audits — here plausibly `checkbox_label`'s label text, not confirmed without `get_design_context`.

---

## 8. Spacing, radius, border, elevation, and effect tokens

```
spacing/2, 8, 12, 16, 24, 32, 40, 48

radius/border_radius_xs = 6     ← the ONLY small radius token; NO radius/custom/* tokens present at all.
                                    This value EXACTLY matches the radius confirmed applied to the nested
                                    Checkbox's "base" layer in the `list` deep audit — see §12, very likely
                                    the same underlying component.
radius/border_radius_xl = 20     radius/border_radius_5xl = 40     radius/border_radius_8xl = 64

outline/Gray 300 / 400

elevation/e2 = (confirmed 2-layer, identical to prior audits — likely spillover, no icon slot on checkbox itself)
elevation/e5 = (confirmed 5-layer, identical to prior audits)
secondary_button_effect = (confirmed 4-layer, identical to Buttons audit — likely spillover)

outline/focus_primary = Effect(type: DROP_SHADOW, color: outline/primary_alpha, offset: (0,0), radius: 0, spread: 3)
outline/focus_gray    = Effect(type: DROP_SHADOW, color: outline/Gray 300, offset: (0,0), radius: 0, spread: 3)
  ← both fully confirmed from Special Effects/Buttons/Chips audits; strong candidates for the checked_focused/
    unchecked_focused ring treatments (plausibly one uses primary, the other gray — not confirmed)
```

---

## 9. Color and semantic tokens

```
Text/Gray 400 / 600 / 700 / 950
Text/Primary 100 = #edf6ff   ← new token name, but matches Color/primary/100 exactly (Colors audit)
Text/Primary 500 = #5468ff
outline/primary_alpha = #5468ff3d
outline/Gray 300 / 400
Color/White 100 = #ffffff     Color/white/50 = #ffffff0a
Color/inverse_black_neutral = #ffffff
Color/smoke_low = #f9f9fa
```

---

## 10. Duplicated, inconsistent, or suspicious variants; naming inconsistencies

- **Asymmetric state-prefix naming:** `focused` variants qualified with `checked_`/`unchecked_`, but `hover`/`disabled` are not, despite no `checked_hover`/`checked_disabled` counterpart existing.
- **`Text/Primary 100` duplicates `Color/primary/100`** (Colors audit) — another instance of the `Text/*` vs. `Color/*` namespace duplication pattern already flagged in the Switcher audit.
- **No `radius/custom/*` tokens** — `checkbox` relies solely on `radius/border_radius_xs`, the narrowest radius footprint among all components audited (tied with `chip`'s single-token footprint, though `chip` used `border_radius_round` instead).
- **🟣 (purple circle) property-icon for `shape`** — a sixth distinct property-icon convention in this audit series.

---

## 11. Comparing the architecture suggested by Checkboxes with List and Chips

- **Checkboxes ↔ List — confirmed, direct relationship.** The `list` deep audit found a nested Checkbox component instance (`theme_light/sm/square/unchecked/default`) embedded via the `leadIcon` boolean — matching this `checkbox` component set's `size`/`shape` values and radius token exactly. This confirms **List's row-selection UI is built by composing `list` + a nested `checkbox` instance**, not by `list` implementing its own selection visuals natively.
- **Checkboxes ↔ Chips — no direct dependency confirmed, but a clear architectural contrast.** `chip`'s selection concept lives in its **`type`** property (`selected`/`unselected`/`selected_neutral`), with no literal "checked" state name and no dedicated checkmark layer confirmed in the deep audit. `checkbox`, by contrast, encodes selection **directly and explicitly in `state`** (`checked`/`unchecked`/`indeterminate`, plus focus variants). These represent two different selection-encoding philosophies within the same design system — reinforcing the same `type`-vs-`state` architectural ambiguity already flagged between `list`, `switcher_item`, `alert`, and `toast`.
- **Indeterminate state:** `checkbox` uniquely supports `indeterminate`/`indeterminate_disabled` — a concept with no equivalent in either `list`'s selection model or `chip`'s `selected` type, confirming `checkbox` has richer selection semantics than either.

---

## 12. Dependencies on previously audited components

Confirmed reuse of: `elevation/e2`, `elevation/e5` (every prior audit, likely spillover here); `secondary_button_effect` (Buttons audit, likely spillover); `outline/focus_primary`, `outline/focus_gray` (Special Effects, Buttons, Chips audits — both fully resolved there); `radius/border_radius_xs/xl/5xl/8xl` (Buttons, Button Group, Input, List, Switcher, Sidebar Navigation, Tooltips, Alerts, Toasts, Chips, Tags audits); `Color/White 100`, `Color/white/50`, `Color/inverse_black_neutral`, `Color/smoke_low` (Colors, Input, List, Switcher, Sidebar Navigation, Tooltips, Alerts, Toasts audits); `Text/Gray`, `Text/Primary` families (Colors, Buttons, Input, Switcher, Sidebar Navigation audits); `web/Body/12 Medium` (Typography, Input, Chips audits).

**Most significant cross-reference:** the `checkbox` component set audited here is very likely the **same underlying Checkbox component** confirmed nested inside `list` (via the `leadIcon` boolean) in the List deep audit — that instance was `theme_light/sm/square/unchecked/default`, matching this set's `size=sm`, `shape=square` values exactly, and using the identical `radius/border_radius_xs` (6px) token confirmed there.

---

## 13. Anything MCP cannot retrieve

- Whether `checkbox_label`'s label text uses the Regular/400-weight primitives found in this subtree, or something else — not confirmed without `get_design_context`.
- Whether `outline/focus_primary`/`outline/focus_gray` map specifically to `checked_focused` vs. `unchecked_focused` respectively, or some other assignment.
- Whether `checkbox_label` composes a `checkbox` instance internally (analogous to how `list` composes `checkbox`) — plausible given the naming, not confirmed.
- Why `hover`/`disabled` states aren't qualified with `checked_`/`unchecked_` prefixes while `focused` states are.
- Default variant configuration for either component set.
- Variable Collection / Mode metadata — not retrievable, consistent with every prior audit in this series.
