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

---

## 14. Deep re-audit addendum — implementation rebuild (this pass)

The original audit above deliberately never called `get_design_context` (see the note under the title). The pre-rebuild `Toggle` implementation reflected that: it rendered a bare `<input type="checkbox" role="switch">` with only a track-colored background and no knob at all — which browsers render as a plain checkbox square, not a switch, since no browser has meaningful default styling for `role="switch"` on a checkbox input. This section documents a deep re-audit performed to correct that, following the same pattern applied to Button, Input, Chip, Tags, Checkbox, and Radio in this session.

**Method:** `get_metadata` on `toggle` (node `66079:30353`, confirming exact node IDs for all 15 size×state variants) and `toggle_label` (node `66079:30441`, confirming 4 size×direction variants); then `get_design_context` on all 5 states at `md` (`switch_OFF` `66079:30431`, `switch_ON` `66079:30414`, `switch_ON_focused` `66079:30395`, `switch_OFF_disabled` `66079:30378`, `switch_ON_disabled` `66079:30361`), plus `switch_OFF`/`switch_ON` at both `sm` (`66079:30436`/`66079:30421`) and `lg` (`66079:30426`/`66079:30407`); then `get_design_context` on all 4 `toggle_label` variants.

**Confirmed — this decomposes into real layers, unlike Radio.** Unlike `radio`'s flattened-image states, `get_design_context` returns real `base`/`inner_shape` (or `check`) layer nodes for every `toggle` state, with actual bound colors — no flattened-image limitation here.

**Confirmed exact structure, per state:**
- **`switch_OFF`**: `base` (track) = `Color/Gray 200` (`#ebecf0`), pill radius (`radius/border_radius_100`). `inner_shape` (knob) = `Color/White 100`, same pill radius, with a real drop-shadow (`elevation/e2`, two-layer). No checkmark.
- **`switch_ON`**: `base` = `Text/Primary 500` (`#5468ff`). Knob = a `check` layer: a white stadium shape (identical size to `switch_OFF`'s knob) with the same shadow, containing a checkmark icon path filled `#5468FF` (primary/500). **Corrected (2026-08-12) — user reported the rendered checkmark looked too small.** Re-fetched node `254:155` (`switch_ON`/`md`): the check's own layout frame is `20×16`, exactly the full knob size — not a smaller icon centered inside it. `CheckIcon` (`@shikho/icons`) already has generous padding baked into its own `20×16` viewBox (the mark occupies only ~35% of it, same viewBox dimensions as the knob), so `toggle.tsx` rendering it at `width:"100%" height:"100%"` of the knob (matching how `Checkbox` already uses the same icon) reproduces the confirmed size — the previous implementation additionally shrunk it to 60%, compounding on top of the icon's own padding and landing at roughly 21% of the knob.
- **`switch_ON_focused`**: identical to `switch_ON`, plus a confirmed `outline/focus_primary` ring on the `base` (`Effect(type: DROP_SHADOW, color: outline/primary_alpha, spread: 3)`).
- **`switch_OFF_disabled`**: `base` = `Color/disabled_base_em` (`#f4f4f6`, confirmed identical value to `Color/gray/100`). Knob = a flat translucent black fill (`rgba(0,0,0,0.12)`, no drop-shadow — the shadow is confirmed absent on disabled knobs specifically).
- **`switch_ON_disabled`**: same muted `#f4f4f6` **track** as `switch_OFF_disabled` (confirmed **not** primary-tinted despite being "ON"), same translucent-black knob, but with a checkmark path filled `#F4F4F6` (a muted gray checkmark, confirmed distinct from the enabled ON's primary-blue checkmark) — **no drop-shadow filter** on this checkmark either, unlike the enabled/focused checkmark SVGs.

**Confirmed exact geometry, per size** (downloaded/decomposed, not derived):

| Size | Outer box | Track | Knob |
|---|---|---|---|
| `sm` | 32×20 | 28×16 | 16×12 |
| `md` | 40×24 | 34×20 | 20×16 |
| `lg` | 40×24 | **38×22** | **22×18** |

`md` and `lg` share the exact same **outer** 40×24 box (confirmed in the original audit, §4), but this re-audit additionally confirms their **internal track/knob are drawn at different sizes** — `lg`'s track sits almost edge-to-edge of its box (1px inset each side) while `md`'s track is visibly narrower (3px inset each side), despite the identical outer hit-target. This was not previously confirmed or implemented.

**Confirmed — the knob is a uniform 2px inset from the track's edges on every size and side**, both vertically (knob height = track height − 4) and horizontally at rest (knob's leading edge sits 2px inside the track's leading edge; when ON, its trailing edge sits 2px inside the track's trailing edge). This lets the implementation use a single `padding: 2px` + `justifyContent: flex-start/flex-end` flex layout on the track for both the knob's resting size and its slide position, rather than a per-state absolute-position table.

**Confirmed — the knob is a stadium/pill shape, not a circle** (width ≠ height at every size, e.g. 20×16 at `md`) — CSS `border-radius` set to a value larger than half the shorter dimension (e.g. `radius.full`) naturally clamps to produce this exact shape, no extra logic needed.

**Confirmed — `toggle_label`'s label typography differs from Checkbox's/Radio's own `md` label.** At `md`, Toggle's label uses `web/Title/13 Medium` — **Medium/500 weight**, not the Regular/400 weight confirmed for Checkbox's/Radio's `md` label. At `sm`, Toggle's label collapses to `caption_2`/Medium/500, matching the caption — same pattern as Checkbox/Radio's `sm` label. Structure otherwise matches: `gap-[spacing/8]` row, `items-start`, `gap-[spacing/2]` label/caption gap, `direction` left/right ordering.

**Rebuild:** `toggle.tsx` was rewritten from a bare native-rendering checkbox to the hidden-native-input + custom-rendered `aria-hidden` track/knob pattern already used for `Checkbox`/`Radio`, reproducing the exact confirmed colors, shadow, checkmark, and per-size track/knob geometry above. A new `toggle_label.tsx` was added, composing the real `Toggle` plus the confirmed label/caption text column with Toggle's own (Medium/500-at-both-sizes) typography. `index.ts` now exports `ToggleLabel`/`ToggleLabelProps`/`ToggleLabelSize`/`ToggleLabelDirection` alongside `Toggle`. `toggle.test.tsx` was fully rewritten against these exact confirmed values.
