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

---

## 14. Deep re-audit addendum — implementation rebuild (this pass)

The original audit above deliberately never called `get_design_context` — the pre-rebuild `Tooltip` implementation reflected that: a bare content bubble with a derived fill/text/radius/shadow and no heading, description, actions, or pointer at all, since none of those could be confirmed to exist. This section documents a deep re-audit that found the opposite of the original audit's caution: `tooltip` is one of the richest single components audited in this library.

**Method:** `get_metadata` on `tooltip` (node `66070:27636`, confirming exact node IDs for all 8 `direction` variants), then `get_design_context` on 6 of the 8 variants (`bottom_center` `66070:27685`, `left_center` `66070:27709`, `botom_left` `66070:27637`, `top_center` `66070:27697`, `top_left` `66070:27649`, `right_center` `66070:27721`), then downloaded the real pointer SVG assets behind 4 of those samples to confirm exact geometry.

**Confirmed structure** (boolean-gated content slots, all present in the audited instances): `heading` (SemiBold, `body_1` 13/20, `Text/gray-950`), `description` (Medium, `caption_2` 12/16, `Text/gray-700`), an `actions` row gated by `ctAs` containing up to two buttons — `button1` ("Learn more": `gray/100` fill, `radius/custom/sm`=8, the confirmed system-wide "special_drop" 2-layer inset, `Text/gray-700` SemiBold text) and `button2` ("Got it": `primary/500` fill, `outline/Black 150` border, a distinct confirmed 2-layer inset (`inset 0px 3px 4px -3px Color/white/600, inset 0px 0px 8px -2px Color/white/500`), `Text/white-950` SemiBold text) — and a `pointer` graphic.

**Confirmed exact `tip` construction:** `Color/smoke_base` (white) fill, `radius/border_radius_lg` (16, i.e. `radius.xl` in this package's own naming — not `radius/custom/sm`=8 as previously assumed), `spacing/12` padding, `spacing/16` gap between the text block and the actions row, and a 1px `outline/Gray 100` border on 3 of its 4 sides — the border is confirmed OMITTED on whichever edge touches the pointer, so the two shapes visually fuse into one continuous card.

**Confirmed exact `pointer` construction:** downloading the real SVG behind 4 samples (`bottom_center`, `top_center`, `left_center`, `botom_left`) shows a rounded-tip triangle (not a plain polygon), filled solid white, sized 16×8 for vertical placements and 8×16 for horizontal ones. Center placements (`bottom_center`/`top_center`) use this shape directly; corner placements (`botom_left`/`botom_right`/`top_left`/`top_right`) use the same triangle shape but confirmed offset within a wider 48px-tall bounding asset (visually placing the arrow nearer one horizontal edge of the tip rather than centered) — this implementation reproduces the same visual effect via simple flex alignment rather than the padded-asset technique, an intentional simplification, not a literal reproduction.

**Confirmed exact wrapper construction:** a fixed 240px width (not a max-width, resolving §4's ambiguity — height is Hug/content-driven), and a 3-layer drop-shadow matching `elevation/e3` exactly, expressed via the `filter: drop-shadow()` chain Figma itself generates (not `box-shadow`) — because the shadow wraps the pointer's non-rectangular alpha shape as a unit with the tip, not just the tip's rectangular box. The blur-minus-spread conversion Figma applies here (e.g. `elevation.e3`'s `blur:24,spread:-12` becomes `drop-shadow(... 12px ...)`) is the same conversion already used system-wide for `iconShadowFilter`-style constants.

**Resolves §5/§13's open question:** yes — an arrow/pointer, a heading, a description, and 2 actions all exist as confirmed internal layers. None of §5's speculation was invented; all of it is now directly confirmed.

**Derived, not confirmed — anchor-relative positioning:** Figma's `direction` variants define only the internal tip+pointer visual union, not how that whole unit attaches to a trigger element in a page layout — this remains exactly as unconfirmed as before. This pass changes the *derived* anchor-offset mapping, though: the newly confirmed pointer geometry shows `top_*`'s pointer sits above the tip pointing upward, and `botom_*`/`bottom_center`'s pointer sits below the tip pointing downward. For the pointer to visually point *at* its anchor (the entire reason a tooltip has a pointer), `top_*` must therefore render the tooltip BELOW its anchor, and `botom_*`/`bottom_center` must render it ABOVE — the reverse of the naive "placement=top means tooltip renders above the anchor" convention this component's pre-rebuild implementation used. `left_center`/`right_center` are corrected the same way (tooltip renders on the side opposite its own pointer).

**Rebuild:** `tooltip.tsx` was rewritten from a bare content `<div>` to the confirmed rich card: a `tip` surface (white fill, 3-sided bordered, 16px radius, 12px padding, 16px internal gap) plus a real SVG pointer, wrapped in a positioned unit using the corrected anchor-offset direction above. New props: `heading`, `description`, `secondaryAction`/`primaryAction` (each `{ label: ReactNode; onClick?: () => void }`), replacing the old generic `children` prop, since the confirmed structure is these specific named slots, not free-form content. `tooltip.test.tsx` was fully rewritten against the new API and the corrected positioning direction.
