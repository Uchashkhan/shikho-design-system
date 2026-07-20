# Top Navigation Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0"
Frame audited: `Top Navigation` overview (node `66081:31172`), containing two component sets.

Method: `get_metadata` and `get_variable_defs` via Figma MCP (live desktop selection). `get_design_context` was deliberately not used for this audit — no internal layer structure was inferred.
Status: **Audit only.** No code, components, or project configuration were generated. No variable, style, or layer names were renamed or normalized.

---

## 1. Component sets and node IDs

| Name | Node ID |
|---|---|
| `top_nav_item` | `66081:31190` |
| `top_nav` | `66081:31666` |

(Plus an unrelated `overview_sheet_sidebar` instance, `66081:31173`.)

---

## 2. Exposed properties and variant values

- `top_nav_item`: **`size`** (xl, lg, md, sm, xs), **`type`** — **active_outline, inactive_outline, inactive, active_neutral, active, active_primary_accent, active_primary** (7 values), **`state`** — **focus, hover, default**
- `top_nav`: **`size`** only

**Confirmed state-coverage split within `top_nav_item`'s own type set:** `active_outline`, `active_neutral`, `active`, `active_primary_accent`, `active_primary` (5 types) each get all 3 states (focus/hover/default); **`inactive_outline` and `inactive` (2 types) only get `hover`/`default` — no `focus`.**

---

## 3. Variant counts

- `top_nav_item`: **95** — confirmed as (5 types × 3 states × 5 sizes) + (2 types × 2 states × 5 sizes) = 75 + 20 = 95.
- `top_nav`: **5** (size only).
- **Combined total: 100.**

---

## 4. Sizes and states — confirmed coverage

- **Sizes:** `top_nav_item` — xl (184×56), lg (146×48), md (134×40), sm (114×32), xs (97×24). `top_nav` shares the same 5 size labels; width scales heavily (xs=617 → xl=1150) while height exactly matches `top_nav_item`'s per-size heights — consistent with a composed row of multiple `top_nav_item` instances (§7).
- **States:** `focus, hover, default` — 3 total, but only fully available on 5 of 7 types (§2). **No `disabled` state exists anywhere on `top_nav_item`.**

---

## 5. Types

7 values: `active_outline, inactive_outline, inactive, active_neutral, active, active_primary_accent, active_primary`. Six of seven share an `active_`/`inactive_` root; two (`active_outline`, `inactive_outline`) introduce an `_outline` suffix not seen in `switcher_item` or `sidebar_item`'s type vocabularies.

---

## 6. Whether icons, badges, counters, separators, and labels are exposed as properties

**None of these appear as named top-level variant properties** — only `size`/`type`/`state`. Icon-size tokens (`sizing/icon/14/16/18/20/24`) are present in the subtree, consistent with every sibling nav component, but not confirmed as an exposed property or slot without `get_design_context`.

---

## 7. True component sets vs. demo compositions

**`top_nav_item` is a true, atomic component set.** **`top_nav` is very likely a demo composition, not a primitive** — its dimensions (width scaling steeply per size while height matches `top_nav_item` exactly) mirror the pattern confirmed as a composed multi-item demo in the Sidebar Navigation audit's `sidebar_nav`. This is inferred from bounding-box shape/scale, not confirmed via internal structure.

---

## 8. Typography tokens

```
web/Title/22 Semibold, web/Title/76 Semibold, web/Title/32 Medium   ← likely unrelated spillover
web/Title/18 Semibold
web/Title/13 Semibold
web/Body/13 Semibold, web/Body/12 Semibold, web/Body/11 Semibold
```
The SemiBold-only pattern (no Medium weight variants) matches the confirmed label typography style already seen in `list`, `switcher_item`, and `sidebar_item` — a consistent typographic choice across nav/selection-style components.

---

## 9. Spacing, radius, border, elevation, and effect tokens

```
spacing/0, 2, 4, 6, 8, 12, 16, 24, 32, 40, 48

radius/border_radius_round = 1000
radius/border_radius_xl = 20
radius/custom/xl = 16     radius/custom/lg = 12     radius/custom/md = 10     radius/custom/sm = 8
  ← the full custom radius scale, matching the Buttons audit's complete set
radius/border_radius_5xl = 40     radius/border_radius_8xl = 64

outline/Gray 100 / 200 / 300 / 400     outline/Black 50 / 100 / 150 / 300

elevation/e2 = (confirmed 2-layer, identical to prior audits)
elevation/e5 = (confirmed 5-layer, identical to prior audits)
secondary_button_effect = (confirmed 4-layer, identical to Buttons audit — likely spillover)
special_drop = (confirmed 2-layer, identical to the Input/List/Sidebar Navigation/Tags audits)
primary_special_outline = ""     secondary_special_outline = ""
  ← both confirmed unresolved simultaneously in this single subtree — the first audit where both appear together

outline/focus_gray    = Effect(type: DROP_SHADOW, color: outline/Gray 300, offset: (0,0), radius: 0, spread: 3)
outline/focus_primary = Effect(type: DROP_SHADOW, color: outline/primary_alpha, offset: (0,0), radius: 0, spread: 3)
  ← both fully resolved from prior audits; plausible mechanism for the `focus` state on the 5 eligible types

sizing/icon/14, 16, 18, 20, 24
```

---

## 10. Color and semantic tokens

```
Text/Gray 600 / 700 / 950
Color/White 100 = #ffffff     Color/white/50 = #ffffff0a
Color/Gray 50 / 100
Text/inverse_black_neutral = #ffffff     Color/inverse_white_neutral = #000000     Color/inverse_black_neutral = #ffffff
neutral_transparent_Black/alpha_88 = #000000e0     ← matches Color/black/900 (Colors audit), Switcher/Sidebar audits
neutral_transparent_Black/Black 24 = #0000003d     ← NEW naming variant, matches outline/Black 300/Color/black/300
                                                        (23.9%); a "percentage-literal" suffix style, joining
                                                        "Black 12"/"White 16" (Sidebar Navigation) as further
                                                        evidence this naming convention recurs, not a one-off
Color/smoke_high / med / low
Text/Primary 500 / 600     outline/primary_alpha
Color/primary_med_em = #85a4ff     Color/primary_base = #5468ff
```

---

## 11. Duplicated, inconsistent, or suspicious variants

- **`inactive`/`inactive_outline` types lack a `focus` state** while all five `active_*` types have one — a confirmed, systematic coverage split within a single component's own type vocabulary.
- **No `disabled` state anywhere on `top_nav_item`** — unlike `switcher_item`, which has one.
- **`neutral_transparent_Black/Black 24` is another instance of the percentage-literal alpha-naming convention**, reinforcing that this isn't isolated to the Sidebar Navigation audit.
- **Both `primary_special_outline` and `secondary_special_outline` appear unresolved together in one subtree for the first time** — previously these surfaced individually across different components.

---

## 12. Comparing naming against Switcher and Sidebar Navigation

| | `switcher_item` | `sidebar_item` | `top_nav_item` |
|---|---|---|---|
| Type values | inactive, active_neutral, active, active_primary_accent, active_primary (5) | active_primary, active_primary_accent, active, active_neutral_inverse, active_neutral, inactive (6) | active_outline, inactive_outline, inactive, active_neutral, active, active_primary_accent, active_primary (7) |
| State values | Default, Disabled, Focus, Hover (4, **capitalized**) | default, hover (2, lowercase, **no focus/disabled**) | focus, hover, default (3, lowercase, **no disabled**; only 5/7 types get focus) |

**Confirmed: `top_nav_item`'s type vocabulary is a superset combining `switcher_item`'s and most of `sidebar_item`'s.** All 5 of `switcher_item`'s type values appear verbatim in `top_nav_item`. Five of `sidebar_item`'s 6 types also appear verbatim — but `top_nav_item` **drops** `sidebar_item`'s `active_neutral_inverse` and **adds** two new `_outline` variants (`active_outline`, `inactive_outline`) not present in either sibling. This is a genuine, confirmed pattern of **deliberate naming reuse/evolution** across three related nav-style components — a positive contrast to the naming chaos documented in the selection-control family (Checkbox/Radio/Toggle).

**State casing:** `top_nav_item` uses lowercase, matching `sidebar_item`'s convention rather than `switcher_item`'s capitalized one. **State coverage** is inconsistent across all three: `switcher_item` has `disabled`, neither `sidebar_item` nor `top_nav_item` do; only `switcher_item` and (partially) `top_nav_item` have `focus`, `sidebar_item` has none at all.

---

## 13. Dependencies on previously audited components

Confirmed reuse of: `elevation/e2`, `elevation/e5` (every prior audit); `secondary_button_effect` (Buttons audit, likely spillover); `special_drop` (Input, List, Sidebar Navigation, Tags audits); `outline/focus_gray`, `outline/focus_primary` (Special Effects, Buttons, Chips, Checkbox, Radio, Toggle audits); `radius/custom/sm/md/lg/xl` (Buttons audit's full radius scale, confirmed reused completely here); `radius/border_radius_round/xl/5xl/8xl` (every prior multi-component audit); `Color/smoke_high/med/low` (Input, List, Switcher, Sidebar Navigation, Tooltips, Alerts, Toasts audits); `Color/primary_med_em`/`primary_base` (Avatars, Switcher, Sidebar Navigation audits); `Color/inverse_black_neutral`/`inverse_white_neutral` (Button Group, Input, Switcher, Sidebar Navigation audits); `Text/Gray`, `Text/Primary` families (Colors, Buttons, Input, Switcher, Sidebar Navigation audits); `web/Body/11/12/13 Semibold`, `web/Title/13/18 Semibold` (Typography, List, Switcher, Sidebar Navigation audits); the type-vocabulary overlap with `switcher_item` and `sidebar_item` (§12) — the clearest confirmed cross-component naming lineage in this audit series; `primary_special_outline`/`secondary_special_outline` (still unresolved, consistent with every prior audit).

---

## 14. Anything MCP cannot retrieve

- Whether `top_nav` is genuinely a composed demo (as its dimensions strongly suggest) or a standalone primitive — not confirmed without `get_design_context`.
- Whether icons, badges, counters, or separators exist as internal instance slots on `top_nav_item`.
- Whether `outline/focus_gray`/`outline/focus_primary` map to specific types (e.g. gray for neutral types, primary for primary types) — plausible, not confirmed.
- Why `inactive`/`inactive_outline` lack a `focus` state while every `active_*` type has one.
- Why no `disabled` state exists on `top_nav_item` at all.
- Whether `Color/primary_med_em`/`primary_base` are genuinely applied here, or incidental spillover.
- Default variant configuration for either component set.
- Variable Collection / Mode metadata — not retrievable, consistent with every prior audit in this series.
