# Tags Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0"
Frame audited: `Tags` overview (node `66077:29295`), containing a single component set.

Method: `get_metadata` and `get_variable_defs` via Figma MCP (live desktop selection). No deep instance audit (`get_design_context`) was performed for this component family — only the overview-level audit below.
Status: **Audit only.** No code, components, or project configuration were generated. No variable, style, or layer names were renamed or normalized.

---

## 1. Component set and node ID

| Name | Node ID |
|---|---|
| `tags` | `66077:29313` |

(Plus an unrelated `overview_sheet_sidebar` instance, `66077:29296`.) **This is the only component set in the entire selection** — no additional demo compositions or bare instances, consistent with the sparse single-set pattern seen in Tooltips, Alerts, Toasts, and Chips.

---

## 2. Exposed properties and variant values

`tags` exposes three: **`size`**, **`type`**, **`state`**.

- `size`: **lg, md, sm**
- `type`: **info, warning, danger, Danger Filled, success, Success Filled, tertiary, secondary, primary_outline, primary_light, primary** — 11 values
- `state`: **disabled, hover, default** — 3 values, notably **no `focus` and no `drag`**

**Confirmed major naming inconsistency:** `Danger Filled` and `Success Filled` are **two-word, space-containing, Title Case** values — a first in this entire audit series. Every other type value is a single lowercase or snake_case word.

---

## 3. Variant count and coverage

**99 variants** (11 types × 3 states × 3 sizes), confirmed against the full symbol list, with **no coverage gaps** — every type has all 3 states at all 3 sizes, unlike `chip`'s `Green`/`Red` gap.

Sizes: `lg` (77×32), `md` (67×24), `sm` (35×20). States uniformly available across all 11 types.

**Type groupings suggested by naming:** `primary` / `primary_light` / `primary_outline` (a confirmed three-way visual-style split for the primary brand color — filled, tinted, outlined); `danger` / `Danger Filled` and `success` / `Success Filled` (each paired with an explicit "Filled" counterpart) — but **only danger and success get a "Filled" pair**; `warning`/`info` do not, a confirmed asymmetry.

---

## 4. Whether labels, leading icons, trailing icons, counters, status indicators, and dismiss controls are exposed as properties

**None of these appear as named top-level variant properties** — only `size`/`type`/`state`. Confirming their existence as internal instance slots would require `get_design_context`, not used for this component family.

---

## 5. True component set vs. demo composition

**`tags` is a true, atomic component set** — 99 variants spanning size/type/state. No demo compositions or bare instances exist in this selection.

---

## 6. Typography tokens

```
web/Title/22 Semibold, web/Title/76 Semibold, web/Title/32 Medium   ← likely unrelated spillover
web/Body/12 Semibold, web/Body/11 Semibold
```
**Notably narrower than `chip`'s typography set** — only SemiBold weights appear (12/11), with no Medium weight and no `13` size — consistent with the SemiBold tag-label treatment already confirmed in the `list` and `sidebar_item` deep audits.

---

## 7. Spacing, radius, border, elevation, and effect tokens

```
spacing/0, 2, 4, 6, 8, 12, 16, 24, 32, 40, 48

radius/border_radius_round = 1000
radius/border_radius_xl = 20
radius/custom/md = 10     radius/custom/sm = 8     radius/custom/xs = 6
radius/border_radius_5xl = 40     radius/border_radius_8xl = 64

outline/Black 50 / 100     outline/Gray 400

elevation/e2 = (confirmed 2-layer, identical to prior audits)
elevation/e5 = (confirmed 5-layer, identical to prior audits)
secondary_button_effect = (confirmed 4-layer, identical to Buttons audit — likely spillover)
special_drop = (confirmed 2-layer, identical to the Input/List/Sidebar Navigation audits — confirmed there as
                 the genuine tag inner-shadow mechanism; plausibly identical here, not confirmed without
                 get_design_context)
secondary_special_outline = ""   ← still unresolved, consistent with every prior audit

sizing/icon/14, 16
```
**Three `radius/custom/*` tokens present** (xs/sm/md) — more than `chip`'s zero, suggesting `tags` may use varied corner-radius treatments across types, unlike `chip`'s uniform full-pill shape.

---

## 8. Color and semantic tokens

A rich, notably systematic alpha pattern — every severity/brand color gets exactly `_alpha_12` and `_alpha_20`, with `primary` additionally getting `_alpha_24`:
```
Text/Info 600 = #1080d6        Color/info/500_alpha_20 = #118be833     Color/info/500_alpha_12 = #118be81f
Text/Warning 600 = #ca9802     Color/warning/500_alpha_20 = #fcbf0433  Color/warning/500_alpha_12 = #fcbf041f
Text/Danger 600 = #e92020      Color/danger/500_alpha_20 = #f03d3d33   Color/danger/500_alpha_12 = #f03d3d1f   Color/danger/500 = #f03d3d   Color/danger/600 = #e92020
Text/Success 600 = #2a9919     Color/success/500_alpha_20 = #35c22033  Color/success/500_alpha_12 = #35c2201f  Color/success/500 = #35c220   Color/success/600 = #2a9919
Text/Primary 600 = #3b4ee3     Color/primary/500_alpha_24 = #5468ff3d  Color/primary/500_alpha_20 = #5468ff33  Color/primary/500_alpha_12 = #5468ff1f  Color/primary/500 = #5468ff   Color/primary/600 = #3b4ee3
```
Plus: `Color/gray/100/200`, `Color/white/950`, `outline/Black 50/100`, `outline/Gray 400`, and a **new token — first appearance outside the original Colors audit:** `Color/vanilla_gray/100 = #f6f4ef`, matching that ramp's documented value exactly.

---

## 9. Duplicated, inconsistent, or suspicious variants; naming inconsistencies

- **`Danger Filled`/`Success Filled` — two-word, spaced, Title Case values within a `type` property otherwise composed of single lowercase/snake_case words** — the most severe single-property naming inconsistency confirmed in this entire audit series.
- **Asymmetric "Filled" coverage:** only `danger`/`success` get a "Filled" counterpart; `warning`/`info` do not.
- **`primary_outline`/`primary_light`** use underscores while `Danger Filled`/`Success Filled` use spaces — two different word-separation conventions within the same `type` property.
- **Uniform state coverage** (no gaps) — a positive contrast to `chip`'s `Green`/`Red` gap.
- **The cleanest, most internally consistent alpha-naming system found in this entire audit series** (§8) — a rare positive exception to the naming proliferation documented across prior audits.

---

## 10. Comparing the architecture suggested by Tags with Chips

| Aspect | `chip` | `tags` |
|---|---|---|
| Sizes | 3 (lg/md/sm) | 3 (lg/md/sm) |
| Types | 5 (unselected, selected, selected_neutral, Green, Red) | 11 (info, warning, danger, Danger Filled, success, Success Filled, tertiary, secondary, primary_outline, primary_light, primary) |
| States | 5 (disabled, focus, hover, drag, default) | 3 (disabled, hover, default) — no focus, no drag |
| State coverage gaps | Yes — `Green`/`Red` only get `default` | None — all 11 types get all 3 states |
| Total variants | 51 | 99 |
| Radius tokens | only `border_radius_round` (uniform pill) | `border_radius_round` + `custom/xs/sm/md` — suggests varied shapes |
| Typography weights | Medium and Semibold, size 13/12/11 | Semibold only, size 12/11 — no Medium, no 13 |
| Color-alpha system | ad hoc (`outline/{name}_alpha`, raw `/500` values) | systematic `_alpha_12`/`_alpha_20`(/`_24` for primary) across every severity |
| Focus mechanism | confirmed ring-shadow (`outline/focus_primary`) | not applicable — no `focus` state exists |
| Naming inconsistency severity | moderate (casing: `Green`/`Red` vs. lowercase) | severe (space-containing, Title Case `Danger Filled`/`Success Filled`) |

**Overall architectural inference (not confirmed structurally without `get_design_context`):** `chip` reads as an **interactive, selectable/draggable** control (focus + drag states, selection-oriented types), while `tags` reads as a **static, label-only** element (no interactive states, but a much richer palette of semantic/brand color themes) — consistent with the conventional UI distinction between a chip (user-manipulable) and a tag (a static classification label).

---

## 11. Dependencies on previously audited components

Confirmed reuse of: `elevation/e2`, `elevation/e5` (every prior audit); `secondary_button_effect` (Buttons audit, likely spillover); `special_drop` (Input, List, Sidebar Navigation audits — confirmed there as the genuine tag inner-shadow mechanism); `radius/custom/xs/sm/md`, `radius/border_radius_round/xl/5xl/8xl` (Buttons, Button Group, Input, List, Switcher, Sidebar Navigation, Tooltips, Alerts, Toasts, Chips audits); `Color/gray/100/200`, `Color/white/950` (Colors audit); `Color/vanilla_gray/100` (Colors audit — first cross-referenced use outside that audit); `Color/{severity}/500_alpha_12/20` and `Color/primary/500_alpha_24` (Buttons audit's `_alpha_XX` convention, systematically applied here); `Text/Info/Warning/Danger/Success/Primary 600` families (Colors, Alerts, Toasts audits); `web/Body/11/12 Semibold` (Typography, List, Sidebar Navigation audits); `sizing/icon/14/16` (Buttons, List, Switcher, Sidebar Navigation, Chips audits); `secondary_special_outline` (still unresolved, consistent with every prior audit).

---

## 12. Anything MCP cannot retrieve

- Whether labels, leading/trailing icons, counters, status indicators, or dismiss controls exist as internal layers on `tags`.
- Whether `special_drop` is genuinely applied to `tags`, or is incidental spillover.
- Why only `danger`/`success` get a "Filled" counterpart while `warning`/`info` do not.
- Whether the three `radius/custom/*` tokens map to different `type` values (e.g. outline types vs. filled types).
- Whether `chip`'s and `tags`' architectural differences reflect genuinely different intended use cases or independent design evolution — inferred, not confirmed.
- Default variant configuration for `tags`.
- Variable Collection / Mode metadata — not retrievable, consistent with every prior audit in this series.
