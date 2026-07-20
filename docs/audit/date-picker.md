# Date Picker Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0"
Frame audited: `Date Picker` overview (node `66083:34360`), containing a single component set.

Method: `get_metadata` and `get_variable_defs` via Figma MCP (live desktop selection). `get_design_context` was deliberately not used for this audit — no internal layer structure was inferred.
Status: **Audit only.** No code, components, or project configuration were generated. No variable, style, or layer names were renamed or normalized.

---

## 1. Component set and node ID

| Name | Node ID |
|---|---|
| `date_picker` | `66083:34378` |

(Plus an unrelated `overview_sheet_sidebar` instance, `66083:34361`.) Only one component set.

---

## 2. Exposed properties and variant values

`date_picker` exposes two: **`type`** (`range`, `single`) and **`size`** (`lg`, `md`).

**Confirmed ordering quirk:** the layer-name convention lists `type` before `size` (`☘️ type=range, 📐 size=lg`) — every other component in this series lists `size` first. Whether this is meaningful or a display artifact isn't determinable from metadata alone.

**No `state` property exists at all** — confirmed complete absence of interaction states, joining `pagination` and `Progress` as components with zero state coverage.

---

## 3. Variant count and dimensions

**4 variants** (2 types × 2 sizes), confirmed against the full symbol list.

Confirmed dimensions: `range/lg` = 944×408, `range/md` = 792×352, `single/lg` = 568×408, `single/md` = 480×352. Height is determined purely by `size` (identical across both types at a given size); width differs by both `size` and `type` — `range` is wider than `single` at the same size, consistent with a two-panel calendar layout for range selection vs. one panel for single.

---

## 4. Sizes, states, types

- **Sizes:** `lg`, `md` (§3).
- **States:** none.
- **Types:** `range`, `single` only. **No `month`, `year`, or `time` type exists.**

---

## 5. Whether day cells, ranges, months, years, navigation arrows, presets, and input fields are exposed as properties

**None of these appear as named top-level variant properties** — only `type`/`size`. Whether any exist as internal (non-variant) layers cannot be confirmed without `get_design_context`.

---

## 6. True component set vs. demo composition

**`date_picker` is a true, atomic component set.** No demo compositions or bare instances exist in this selection.

---

## 7. Feature-support determination

- **Single date selection:** confirmed supported — `type=single` exists.
- **Date ranges:** confirmed supported — `type=range` exists.
- **Month picker:** not confirmed as its own mode — no `month` value exists in `type`. A month-navigation control might exist internally within `single`/`range`, not confirmed without `get_design_context`.
- **Year picker:** not confirmed — no `year` value exists anywhere.
- **Time selection:** not confirmed / likely absent — no time-related property, value, or token appears anywhere in this export.
- **Mobile layouts:** not confirmed / likely absent for `date_picker` specifically — no `mobile`/`device` value exists, unlike `nav_bar_header` and `pagination`.

---

## 8. Typography tokens

```
web/Title/22 Semibold, web/Title/76 Semibold, web/Title/32 Medium   ← likely unrelated spillover
web/Title/18 Semibold, web/Title/15 Semibold
web/Body/13 Medium, web/Body/13 Semibold, web/Body/12 Semibold

New primitives, first referenced in a component-specific context in this series:
font/size/overline = 11     font/line_height/overline = 16     font/weight/default/medium = 500
font/family/primary = "Noto Sans Bengali"
```
The `overline` scale — previously only documented as a primitive step in the original Typography audit — appears here bound to an actual component for the first time; plausibly used for day-of-week header labels, though speculative.

---

## 9. Spacing, radius, border, elevation, and effect tokens

```
spacing/0, 2, 4, 6, 8, 10, 12, 16, 24, 32, 40, 48

radius/border_radius_round = 1000     radius/border_radius_xl = 20
radius/border_radius_lg = 16     radius/border_radius_sm = 8     radius/border_radius_0 = 0
radius/border_radius_xxl = 24   ← BRAND NEW token, not seen in any prior audit
radius/custom/sm = 8     radius/custom/md = 10
radius/border_radius_5xl = 40     radius/border_radius_8xl = 64

outline/Black 150 / 300     outline/Gray 400

elevation/e2 = (confirmed 2-layer, identical to prior audits)
elevation/e4 = Effect(type: DROP_SHADOW, color: elevation/Black 50, offset: (0, 32), radius: 32, spread: -16);
               Effect(type: DROP_SHADOW, color: elevation/Black 50, offset: (0, 6), radius: 6, spread: -3);
               Effect(type: DROP_SHADOW, color: elevation/Black 50, offset: (0, 3), radius: 3, spread: -1.5);
               Effect(type: DROP_SHADOW, color: elevation/Black 50, offset: (0, 1), radius: 1, spread: -0.5)
  ← NEWLY FULLY RESOLVED — first confirmed appearance of e4 in this audit series. See nesting note below.
elevation/e5 = (confirmed 5-layer, identical to prior audits)
secondary_button_effect = (confirmed 4-layer, identical to Buttons audit — likely spillover)
primary_button_effect = (confirmed 4-layer, identical to Buttons/Alerts/Toasts/Pagination audits)
input_inner_shadow = (confirmed, identical to the Input/List/Tags/Pagination audits)
primary_special_outline = ""   ← still unresolved, consistent with every prior audit

sizing/icon/16, 18
```

**Elevation nesting note (refines the additive-stacking hypothesis):** `e4`'s layers (32, 6, 3, 1) are a strict subset of `e5`'s (56, 32, 6, 3, 1) — confirming `e5` = `e4` plus one new larger layer. However, `e3`'s distinctive `24` value (confirmed in the Tooltips audit: layers 24, 3, 1) does **not** appear anywhere in `e4`'s layer set — `e4` introduces both `32` and `6` while dropping `24` entirely. **The additive-stacking hypothesis holds for most transitions (e2→e3, e2→e6, e4→e5) but breaks specifically at the e3→e4 transition** — a confirmed refinement, not a full universal rule.

---

## 10. Color and semantic tokens

```
Text/Gray 400 / 600 / 700 / 950
Color/White 100 = #ffffff     Color/white/50 / 500 / 600
Color/Gray 100     Color/gray/100     Text/White 950
Color/primary/500 = #5468ff     Text/Primary 600 = #3b4ee3
Color/primary/500_alpha_12 = #5468ff1f
Color/black/50
Color/smoke_base = #ffffff     Color/smoke_low = #f9f9fa
Color/inverse_black_neutral = #ffffff
```

---

## 11. Duplicated, inconsistent, or suspicious variants

- **`type` listed before `size`** — a confirmed ordering inversion relative to every other component audited.
- **`radius/border_radius_xxl` is a brand-new token**, adding another entry to the already-fragmented `radius/*` naming landscape.
- **The elevation additive-stacking hypothesis is confirmed to break at the e3→e4 transition** — a precise, new finding refining the pattern documented across the Elevations, Tooltips, Alerts, and Toasts audits.
- **Complete absence of any state property** — consistent with `pagination` and `Progress`, suggesting a broader tendency for "content-heavy" components to skip state variants that "control-like" components consistently have.

---

## 12. Comparing the architecture with Inputs, Pagination, and navigation components

- **Inputs:** `date_picker` shares `input_inner_shadow` with the Input family — plausibly real if `date_picker` includes a manual-entry text field, though inferred from token presence only. Unlike `field`/`input_field`, `date_picker` has no boolean properties for label/hint/icon slots — its variant model is purely `type`×`size`, much simpler than Input's boolean-driven architecture.
- **Pagination:** both `date_picker` and `pagination` share `primary_button_effect`/`input_inner_shadow` tokens and both have **zero state coverage** — a shared architectural trait among "content/data display" components, contrasting with interactive controls (Buttons, Chips, Checkbox, etc.).
- **Navigation components (Switcher/Sidebar/Top Nav/Tab Nav):** no property-icon or type-vocabulary overlap found; `date_picker` doesn't participate in the `active_*`/`inactive_*` naming lineage confirmed among those four.
- **Overall:** `date_picker` sits architecturally closer to `pagination` (simple type/size-only model, no states, shared button/input effect tokens) than to the interactive-control families.

---

## 13. Dependencies on previously audited components

Confirmed reuse of: `elevation/e2`, `elevation/e5` (every prior audit); `elevation/e4` (newly resolved here, first full confirmation in this series); `secondary_button_effect`, `primary_button_effect` (Buttons, Alerts, Toasts, Pagination audits); `input_inner_shadow` (Input, List, Tags, Pagination audits); `radius/custom/sm/md`, `radius/border_radius_round/xl/lg/sm/0/5xl/8xl` (Buttons and nearly every subsequent audit); `radius/border_radius_xxl` (new, first seen here); `Color/primary/500`, `Color/primary/500_alpha_12` (Colors, Buttons audits); `Text/Primary 600` (Colors, Input, Buttons audits); `Color/smoke_base/low` (Input, List, Switcher, Sidebar Navigation, Top Navigation, Tab Navigation, Tooltips, Alerts, Toasts audits); `Color/inverse_black_neutral` (Button Group, Input, Switcher, Sidebar Navigation, Top Navigation audits); `Text/Gray` family (Colors and nearly every subsequent audit); `web/Title/15/18 Semibold`, `web/Body/12/13 Medium/Semibold` (Typography, Buttons, Input, Chips, Links, Pagination audits); `primary_special_outline` (still unresolved, consistent with every prior audit).

---

## 14. Anything MCP cannot retrieve

- Whether day cells, month/year navigation, presets, or an input field exist as internal layers — requires `get_design_context`, not authorized for this task.
- Whether month picker, year picker, or time-selection modes exist as internal sub-states of `single`/`range` rather than separate `type` values.
- Whether a mobile-specific layout exists for `date_picker` at all.
- Whether `input_inner_shadow`/`primary_button_effect` are genuinely applied here, and to which specific internal elements.
- What specifically uses the `overline` typography scale.
- Default variant configuration for `date_picker`.
- Variable Collection / Mode metadata — not retrievable, consistent with every prior audit in this series.
