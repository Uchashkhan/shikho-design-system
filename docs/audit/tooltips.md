# Tooltips Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0"
Frame audited: `Tooltips` overview (node `66070:27618`), containing a single component set.

Method: `get_metadata` and `get_variable_defs` via Figma MCP (live desktop selection). No deep instance audit (`get_design_context`) was performed for this component family — only the overview-level audit below.
Status: **Audit only.** No code, components, or project configuration were generated. No variable, style, or layer names were renamed or normalized.

---

## 1. Component set and node ID

| Name | Node ID |
|---|---|
| `tooltip` | `66070:27636` |

(Plus an unrelated `overview_sheet_sidebar` instance, `66070:27619`.) **This is the only component set in the entire selection** — no additional demo compositions or bare instances exist here, unlike every prior overview audited (Buttons, Input, Avatars, List, Switcher, Sidebar Navigation).

---

## 2. Exposed property and variant values

Exactly one property: **`direction`**. Property-icon prefix is 🧭 (compass) — a fifth distinct convention alongside 📐 (size), ☘️ (type), 💡 (state), and 🐷 (face, Avatars audit). No `size`, `type`, or `state` property exists.

**8 values, verbatim:** `botom_left`, `top_left`, `botom_right`, `top_right`, `bottom_center`, `top_center`, `left_center`, `right_center`.

**Confirmed spelling inconsistency:** `botom_left` and `botom_right` are missing the second "t" in "bottom," while `bottom_center` is spelled correctly in the same property's value set.

---

## 3. Variant count

**8 variants** (direction only), confirmed against the full symbol list.

---

## 4. Sizes, states, placements — confirmed coverage

- **Sizes:** none — no `size` property exists.
- **States:** none — no `state` property exists.
- **Placement (`direction`)** is the only variant axis (§2). Confirmed bounding-box dimensions: `botom_left/top_left/botom_right/top_right/bottom_center/top_center` = 240×152; `left_center/right_center` = 240×144 — an 8px height difference between vertically- and horizontally-oriented placements.

---

## 5. Whether titles, descriptions, buttons, arrows, icons, and actions are exposed as properties

**None of these appear as named top-level variant properties.** Only `direction` exists. A tooltip typically includes a pointer/arrow indicating anchor direction — plausible given the placement-based naming — but its existence as an internal layer **cannot be confirmed** without `get_design_context`, which was not used for this component family.

---

## 6. True component set vs. demo composition

**`tooltip` is a true, atomic component set** — 8 direction variants with consistent structure implied by uniform width (240px) and near-uniform height (152/144px). No demo compositions or bare instances exist in this selection, making this the sparsest overview audited in this series.

---

## 7. Typography tokens

```
web/Title/22 Semibold, web/Title/76 Semibold, web/Title/32 Medium,
web/Body/12 Medium, web/Body/12 Semibold

Primitives present without an accompanying named composite in this export:
font/family/primary = "Noto Sans Bengali"
font/size/body_1 = 13
font/line_height/para = 20
font/weight/default/semibold = 600
```
22/76/32 likely belong to unrelated sidebar/heading spillover. `web/Body/12 Medium/Semibold` (caption_2 scale) are more plausible candidates for actual tooltip label text. **Anomaly:** the raw `body_1`/`para`/`semibold` primitives appear without a corresponding `web/Title/13 *` or `web/Body/13 *` composite, unlike every prior audit where size/line-height/weight primitives were consistently paired with a named `Font()` composite.

---

## 8. Spacing, radius, border, elevation, and effect tokens

```
spacing/2, 4, 8, 12, 16, 24, 32, 40, 48     ← narrower set than prior audits (no 0, 6, 10, 14 seen here)

radius/border_radius_round = 1000
radius/border_radius_xl = 20
radius/border_radius_lg = 16
radius/custom/sm = 8          ← only one "custom/*" token present in this export
radius/border_radius_5xl = 40
radius/border_radius_8xl = 64

outline/Black 150 / 300     outline/Gray 100 / 200 / 400

elevation/e2 = (confirmed 2-layer, identical to prior audits)
elevation/e3 = Effect(type: DROP_SHADOW, color: elevation/Black 50, offset: (0, 24), radius: 24, spread: -12);
               Effect(type: DROP_SHADOW, color: elevation/Black 50, offset: (0, 3), radius: 3, spread: -1.5);
               Effect(type: DROP_SHADOW, color: elevation/Black 50, offset: (0, 1), radius: 1, spread: -0.5)
  ← NEWLY FULLY RESOLVED — first confirmed appearance in this audit series.
elevation/e5 = (confirmed 5-layer, identical to prior audits)
secondary_button_effect = (confirmed 4-layer, identical to Buttons audit — likely spillover, not confirmed applied)
primary_button_effect = (confirmed 4-layer, identical to Buttons audit — likely spillover, not confirmed applied)
primary_special_outline = ""   ← still unresolved, consistent with every prior audit
```

**Significant cross-reference finding:** `elevation/e3`'s resolution **confirms the additive-stacking hypothesis** first raised (but left unconfirmed) in the original Elevations audit — `e3`'s last two layers are exactly identical to `e2`'s complete 2-layer stack, matching the same pattern already confirmed between `e2` and `e6`.

---

## 9. Color and semantic tokens

```
Text/Gray 600 / 700 / 950     Text/White 950
Color/White 100 = #ffffff     Color/white/50 / 500 / 600
Color/gray/100 = #f4f4f6
Color/primary/500 = #5468ff
Color/smoke_base = #ffffff     Color/smoke_low = #f9f9fa
Color/inverse_black_neutral = #ffffff
```
All are known values already documented in prior audits (Colors, Input, List, Switcher, Sidebar Navigation) — no new tokens surfaced in this subtree.

---

## 10. Duplicated, inconsistent, or suspicious variants

- **`botom_left`/`botom_right` typo** vs. correctly-spelled `bottom_center` in the same property's value set.
- **Only one `radius/custom/*` token present** (`sm`, 8) — every other component audited so far exposed a fuller `custom/xs–xl` set; whether `tooltip` genuinely uses only this one step, or the rest are simply unbound in this subtree, is not confirmed.
- **Missing composite typography token** for the `body_1`/`para`/`semibold` primitives (§7) — an anomaly in the token export, not necessarily a design defect.

---

## 11. Naming inconsistencies

- **`botom_left`/`botom_right` vs. `bottom_center`** — a straightforward spelling typo, distinct from the structural/semantic naming-system conflicts (e.g. `custom/*` vs. `border_radius_*`, the `_alpha`/`_base`/`_med_em` proliferation) documented in prior audits.
- **🧭 (compass) property-icon prefix** — a fifth distinct convention, continuing the pattern of inconsistent per-property iconography across the design system (📐 size, ☘️ type, 💡 state, 🐷 face, 🧭 direction).

---

## 12. Dependencies on previously audited components

Confirmed reuse of: `elevation/e2`, `elevation/e5` (Button Group, Input, Avatars, List, Switcher, Sidebar Navigation audits); `secondary_button_effect`, `primary_button_effect` (Buttons audit, likely spillover, not confirmed applied to the tooltip itself); `radius/custom/sm`, `radius/border_radius_round/xl/lg/5xl/8xl` (Buttons, Button Group, Input, List, Switcher, Sidebar Navigation audits); `Color/smoke_base/low` (Input, List, Switcher, Sidebar Navigation audits); `Color/primary/500`, `Color/inverse_black_neutral` (Colors, Avatars, Input audits); `Text/Gray`/`Text/White` families (Colors, Buttons, Input audits); `web/Body/12 Medium/Semibold` (Typography, Input audits); `primary_special_outline` (still unresolved, consistent with every prior audit).

**Most significant cross-reference:** `elevation/e3`'s first-ever resolution in this series, confirming the additive-stacking pattern hypothesized in the original Elevations audit (§8).

---

## 13. Anything MCP cannot retrieve

- Whether an arrow/pointer, title, description, button, icon, or action exists as an internal layer on `tooltip` — requires `get_design_context`, not used for this component family.
- Whether `secondary_button_effect`/`primary_button_effect` are genuinely applied to the tooltip, or are incidental spillover.
- Why the typography export lacks a named composite for the `body_1`/`para`/`semibold` primitives found here.
- Whether `tooltip` truly uses only `radius/custom/sm`, or additional radius steps exist unbound in this subtree.
- Default variant configuration for `tooltip`.
- Variable Collection / Mode metadata — not retrievable, consistent with every prior audit in this series.
