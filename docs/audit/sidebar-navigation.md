# Sidebar Navigation Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0"
Frames audited:
- `Sidebar Navigation` overview (node `66068:24429`), containing two true component sets, one likely-composed demo, and four bare instances
- Deep instance audit: `sidebar_item` / `📐 size=lg, ☘️ type=active_primary_accent, 💡 state=hover` (node `66068:24523`), via `get_design_context`

Method: `get_metadata` and `get_variable_defs` for the overview; `get_design_context` (explicitly authorized) for the deep instance audit. Each finding is marked with its source.
Status: **Audit only.** No code, components, or project configuration were generated. No variable, style, or layer names were renamed or normalized.

---

## 1. Overview: component sets, node IDs, and classification

*(Source: `get_metadata`)*

| Name | Node ID | Classification |
|---|---|---|
| `sidebar_item` | `66068:24447` | true component set (variants exposed) |
| `sidebar_item_collapsed` | `66068:24628` | true component set (variants exposed) |
| `sidebar_nav` | `66068:24665` | likely a **demo composition**, not a primitive — see §7 |
| `sidebar_nav_collapsed` | `66068:24702` | single instance, no variants visible |
| `side_bar` | `66068:24703` | single instance, no variants visible |
| `side_bar_collapsed` | `66068:24704` | single instance, no variants visible |
| `side_bar_collapsed_2` | `66068:24705` | single instance, no variants visible |

(Plus an unrelated `overview_sheet_sidebar` instance, `66068:24430`.)

---

## 2. Exposed properties and variant values

*(Source: `get_metadata`)*

- `sidebar_item`: **`size`** (md, lg, xl), **`type`** (active_primary, active_primary_accent, active, active_neutral_inverse, active_neutral, inactive — 6 values), **`state`** (default, hover)
- `sidebar_item_collapsed`: **`type`** (same 6 values), **`state`** (default, hover) — **no `size` property**
- `sidebar_nav`: **`size`** (md, lg, xl) only

---

## 3. Variant counts

*(Source: `get_metadata`)*

- `sidebar_item`: **36** (3 sizes × 6 types × 2 states), confirmed against the full symbol list.
- `sidebar_item_collapsed`: **12** (6 types × 2 states).
- `sidebar_nav`: **3** (size only).
- The four bare instances: **0 confirmed variants each** — not expanded component sets in this metadata.

---

## 4. Sizes, states, types — confirmed coverage

*(Source: `get_metadata`)*

- **Sizes:** `sidebar_item` — md (h=40), lg (h=48), xl (h=56). `sidebar_item_collapsed` has **no size property** — all 12 variants share one implicit size (64×56). `sidebar_nav` — md (248×440), lg (248×528), xl (248×616), with height scaling heavily per size, consistent with a composed multi-item layout (§7).
- **States:** only `default`/`hover` on both `sidebar_item` and `sidebar_item_collapsed` — **no `disabled` state**, matching the same gap flagged in the `switcher_item` audit.
- **Types:** 6 values — `active_primary, active_primary_accent, active, active_neutral_inverse, active_neutral, inactive`. **`active_neutral_inverse` is new**, not present in `switcher_item`'s 5-value type set, confirming vocabulary drift between the two sibling navigation-style components despite 4 overlapping values.

---

## 5. Typography, spacing, radius, border, elevation, and effect tokens (overview-level)

*(Source: `get_variable_defs`, overview)*

```
Typography:
web/Title/22 Semibold, web/Title/76 Semibold, web/Title/32 Medium, web/Title/18 Semibold, web/Title/18 Medium,
web/Title/13 Semibold, web/Title/13 Medium, web/Body/13 Semibold, web/Body/13 Medium, web/Body/12 Medium,
web/Body/11 Semibold, web/Body/11 Medium
  (22/76/32/18 likely unrelated sidebar/heading spillover; 13/12/11 more plausible for actual item labels —
   13 Semibold confirmed genuinely applied in the deep audit, §7)

Spacing: 0, 2, 4, 6, 8, 12, 16, 24, 32, 40, 48

Radius:
radius/border_radius_round = 1000     radius/border_radius_xl = 20
radius/border_radius_md = 12          ← matches radius/custom/lg (12), NOT radius/custom/md (10) — another
                                          confirmed custom/* vs. border_radius_* mismatch
radius/custom/sm = 8   radius/custom/md = 10   radius/custom/lg = 12
radius/border_radius_5xl = 40         radius/border_radius_8xl = 64

Outline: outline/Black 50/100/150/300     outline/Gray 100/200/400

Effects:
elevation/e2 = (confirmed 2-layer, identical to prior audits — confirmed genuinely applied in the deep audit)
elevation/e5 = (confirmed 5-layer, identical to prior audits)
secondary_button_effect = (confirmed 4-layer — confirmed 3 of 4 layers genuinely applied in the deep audit, §7)
special_drop = (confirmed 2-layer — confirmed genuinely applied to the tag element in the deep audit, §7)
primary_special_outline = ""     secondary_special_outline = ""   ← both still unresolved, consistent

Icon sizes: sizing/icon/16, 20, 22, 24     ← 22 is new, first seen here; confirmed applied in the deep audit
```

---

## 6. Color and semantic tokens (overview-level)

*(Source: `get_variable_defs`, overview)*

Known values, confirmed reused: `Text/Gray 600/700/950`, `Text/Primary 500/600`, `Color/White 100`, `Color/white/50/400`, `Color/primary/500`, `Color/primary_base/_med_em/_base_em_alpha/_low_em_alpha`, `Color/smoke_med/base/low`, `Color/inverse_black_neutral/inverse_white_neutral`, `Color/gray/100`, `Color/Gray 50`, `Color/Gray` (unnumbered).

**New tokens/naming variants first observed here:**
```
Color/primary_base_em = #f7fbff        ← matches Color/primary/50 (lightest step!) — a THIRD, visually distinct
                                            value sharing the "primary_base" name stem alongside "Color/primary_base"
                                            (=#5468ff, primary/500) and "Color/primary_base_em_alpha" (=#5468ff1f,
                                            primary/500 @ 12%) — a significant naming-collision risk (§9)
Color/smoke_high = #ebecf0             ← completes the smoke family (low/med/high/base/em all now confirmed)
neutral_transparent_Black/Black 12 = #0000001f    ← matches outline/Black 150 (12.2%); a percentage-literal naming
                                                       style distinct from the "/150" step style
neutral_transparent_White/White 16 = #ffffff29    ← matches Color/white/200 (16.1%); same percentage-literal style
Color/dark/500 = #7d7d7d               ← first reference to the "dark" ramp outside the Colors audit itself
Text/Success 600 = #2a9919             ← first Success-specific Text/ token seen in this series
Color/success/500_alpha_12 = #35c2201f ← matches the Buttons audit's "_alpha_12" convention
```

---

## 7. Deep audit: `sidebar_item` / size=lg, type=active_primary_accent, state=hover (node `66068:24523`)

*(Source: `get_design_context`)*

### Internal layer hierarchy
```
66068:24523  "sidebar_item" (root)
├─ (absolute fill overlay — background layer, no separate node-id given)
├─ 66068:24524  "left_icon" (22×22)   [rendered — leftIcon=true, selectLeftIcon=null]
│  └─ I66068:24524;29:307   "vector"
├─ 66068:24525  <text> "Nav item"     [rendered — text=true — no wrapper container, unlike switcher_item's text_wrap]
├─ 66068:24526  "right_icon" (24×24)  [rendered — rightIcon=true, selectRightIcon=null]
│  └─ I66068:24526;29:307   "vector"
├─ 66068:24527  "tags"                [rendered — tag=true]
│  ├─ (absolute fill overlay — tag background, no separate node-id given)
│  ├─ I66068:24527;16712:81061   "test_wrap"
│  │  └─ I66068:24527;69:3577   <text> "Tag"
│  └─ (absolute inset overlay — tag inner shadow, no separate node-id given)
└─ (absolute inset overlay — root inner shadow, no separate node-id given)
```
**Confirmed structural simplification vs. `switcher_item`:** the label text is a direct flex child with no `text_wrap` container.

### Confirmed facts
- **Boolean properties (4):** `leftIcon`, `rightIcon`, `tag`, `text` — all at plain component defaults, no overrides.
- **Instance-swap properties (2):** `selectLeftIcon`, `selectRightIcon` (both `React.ReactNode | null`), same pattern as `field`, `list`, `switcher_item`.
- **Likely shared Tag dependency:** the `tags` element's internal `test_wrap`/text nodes carry instance-reference IDs (`16712:81061`, `69:3577`) in the **same ID-range pattern** as `list`'s tag (`16712:80998`, `69:3529`) — strongly suggesting both components instantiate the same underlying Tag component, though not confirmed byte-identical.
- **Icons/labels/tags confirmed; badges/counters/separators not found.** Collapsible controls are **not present in this `size=lg` variant** — that behavior lives entirely in the separate `sidebar_item_collapsed` component set.
- **Asymmetric icon sizing confirmed:** `left_icon` = 22×22, `right_icon` = 24×24 — different sizes within the same component, a genuine confirmed inconsistency.
- **Layout:** root `flex items-center justify-center` (horizontal, fully centered); `tags`/`test_wrap` same.
- **Sizing:** root `w-[240px] h-[48px]` (Fixed); label `flex-[1_0_0]` (Fill/grow) with `min-w-px`; `tags` `h-[24px]` Fixed, width Hug.
- **Padding/gaps:** root `p-[spacing/12, 12px]` uniform, `gap-[spacing/12, 12px]`; `tags` `px-[spacing/6, 6px] py-[spacing/4, 4px]`; `tags`' `test_wrap` `px-[spacing/4, 4px]` `gap-[spacing/8, 8px]`.
- **Typography:** label — SemiBold, `body_1`/`para` (13px/20px), color `text/primary-600` (`#3b4ee3`) — confirmed `web/Title/13 Semibold`/`web/Body/13 Semibold`, **identical to `switcher_item`'s label treatment.** Tag text — SemiBold, `caption_1` (11px/16px), color `text/white-950` (white) — confirmed `web/Body/11 Semibold`.
- **Fill/border/radius:** root fill `Color/primary_low_em_alpha` (`rgba(84,104,255,0.2)`) — **identical token and value to `switcher_item`'s `hover`/`active_primary_accent` fill.** Root radius `radius/custom/lg` (12px), no border. Tag fill `Color/primary/500` (solid blue) — **confirmed different** from `list`'s white tag fill. Tag border `outline/black-50`, radius `radius/custom/sm` (8px).
- **Elevation/effect:** root's own box-shadow is a single layer matching `elevation/e2`'s smaller layer (also `secondary_button_effect`'s 4th layer). A separate root inner-shadow overlay matches **exactly** `secondary_button_effect`'s first two INNER_SHADOW layers. **Confirmed: 3 of `secondary_button_effect`'s 4 layers are present**, its other drop-shadow layer (`offset (0,3) radius 3 spread -1.5`) was **not found** anywhere in this output. Tag's inner shadow matches `special_drop` **exactly** (full 2-layer match, same as `list`'s tag). Icons carry `elevation/e2`-matching drop-shadows.
- **Overrides:** none.

### Not confirmed / unresolved
- Whether `default` state or the other five `type` values share this structure with only styling differences — out of scope, no sibling inference.
- Why `left_icon`/`right_icon` sizes differ (22 vs. 24) — confirmed discrepancy, reason unknown.
- Whether the Tag sub-component is genuinely shared with `list` or a separately-defined duplicate.
- Why `secondary_button_effect`'s 4th layer is absent from this render while the other 3 are present.

---

## 8. Duplicated, suspicious, and naming inconsistencies

- **"primary_base" name-stem collision** (§6): `Color/primary_base_em` (`#f7fbff`, ≈primary/50), `Color/primary_base` (`#5468ff`, primary/500), and `Color/primary_base_em_alpha` (`#5468ff1f`, primary/500@12%) are three genuinely different colors sharing the same name stem — the most severe naming inconsistency confirmed so far in this audit series, since it affects distinct values, not just duplicate names for the same one.
- **`radius/border_radius_md` (12) matches `radius/custom/lg` (12), not `radius/custom/md` (10)** — continuing the pervasive, unresolved `custom/*` vs. `border_radius_*` mismatch (Input, List, Switcher, now Sidebar).
- **`sidebar_item_collapsed` has no `size` property**, unlike its sibling `sidebar_item` (3 sizes) — confirmed structural asymmetry.
- **`active_neutral_inverse`** exists in Sidebar's type vocabulary but not Switcher's, despite 4 overlapping `active_*` values between the two.
- **Five parallel naming conventions now confirmed for "color at reduced opacity"** across this and prior audits: `_alpha_12/20/24` (Buttons), `_base_em_alpha`/`_low_em_alpha` (Input, Switcher, Sidebar), `smoke_em/med/low/base/high` (Input, List, Switcher, Sidebar), the step-style `outline/Black 150` (Special Effects, Colors), and the percentage-literal style `neutral_transparent_Black/Black 12`, `neutral_transparent_White/White 16` (this audit).
- **Asymmetric icon sizing within `sidebar_item`** itself (§7) — confirmed at the instance level, not just a naming issue.

---

## 9. Dependencies on previously audited components

Confirmed reuse of: `elevation/e2` (icon shadows, root drop-shadow — every prior audit); `secondary_button_effect` (Buttons audit — 3 of 4 layers confirmed genuinely present here); `special_drop` (Input, List audits — confirmed exact match on the tag); `radius/custom/sm/md/lg` and `radius/border_radius_round/xl/md/5xl/8xl` (Buttons, Button Group, Input, List, Switcher audits); `sizing/icon/16/20/22/24` (Buttons, List, Switcher audits — `22` confirmed applied here for the first time); `Color/primary_base/_med_em/_base_em_alpha/_low_em_alpha` (Avatars, Input, Switcher audits — `_low_em_alpha` confirmed identical reuse from Switcher); `Color/smoke_*` family (Input, List, Switcher audits — now fully enumerated with `smoke_high`); `Text/Gray`, `Text/Primary`, `Text/White` families (Colors, Input, Buttons audits); `web/Body/11/12/13` and `web/Title/13/18` typography tokens (Typography, Buttons, Input, List, Switcher audits — `web/Title/13 Semibold`/`web/Body/13 Semibold` confirmed identical between `sidebar_item` and `switcher_item` labels); `outline/black-50` (Special Effects, List audits); the likely-shared Tag sub-component (List audit, same ID-range pattern); `primary_special_outline`/`secondary_special_outline` (still unresolved, consistent with every prior audit).

---

## 10. Anything MCP cannot retrieve

- Whether `sidebar_nav` is genuinely a composed demo (as its dimensions suggest) or a true standalone primitive — not confirmed without deeper `get_design_context` inspection of that specific node.
- The internal structure of the four bare instances (`sidebar_nav_collapsed`, `side_bar`, `side_bar_collapsed`, `side_bar_collapsed_2`) — none expanded in this metadata.
- Whether `default` state or the other five `type` values of `sidebar_item` share the audited instance's structure with only styling changes — out of scope, no sibling inference.
- Why `left_icon`/`right_icon` differ in size, and why one `secondary_button_effect` layer is missing from the render (§7).
- Whether `sidebar_item`'s tag genuinely instantiates the exact same Tag component as `list`'s tag.
- The intended distinction between `Color/primary_base`, `Color/primary_base_em`, and `Color/primary_base_em_alpha` (§8) — values are confirmed distinct; design rationale for the shared name stem is not.
- Real icon/tag glyph content beyond placeholder asset URLs.
- Default variant configuration for any component set.
- Variable Collection / Mode metadata — not retrievable, consistent with every prior audit in this series.
