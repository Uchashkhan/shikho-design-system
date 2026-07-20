# Table Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0"
Frame audited: `Tables` overview (node `66084:36270`).

Method: `get_metadata` and `get_variable_defs` via Figma MCP (live desktop selection). `get_design_context` was deliberately not used for this audit — no internal layer structure was inferred.
Status: **Audit only.** No code, components, or project configuration were generated. No variable, style, or layer names were renamed or normalized.

---

## 1. Component sets and node IDs

| Name | Node ID | Classification |
|---|---|---|
| `table_cell` | `66084:36288` | true component set |
| `table` | `66084:36365` | single bare instance, **not expanded** |

(Plus an unrelated `overview_sheet_sidebar` instance, `66084:36271`.)

---

## 2. Exposed properties and variant values

`table_cell` exposes two: **`type`** (`header`, `header_compact`, `default`, `default_compact` — 4 values, with density folded into `type`), **`state`** (`default`, `loading` — **`loading` is a new state, not seen in any prior audit in this series**). `table` has no confirmable properties — it's a bare instance in this metadata.

---

## 3. Variant count and dimensions

**`table_cell`: 8 variants** (4 types × 2 states), confirmed against the full symbol list. `table` has 0 confirmable variants (bare instance). Dimensions vary per type/state combination directly (e.g. `header/default` = 307×40, `default/default` = 540×56, `default_compact/default` = 472×44) rather than through a separate size axis.

---

## 4. Sizes, states, types

- **Sizes:** none — no `size` property exists.
- **States:** `default, loading` only.
- **Types:** `header, header_compact, default, default_compact` — density (`_compact`) confirmed folded into the `type` axis rather than a separate property.

---

## 5. Whether the system exposes properties for row selection, checkboxes, sorting, column alignment, pagination, avatars, tags/chips, actions, expandable rows, status indicators, sticky headers

**None of these appear as named top-level variant properties on `table_cell`.** The existence of `loading` hints at data-fetching UX, but none of these listed features are confirmed as exposed properties. Any could exist as internal (non-variant) layers within specific `type` values, not confirmed without `get_design_context`.

---

## 6. True component sets vs. demo compositions or bare instances

**`table_cell` is a true, atomic component set.** **`table` is a single bare instance, not an expanded component set** — its internal composition cannot be confirmed from this metadata.

---

## 7. Whether the system separates table / table_row / table_cell / table_header / table_toolbar / table_pagination

**Confirmed: the system does NOT separate these into distinct component sets in this selection.**
- **`table_cell`** exists as a true component set.
- **`table_header`** does **not** exist as its own component set — `header`/`header_compact` are `type` values within `table_cell`, not a separate component.
- **`table_row`, `table_toolbar`, `table_pagination`** — none of these exist anywhere in this selection.
- **`table`** exists only as an unexpanded bare instance — whether it internally composes rows/headers/toolbar/pagination cannot be confirmed without direct inspection.

---

## 8. Typography tokens

```
web/Title/22 Semibold, web/Title/76 Semibold, web/Title/32 Medium   ← likely unrelated spillover
web/Title/13 Medium
web/Body/13 Semibold, web/Body/13 Medium
web/Body/12 Semibold, web/Body/12 Medium
web/Body/11 Semibold
```
Notably includes both Semibold and Medium pairs — a break from the SemiBold-only pattern confirmed consistent across `list`, `switcher_item`, `sidebar_item`, `top_nav_item`, and `tab_nav_item`. Plausibly Semibold for header cells and Medium for regular data cells, not confirmed.

---

## 9. Spacing, sizing, radius, border, elevation, and effect tokens

```
spacing/0, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48

radius/border_radius_round = 1000
radius/border_radius_xl = 20     radius/border_radius_xs = 6     radius/border_radius_0 = 0
radius/border_radius_md = 12   ← matches the same custom/* vs. border_radius_* mismatch pattern flagged in
                                   Input/List/Sidebar Navigation/Switcher (border_radius_md=12 ≠ custom/md=10)
radius/custom/sm = 8     radius/custom/md = 10
radius/border_radius_5xl = 40     radius/border_radius_8xl = 64

outline/Gray 400

elevation/e1 = Effect(type: DROP_SHADOW, color: elevation/Black 50, offset: (0, 1), radius: 1, spread: -0.5)
  ← NEWLY FULLY RESOLVED — the single smallest shadow layer, and the LAST previously-unresolved elevation
    token from the original Elevations audit. With e1 now confirmed, ALL SIX elevation levels (e1–e6) have
    been fully resolved across this audit series. This is precisely the shared final/smallest layer that
    has appeared consistently at the tail end of every higher elevation level — its resolution is the
    capstone confirmation of the additive-stacking hypothesis at its base case.
elevation/e2 = (confirmed 2-layer, identical to prior audits)
elevation/e5 = (confirmed 5-layer, identical to prior audits — likely spillover)
secondary_button_effect = (confirmed 4-layer, identical to Buttons audit — likely spillover)
special_drop = (confirmed 2-layer, identical to the Input/List/Sidebar Navigation/Tags audits)

sizing/icon/16, 18, 20, 22, 24
```

---

## 10. Color and semantic tokens

```
Text/Gray 400 / 600 / 700 / 950
Color/White 100 = #ffffff     Color/white/50 = #ffffff0a
Color/Gray 100 / 200     Color/gray/100
Color/disabled_base_em = #f4f4f6   ← same duplicate-of-gray/100 pattern flagged in the Toggle audit
Text/Primary 600 = #3b4ee3     Color/primary/500_alpha_12 = #5468ff1f
Color/inverse_black_neutral = #ffffff
Color/smoke_low = #f9f9fa
```

---

## 11. Duplicated, inconsistent, or suspicious variants

- **`elevation/e1` fully resolved — completes the full e1–e6 elevation set across this audit series.** A significant capstone finding, not an inconsistency, but worth flagging as the resolution of a long-standing gap first identified in the original Elevations audit.
- **`radius/border_radius_md` (12) again mismatches `radius/custom/md` (10)** — recurring instance of the ongoing `custom/*` vs. `border_radius_*` naming/value discrepancy.
- **Density (`_compact`) folded into `type` rather than exposed as its own property** — consistent with the broader pattern of overloaded properties documented throughout this series.
- **`Color/disabled_base_em` duplicates `Color/gray/100`** — same recurring neutral-color duplication pattern.
- **`table` present only as a bare, unexpanded instance** — consistent with the recurring pattern (seen with `drop_menu`, `digit_field`, `side_bar`, etc.) of higher-level composed components not being explorable via metadata alone.

---

## 12. Comparing the architecture with List, Pagination, and Input

- **List:** `list`'s rich boolean-driven composition (leadIcon, leadItem, tags, textGroup1/2, etc.) has no counterpart in `table_cell`, which exposes zero boolean properties in this metadata — `table_cell`'s variant model (`type`×`state`) is far simpler on the surface, though internal flexibility could still exist via instance overrides not visible here.
- **Pagination:** both `table_cell` and `pagination` are minimal, non-orthogonal-leaning components, but `table_cell` at least has a genuine `state` axis (`default`/`loading`), unlike `pagination`'s complete absence of states — `table_cell` is slightly more conventionally structured.
- **Input:** `field`'s extensive parameterization (9 booleans, 2 instance-swap slots) contrasts sharply with `table_cell`'s two-property model — suggesting `table_cell` either handles content variation entirely through instance overrides, or its internal richness (if any) simply wasn't captured by this variant structure.
- **`loading` state is unique to `table_cell`** among all components compared — no equivalent skeleton/loading state was found in List, Pagination, or Input.

---

## 13. Dependencies on previously audited components

Confirmed reuse of: `elevation/e1` (newly resolved, completing the full e1–e6 set); `elevation/e2`, `elevation/e5` (every prior audit); `secondary_button_effect` (Buttons audit, likely spillover); `special_drop` (Input, List, Sidebar Navigation, Tags audits); `radius/custom/sm/md`, `radius/border_radius_round/xl/xs/md/0/5xl/8xl` (Buttons, Input, List, Sidebar Navigation, Switcher, Tab Navigation, and other prior audits — including the recurring `border_radius_md`/`custom/md` mismatch); `Color/disabled_base_em` (Toggle audit); `Color/primary/500_alpha_12` (Buttons audit's `_alpha_12` convention); `Text/Primary 600` (Colors, Input, Buttons, Switcher, Sidebar Navigation audits); `Color/smoke_low`, `Color/inverse_black_neutral` (Input, List, Switcher, Sidebar Navigation, Top Navigation, Tab Navigation, Tooltips, Alerts, Toasts, Date Picker audits); `Text/Gray` family (Colors and nearly every subsequent audit); `web/Body/11/12/13 Semibold/Medium`, `web/Title/13 Medium` (Typography, Input, Chips, Links, Pagination, Date Picker audits); `sizing/icon/16/18/20/22/24` (Buttons, List, Switcher, Sidebar Navigation, Top Navigation, Chips audits).

---

## 14. Anything MCP cannot retrieve

- Whether row selection, checkboxes, sorting, column alignment, pagination, avatars, tags/chips, actions, expandable rows, status indicators, or sticky headers exist as internal layers on `table_cell` — requires `get_design_context`, not authorized for this task.
- What the `table` bare instance actually contains internally (rows, headers, toolbar, pagination composition) — not expanded in this metadata.
- Whether `table_row`, `table_header`, `table_toolbar`, or `table_pagination` exist elsewhere in the file outside this specific selection.
- Whether `special_drop`/`secondary_button_effect` are genuinely applied to `table_cell`, or are incidental spillover.
- Default variant configuration for `table_cell`.
- Variable Collection / Mode metadata — not retrievable, consistent with every prior audit in this series.
