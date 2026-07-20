# Links Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0"
Frame audited: `Links` overview (node `66080:30572`), containing a single component set.

Method: `get_metadata` and `get_variable_defs` via Figma MCP (live desktop selection). `get_design_context` was deliberately not used for this audit, per instruction — no internal layer structure was inferred.
Status: **Audit only.** No code, components, or project configuration were generated. No variable, style, or layer names were renamed or normalized.

---

## 1. Component set and node ID

| Name | Node ID |
|---|---|
| `link` | `66080:30590` |

(Plus an unrelated `overview_sheet_sidebar` instance, `66080:30573`.) **Only one component set** — no paired `link_label` sibling exists, unlike the Checkbox/Radio/Toggle families, which each had a matching `_label` component. This is the simplest multi-variant component architecture audited so far.

---

## 2. Exposed properties and variant values

`link` exposes three: **`size`** (xl, lg, md, sm, xs), **`type`** (quaternary, primary — only 2 values), **`state`** (disabled, hover, default — **no `focus`**).

---

## 3. Variant count

**30 variants** (5 sizes × 2 types × 3 states), confirmed against the full symbol list.

---

## 4. Sizes and states — confirmed coverage

- **Sizes:** `xl` (≈100×24), `lg` (≈78×20), `md` (≈74×20), `sm` (≈68×16), `xs` (≈58×16).
- **States:** `disabled, hover, default` only. **`focus` is confirmed absent** — unlike every other interactive component audited so far (Buttons, Chips, Checkbox, Radio, Toggle, Switcher all had at least one focus-related state).

---

## 5. Whether icons, underlines, badges, external-link indicators, and captions are exposed as properties

**None of these appear as named top-level variant properties** — only `size`/`type`/`state`. A broad `sizing/icon/*` range (14/16/18/20/24) is present in the subtree, plausibly supporting an external-link or trailing icon internally, but this is **not confirmed** as an exposed property or internal slot without `get_design_context`.

---

## 6. True component set vs. demo composition

**`link` is a true, atomic component set.** No demo compositions or bare instances exist in this selection.

---

## 7. Typography tokens

```
web/Title/22 Semibold, web/Title/76 Semibold, web/Title/32 Medium   ← likely unrelated spillover
web/Title/18 Medium, web/Title/18 Semibold
web/Title/13 Medium, web/Title/13 Semibold
web/Body/13 Medium, web/Body/13 Semibold
web/Body/12 Medium, web/Body/12 Semibold
web/Body/11 Medium, web/Body/11 Semibold
```
A notably full set of Medium+Semibold pairs across the `title_2`/`body_1`/`caption_2`/`caption_1` scale — plausibly mapping to `link`'s 5 sizes, though the exact size-to-token pairing is not confirmed.

---

## 8. Spacing, radius, border, elevation, and effect tokens

```
spacing/0, 4, 6, 8, 12, 16, 24, 32, 40, 48

radius/border_radius_round = 1000
radius/border_radius_xl = 20
radius/border_radius_0 = 0   ← known from Button Group/List audits
radius/border_radius_5xl = 40     radius/border_radius_8xl = 64
```
**No `radius/custom/*` tokens at all** — consistent with links typically being plain text with no rounded container.

```
outline/Gray 400

elevation/e2 = (confirmed 2-layer, identical to prior audits — likely spillover)
elevation/e5 = (confirmed 5-layer, identical to prior audits — likely spillover)
secondary_button_effect = (confirmed 4-layer, identical to Buttons audit — likely spillover)
```
**Confirmed absence: no `outline/focus_primary`, `outline/focus_gray`, or `special_drop` token anywhere in this export** — consistent with `link` having no `focus` state to drive a focus-ring effect.

```
sizing/icon/14, 16, 18, 20, 24
```

---

## 9. Color and semantic tokens

```
Text/Gray 400 / 600 / 700 / 950
Text/Primary 500 = #5468ff     Text/Primary 600 = #3b4ee3
Color/White 100 = #ffffff     Color/white/50 = #ffffff0a
Color/inverse_black_neutral = #ffffff
Color/smoke_low = #f9f9fa
```

---

## 10. Naming inconsistencies and suspicious variants

- **`focus` state confirmed absent** — a genuine coverage gap relative to every other interactive component audited. For a text link, a commonly keyboard-focusable element, the absence of a distinct focus treatment (and the corresponding absence of any focus-ring token) is a notable, confirmed observation.
- **Only 2 `type` values** (`quaternary`, `primary`) — a much narrower type set than most other multi-type components audited (Buttons' 4–7, Tags' 11).
- **`quaternary` reuses the exact naming convention from `icon_button`'s type vocabulary** (Buttons audit) — a confirmed, meaningful naming *consistency* rather than an inconsistency, notable because most cross-component naming in this audit series has been inconsistent rather than deliberately reused.

---

## 11. Dependencies on Buttons, Sidebar Navigation, and Switcher

- **Buttons:** `link`'s `type=quaternary` is a confirmed exact match to one of `icon_button`'s 7 type values from the Buttons audit — the clearest deliberate cross-component naming reuse found in this audit series. `elevation/e2`/`e5` and `secondary_button_effect` also appear, consistent with the spillover pattern seen everywhere.
- **Sidebar Navigation:** no specific token or naming overlap beyond generic shared design-system primitives — no confirmed structural relationship to `sidebar_item`.
- **Switcher:** `switcher_item`'s label was confirmed to use `web/Title/13 Semibold` in that deep audit; `link`'s typography set includes the identical token — a plausible shared typography choice for interactive text elements, not a structural/nesting dependency.

---

## 12. Comparing Link state naming with Button and Switcher state naming

| Component | States | Casing |
|---|---|---|
| `link` | disabled, hover, default | lowercase |
| `button_danger`/`button_success`/`Greyscale`/`icon_button` (Buttons) | default, disabled, focus, hover | lowercase |
| `new_blue`/`new_pink`/`ai_rounded`/`ai_regular` (Buttons) | Default, Disabled, Focus, Hover | Capitalized |
| `switcher_item` | Default, Disabled, Focus, Hover | Capitalized |

**Confirmed:** where `link`'s state names overlap with existing vocabulary, its casing matches the lowercase Buttons family, not the capitalized family. However, **`link` is missing `focus` entirely** — every comparable Button family and `switcher_item` include a focus state, but `link` only has `disabled`/`hover`/`default`. This is the clearest functional (not just naming) state-coverage gap found when comparing `link` against its closest architectural relatives.

---

## 13. Anything MCP cannot retrieve

- Whether `link` has an icon slot (external-link indicator or otherwise), underline treatment, or badge — requires `get_design_context`, not used for this task.
- Which specific typography token (of the 6 Medium/Semibold pairs) maps to which of `link`'s 5 sizes.
- Whether the missing `focus` state reflects an intentional design decision (e.g. links rely on browser-default focus rings) or a genuine gap.
- Whether `elevation/e2`/`e5`/`secondary_button_effect` are genuinely applied to `link`, or are incidental spillover.
- Default variant configuration for `link`.
- Variable Collection / Mode metadata — not retrievable, consistent with every prior audit in this series.
