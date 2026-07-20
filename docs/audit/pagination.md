# Pagination Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0"
Frame audited: `Pagination` overview (node `66082:32858`), containing a single component set.

Method: `get_metadata` and `get_variable_defs` via Figma MCP (live desktop selection). `get_design_context` was deliberately not used for this audit — no internal layer structure was inferred.
Status: **Audit only.** No code, components, or project configuration were generated. No variable, style, or layer names were renamed or normalized.

---

## 1. Component set and node ID

| Name | Node ID |
|---|---|
| `pagination` | `66082:32876` |

(Plus an unrelated `overview_sheet_sidebar` instance, `66082:32859`.) Only one component set in this selection.

---

## 2. Exposed property and variant values

Exactly one property: **`page`** — and notably, **no emoji/icon prefix at all**, unlike every other component audited so far (📐, ☘️, 💡, 🐷, 🧭, 🟣, 🖥️). First confirmed property in this series with no icon convention.

**6 values, verbatim:** `first, center, last, less_pages, load_more, mobile`.

**Confirmed architectural anomaly:** these are not orthogonal style/state axis values — they represent **entirely different pagination layout scenarios**, confirmed from bounding-box dimensions:
- `first`, `center`, `last`: identical **1040×32** (same page-number-row shape, different scroll position)
- `less_pages`: **242×32** (a compact variant for fewer total pages)
- `load_more`: **176×128** (a completely different aspect ratio — tall, not wide — consistent with a stacked "Load more" button pattern rather than a page-number row)
- `mobile`: **344×88** (a distinct responsive layout)

---

## 3. Variant count

**6 variants** (single `page` property), confirmed against the full symbol list.

---

## 4. Sizes and states — confirmed absence

- **Sizes:** none — each `page` value has its own fixed dimensions rather than a size variant axis.
- **States:** **none** — no `state` property exists anywhere. The most complete absence of interaction-state coverage of any component audited in this entire series.

---

## 5. Types/styles

No `type` property exists; the closest equivalent is the `page` property itself, which mixes layout-scenario and responsive-breakpoint concepts (`mobile`) into a single value set rather than separating them.

---

## 6. Whether previous/next controls, page numbers, ellipsis, labels, icons, counters, and selected-page indicators are exposed as properties

**None of these appear as named top-level variant properties.** The value names (`first`, `center`, `last`, `less_pages`) strongly imply the presence of previous/next arrow controls, numbered page buttons, and likely an ellipsis for `center`/`last` — but none of this is confirmed structurally without `get_design_context`.

---

## 7. True component set vs. demo composition

**`pagination` is technically a single, formal component set** (real Figma variant symbols), but **functionally reads as a scenario/demo showcase rather than an atomic primitive with orthogonal properties** — each of its 6 values represents a different composed layout situation rather than independent style choices that could be freely combined. This is the clearest confirmed instance in this audit series of a component set blurring the line between "reusable primitive" and "demo composition."

---

## 8. Typography tokens

```
web/Title/22 Semibold, web/Title/76 Semibold, web/Title/32 Medium   ← likely unrelated spillover
web/Body/13 Medium, web/Body/13 Semibold
web/Body/12 Medium, web/Body/12 Semibold
```
Both Medium and Semibold variants at the same two scale steps are present — plausibly Semibold for the current/selected page number and Medium for others, not confirmed.

---

## 9. Spacing, radius, border, elevation, and effect tokens

```
spacing/2, 4, 6, 8, 12, 16, 24, 32, 40, 48

radius/border_radius_round = 1000
radius/border_radius_xl = 20
radius/custom/sm = 8     radius/custom/md = 10
radius/border_radius_5xl = 40     radius/border_radius_8xl = 64

outline/Black 150 / 300     outline/Gray 200 / 400     outline/Primary 300 = #bad5ff
  ← new token, matches Color/primary/300 from the Colors audit exactly; joins the growing family of
    "outline/{Brand} {step}" tokens (outline/Gray*, outline/danger_alpha, etc.)

elevation/e2 = (confirmed 2-layer, identical to prior audits — likely spillover)
elevation/e5 = (confirmed 5-layer, identical to prior audits — likely spillover)
secondary_button_effect = (confirmed 4-layer, identical to Buttons audit — likely spillover)
primary_button_effect = (confirmed 4-layer, identical to Buttons/Alerts/Toasts audits — plausibly reused for
                            the "load_more" variant, given its button-like shape, not confirmed)
input_inner_shadow = (confirmed, identical to the Input/List/Tags audits — presence unexplained without
                        deeper inspection; could be spillover or a genuine jump-to-page input element)
primary_special_outline = ""   ← still unresolved, consistent with every prior audit

sizing/icon/16, 18
```

---

## 10. Color and semantic tokens

```
Text/Gray 400 / 600 / 700 / 950
Color/White 100 = #ffffff     Color/white/50 / 500 / 600
Color/gray/100     Color/primary/500 = #5468ff     Text/Primary 500 = #5468ff
Color/smoke_med / low     Color/black/50     Color/inverse_black_neutral = #ffffff
neutral_transparent_Black/Black 12 = #0000001f
```

---

## 11. Duplicated, inconsistent, or suspicious variants

- **`page` values mix scenario, density, and responsive-breakpoint concerns into one property** — a confirmed structural inconsistency compared to every other component's clean size/type/state separation.
- **No emoji/icon prefix on the `page` property** — a first, distinct naming-convention break from every other multi-variant component in this series.
- **Complete absence of any state property** — zero hover/focus/disabled coverage, the most minimal interaction-state footprint in this entire audit series.
- **`input_inner_shadow` present in a pagination component's token set** — plausible spillover, but also plausibly a genuine (if unusual) design choice if pagination includes a "jump to page" input field; unconfirmed either way.

---

## 12. Comparing naming and state behavior against Buttons, Links, and navigation components

| Component | State coverage | Property-icon convention | Variant axis style |
|---|---|---|---|
| Buttons (`button_danger` etc.) | 4 states (default/disabled/focus/hover) | 📐☘️💡 | clean orthogonal axes |
| `link` | 3 states (disabled/hover/default), no focus | 📐☘️💡 | clean orthogonal axes |
| `tab_nav_item` | 2 states (hover/default), no focus | 📐☘️💡 | clean orthogonal axes |
| `pagination` | **0 states** | **none** | **scenario-based, non-orthogonal** |

**Confirmed: `pagination` has the weakest interaction-state coverage and the least conventional property architecture of any component compared.** Where Buttons and the nav-family components (however inconsistently) separate size/type/state into independent axes, `pagination` collapses everything into a single `page` property whose values are scenario descriptions, not composable style choices. The reuse of `primary_button_effect` (confirmed genuinely applied to actual buttons in the Buttons, Alerts, and Toasts audits) hints that `pagination`'s `load_more` variant may internally reuse a Button-family visual treatment — consistent with `load_more` behaving more like a CTA button than a page-number control — but this is inferred from token presence, not confirmed structurally.

---

## 13. Dependencies on previously audited components

Confirmed reuse of: `elevation/e2`, `elevation/e5` (every prior audit, likely spillover); `secondary_button_effect` (Buttons audit, likely spillover); `primary_button_effect` (Buttons, Alerts, Toasts audits — plausibly genuinely applied to the `load_more` variant given its button-like shape); `input_inner_shadow` (Input, List, Tags audits); `radius/custom/sm/md` (Buttons, Input, and many subsequent audits); `Color/primary/500`, `Text/Primary 500` (Colors, Buttons, Input, and many subsequent audits); `outline/Primary 300` (new name, but matches `Color/primary/300` from the Colors audit); `Color/smoke_med/low` (Input, List, Switcher, Sidebar Navigation, Top Navigation, Tab Navigation audits); `Color/inverse_black_neutral` (Button Group, Input, Switcher, Sidebar Navigation, Top Navigation audits); `web/Body/12/13 Medium/Semibold` (Typography, Input, Chips, Links audits); `neutral_transparent_Black/Black 12` (Sidebar Navigation, Toggle audits); `primary_special_outline` (still unresolved, consistent with every prior audit).

---

## 14. Anything MCP cannot retrieve

- Whether previous/next arrow controls, numbered page buttons, an ellipsis element, or a selected-page indicator exist internally on any `page` variant — requires `get_design_context`, not authorized for this task.
- Whether `primary_button_effect` and `input_inner_shadow` are genuinely applied here, and to which specific `page` variant(s).
- Whether the `load_more` variant literally nests a Button-family component instance (plausible given the shared `primary_button_effect` token, not confirmed).
- Why no state property exists on `pagination` at all, given every comparable interactive component has at least some state coverage.
- Whether `mobile` represents a true responsive breakpoint mechanism analogous to `nav_bar_header`'s `device` property, or an unrelated one-off layout.
- Default variant configuration for `pagination`.
- Variable Collection / Mode metadata — not retrievable, consistent with every prior audit in this series.
