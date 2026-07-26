# Tags

Implements the `tags` component set audited in `docs/audit/tags.md` — Chip's closest sibling (§10). The original audit never called `get_design_context` at all (overview-only), so the first implementation was built entirely from metadata/token names. A second re-audit pass (§13, 16 `get_design_context` calls) then confirmed the real per-size, per-type, and per-state visual construction.

## Fresh re-audit corrections (§14)

§13 itself asserted "no confirmed hover exists for any solid fill in this family" and left `primary_outline`'s hover as a guess. A fresh, non-trusting re-check (6 more `get_design_context` fetches directly on hover instances) disproves that: **the 3 solid-fill types (`primary`, `Danger Filled`, `Success Filled`) DO have a real confirmed hover — the fill darkens from the ramp's `500` step to its `600` step.** `primary_outline`'s hover was also corrected from a guessed plain `gray/50` to the confirmed real `primary/500_alpha_12` tint. `info`'s and `secondary`'s hover fills were re-checked and found already correct.

## This rebuild (§13)

- **Radius was assumed to be a full pill**, following Chip's shape. Confirmed real: `tags` uses the `radius/custom/xs|sm|md` scale (6/8/10px at sm/md/lg) — a small rounded rectangle, not a pill — likely the single largest visual miss in the original guess.
- **Every size shared one 12px font with horizontal-only padding.** Confirmed real: `lg` uses `caption_2` (12px), `md`/`sm` use `caption_1` (11px) — a genuine per-size typography split — plus real per-size padding/gap differences.
- **Icon slots did not exist.** Confirmed real: `left_icon`/`right_icon` slots on every sampled instance, with the same `elevation/e2` drop-shadow filter used system-wide.
- **`tertiary` was guessed as a lighter, borderless gray.** Confirmed real: a white fill with a `black/50` border — the neutral analogue of `primary_outline`, not "secondary but lighter." Its `hover` (white → `gray/100`) is independently confirmed.
- **`primary_outline` was guessed as transparent with a fully opaque border.** Confirmed real: an opaque white fill with the border at only 24% alpha.
- **The solid `primary` type was guessed as borderless.** Confirmed real: a `black/50` border — while "Danger Filled"/"Success Filled" are confirmed genuinely borderless. This asymmetry is real, not an inconsistency this rebuild introduced.
- **`disabled` was a generic `opacity: 0.5` dim.** Confirmed real: a flat `Color/vanilla_gray/100` fill (a distinct token from the gray ramp's own `gray/100`), `gray/400` text, no border — and the resting inset shadow is **kept**, unlike Button/Chip's disabled treatment.
- **The confirmed inset shadow (`special_drop`) was never applied.**

## Confirmed vs. derived

**Exactly confirmed** (`docs/audit/tags.md` §13, 16 sampled instances):
- `size`: real per-size height/padding/gap/radius/icon-size/typography, sampled at all 3 sizes.
- `type`: all 11 types' default fill/border/text, sampled directly at `md`.
- `state`: `disabled`'s universal recipe (sampled on `primary`); `tertiary`'s `hover` (sampled directly).
- No coverage gaps — every type gets all 3 states at all 3 sizes (§3).
- The systematic alpha convention (`_alpha_12`/`_alpha_20`/`_24` for primary) — confirmed in §8 and now confirmed genuinely applied at `_alpha_12` for every tinted type's default state.
- `Danger Filled`/`Success Filled`'s casing (space-containing Title Case) — preserved verbatim, not corrected, per the audit's own note that this is "the most severe single-property naming inconsistency confirmed in this entire audit series" (§9).

**Now exactly confirmed** (`docs/audit/tags.md` §14 — corrects §13's own hover derivations):
- `hover` for the 3 solid-fill types (`primary` → `primary/600`, `Danger Filled` → `danger/600`, `Success Filled` → `success/600`) — a genuine, confirmed 500→600 darkening pattern, not "no confirmed hover" as §13 asserted.
- `hover` for `primary_outline` — confirmed `primary/500_alpha_12` (a light primary tint), not the previously-guessed plain `gray/50`.
- `hover` for `info` and `secondary` — re-checked and confirmed already correct.

**Derived, not independently confirmed:**
- `hover` for `warning`/`success`/`primary_light` — derived from the confirmed `_alpha_12`→`_alpha_20` system (§8), cross-checked correct on `info` (§14) but not independently sampled per type.
- Icon size at `sm` (12px) — derived by rank from the confirmed 14px@md/16px@lg progression.

## Rendered as a static label, not a button

Unlike `Chip`, `Tags` renders a plain `<span>`, not a `<button>` — no `focus`/`drag` states exist for this family (§10). `state="disabled"` is expressed via `aria-disabled` plus the confirmed disabled recolor, since a `<span>` has no native `disabled` attribute.

## Not implemented

- A confirmed reason why only `danger`/`success` get a "Filled" counterpart while `warning`/`info` do not — a confirmed asymmetry (§3, §9), not resolved.
- Real dismiss/counter controls — no dedicated layer was found for either.

## Token dependencies

`@shikho/tokens`: `color.info/warning/danger/success[500/600]`, `color.primary[500/600]`, `color.gray[50/100/200/400/700]`, `color.black[50]`, `color.white[50/950]`, `color.vanillaGray[100]`, `radius.xs/sm/md`.
