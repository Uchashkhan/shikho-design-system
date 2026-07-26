# Button

Implements the 8 button component sets audited in `docs/audit/buttons.md`, as 8 separate components mirroring Figma's own structure (not merged into one unified `Button` API — the audit found real, confirmed differences in `type`/`state` vocabulary between families, and merging them would erase that).

| Component | Figma set | `size` | `type` | `state` |
|---|---|---|---|---|
| `NewBlueButton` | `new_blue` | xs, sm, md, lg, **xxl** | Outline, Primary, Secondary, Text | Default, Disabled, Focus, Hover |
| `NewPinkButton` | `new_pink` | xs, sm, md, lg, **xxl** | Outline, Primary, Secondary, Text | Default, Disabled, Focus, Hover |
| `AiRoundedButton` | `ai_rounded` | xs, sm, md, lg, **xxl** | Green, Primary, Purple, `blue gradient` | Default, Disabled, Focus, Hover |
| `AiRegularButton` | `ai_regular` | xs, sm, md, lg, **xxl** | Green, Primary, `blue gradient`, **purple** (lowercase) | Default, Disabled, Focus, Hover |
| `ButtonSuccess` | `button_success` | xs, sm, md, lg, **xl** | Outline, Secondary, Text, **primary** | default, disabled, focus, hover |
| `ButtonDanger` | `button_danger` | xs, sm, md, lg, **xl** | Secondary, Text, **primary**, tertiary (no Outline) | default, disabled, focus, hover |
| `GreyscaleButton` | `Greyscale` | xs, sm, md, lg, **xl** | Outline, Secondary, Text, **primary** | default, disabled, focus, hover |
| `IconButton` | `icon_button` | xs, sm, md, lg, **xl** | neutral, primary, primary_light, quaternary, secondary, tertiary, tertiary_light | default, disabled, focus, hover |

Casing (`Default` vs `default`, `primary` vs `Primary`) is preserved exactly per family, per the audit's own documented inconsistency (`docs/audit/buttons.md` §4) — not normalized.

## This rebuild

The original implementation was built from `get_metadata`/`get_variable_defs` alone — it captured every family's exact `size`/`type`/`state` enum values, but never rendered a single instance to see how they actually looked. A deep re-audit (`docs/audit/buttons.md` §14, ~35 `get_design_context` calls across all 8 families) found the real visual construction was materially different from what had been guessed. See `docs/audit/buttons.md` §14.1 for the full list of what was wrong; the highlights:

- **Every button now renders a real border + 2-part shadow construction** (an outer `box-shadow` plus an inset overlay `div`) that the old implementation never rendered at all.
- **`icon_button`'s `secondary` type is a neutral `gray/100` fill** — the old code mapped it to the pink `color.secondary` brand ramp by matching the type name, which was simply wrong.
- **`Greyscale`'s `primary` type fills with `color.black[900]`** (near-black), not `color.gray[500]`.
- **`ai_rounded`/`ai_regular`'s 4 types are all real gradients** (3 linear, 1 radial) with exact confirmed stop colors/angles — not solid ramp fills with an unresolved-gradient placeholder.
- **Hover jumps a solid fill from ramp[500] to ramp[700]**, not ramp[600].
- **Focus replaces the entire border/shadow construction with a ring**, rather than adding a ring on top of the default look.
- **Disabled is an explicit recolor** (light tinted fill, light text, downgraded shadow, the *secondary*-effect inset regardless of the button's own type) — not a CSS `opacity` filter.

## Internal architecture

Public exports are unchanged (all 8 component names, all prop names/casing preserved). Internally, `packages/ui/src/components/button/shared.ts` now holds:

- Confirmed per-size metrics (height/padding/gap/icon-size/radius/typography) shared by every family — scale A's `xl` step and scale B's `xxl` step are confirmed pixel-identical, including radius (scale B's `xxl` uses `radius.lg`, NOT `radius["2xl"]` as the old code assumed).
- `rampEmphasisStyle(ramp, emphasis, phase, focusRing)` — the confirmed `Primary`/`Secondary`/`Outline`/`Text` construction, shared by `new_blue`, `new_pink`, `button_danger`, `button_success`, and `Greyscale`'s non-`primary` types. One shared function, not eight copies, since all five families render the exact same construction against a different ramp.
- `greyscalePrimaryStyle(phase)` — `Greyscale`'s `primary` type, kept separate since it's confirmed to use a fixed near-black color rather than an 11-step ramp.
- `aiGradientStyle(type, phase)` — `ai_rounded`/`ai_regular`'s confirmed gradient fills, kept separate since the fill mechanism (gradient vs. ramp) is genuinely different, not just a different color choice.
- `iconButtonStyle(type, phase)` — `icon_button`'s own confirmed 7-type table, kept separate since its structure (single icon slot, fixed square) and color mapping are both genuinely distinct from the text-button families.

`packages/ui/src/components/button/button_shell.tsx` is a shared, unexported DOM renderer (root row + icon slot(s) + label + optional inset overlay) used by all 8 families — the actual render tree shape is confirmed identical (including `icon_button` in a single-icon, no-label mode), so this is shared rather than duplicated 8 times.

## Confirmed vs. derived

**Exactly confirmed** (`docs/audit/buttons.md` §14.2/§14.3, from directly rendered `get_design_context` output — not from token names):

- The full `Primary`/`Secondary`/`Outline`/`Text` fill/border/text/shadow construction on `new_blue`, cross-checked identically on `new_pink` (pink ramp), `button_danger` (danger ramp), `button_success` (success ramp).
- The confirmed size ramp (height/padding/gap/icon-size/radius/typography) at all 5 steps.
- Confirmed `hover`/`focus`/`disabled` transition rules (see the rebuild summary above).
- `button_danger`'s `Secondary` type's exact fill/text pair, from `docs/audit/alerts.md` §11's discovery that `alert`'s nested action button is a literal `button_danger/md/secondary/default` instance.
- `button_success`'s one confirmed family-specific exception: `disabled` fill is flat neutral `gray/100`, not a tinted success color.
- `Greyscale`'s `primary` type (`black[900]`) and `icon_button`'s 5-of-7 sampled types (`primary`, `neutral`, `secondary`, `tertiary`, `quaternary`).
- All 4 `ai_rounded`/`ai_regular` gradient definitions (exact stop colors, angles) — `Primary`/`blue gradient`/`Green` are linear gradients; `Purple` is a 6-stop radial gradient, approximated in CSS (exact colors, non-pixel-exact geometry — Figma's version has an affine transform CSS `radial-gradient()` cannot express).
- `ai_rounded`'s pill radius (confirmed `height/2` at 2 independently sampled sizes) vs. `ai_regular`'s ordinary scale radius.
- The 6 focus-ring colors + shared ring geometry (0-blur, 3px-spread), including the corrected `focus.danger` (`docs/token-normalization-decisions.md` §10) — Figma's own `outline/focus_danger` binding is still wrong; this code does not reproduce that bug.

**Derived, documented as such** (`docs/audit/buttons.md` §14.4):

- `icon_button`'s `primary_light`/`tertiary_light` types (not independently sampled — a lighter tint of their non-`_light` sibling, following the `_light`-suffix pattern confirmed elsewhere in this system).
- `new_pink`/`button_danger`/`button_success`/`Greyscale`'s own `Secondary`/`Outline`/`Text`(/`tertiary`) hover/focus/disabled deltas (not independently re-sampled per family — `new_blue`'s confirmed transition rules are applied uniformly, since no sampled instance contradicted them except `button_success`'s disabled exception above).
- `button_danger`'s `tertiary` type (no counterpart in any other family — implemented via the confirmed `Outline`-shape construction as the closest structural analogue).
- `ai_rounded`/`ai_regular`'s gradient hover/focus/disabled states (not independently sampled — hover applies a `brightness()` filter, disabled/focus reuse the universal confirmed recipes).
- `Greyscale`'s `Secondary`/`Outline`/`Text` types (still derived from the gray ramp via `rampEmphasisStyle`, not independently re-sampled).

## Not implemented (by explicit instruction)

- `loading` state
- `pressed`/active state beyond the audited `state` enum
- Any accessibility affordance beyond native `<button>` semantics (no `aria-pressed`, no focus trap, etc. — not present in the audit)
- New variants beyond each family's confirmed `size`/`type`/`state` values
- New token categories (typography, spacing, gradients) in `@shikho/tokens` — gradient stop colors are hardcoded literals in `shared.ts`, documented inline, since no gradient token category exists

## `IconButton`'s `icon` prop

`icon_button` is icon-only, and `@shikho/icons` has no glyphs implemented yet (`packages/icons/README.md`). `IconButton` requires a consumer-supplied `icon: ReactNode` and `aria-label`, matching the instance-swap `ReactNode`-slot pattern the wider audit found used system-wide for icon slots.
