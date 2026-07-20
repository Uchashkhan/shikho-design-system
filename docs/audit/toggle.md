# Toggle Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0"
Frame audited: `Toggle` overview (node `66079:30335`), containing two component sets.

Method: `get_metadata` and `get_variable_defs` via Figma MCP (live desktop selection). `get_design_context` was deliberately not used for this audit, per instruction — no internal layer structure was inferred.
Status: **Audit only.** No code, components, or project configuration were generated. No variable, style, or layer names were renamed or normalized.

---

## 1. Component sets and node IDs

| Name | Node ID |
|---|---|
| `toggle` | `66079:30353` |
| `toggle_label` | `66079:30441` |

(Plus an unrelated `overview_sheet_sidebar` instance, `66079:30336`.) Two true component sets, extending the same `{control}` / `{control}_label` pairing pattern already seen in Checkbox and Radio.

---

## 2. Exposed properties and variant values

- `toggle`: **`size`** (lg, md, sm), **`state`** — **switch_ON_disabled, switch_OFF_disabled, switch_ON_focused, switch_ON, switch_OFF** (5 values)
- `toggle_label`: **`size`** (sm, md), **`direction`** (left, right) — identical property set to `checkbox_label`/`radio_label`.

**Confirmed third distinct selection-state vocabulary:** `toggle` uses **`switch_ON`/`switch_OFF`** — literal embedded uppercase "ON"/"OFF" with a `switch_` prefix — differing from both `checkbox` (`checked`/`unchecked`) and `radio` (`active`/`inactive`).

**Confirmed internal casing inconsistency within a single value:** `switch_ON_disabled` mixes lowercase (`switch_`, `_disabled`) with uppercase (`ON`) in one state name.

**Confirmed asymmetric focus coverage, more limited than Checkbox/Radio:** only `switch_ON` gets a `_focused` variant — there is **no `switch_OFF_focused`** at all. **No `hover` state exists either**, unlike both `checkbox` and `radio`.

---

## 3. Variant counts

- `toggle`: **15** (3 sizes × 5 states), confirmed against the full symbol list.
- `toggle_label`: **4** (2 sizes × 2 directions).
- **Combined total: 19.**

---

## 4. Sizes, states — confirmed coverage

- **Sizes:** `toggle` — lg (40×24), md (40×24, same bounding box as lg), sm (32×20). `toggle_label` — sm (85×34), md (93×38) — **larger than `checkbox_label`/`radio_label`'s equivalent dimensions** (73×34/77×38), a confirmed size difference between the three `_label` siblings despite identical property structure.
- **States:** `switch_ON_disabled, switch_OFF_disabled, switch_ON_focused, switch_ON, switch_OFF` — 5 total. No `hover`, no `indeterminate`.

---

## 5. Whether labels, captions, descriptions, icons, and indicators are exposed as properties

**None appear as properties on `toggle` itself.** Labels are handled entirely by the separate `toggle_label` component set (matching `checkbox_label`/`radio_label`) — positioning via `direction`, no caption/description property found. No icon or indicator property exists on either set.

---

## 6. True component sets vs. demo compositions

**Both `toggle` and `toggle_label` are true, atomic component sets.** No demo compositions or bare instances exist in this selection.

---

## 7. Typography tokens

```
web/Title/22 Semibold, web/Title/76 Semibold, web/Title/32 Medium   ← likely unrelated spillover
web/Body/12 Medium
web/Title/13 Medium   ← NEW composite, not seen in the Checkbox or Radio overview exports
```
`web/Title/13 Medium` resolves `font/size/body_1` (13px) / `font/line_height/para` (20px) at Medium weight — fully resolved here, unlike the Checkbox/Radio overviews, which only exposed the raw unresolved primitives for this same scale step.

---

## 8. Spacing, radius, border, elevation, and effect tokens

```
spacing/2, 8, 12, 16, 24, 32, 40, 48   ← identical set to Checkbox/Radio

radius/border_radius_round = 1000
radius/border_radius_100 = 100    ← BRAND NEW token, not seen in any prior audit in this series
radius/border_radius_xl = 20     radius/border_radius_5xl = 40     radius/border_radius_8xl = 64

outline/Gray 200 / 400

elevation/e2 = (confirmed 2-layer, identical to prior audits — likely spillover)
elevation/e5 = (confirmed 5-layer, identical to prior audits)
secondary_button_effect = (confirmed 4-layer, identical to Buttons audit — likely spillover)

outline/focus_primary = Effect(type: DROP_SHADOW, color: outline/primary_alpha, offset: (0,0), radius: 0, spread: 3)
  ← present; NO outline/focus_gray here, unlike Checkbox/Radio, consistent with toggle having only ONE
    focused variant (switch_ON_focused) rather than two
```

---

## 9. Color and semantic tokens

```
Text/Gray 600 / 700 / 950
Text/Primary 500 = #5468ff
outline/primary_alpha = #5468ff3d
Color/White 100 = #ffffff     Color/white/50 = #ffffff0a
Color/Gray 100 / 200 = #f4f4f6 / #ebecf0
Color/disabled_base_em = #f4f4f6   ← NEW token name, matches Color/gray/100 exactly — another duplicate-value
                                       naming instance, though a fittingly semantic one ("disabled" state color)
neutral_transparent_Black/Black 12 = #0000001f   ← matches outline/Black 150 (Sidebar Navigation audit)
Color/inverse_black_neutral = #ffffff
Color/smoke_low = #f9f9fa
```

---

## 10. Naming inconsistencies and suspicious variants

- **Third distinct selection-state vocabulary confirmed:** `switch_ON`/`switch_OFF` (toggle) vs. `checked`/`unchecked` (checkbox) vs. `active`/`inactive` (radio) — three different naming systems for the same underlying binary-selection concept across three sibling controls.
- **Internal mixed-casing within a single value** (`switch_ON_disabled`) — a new form of inconsistency not seen in Checkbox/Radio's naming.
- **Most limited focus coverage of the three controls:** only `switch_ON_focused` exists — no `switch_OFF_focused`, and no `hover` state at all, compared to Checkbox's 8 and Radio's 7 states.
- **`radius/border_radius_100`** — a singular, previously-unseen radius token, distinct from `border_radius_round` (1000); its specific application (e.g. knob vs. track) is not confirmed.
- **`Color/disabled_base_em` duplicates `Color/gray/100`** — another entry in the ongoing multi-named-neutral-color pattern, though with a more specific semantic label than most prior duplicates.

---

## 11. Dependencies on Checkbox and Radio

- **`toggle_label` matches `checkbox_label`/`radio_label`'s property structure exactly** (`size` × `direction`, same value sets) — a confirmed **three-way sibling pattern** across all three selection-control families, though `toggle_label`'s actual bounding-box dimensions are larger than the other two, so they are not pixel-identical the way `checkbox_label` and `radio_label` were to each other.
- **Shared tokens with both Checkbox and Radio:** `outline/focus_primary`, `elevation/e2`/`e5`, `secondary_button_effect`, the same spacing scale, `Color/smoke_low`, `Color/inverse_black_neutral`, `Text/Primary 500`, `Color/White 100`/`white/50`.
- **Confirmed absence relative to Checkbox/Radio:** no `outline/focus_gray` token appears in this subtree — consistent with `toggle` having only one focused variant rather than two.
- **Two tokens introduced here for the first time in this series:** `radius/border_radius_100` and `Color/disabled_base_em`.

---

## 12. Comparing Toggle with Checkbox and Radio — is the selection-state vocabulary consistent?

**No — confirmed inconsistent across all three controls.** Despite all three (`checkbox`, `radio`, `toggle`) representing the same fundamental concept — a binary (or near-binary) on/off selection state — each uses a completely different naming vocabulary:

| Control | "On" value | "Off" value | Extra state | Focus coverage |
|---|---|---|---|---|
| `checkbox` | `checked` | `unchecked` | `indeterminate` (+ `indeterminate_disabled`) | both checked_focused and unchecked_focused |
| `radio` | `active` | `inactive` | `indeterminate` (unusual for radio) | both active_focused and inactive_focused |
| `toggle` | `switch_ON` (uppercase) | `switch_OFF` (uppercase) | none | only switch_ON_focused — no OFF-focused |

**The asymmetric-focus-coverage pattern is now confirmed systemic across all three**, not a one-off in any single component: `checkbox` and `radio` both qualify only their `focused` states with the checked/active-value prefix (leaving `hover`/`disabled` unqualified), and `toggle` takes this asymmetry further by omitting an OFF-focused variant entirely. Combined with the three unrelated vocabularies, this is the clearest evidence in this entire audit series that **the design system was not built with a single, shared selection-state naming convention** — each control appears to have been named independently.

---

## 13. Anything MCP cannot retrieve

- What `radius/border_radius_100` is specifically applied to (knob vs. track vs. something else).
- Why `toggle` has no `hover` state and no `switch_OFF_focused` variant, while `checkbox`/`radio` have fuller focus/hover coverage.
- Whether `toggle_label`, despite matching property structure, shares any literal component reuse with `checkbox_label`/`radio_label`, or is independently built (its differing dimensions argue against a literal shared primitive, but this isn't conclusive without `get_design_context`).
- Whether `Color/disabled_base_em` is genuinely applied to `toggle`'s disabled states, or is incidental spillover.
- Default variant configuration for either component set.
- Variable Collection / Mode metadata — not retrievable, consistent with every prior audit in this series.
