# Shikho Design System — Consolidated Audit Summary

**Source:** Synthesis of all 27 audit documents in `docs/audit/`, covering the Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0."
**Method:** This document is a read-only synthesis. No new Figma inspection was performed; every finding below is drawn from and attributed to the individual audit files already saved. No existing audit file was modified. No components were redesigned. No code was generated.
**How to read this document:** Every major finding cites its source file(s) in parentheses, e.g. `(colors.md)`. Confirmed findings are stated as fact; anything speculative is explicitly marked **"inferred"** or **"not confirmed"** — carried over verbatim from that discipline in the source audits.

---

## 1. Executive Summary

### What was audited
27 documents, produced across two phases:
- **Foundations (4 documents):** `colors.md`, `typography.md`, `elevations.md`, `special-effects.md` — the token layer (color ramps, type scale, shadow/elevation system, focus rings and special effects).
- **Components (23 documents):** `buttons.md`, `button-group.md`, `input.md`, `avatars.md`, `list.md`, `switcher.md`, `sidebar-navigation.md`, `tooltips.md`, `alerts.md`, `toasts.md`, `chips.md`, `tags.md`, `checkboxes.md`, `radio-buttons.md`, `toggle.md`, `links.md`, `top-navigation.md`, `tab-navigation.md`, `pagination.md`, `progress.md`, `date-picker.md`, `table.md`, `modal.md`.

Each was audited via Figma MCP tools (`get_metadata`, `get_variable_defs`, and — where explicitly authorized — `get_design_context`). No file was audited using inference from screenshots.

### Overall maturity of the current design system
**Mixed — a system with strong foundational bones but inconsistent execution above the token layer.**

- The color, typography, and elevation **token layers are comprehensive and, after this audit series, fully resolved** — all six elevation levels (e1–e6) are now confirmed (`table.md` completed the set with `e1`), and the full color/type scales are documented.
- Above the token layer, component quality is **highly uneven**: some families (Buttons, Input, List, Tags) show deliberate, well-parameterized architecture; others (`Progress`, `Pagination`) are minimally developed, non-orthogonal, or appear to duplicate each other's content under different names.
- **No single, consistent naming convention exists** for several core concepts that recur across the whole system: corner radius, opacity/alpha color variants, and — most significantly — the very concept of "selected/on" state, which is spelled four different ways across four sibling controls.

### Main strengths
1. **Complete token foundations.** Full 11-step ramps for all brand/functional colors (`colors.md`); a complete 15-step type scale with weight variants (`typography.md`); all six elevation levels now confirmed, including proof of a genuine additive-stacking design pattern (`elevations.md`, `tooltips.md`, `alerts.md`, `date-picker.md`, `table.md`).
2. **Real composition patterns, confirmed structurally.** `button_group` composes `button` instances; `list` composes a shared `checkbox` component; `sidebar_item` and `list` share a Tag sub-component; `nav_bar_header` composes five `tab_nav_item` instances (`button-group.md`, `list.md`, `sidebar-navigation.md`, `tab-navigation.md`). This is a genuine, deliberate architecture, not incidental duplication.
3. **Some pockets of excellent internal consistency.** `tags.md`'s alpha-naming system (`_alpha_12`/`_alpha_20`/`_alpha_24` applied uniformly across every severity color) is the cleanest naming pattern found in the entire audit series — proof the team can do this well when it happens.
4. **Deliberate cross-component naming reuse exists in the nav family.** `top_nav_item`'s type vocabulary is confirmed to be a superset combining `switcher_item`'s and most of `sidebar_item`'s values (`top-navigation.md`) — real evidence of considered design-system evolution, not just accidental duplication.

### Main weaknesses
1. **No consistent selection-state vocabulary.** The same "is this thing on/selected" concept is spelled `checked`/`unchecked` (Checkbox), `active`/`inactive` (Radio), `switch_ON`/`switch_OFF` (Toggle, with internal mixed casing), `selected`/`unselected` (Chip, as a `type` not a `state`), and `active_primary_accent` (List and Switcher, as a `state` in one and a `type` in the other) (`checkboxes.md`, `radio-buttons.md`, `toggle.md`, `chips.md`, `list.md`, `switcher.md`). This is the single most significant, systemic naming problem documented in the whole audit.
2. **A fragmented, at-least-six-deep radius naming system**, with **confirmed value collisions** — `radius/custom/md` (10) vs. `radius/border_radius_md` (12); `radius/border_radius_sm` (8) vs. `radius/border_radius_sm_2` (10) — meaning the same-sounding token name can silently resolve to a different pixel value depending on which family is picked (`input.md`, `list.md`, `sidebar-navigation.md`, `date-picker.md`, `modal.md`, `table.md`).
3. **A confirmed color-binding bug, reproduced across three separate contexts.** `outline/focus_danger` / `outline/danger`-equivalent tokens resolve to the **Secondary** brand color instead of the **Danger** functional color, in the Special Effects style swatch, the live Buttons component binding, and the Input component binding (`special-effects.md` §9, `buttons.md` §13, `input.md` §11).
4. **Components that don't reward reuse.** `Progress` uses Figma's literal unrenamed default property name (`Property 1`) and its `Load More` variant is dimensionally identical to `pagination`'s `load_more` variant — strong evidence of duplicated, unlabeled content rather than a deliberate primitive (`progress.md`, `pagination.md`).
5. **Inconsistent, often absent state coverage**, with no shared logic for which components get `focus`, `disabled`, or `error` — see the State Coverage Matrix (§5).

---

## 2. Component Inventory

### Foundations
| Area | Source | Status |
|---|---|---|
| Color ramps (primary, secondary, functional, gray, dark, subject colors) | `colors.md` | Comprehensive; ~30 of ~35 Subject Colors unresolved |
| Typography scale (15 steps, weight variants) | `typography.md` | Comprehensive; several composite gaps documented |
| Elevation system (e1–e6) | `elevations.md`, cross-resolved in `tooltips.md`, `alerts.md`, `date-picker.md`, `table.md` | **Fully resolved as of this audit series** |
| Special effects (focus rings, button effects, special outlines) | `special-effects.md` | Mostly resolved; `primary_special_outline`/`secondary_special_outline` remain permanently unresolved (empty string) everywhere they appear |

### Primitive components (atomic, variant-driven, confirmed real component sets)
`button_danger`, `button_success`, `Greyscale`, `icon_button`, `new_blue`, `new_pink`, `ai_rounded`, `ai_regular` (`buttons.md`); `field`, `input_field`, `dropdown`, `textarea`, `digit_input`, `input_label`, `input_hint` (`input.md`); `avatar`, `avatar_face`, `avatar_group` (`avatars.md`); `list` (`list.md`); `switcher_item`, `switcher` (`switcher.md`); `sidebar_item`, `sidebar_item_collapsed` (`sidebar-navigation.md`); `tooltip` (`tooltips.md`); `alert` (`alerts.md`); `toast` (`toasts.md`); `chip` (`chips.md`); `tags` (`tags.md`); `checkbox`, `checkbox_label` (`checkboxes.md`); `radio`, `radio_label` (`radio-buttons.md`); `toggle`, `toggle_label` (`toggle.md`); `link` (`links.md`); `top_nav_item` (`top-navigation.md`); `tab_nav_item`, `nav_bar_header` (`tab-navigation.md`); `table_cell` (`table.md`); `modal` (`modal.md`).

### Composed components (confirmed to nest other components, not custom-drawn)
- `button_group` → nests `button` instances (confirmed via `I<parent>;<componentId>` reference pattern) (`button-group.md`).
- `list` → nests a shared `checkbox` component (`shape="square"`, `size="sm"`) and a shared Tag sub-component, the latter also reused by `sidebar_item` (`list.md`, `sidebar-navigation.md`).
- `nav_bar_header` → nests five `tab_nav_item` instances directly (`tab-navigation.md`).
- `alert` → nests a fully path-named `button_danger/md/secondary/default` instance; `toast` nests the same `button_danger` set under a shorter, less-descriptive instance name (`alerts.md`, `toasts.md`).

### Bare or unverified components (present in the file, but appear only as unexpanded single instances — internal structure not confirmed by any audit in this series)
`drop_menu` (`input.md`); `digit_field` (`input.md`); `side_bar`, `side_bar_collapsed`, `side_bar_collapsed_2`, `sidebar_nav_collapsed` (`sidebar-navigation.md`); `table` (`table.md`); `modal_header`, `modal_actions` (`modal.md`).

### Likely demo/scenario compositions presented alongside true primitives
`sidebar_nav` (`sidebar-navigation.md`), `top_nav` (`top-navigation.md`), `tab_nav` (`tab-navigation.md`) — all three share the same confirmed signature (width scales steeply with a `size` property while height matches the sibling primitive's exact per-size height), strongly suggesting each is a rendered demo of multiple primitive instances rather than an independent component. `pagination` and `Progress` are more severe cases — see §4.

---

## 3. Cross-System Inconsistencies

### Naming inconsistencies
- **Seven-plus distinct property-icon conventions**, applied inconsistently: 📐 (size), ☘️ (type), 💡 (state), 🐷 (face, `avatars.md`), 🧭 (direction, `tooltips.md`/`checkboxes.md`/`radio-buttons.md`/`toggle.md`), 🟣 (shape, `checkboxes.md`), 🖥️ (device, `tab-navigation.md`) — and **two components with no icon convention at all** (`pagination.md`, `progress.md`).
- **State-value casing varies by component family**: lowercase (`default/hover/focus/disabled`) vs. Capitalized (`Default/Hover/Focus/Disabled`) — documented across `buttons.md` (two casing families within the same audit), `switcher.md`, `sidebar-navigation.md`, `top-navigation.md`, `links.md`.
- **`Danger Filled`/`Success Filled`** in `tags.md` are the only two-word, space-containing, Title Case values in an otherwise single-word/snake_case `type` property — the most severe single-property naming break in the series.
- **Property ordering inversion**: `date_picker` lists `type` before `size` in its layer-naming convention, while every other multi-property component lists `size` first (`date-picker.md`).
- **A confirmed spelling typo**: `botom_left`/`botom_right` vs. correctly-spelled `bottom_center` within `tooltip`'s own `direction` values (`tooltips.md`).
- **A likely-corrupted token name**: `outline/B` (later confirmed real and functional as the active-tab underline color, but its truncated name remains unexplained) (`tab-navigation.md`).

### Duplicate tokens
- **The same near-white/light-gray value has at least four names**: `Color/gray/100`, `Color/smoke_med`, `Color/disabled_base_em` (all `#f4f4f6`), plus the unnumbered `Color/Gray` (`#ebecf0`, a slightly different but frequently conflated value) (`colors.md`, `input.md`, `elevations.md`, `special-effects.md`, `toggle.md`, `table.md`).
- **`Text/Primary 100` duplicates `Color/primary/100`** — the `Text/*` vs. `Color/*` namespace duplication pattern recurs across `checkboxes.md` and `radio-buttons.md`.
- **A "primary_base" name-stem collision** in `sidebar-navigation.md`: `Color/primary_base` (primary/500), `Color/primary_base_em` (primary/50 — a completely different, much lighter value), and `Color/primary_base_em_alpha` (primary/500 at 12% alpha) all share the same name stem despite representing three visually distinct colors — flagged as the most severe *value*-level naming collision found (as opposed to a duplicate-name-for-same-value issue).
- **Opacity/alpha ramps are named at least five different ways** for conceptually identical values: step-style (`outline/Black 150`, `Color/black/150`), percentage-literal style (`neutral_transparent_Black/Black 12`, `White 16`, `Black 24`, `Black 88`), suffix style (`_alpha_12/20/24`), semantic-emphasis style (`_base_em_alpha`, `_low_em_alpha`, `_med_em`), and the `smoke_low/med/high/base/em` family (`special-effects.md`, `avatars.md`, `switcher.md`, `sidebar-navigation.md`, `top-navigation.md`).

### Radius-system conflicts
Two parallel primary systems — `radius/custom/{xs,sm,md,lg,xl}` and `radius/border_radius_{xs,sm,md,lg,xl,round,0,5xl,8xl}` — coexist, joined by at least four more one-off variants: `radius/border_radius_sm_2` (`input.md`), `radius/border_radius_xxl` (`date-picker.md`), `radius/border_radius_2xl` (`modal.md`), and `radius/border_radius_100` (`toggle.md`). **Confirmed value collisions, not just name collisions:**
- `radius/custom/md` = 10 vs. `radius/border_radius_md` = 12 (`input.md`, `sidebar-navigation.md`, `table.md`).
- `radius/border_radius_sm` = 8 vs. `radius/border_radius_sm_2` = 10 (`input.md`, `progress.md`).

### Typography duplication
- `web/Title/13 *` and `web/Body/13 *` are **fully duplicate composites** (identical family, size, weight, line-height, letter-spacing) for Medium, Semibold, and Bold alike (`typography.md`).
- `Caption 1` and `Overline` resolve to numerically identical size/line-height (11px/16px) but are backed by two entirely separate variable pairs (`typography.md`).
- `font/family/display` and `font/family/primary` both resolve to `"Noto Sans Bengali"`, with one composite (`web/Title/104 Semibold`) leaving `font/family/display` unresolved as a literal string rather than an alias — a confirmed miswiring (`typography.md`).

### Missing or inconsistent states
See the full matrix in §5. Headline findings: no component in the audit series has an `error` state except the Input family; `focus` is present in roughly half the interactive components and absent from `list`, `sidebar_item`, `link`, `tab_nav_item`, and most of Input's family; three sibling selection controls (Checkbox/Radio/Toggle) each have a different, non-overlapping subset of interaction states.

### Overloaded properties
- `alert`/`toast`'s `state` property encodes **severity** (`danger`/`success`/`warning`/`info`), not interaction state (`alerts.md`, `toasts.md`).
- `chip`'s `type` property encodes **selection** (`selected`/`unselected`/`selected_neutral`) alongside brand-color themes (`Green`/`Red`) (`chips.md`).
- `table_cell`'s `type` property encodes both **role** (header/default) and **density** (`_compact`) in one axis (`table.md`).
- `pagination`'s single `page` property encodes **layout scenario**, **density**, and **responsive breakpoint** (`mobile`) all at once — the most overloaded single property in the series (`pagination.md`).

### Different size conventions
- Buttons split into "Scale A" (`xs,sm,md,lg,xl`) and "Scale B" (`xs,sm,md,lg,xxl`) with no set using both (`buttons.md`).
- `switcher` and `switcher_item` share identical size *labels* but `switcher`'s actual heights are 8px taller at every step (`switcher.md`).
- `checkbox_label`, `radio_label`, and `toggle_label` share an identical `size`×`direction` property signature, but `toggle_label`'s bounding-box dimensions are confirmed larger than the other two, which are themselves pixel-identical to each other (`checkboxes.md`, `radio-buttons.md`, `toggle.md`).

### Unresolved tokens
- `primary_special_outline` / `secondary_special_outline` resolve to an empty string in **every single audit where they appear** — `special-effects.md` through `modal.md` — with `top-navigation.md` and `modal.md` both showing the two appearing together, unresolved, in the same subtree.
- `Gradient/G1`–`G6` never resolve to stop/color data in any audit (`colors.md`, `switcher.md`).
- ~30 of ~35 Subject Colors never resolved (`colors.md`).

---

## 4. Architecture Findings

### Reusable primitives (confirmed genuine, low-level building blocks)
The Button family, `field`, `checkbox`, the shared Tag sub-component, and the full elevation/effect token set are the clearest examples of primitives designed for reuse and confirmed to actually be reused elsewhere (`buttons.md`, `input.md`, `list.md`, `sidebar-navigation.md`, `elevations.md`).

### Higher-level compositions
`button_group`, `list`, `sidebar_item`, `nav_bar_header`, and `alert`/`toast` (via their nested `button_danger` instances) are all confirmed compositions — they assemble other real components rather than drawing their own equivalent visuals from scratch. This is a legitimate, working architectural pattern in this system, not an audit artifact.

### Demo/scenario components presented as reusable components
Three tiers of severity were found:
1. **Likely demo compositions** (`sidebar_nav`, `top_nav`, `tab_nav`) — probably fine as-is once explicitly labeled as demos rather than primitives, since their content is likely just repeated instances of an already-real primitive.
2. **`pagination`** — a single component set whose six variant values are non-orthogonal layout scenarios (`first`/`center`/`last`/`less_pages`/`load_more`/`mobile`) rather than composable style choices; this genuinely blurs the primitive/demo line and would benefit from being split into a real `pagination_item` primitive plus separate demo compositions.
3. **`Progress`** — the most severe case: an unrenamed Figma default property (`Property 1`) with only two values (`Media`, `Load More`), one of which is dimensionally identical to `pagination`'s `load_more` and named inconsistently (`Load More` vs. `load_more`). This reads as an artifact of copy/paste or incomplete component authoring rather than an intentional primitive.

### Components that need structural redesign
- **`Progress`** — needs a clear purpose statement, a renamed property, and reconciliation with `pagination`'s `load_more` (are they the same control? if so, which is canonical?).
- **`pagination`** — needs its scenario values split into an orthogonal `size`/`type`/`state` model, consistent with every other well-formed component in the system.
- **Checkbox/Radio/Toggle** — need a single shared selection-state vocabulary; currently the clearest, most systemic naming failure in the whole audit.
- **`focus_danger`** (and its equivalents wherever it recurs) — needs its color binding corrected from Secondary to Danger; confirmed wrong in at least three components.
- **Bare instances** (`table`, `modal_header`, `modal_actions`, `side_bar` and its variants, `drop_menu`, `digit_field`) — need to be either expanded into real, auditable component sets, or explicitly documented as intentionally opaque compositions.

---

## 5. State Coverage Matrix

`✓` = confirmed present · `—` = confirmed absent · `≈` = concept present under a different property (noted) · `?` = not determinable from available audits

| Component | default | hover | focus | disabled | selected | active | loading | error |
|---|---|---|---|---|---|---|---|---|
| Buttons (`button_danger` family) | ✓ | ✓ | ✓ | ✓ | — | — | — | — |
| `chip` | ✓ | ✓ | ✓ | ✓ | ≈ (`type=selected`) | — | — (has `drag` instead) | — |
| `checkbox` | ≈ (`unchecked`) | ✓ | ✓ (checked/unchecked-qualified only) | ✓ | ≈ (`checked`) | — | — | — (has `indeterminate` instead) |
| `radio` | ≈ (`inactive`) | ✓ | ✓ (active/inactive-qualified only) | ✓ | ≈ (`active`) | ✓ (=selected here) | — | — (has `indeterminate`, unusually) |
| `toggle` | ≈ (`switch_OFF`) | — | ✓ (`switch_ON` only, no OFF-focus) | ✓ | ≈ (`switch_ON`) | ✓ (=selected here) | — | — |
| `input_field`/`textarea`/`digit_input` | ✓ (+`default_dark`) | ✓ | — (uses `active` instead) | ✓ | — | ✓ | — | ✓ |
| `dropdown` | ✓ (+`default_dark`) | ✓ | — (`active_no_focus` instead) | ✓ | — | ✓ (+`brand`, `naked`) | — | ✓ |
| `list` | ✓ | ✓ | — | — | ≈ (`active_primary_accent` state) | ≈ (same value) | — | — |
| `switcher_item` | ✓ (Capitalized) | ✓ | ✓ | ✓ | ≈ (`type`, not state) | ≈ (`type`) | — | — |
| `sidebar_item` | ✓ | ✓ | — | — | ≈ (`type`) | ≈ (`type`) | — | — |
| `top_nav_item` | ✓ | ✓ | ✓ (5 of 7 types only) | — | ≈ (`type`) | ≈ (`type`) | — | — |
| `tab_nav_item` | ✓ | ✓ | — | — | ≈ (`type=active`) | ≈ (`type=active`) | — | — |
| `link` | ✓ | ✓ | — | ✓ | — | — | — | — |
| `alert`/`toast` | ≈ (baseline `Default`/`default`) | — | — | — | — | — | — | ≈ (`danger` severity) |
| `table_cell` | ✓ | — | — | — | — | — | ✓ (unique) | — |
| `tooltip`, `pagination`, `Progress`, `date_picker`, `modal` | — | — | — | — | — | — | — | — |

**Key takeaways:**
- **`error` as a literal state exists only in the Input family.** Everywhere else, "error" is either absent or represented indirectly (e.g. `alert`'s `danger` severity).
- **`loading` exists only in `table_cell`** — no other component in the system has a data-fetching/skeleton state.
- **`focus` coverage is inconsistent and often partial**, even within a single component's own type set (`top_nav_item`: 5 of 7 types; `toggle`: only the ON value).
- **"Selected" is never expressed the same way twice** — it appears as a `state` value (`list`, `checkbox`, `radio`, `toggle`), a `type` value (`switcher_item`, `sidebar_item`, `top_nav_item`, `tab_nav_item`, `chip`), or not at all as a discrete concept (Buttons, Input).

---

## 6. Priority Levels

### Critical
1. **`focus_danger` color-binding bug** — resolves to the Secondary brand color instead of Danger, confirmed in three independent contexts (`special-effects.md` §9, `buttons.md` §13, `input.md` §11). Any UI currently rendering a danger-context focus ring is showing the wrong color.
2. **Radius token value collisions** (`custom/md`=10 vs. `border_radius_md`=12; `border_radius_sm`=8 vs. `border_radius_sm_2`=10) — if engineering picks the wrong sibling token during implementation, corner radii will silently be off by 2–20% with no error surfaced (`input.md`, `sidebar-navigation.md`, `table.md`, `progress.md`).

### High
3. **No unified selection-state vocabulary across Checkbox/Radio/Toggle/Chip/List/Switcher** — blocks any attempt at shared component logic or token-driven state styling across these controls (`checkboxes.md`, `radio-buttons.md`, `toggle.md`, `chips.md`, `list.md`, `switcher.md`).
4. **`Progress` component's unclear identity and possible duplication with `pagination`'s `load_more`** — needs a decision before either is built in code, to avoid maintaining two divergent implementations of the same control (`progress.md`, `pagination.md`).
5. **Inconsistent `focus` and `error` state coverage** across otherwise-comparable interactive components — a real accessibility/completeness gap, not just a naming issue (see §5).

### Medium
6. **Six-plus parallel naming systems for opacity/alpha values** — a maintainability risk for anyone building a token pipeline from this file (`special-effects.md`, `avatars.md`, `switcher.md`, `sidebar-navigation.md`, `top-navigation.md`).
7. **Bare, unexpanded component instances** (`table`, `modal_header`, `modal_actions`, `side_bar` family, `drop_menu`, `digit_field`) — unknown internal structure; risk of hidden complexity or duplicated variants (`table.md`, `modal.md`, `sidebar-navigation.md`, `input.md`).
8. **Typography duplicate composites** (`web/Title/13 *` ≡ `web/Body/13 *`) and **unresolved Gradient/Subject-Color tokens** — lower functional risk, but real cleanup debt (`typography.md`, `colors.md`).

### Low
9. **Cosmetic naming inconsistencies** — the `botom_left` typo, `Danger Filled`/`Success Filled` spacing, the seven-plus property-icon conventions, `outline/B`'s truncated name (`tooltips.md`, `tags.md`, `tab-navigation.md`).
10. **Size-scale label/value mismatches** that don't break anything functionally but complicate documentation (`switcher` vs. `switcher_item` height mismatch; the three `_label` components' differing dimensions despite identical property signatures).

---

## 7. Recommended Next Phase

*(Recommendations — not findings. Everything above this line is confirmed or clearly labeled as inferred from the source audits; everything below is a suggested course of action, presented for the team's judgment.)*

### Token standardization
- Pick **one** radius-naming system (`custom/*` is the more complete, better-scaled option) and deprecate the rest; resolve every confirmed value collision explicitly rather than guessing which sibling token is canonical.
- Pick **one** opacity/alpha-naming convention and migrate the other five; the `tags.md`-documented `_alpha_12/20/24` pattern is the cleanest candidate already in use.
- Fix the `focus_danger` binding (Critical §6.1) before any further component work depends on it.
- Decide the fate of the ~30 unresolved Subject Colors and the six unresolved Gradients — either bind them properly in Figma or confirm they're intentionally out of scope.

### Naming standardization
- Establish one selection-state vocabulary (e.g. `selected`/`unselected`, or `checked`/`unchecked` — pick one) and apply it to Checkbox, Radio, Toggle, Chip, List, and Switcher alike.
- Standardize state casing (lowercase vs. Capitalized) system-wide.
- Either commit to the property-icon-prefix convention everywhere, or drop it everywhere — the current seven-plus-icon, sometimes-no-icon pattern adds no signal.

### Component architecture cleanup
- Reconcile `Progress` and `pagination`'s `load_more` — merge, rename, or clearly differentiate.
- Split `pagination`'s six scenario values into an orthogonal primitive + explicit demo compositions.
- Expand or document the bare instances (`table`, `modal_header`, `modal_actions`, `side_bar` family) so their internal structure is auditable.
- Add missing `focus`/`error` states where the component's real-world usage would require them (form-adjacent controls especially).

### Figma library restructuring
- Rename any remaining Figma-default property names (`Property 1` in `Progress`, confirmed the only instance found, but worth a file-wide sweep).
- Document the confirmed nesting relationships (`button_group`→`button`, `list`→`checkbox`+Tag, `sidebar_item`→Tag, `nav_bar_header`→`tab_nav_item`) explicitly in the library, since they are currently only discoverable via deep MCP inspection.
- Correct the confirmed spelling typo (`botom_left`/`botom_right`) and the `Danger Filled`/`Success Filled` spacing inconsistency.

### Documentation and engineering handoff
- Treat this summary plus the 27 linked audit files as the baseline design-system documentation until the above cleanup lands — do not begin a token-pipeline or component-library engineering effort against the current naming as-is, since it would encode every inconsistency documented here directly into code.
- Once naming and token standardization (above) are complete, re-run the affected audits to confirm the fixes before starting engineering handoff.
