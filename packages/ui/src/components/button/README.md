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

## What's confirmed vs. derived

**Exactly confirmed by the audit** (`docs/audit/buttons.md` §8, §10) and used as literal ground truth:
- `NewBlueButton` at `size="xs" type="Primary" state="Default"` → fill `Color/primary/500` (`#5468ff`), text `Color/white/950` (`#ffffff`), radius `radius/custom/xs` (`6`), icon size `14`, typography 11px/16px/600-weight ("Caption 1").
- The 6 focus-ring colors + shared ring geometry (0-blur, 3px-spread), §6 — implemented as `box-shadow: 0 0 0 3px <color>` for every family, using `focusRingColor` from `@shikho/tokens` (including the corrected `focus.danger`, applied in `ButtonDanger`).
- Every family's exact `size`/`type`/`state` enum values (§2) — from `get_metadata` variant names, not visual data, but 100% confirmed structurally.

**Derived, not independently confirmed** — every one of the 8 families besides `new_blue`'s one audited instance has no deep-audited visual binding (§11: internal layer hierarchy, padding attribution, and icon-slot mechanism were never retrieved for any of the 8 sets). To still ship a renderable component, this implementation:
- Maps each family to the color ramp its own name refers to (`button_danger` → `color.danger`, `button_success` → `color.success`, `Greyscale` → `color.gray`, `new_blue` → `color.primary`, `new_pink` → `color.secondary` — the pink brand ramp), and for `ai_rounded`/`ai_regular`, maps each color-named `type` value the same way (`Green` → `color.success`, `Purple`/`purple` → `color.shikhoAi`).
- Derives `Outline`/`Secondary`/`Text`/`tertiary`/`*_light` as a `solid`/`soft`/`outline`/`text` emphasis mode reusing the **same ramp's own real steps** (50/100/200/300/600/700) — never a fabricated color, but the choice of which step maps to which emphasis is this implementation's decision, not an audit finding.
- Applies the general, already-confirmed `radius` scale from `@shikho/tokens` by size-name rank (only `xs` is confirmed specifically for Buttons).
- Applies the one confirmed typography value (11px/16px/600) uniformly across all sizes, since no other size's typography was confirmed.
- Uses an unconfirmed, minimal placeholder padding scale (`docs/audit/buttons.md` §11 — three spacing tokens were bound somewhere in the subtree but never attributed to a specific side).
- `hover` state reuses the same ramp's own `600` step (one shade darker than the `500` solid fill) — a real token value, applied as a reasonable, minimal interaction cue, not confirmed as the actual hover treatment.

**Explicitly not resolved, and not approximated:**
- `ai_rounded`/`ai_regular`'s `"blue gradient"` type — `Gradient/G1`–`G6` never resolve anywhere in the audit series. This falls back to a solid `color.primary` fill, clearly marked in code and in the `UnresolvedGradientPlaceholder` story, not an attempt to guess the gradient.
- `primary_button_effect`/`secondary_button_effect` (the audited 4-layer button shadow composites, §7) are **not applied** — they are not implemented in `@shikho/tokens` yet (only `color`, `radius`, `elevation` are), and this component uses only `@shikho/tokens` exports, per the implementation constraints.
- Padding/gap sides, auto-layout direction, and any icon-slot mechanism for the 7 non-`icon_button` families — never confirmed (§11), so no icon prop was added to them.

## Not implemented (by explicit instruction)

- `loading` state
- `pressed`/active state beyond the audited `state` enum
- Any accessibility affordance beyond native `<button>` semantics (no `aria-pressed`, no focus trap, etc. — not present in the audit)
- New variants beyond each family's confirmed `size`/`type`/`state` values
- New token categories (typography, spacing, effects) in `@shikho/tokens`

## `IconButton`'s `icon` prop

`icon_button` is icon-only, and `@shikho/icons` has no glyphs implemented yet (`packages/icons/README.md`). `IconButton` requires a consumer-supplied `icon: ReactNode` and `aria-label`, matching the instance-swap `ReactNode`-slot pattern the wider audit found used system-wide for icon slots.
