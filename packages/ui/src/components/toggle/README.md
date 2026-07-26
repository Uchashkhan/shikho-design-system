# Toggle

Implements the `toggle` component set audited in `docs/audit/toggle.md` — the third and final selection-control primitive alongside `Checkbox` and `Radio`.

## This rebuild — ground-truth re-audit (docs/audit/toggle.md §14)

The original audit deliberately never called `get_design_context` (an explicit instruction for that pass). The prior implementation reflected that gap: it rendered a bare `<input type="checkbox" role="switch">` with only a track-colored background and **no knob at all** — which is exactly why it visually looked like a plain checkbox rather than a switch (no browser has meaningful default styling for `role="switch"` on a checkbox input).

A deep re-audit was performed: `get_metadata` on both `toggle` (15 variants) and `toggle_label` (4 variants), followed by `get_design_context` on all 5 states at `md`, plus `switch_OFF`/`switch_ON` at both `sm` and `lg`, plus all 4 `toggle_label` variants. Unlike `radio`, every `toggle` state decomposes into real layers with actual bound colors — there was no flattened-image limitation here.

The component was rebuilt using the same hidden-native-input + custom-rendered-visual pattern as `Checkbox`/`Radio`: a real `<input type="checkbox" role="switch">` stays for semantics/keyboard/AX, visually hidden, while a sibling `aria-hidden` track+knob renders the confirmed pill track and sliding stadium-shaped knob.

## Confirmed vs. derived

**Exactly confirmed** (`docs/audit/toggle.md` §14 unless noted):
- Outer box: `lg`/`md` = 40×24 (confirmed identical, §4), `sm` = 32×20.
- **Track and knob are drawn at different internal sizes for `md` vs `lg`, despite the identical outer box**: `lg` track 38×22/knob 22×18 (near edge-to-edge, 1px inset); `md` track 34×20/knob 20×16 (3px inset); `sm` track 28×16/knob 16×12.
- The knob is a uniform 2px inset from the track's edges on every side, at rest and when slid — used directly as the CSS layout mechanism (`padding: 2px` + flex `justifyContent: flex-start`/`flex-end`) rather than a per-state position table.
- The knob is a confirmed **stadium/pill shape** (width ≠ height), not a circle.
- Per-state colors: `switch_OFF` = `gray/200` track, white knob + `elevation.e2` shadow; `switch_ON` = `primary/500` track, white knob (same shadow) + a `primary/500`-colored checkmark; `switch_ON_focused` = same as ON + `outline/focus_primary` ring; `switch_OFF_disabled`/`switch_ON_disabled` = the **same** muted `gray/100` track (confirmed **not** primary-tinted even when "ON") + a translucent-black knob with **no shadow** — the only difference between disabled ON/OFF is whether a muted gray/100-colored checkmark appears.
- `toggle_label` composition — a real nested `Toggle` + a `cell_content` column (`gap: 8px` row gap, `gap: 2px` label/caption gap, `items-start`), confirmed across all 4 size × direction variants.
- **Toggle's label typography differs from Checkbox's/Radio's**: at `md`, the label is confirmed `Medium/500` weight (not Regular/400 like its siblings); at `sm`, it collapses to `caption_2`/Medium/500, matching the caption — same pattern as the other two controls' `sm` label.
- `outline/focus_primary` is the only focus-ring token present — confirmed to apply only to the `checked` (ON) track; there is no `switch_OFF_focused` variant.

**Explicitly not resolved, and not approximated:**
- No `hover` state and no `indeterminate` state — both confirmed absent from `toggle`'s enum (§2, §4), unlike its two siblings. Neither is implemented.
- Whether `toggle_label` shares any literal component reuse with `checkbox_label`/`radio_label` — explicitly unconfirmed (§13); its differing bounding-box dimensions argue against it, but this isn't conclusive.

## Not implemented

- Captions/descriptions beyond `toggle_label`'s own confirmed caption, `success`/`warning`/`error` states — none exist on `toggle` (§5).

## Token dependencies

`@shikho/tokens`: `color.gray[100]`, `color.gray[200]`, `color.primary[500]`, `color.white[950]`, `color.black[100]`, `color.gray[950]`, `color.gray[700]`, `elevation.e2`, `radius.full`. The exact track/knob pixel dimensions per size are hardcoded, confirmed-in-Figma values with no matching token — consistent with this project's policy of hardcoding only when a value is confirmed and no token exists.
