# Switcher Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0"
Frames audited:
- `Switcher` overview (node `66065:22374`), containing two component sets
- Deep instance audit: `switcher_item` / `📐 size=lg, ☘️ type=active_primary_accent, 💡 state=hover` (node `66065:22473`), via `get_design_context`

Method: `get_metadata` and `get_variable_defs` for the overview; `get_design_context` (explicitly authorized) for the deep instance audit. Each finding is marked with its source.
Status: **Audit only.** No code, components, or project configuration were generated. No variable, style, or layer names were renamed or normalized.

---

## 1. Overview: component sets and node IDs

*(Source: `get_metadata`)*

| Name | Node ID |
|---|---|
| `switcher_item` | `66065:22392` |
| `switcher` | `66065:22643` |

(Plus an unrelated `overview_sheet_sidebar` instance, `66065:22375`.)

---

## 2. Exposed properties and variant values

*(Source: `get_metadata`)*

- `switcher_item`: **`size`** (xl, lg, md, sm, xs), **`type`** (inactive, active_neutral, active, active_primary_accent, active_primary), **`state`** (hover, default)
- `switcher`: **`size`** (xl, lg, md, sm, xs) only

---

## 3. Variant counts

*(Source: `get_metadata`)*

- `switcher_item`: **50** (5 sizes × 5 types × 2 states), confirmed against the full symbol list.
- `switcher`: **5** (size only).
- **Combined total: 55.**

---

## 4. Sizes, states, types — confirmed coverage

*(Source: `get_metadata`)*

- **Sizes:** both sets share the label scale `xl, lg, md, sm, xs`, but the **actual heights don't align**: `switcher_item` is xl=56/lg=48/md=40/sm=32/xs=24, while `switcher` is 8px taller at every step (xl=64/lg=56/md=48/sm=40/xs=32) — confirmed numeric mismatch despite identical size labels.
- **States:** only `hover`/`default` on `switcher_item` — **no `disabled` state**. `switcher` exposes no `state` property at all.
- **Architectural note — confirmed structural difference from `list`:** selection/active concepts (`active`, `active_neutral`, `active_primary`, `active_primary_accent`) live on the **`type`** property in `switcher_item`, not on `state`. In the previously-audited `list` component, `active_primary_accent` was itself a **state** value, not a type — the identical string plays two different structural roles across these two components.
- **Types:** `switcher_item`'s 5 `type` values — 4 of them (`active`, `active_neutral`, `active_primary`, `active_primary_accent`) share the `active_` prefix pattern, continuing the compound-naming style first flagged in the `list` audit.

---

## 5. Typography tokens (overview-level)

*(Source: `get_variable_defs`, overview)*

```
web/Title/22 Semibold, web/Title/76 Semibold, web/Title/32 Medium, web/Title/18 Semibold, web/Title/13 Semibold,
web/Body/13 Semibold, web/Body/12 Semibold, web/Body/11 Semibold
```
22/76/32 plausibly belong to unrelated sidebar/heading labels; 18/13/12/11 Semibold are more plausible candidates for actual per-size label text — **`13 Semibold` confirmed genuinely applied** in the deep audit (§7).

---

## 6. Spacing, radius, border, elevation, and effect tokens (overview-level)

*(Source: `get_variable_defs`, overview)*

```
spacing/2, 4, 6, 8, 12, 16, 24, 32, 40, 48

radius/border_radius_round = 1000
radius/border_radius_xl = 20        radius/custom/xl = 16     ← new "custom/xl" token; mismatched value vs. "border_radius_xl" — continues the ongoing custom/* vs. border_radius_* naming discrepancy
radius/custom/lg = 12     radius/custom/md = 10     radius/custom/sm = 8
radius/border_radius_5xl = 40
radius/border_radius_8xl = 64

outline/Black 150 / 300     outline/Gray 100 / 200 / 400

elevation/e2 = (confirmed 2-layer, identical to prior audits — confirmed genuinely applied in the deep audit, §7)
elevation/e5 = (confirmed 5-layer, identical to prior audits)
secondary_button_effect = (confirmed 4-layer, identical to Buttons audit — likely spillover)
primary_special_outline = ""   ← still unresolved, consistent with every prior audit

sizing/icon/14, 16, 18, 20, 24
```

---

## 7. Color and semantic tokens (overview-level)

*(Source: `get_variable_defs`, overview)*

Known ramp/alias values, confirmed reused: `Text/Gray 600/700/950`, `Text/Primary 600 = #3b4ee3`, `Color/White 100/white/50`, `Color/Gray 50/100`, `Color/smoke_med/low`, `Color/primary_base`, `Color/primary_med_em`, `Color/inverse_black_neutral`, `Color/inverse_white_neutral`.

**New tokens/naming variants first observed here:**
```
Text/inverse_black_neutral = #ffffff        ← new casing variant of "Color/inverse_black_neutral"
neutral_transparent_Black/alpha_88 = #000000e0   ← matches Color/black/900 (87.8%, Colors audit); a new naming convention for the same alpha-ramp concept
Color/smoke_em = #ffffff                    ← new, undifferentiated "smoke_em" variant, same value as Color/smoke_base
Color/primary_low_em_alpha = #5468ff33      ← ≈20% alpha of primary/500; a new alpha-suffix convention — CONFIRMED GENUINELY APPLIED as the root fill in the deep audit (§9)
Color/primary_base_em_alpha = #5468ff1f     ← ≈12% alpha; same exact name confirmed reused verbatim from the Input audit
```

---

## 8. Duplicated, suspicious, and naming inconsistencies (overview-level)

*(Source: `get_metadata` / `get_variable_defs`, overview)*

- **Size-scale mismatch between `switcher` and `switcher_item`** despite identical labels (§4).
- **No `disabled` state anywhere in the Switcher family.**
- **`type`-vs-`state` architectural inconsistency** for the identical string `active_primary_accent` across `switcher_item` (type) and `list` (state).
- **`radius/custom/xl` (16) vs. `radius/border_radius_xl` (20)** — another confirmed mismatch in the ongoing `custom/*` vs. `border_radius_*` duplicate-naming problem.
- **A fourth alpha-suffix naming convention confirmed**: `_alpha_12/20/24` (Buttons), `_base_em_alpha` (Input, reused here), `_low_em_alpha` (new, this audit), `smoke_em/med/low/base` (Input/List/this audit) — no single canonical system across the design system.
- **`Text/inverse_black_neutral` vs. `Color/inverse_black_neutral`** — same concept, two namespace prefixes, both `#ffffff`.

---

## 9. Deep audit: `switcher_item` / size=lg, type=active_primary_accent, state=hover (node `66065:22473`)

*(Source: `get_design_context`)*

### Internal layer hierarchy
```
66065:22473  "switcher_item" (root)
├─ 66065:22474  "left_icon" (20×20)   [rendered — leftIcon=true, selectLeftIcon=null]
│  └─ I66065:22474;29:307   "vector"
├─ 66065:22475  "text_wrap"           [rendered — text=true]
│  └─ 66065:22476  <text> "Nav item"
└─ 66065:22477  "right_icon" (20×20)  [rendered — rightIcon=true, selectRightIcon=null]
   └─ I66065:22477;29:307   "vector"
```
**Simpler structure than `list`:** no nested sub-groups; icons sit directly as siblings of `text_wrap`.

### Confirmed facts
- **Boolean properties (3):** `leftIcon`, `rightIcon`, `text` — all at their plain component defaults in this instance.
- **Instance-swap properties (2):** `selectLeftIcon`, `selectRightIcon` (both `React.ReactNode | null`), same pattern confirmed on `field` and `list`.
- **Nested component dependency: none.** Unlike `list` (which embeds a full Checkbox component), `switcher_item`'s icons are plain vector images — no nested component instance exists here.
- **Icons/labels/indicators/counters/badges/separators:** icons (`left_icon`, `right_icon`) and a label (`text_wrap`, placeholder text "Nav item" — possibly suggesting dual use as a nav-item style, though this is an observation from placeholder content, not confirmed intent) exist. **No indicators, counters, badges, or separators found.**
- **Layout:** root `flex items-center justify-center` (horizontal, fully centered); `text_wrap` `flex items-center justify-center`.
- **Sizing:** root `h-[48px]` (Fixed, matches `lg`), **no explicit width class** → Hug (content-driven); icons `size-[20px]` Fixed; `text_wrap` Hug.
- **Padding/gaps:** root `px-[spacing/16, 16px] py-[spacing/12, 12px]`, `gap-[spacing/8, 8px]` between icon/text/icon; `text_wrap` `px-[spacing/2, 2px]`.
- **Typography:** SemiBold, `font/size/body_1` (13px) / `font/line_height/para` (20px), no tracking, color `text/primary-600` (`#3b4ee3`) — confirmed **`web/Title/13 Semibold`** / **`web/Body/13 Semibold`** (the duplicate pair flagged in the Typography audit), now confirmed genuinely applied.
- **Fill:** `Color/primary_low_em_alpha` (≈20% alpha of primary/500, `rgba(84,104,255,0.2)`) — **confirms this token, flagged as new/unconfirmed in the overview, is genuinely applied** as the root background for this `active_primary_accent`/`hover` combination.
- **Radius:** `radius/custom/lg` (12px), uniform.
- **Border/outline:** none on the root.
- **Elevation/effect:** both icons carry `elevation/e2`-matching drop-shadows; no other effect token applies to the root.
- **Overrides:** none — every prop at its plain default.

### Not confirmed / unresolved
- Whether `default` state (or the other four `type` values) share this same structure with only styling differences, or diverge structurally — out of scope, no sibling inference performed.
- Whether indicators, counters, badges, or separators exist on any other `switcher_item` type/state combination.
- Whether the "Nav item" placeholder indicates intentional dual-purpose design.

---

## 10. Dependencies on previously audited components

Confirmed reuse of: `elevation/e2` (icon drop-shadows, consistent across every prior audit); `radius/custom/lg` (Buttons, Input, List audits); `spacing/2, 8, 12, 16` (consistent across every prior audit); `Color/primary_low_em_alpha` (this overview audit — now confirmed genuinely applied); `Text/primary-600` (Colors, Input, Buttons audits); `web/Title/13 Semibold` / `web/Body/13 Semibold` (the Typography audit's confirmed duplicate pair, now confirmed applied here as well); `Color/primary_base`, `Color/primary_med_em` (Avatars audit); `Color/primary_base_em_alpha` (Input audit, name reused verbatim); `radius/border_radius_round/xl/5xl/8xl` and `sizing/icon/*` (Buttons, Button Group, List audits).

---

## 11. Anything MCP cannot retrieve

- Why `switcher`'s size scale is 8px taller than `switcher_item`'s at every step (§4) — the discrepancy is confirmed, the design reason is not.
- Whether the `type`-vs-`state` architectural difference between `switcher_item` and `list` reflects an intentional design decision or drift between components.
- Whether `default` state or the other four `type` values share the `hover`/`active_primary_accent` instance's structure with only styling changes — out of scope, no sibling inference.
- Whether indicators, counters, badges, or separators exist anywhere else in the Switcher family.
- The real icon glyph content beyond the placeholder asset URL.
- Default variant configuration for either component set.
- Variable Collection / Mode metadata — not retrievable, consistent with every prior audit in this series.
