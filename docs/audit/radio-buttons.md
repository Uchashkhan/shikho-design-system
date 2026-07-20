# Radio Buttons Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0"
Frame audited: `Radio buttons` overview (node `66078:30171`), containing two component sets.

Method: `get_metadata` and `get_variable_defs` via Figma MCP (live desktop selection). `get_design_context` was deliberately not used for this audit, per instruction — no internal layer structure was inferred.
Status: **Audit only.** No code, components, or project configuration were generated. No variable, style, or layer names were renamed or normalized.

---

## 1. Component sets and node IDs

| Name | Node ID |
|---|---|
| `radio` | `66078:30189` |
| `radio_label` | `66078:30254` |

(Plus an unrelated `overview_sheet_sidebar` instance, `66078:30172`.) Two true component sets, mirroring the `checkbox`/`checkbox_label` pairing structurally.

---

## 2. Exposed properties and variant values

- `radio`: **`size`** (md, sm), **`state`** — **disabled, indeterminate, active_focused, active, inactive_focused, hover, inactive** (7 values) — **no `shape` property**, unlike `checkbox`.
- `radio_label`: **`size`** (sm, md), **`direction`** (left, right) — identical property set to `checkbox_label`.

**Confirmed cross-component naming divergence:** `radio` uses **`active`/`inactive`** for its selection concept, while `checkbox` used **`checked`/`unchecked`** for the conceptually equivalent idea.

**Confirmed same asymmetric-prefix pattern as `checkbox`:** only `focused` states are qualified (`active_focused`, `inactive_focused`); `disabled`/`hover` are not, and no `active_hover`/`active_disabled` counterpart exists.

**Notable/suspicious inclusion:** `radio` has an `indeterminate` state — conventionally a checkbox-only concept (partial group selection), unusual for a mutually-exclusive radio control. Flagged, not explained.

---

## 3. Variant counts

- `radio`: **14** (2 sizes × 7 states), confirmed against the full symbol list.
- `radio_label`: **4** (2 sizes × 2 directions).
- **Combined total: 18.**

---

## 4. Sizes, states, shapes — confirmed coverage

- **Sizes:** `radio` — md (24×24), sm (20×20) — identical dimensions to `checkbox`'s md/sm. `radio_label` shares the same size labels, and matches `checkbox_label`'s exact bounding-box dimensions (e.g. sm/left = 73×34 in both).
- **States:** 7 total (§2) — one fewer than `checkbox`'s 8, missing an `indeterminate_disabled` counterpart.
- **Shape/type:** **none** — no `shape` or `type` property exists on `radio` at all, consistent with radio buttons conventionally always being circular.

---

## 5. Whether labels, captions, descriptions, indicators, and validation states are exposed as properties

- **Labels:** confirmed via the separate `radio_label` component set, identical structure to `checkbox_label`.
- **Captions/descriptions:** not exposed as a property; the same raw Regular/400-weight typography primitives found in the Checkboxes audit appear here too — not confirmed as an actual description without `get_design_context`.
- **Selection indicator:** represented via `state` (`active`/`inactive`), same pattern as `checkbox`'s `checked`/`unchecked`.
- **Validation states:** none.

---

## 6. True component sets vs. demo compositions

**Both `radio` and `radio_label` are true, atomic component sets.** No demo compositions or bare instances exist in this selection.

---

## 7. Typography tokens

```
web/Title/22 Semibold, web/Title/76 Semibold, web/Title/32 Medium   ← likely unrelated spillover
web/Body/12 Medium

Primitives without an accompanying named composite:
font/family/primary = "Noto Sans Bengali"
font/size/body_1 = 13
font/line_height/para = 20
font/weight/default/normal = 400
```
**Identical set to the Checkboxes overview's typography export** — same tokens, same anomaly (missing composite for the Regular/400 primitives).

---

## 8. Spacing, radius, border, elevation, and effect tokens

```
spacing/2, 8, 12, 16, 24, 32, 40, 48   ← identical set to Checkboxes

radius/border_radius_xl = 20     radius/border_radius_5xl = 40     radius/border_radius_8xl = 64
```
**Confirmed absence: no `radius/border_radius_round` and no `radius/border_radius_xs`/`radius/custom/*` token appears anywhere in this export** — unlike `checkbox`, which had `radius/border_radius_xs` for its square shape. Since `radio` has no shape variant, its circularity may be achieved via a hardcoded/non-tokenized radius rather than a bound variable — a confirmed gap in this data, not a screenshot inference.

```
outline/Gray 300 / 400

elevation/e2 = (confirmed 2-layer, identical to prior audits — likely spillover)
elevation/e5 = (confirmed 5-layer, identical to prior audits)
secondary_button_effect = (confirmed 4-layer, identical to Buttons audit — likely spillover)

outline/focus_primary = Effect(type: DROP_SHADOW, color: outline/primary_alpha, offset: (0,0), radius: 0, spread: 3)
outline/focus_gray    = Effect(type: DROP_SHADOW, color: outline/Gray 300, offset: (0,0), radius: 0, spread: 3)
  ← both identical to the Checkboxes audit; plausible candidates for active_focused/inactive_focused rings
```

---

## 9. Color and semantic tokens

```
Text/Gray 400 / 600 / 700 / 950
Text/Primary 100 = #edf6ff     Text/Primary 500 = #5468ff
outline/primary_alpha = #5468ff3d
outline/Gray 300 / 400
Color/White 100 = #ffffff     Color/white/50 = #ffffff0a
Color/inverse_black_neutral = #ffffff
Color/smoke_low = #f9f9fa
```
**Token-for-token identical to the Checkboxes overview's color export.**

---

## 10. Naming inconsistencies and suspicious variants

- **`active`/`inactive` (radio) vs. `checked`/`unchecked` (checkbox)** — the clearest cross-component naming divergence between two conceptually equivalent selection controls found in this audit series.
- **Same asymmetric focus-prefix pattern as `checkbox`** — confirms a systemic naming convention (or inconsistency) shared across both selection-control families, not a one-off.
- **`indeterminate` state on a radio button** — conventionally unexpected for a single-choice control.
- **Missing `indeterminate_disabled`** — `radio` has one fewer combined state than `checkbox` despite otherwise mirroring its naming pattern.
- **No circular-radius token bound** — confirmed absence, contrasting with `checkbox`'s `radius/border_radius_xs`.

---

## 11. Dependencies on Checkbox, List, and Chips

- **Checkbox:** no literal component nesting confirmed, but an extremely high token-footprint overlap (§9) — both draw from the same underlying token set, which alone doesn't prove either nests the other.
- **`radio_label` vs. `checkbox_label`:** structurally and dimensionally identical — same properties, same values, matching exact bounding-box dimensions — strongly suggestive of a shared underlying label primitive or two pixel-identical independently-built siblings, not confirmed which.
- **List:** no evidence in this subtree that `radio` is nested inside `list` (the List audit's confirmed nested selection element was `checkbox`, not `radio`).
- **Chips:** no dependency evidence found either direction.

---

## 12. Comparing Radio Buttons with Checkbox — does `checkbox.shape=sphere` reuse the same primitive?

**Suggestive but not confirmed.**

**For:** identical dimensions at both sizes (md 24×24, sm 20×20) between `checkbox`'s `sphere` shape and `radio`; both draw from the same token palette.

**Against:** the state vocabularies differ (`checked`/`unchecked` for checkbox vs. `active`/`inactive` for radio) — if `checkbox.shape=sphere` were a literal instance/reuse of `radio`, I would expect it to expose `radio`'s own property names rather than redefine its own; `checkbox` also has an extra state (`indeterminate_disabled`) and a `shape` property that `radio` lacks entirely, consistent with `checkbox` being independently authored.

**Conclusion:** the dimensional match is real and confirmed, but the differing state-naming vocabularies argue against `checkbox.shape=sphere` being a literal reuse of the `radio` primitive. Confirming this definitively would require `get_design_context` (checking for an `I<parent>;<componentId>` reference pointing at `radio`'s node IDs), which was explicitly excluded from this task.

---

## 13. Anything MCP cannot retrieve

- Whether `checkbox.shape=sphere` is a literal nested instance of `radio`, or an independently-drawn circular checkbox — requires `get_design_context`, excluded from this task.
- Whether `radio_label` and `checkbox_label` share a literal underlying primitive or are independently-built duplicates.
- Why `radio` includes an `indeterminate` state despite being conventionally single-choice.
- Why `hover`/`disabled` states aren't qualified with `active_`/`inactive_` prefixes while `focused` states are.
- How `radio`'s circular shape is actually achieved without a bound `radius/border_radius_round` token in this subtree.
- Default variant configuration for either component set.
- Variable Collection / Mode metadata — not retrievable, consistent with every prior audit in this series.
