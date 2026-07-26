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

---

## 14. Deep re-audit addendum — implementation rebuild (this pass)

The original audit above never called `get_design_context` on this family at all (§6, §13), and the pre-rebuild `Radio` implementation rendered a plain native `<input type="radio">` without `appearance: none`, relying on the browser's own selected-dot rendering. This section documents a deep re-audit performed to correct that, following the same pattern applied to Button, Input, Chip, Tags, and Checkbox in this session.

**Method:** `get_metadata` on `radio` (node `66078:30189`, confirming exact node IDs for all 14 size×state variants) and on `radio_label` (node `66078:30254`, confirming 4 size×direction variants); then `get_design_context` on 7 of `radio`'s states at `size=sm` — `inactive` (`66078:30250`), `hover` (`66078:30242`), `active` (`66078:30225`), `active_focused` (`66078:30215`), `inactive_focused` (`66078:30234`), `disabled` (`66078:30195`), `indeterminate` (`66078:30205`) — plus `inactive` at `size=md` (`66078:30246`); then `get_screenshot` on several of the same states to visually confirm colors (every sampled instance renders as one flattened, non-decomposable image, unlike several Checkbox states which decomposed into real layers); then `get_design_context` on `radio_label` at `md/left` (`66078:30260`).

**Confirmed — box sizing:** every sampled state's flattened image sits inside a `size-[16px]` box, centered (`-translate-x-1/2 -translate-y-1/2 absolute left-1/2 top-1/2`) within the 20×20 `sm` footprint. The `md`/`inactive` sample confirms an 18×18 inner box within the 24×24 footprint — identical numbers to Checkbox's own confirmed inset.

**Confirmed — resolves the audit's own open question (§8, §13 implicitly):** `active_focused` (`66078:30215`) carries a confirmed `Effect(type: DROP_SHADOW, color: outline/primary_alpha, offset: (0,0), radius: 0, spread: 3)` — the primary ring. `inactive_focused` (`66078:30234`) carries a confirmed `Effect(type: DROP_SHADOW, color: outline/Gray 300, offset: (0,0), radius: 0, spread: 3)` — the gray ring. This exactly mirrors the identical checked/unchecked focus-ring resolution already made for Checkbox, and replaces the pre-rebuild implementation's uniform native-only focus outline.

**Confirmed — visual character per state**, from `get_screenshot` (20×20/22×22 PNG renders): `active` = a solid, uniformly-filled circle in the primary color with no visible ring (unlike a conventional dot-in-ring radio treatment); `inactive` = a white circle with a thin gray border; `hover` = a circle with a visibly primary-tinted border and no fill change; `disabled` = a flat, muted solid gray circle; `indeterminate` = a lighter tinted circle with a small center mark.

**Derived, not independently confirmed:** because every sampled `radio` instance is a single flattened image asset, the exact fill/border color values used in the rebuilt component (`color.white[950]`/`color.gray[400]` resting, `color.primary[500]` checked fill, `color.gray[400]` disabled fill, `color.primary[100]` indeterminate tint) are reused from Checkbox's own independently-confirmed values rather than independently decomposed for Radio. This reuse is justified by §9's own finding that Radio's color/token export is "token-for-token identical to the Checkboxes overview's export," and is visually consistent with the screenshots above, but is not a per-pixel independent confirmation for Radio specifically.

**Confirmed — `radio_label` composition:** `get_design_context` on `md/left` (`66078:30260`) confirms `radio_label` composes a real nested `<Radio>` instance plus a text column: a Label (`text/gray-950`, `font/family/primary` = "Noto Sans Bengali", Regular/400 weight, `font/size/body_1` = 13, `font/line_height/para` = 20) and an optional Caption (`text/gray-700`, `web/Body/12 Medium` i.e. Medium/500 weight, `caption_2` 12/16) below it — resolving §11/§13's uncertainty and confirming it is structurally identical to `checkbox_label`.

**Rebuild:** `radio.tsx` was rewritten from a plain native-rendering `<input type="radio">` to the hidden-native-input + custom-rendered `aria-hidden` visual `<span>` pattern already used for `checkbox.tsx`, driven by React state for checked/hover/focus. A new `radio_label.tsx` was added, composing the real `Radio` plus the confirmed label/caption text column, mirroring `checkbox_label.tsx`. `index.ts` now exports `RadioLabel`/`RadioLabelProps`/`RadioLabelSize`/`RadioLabelDirection` alongside `Radio`. `radio.test.tsx` was fully rewritten to assert against the new visual `<span>` rather than the (now hidden) native input's own style, and to cover the resolved focus-ring behavior, the confirmed indeterminate tint/dot, and the new `RadioLabel` composition.

---

## 15. Ground-truth re-audit — ​the flattened image assets decompose to exact SVG source (supersedes §14's "derived, not confirmed" colors/shapes)

§14 above treated every `radio` state as an opaque flattened raster and reused Checkbox's colors by analogy, since `get_design_context`'s React/Tailwind output only exposed an `<img>` tag per state. This was an incomplete re-audit: the `imgRadio` src URLs returned by `get_design_context` are not rasters — downloading them (`curl` on the asset URL) reveals they are **raw SVG source**, decomposable pixel-exact. This section replaces every "derived by analogy" color/shape claim in §14 with directly confirmed values, and corrects several genuine mismatches the analogy approach produced.

**Method:** downloaded the actual asset behind `imgRadio` for all 7 states at both `sm` (16px viewBox) and `md` (18px viewBox) via the asset URLs in `get_design_context`'s output (14 total SVGs), plus re-ran `get_design_context` on all 4 `radio_label` variants (`sm/left`, `md/left`, `sm/right`, `md/right`) instead of only `md/left`.

**Confirmed exact SVG geometry per state** (values below are the `sm` numbers; `md` scales the box to 18px but keeps the same construction — dash mark is a fixed 8×2px pill at both sizes, not scaled):

| State | Fill | Border | Extra mark |
|---|---|---|---|
| `inactive` | `white` (explicit, not "none") | `2px solid #C3C6CC` (gray/400) | — |
| `hover` | **`none`/transparent** — not white | `2px solid #5468FF` (primary/500) | — |
| `inactive_focused` | `white` | `2px solid #8C929C` (**gray/600**, darker than resting) + outer ring `outline/Gray 300` spread 3 | — |
| `active` | `#5468FF` (primary/500), **fills the entire circle edge-to-edge, no border** | none | white inner dot, `r=3` of 8 (sm) / `r=4` of 9 (md) — i.e. **not** a bare solid fill, a ring-less disc with a punched-out white center dot |
| `active_focused` | same as `active` | none | same white dot + outer ring `outline/primary_alpha` (`#5468ff3d`) spread 3 |
| `indeterminate` | `#EDF6FF` (primary/100), fills edge-to-edge | none | horizontal pill mark, `8×2px, rx=1`, fill `#5468FF` (primary/500) |
| `disabled` | `#C3C6CC` (gray/400), fills edge-to-edge | none | **same horizontal pill mark as indeterminate, always present**, fill `#8C929C` (gray/600) |

**Corrections this makes to §14 / the previous implementation:**
1. **`hover`'s fill is transparent, not white.** The previous implementation set `background: color.white[950]` unconditionally for every unchecked sub-state (default, hover, focused) — visually indistinguishable on a white page background, but not what the source actually specifies.
2. **`active`/`active_focused` have a punched-out white center dot** — the previous implementation rendered a flat, fully solid `primary/500` disc with no dot at all. This is the single biggest visual miss: Figma's "selected" radio is not a plain filled circle, it is a ring-less disc with a small white dot in the middle (inverted from the conventional ring+dot radio convention, but that is what the source file draws).
3. **`indeterminate`'s mark is a horizontal rounded-rect ("dash"/"minus"), not a circular dot.** The previous implementation rendered a small circle (`borderRadius: radius.full`) sized `40%` of the inner box — the confirmed source is an `8×2px, rx=1` pill, identical in shape (just different color) to the disabled mark below.
4. **`disabled` always renders the same gray dash mark, unconditionally** — regardless of the `checked`/`indeterminate` prop values passed to the component. There is exactly one confirmed Figma `disabled` variant (not a `disabled+checked`/`disabled+unchecked`/`disabled+indeterminate` matrix), and it always shows the gray/400 fill + gray/600 dash. The previous implementation rendered a bare flat gray disc with no mark at all when `disabled` alone was set (only showing a mark when `indeterminate` was *also* true), which does not match any single confirmed Figma state.
5. **No second row of additional states exists.** `get_metadata` on the `radio` frame confirms exactly 14 symbols = 7 states × 2 sizes (`disabled`, `indeterminate`, `active_focused`, `active`, `inactive_focused`, `hover`, `inactive`). The two rows visible in the frame are the `sm`/`md` **size** axis, not two rows of distinct state variants — there is no confirmed `indeterminate_disabled`, `checked_hover`, or any other combined state beyond these 7.

**Confirmed — `radio_label`'s typography is size-dependent** (not confirmed in §14, which only sampled `md/left`): at **`sm`**, both the label and caption text render at the *same* typography — `Noto Sans Bengali Medium` (500 weight), `caption_2` (12px/16px line-height) — differing only by color (label `text/gray-950`, caption `text/gray-700`). At **`md`**, the label uses `Noto Sans Bengali Regular` (400 weight) at `body_1` (13px/20px), and only the caption drops to `caption_2`/Medium — confirmed via `get_design_context` on all 4 `radio_label` variants (`sm/left` `66078:30255`, `md/left` `66078:30260`, `sm/right` `66078:30265`, `md/right` `66078:30270`). The previous implementation hardcoded the `md` typography for both sizes. Structure otherwise unchanged from §14: `content-stretch flex gap-[spacing/8]` (8px) row, `items-start` (top-aligned, not centered), `direction=left` puts `Radio` before the text column, `direction=right` reverses it, and the text column itself uses `gap-[spacing/2]` (2px) between label and caption.

**Rebuild (this pass):** `radio.tsx` was rewritten again to render the confirmed exact SVG geometry above (a `<span>`-based ring/disc plus a nested dot/dash mark, replacing the earlier disc-only/dot-less approximation), with `disabled` now unconditionally showing the gray dash mark regardless of `checked`/`indeterminate`. `radio_label.tsx` was corrected to switch typography by `size` rather than hardcoding `md`'s values. `radio.test.tsx` was fully rewritten against these exact confirmed values. Storybook's `radio.stories.tsx` state matrix now triggers real `mouseenter`/`focus` DOM events on the real component (via a mount-effect helper, not CSS overrides) so the hover/focus columns show the component's actual resolved visual, matching Figma's side-by-side state-matrix layout, rather than only demonstrating native click/tab behavior.
