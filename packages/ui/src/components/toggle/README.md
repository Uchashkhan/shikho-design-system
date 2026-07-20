# Toggle

Implements the `toggle` component set audited in `docs/audit/toggle.md` — the third and final selection-control primitive alongside `Checkbox` and `Radio`. Same `get_design_context`-free audit situation as `Radio`: no deep internal-structure audit exists for this family (§6), so there is no confirmed knob/track color split or animation, only overview-level property and token data.

`toggle_label` (the second confirmed component set) is **out of scope for this task**, same scoping decision as `checkbox_label`/`radio_label`.

## Confirmed vs. derived

**Exactly confirmed** (`docs/audit/toggle.md`):
- `size`: `lg` (40×24), `md` (**confirmed identical bounding box to `lg`, 40×24** — not a typo, reproduced faithfully), `sm` (32×20) — §4.
- 5 raw Figma `state` values: `switch_ON_disabled`, `switch_OFF_disabled`, `switch_ON_focused`, `switch_ON`, `switch_OFF` — confirmed structurally (§2). **No `hover` state and no `switch_OFF_focused`** — the most limited focus/interaction coverage of the three selection controls (§10, §12).
- **A third distinct selection-vocabulary**: `switch_ON`/`switch_OFF` (uppercase, `switch_` prefix), differing from both Checkbox's `checked`/`unchecked` and Radio's `active`/`inactive` (§10, §12 — table comparing all three).
- `outline/focus_primary` is the **only** focus-ring token present in this component's export — unlike Checkbox/Radio, there is no `outline/focus_gray` here at all (§8, §11), consistent with `toggle` having only one focused variant. This removes the primary-vs-gray ambiguity that affected Checkbox/Radio's focus-ring choice.
- `radius/border_radius_round` (1000) is present and used for the pill track shape (§8).

**Derived, grounded in Toggle's own confirmed export (not borrowed from Checkbox/Radio this time):**
- The resting track fill uses `Color/Gray 200` (`#ebecf0`), because Toggle's own §9 color export is **narrower than Checkbox's/Radio's — it does not include `Text/Gray 400`**, the exact border color those two components share and that `Radio` legitimately reused from `Checkbox`. Reusing that same gray-400 border here would have been a weaker derivation than it was for Radio, since it isn't even present in Toggle's own token list. `Color/Gray 200` is used instead because it *is* explicitly present in Toggle's own export (§9).
- **No border is rendered at all** — no border color token appears anywhere in Toggle's confirmed export (unlike Checkbox/Radio, where at least `list.md` cross-referenced an applied border for Checkbox). This is a deliberate absence, not an oversight.
- The focus ring reuses `focusRingColor.primary` from `@shikho/tokens`, whose value (`#5468ff3d`) is exactly `outline/primary_alpha` as confirmed here (§8, §9) — a genuine value match, not an assumption.

**Explicitly not resolved, and not approximated:**
- **No sliding knob/thumb is drawn.** The common toggle-switch visual (a colored track with a white knob that slides between OFF/ON positions) has zero confirmed basis anywhere in this audit — no knob color, no knob size, no track-color-when-ON value, no animation timing. Rather than invent the ubiquitous pattern, this component renders only the confirmed track fill/shape and relies on the browser's native checked-indicator rendering to communicate ON/OFF, exactly the same principle applied to `Checkbox`'s unconfirmed checkmark and `Radio`'s unconfirmed selected-dot.
- `radius/border_radius_100` — a brand-new token first seen in this audit (§8, §10), explicitly flagged as having an unconfirmed application ("knob vs. track vs. something else," §13). **Not used anywhere in this implementation** rather than guessed onto either element.
- `Color/disabled_base_em` — present in the token pool but its genuine application to `toggle`'s disabled states is explicitly unconfirmed (§13). Disabled styling uses the same generic `disabled:opacity-50` treatment as Checkbox/Radio instead of this specific color.
- **No `hover` state and no `indeterminate` state** — both confirmed absent from `toggle`'s enum (§2, §4), unlike its two siblings. Neither is implemented; there is no `indeterminate` prop on `Toggle` at all (contrast with `Checkbox`/`Radio`, which both expose one for their own confirmed enum values).

## Not implemented

- **`toggle_label`** — a separate confirmed component set (§1), out of scope for this task. Notably, its confirmed bounding-box dimensions are *larger* than `checkbox_label`/`radio_label`'s (§4, §11) despite an identical property structure — worth carrying into that component's own future implementation, not something to reconcile here.
- Whether `toggle_label` shares any literal component reuse with `checkbox_label`/`radio_label` — explicitly unconfirmed (§13).
- Captions/descriptions, `success`/`warning`/`error` states — none exist on `toggle` (§5).
- Any accessibility behavior beyond native `<input type="checkbox" role="switch">` semantics.

## Token dependencies

Only `@shikho/tokens`: `color.gray[200]`, `focusRingColor.primary`, `radius.full`. No new token category introduced.
