# Checkbox

Implements the `checkbox` component set audited in `docs/audit/checkboxes.md`. Unlike Input, **no `get_design_context` deep audit was performed on this family** (only `get_metadata`/`get_variable_defs` overview-level data) — so most of this component's visual confirmation actually comes from a cross-reference in `docs/audit/list.md` §7, which found a nested Checkbox instance and captured its real rendered styling.

`checkbox_label` (the second component set in `docs/audit/checkboxes.md`) is **out of scope for this task** — only `checkbox` was requested. See "Not implemented" below.

## Confirmed vs. derived

**Exactly confirmed:**
- `size`: `md` (24×24), `sm` (20×20) — `docs/audit/checkboxes.md` §4.
- `shape`: `sphere`, `square` — a genuine confirmed binary choice (§4).
- The resting/unchecked visual — white fill, a 2px `Text/gray-400` border, and `radius/border_radius_xs` (6px) — confirmed via the nested Checkbox instance in `docs/audit/list.md` §7 (`checkbox/theme_light/sm/square/unchecked/default`), which `checkboxes.md` §12 explicitly calls "very likely the same underlying component" (it uses the identical radius token, `radius/border_radius_xs`, that `checkboxes.md` §8 confirms is `checkbox`'s only radius token).
- 8 raw Figma `state` values exist (`disabled`, `indeterminate_disabled`, `indeterminate`, `checked_focused`, `checked`, `unchecked_focused`, `hover`, `unchecked`) — confirmed structurally (§2), decomposed per this task's requirement 9 into separate `checked`, `indeterminate`, and `disabled` props, with `hover`/`focused` handled by real CSS `:hover`/`:focus-visible` instead of a manually-set prop.
- `outline/focus_gray` (`Effect(DROP_SHADOW, outline/Gray 300, 0,0,0,3)`) — confirmed exact geometry and color (§8), applied to `:focus-visible`.

**Derived / left to native browser behavior — not invented:**
- **No confirmed checkmark glyph, checked-state fill, or indeterminate-dash artwork exists anywhere in the audit.** Rather than invent one (e.g. the common "blue fill + white check" pattern), this component renders a real `<input type="checkbox">` **without `appearance: none`**, so the browser's own native checked/indeterminate indicator renders on top of the confirmed resting-box styling (border/fill/radius). This is a deliberate application of requirement 8 ("use native checkbox semantics where possible"), not a placeholder pending removal — there is no confirmed design to replace it with.
- **Focus ring color assignment:** `docs/audit/checkboxes.md` §8 and §13 both flag that `outline/focus_primary` and `outline/focus_gray` are "strong candidates" for `checked_focused`/`unchecked_focused` respectively, but which applies to which was never confirmed. This implementation applies `outline/focus_gray`'s color uniformly to every focus state, rather than presume an unconfirmed primary/gray split.
- **Default `size`/`shape`:** the audit could not confirm either component set's default variant (§13). This implementation defaults to `size="sm"` and `shape="square"` because that combination is the one instance with real confirmed usage context (the nested instance in `list.md`) — not a claim that Figma itself defaults there.
- **`disabled` + `checked` together:** the audit confirms no `checked_disabled` variant exists (§2, §10) — only bare `disabled` (implicitly unchecked) and `indeterminate_disabled`. This implementation does not block the `checked`+`disabled` prop combination (native `disabled` checkboxes can validly be pre-checked in HTML), but does not claim any confirmed visual for it beyond the generic disabled dimming shared with the other disabled combinations.

## Not implemented

- **`checkbox_label`** — a separate confirmed component set (`docs/audit/checkboxes.md` §1), out of scope for this task. Recommended as a small, fast follow-up: it only needs `size`/`direction`, and §13 notes it plausibly composes a `Checkbox` internally (unconfirmed).
- Captions/descriptions — `docs/audit/checkboxes.md` §5 found no property for this on `checkbox` itself.
- `success`/`warning`/`error` validation states — none exist on `checkbox` (§5).
- Any accessibility behavior beyond native `<input type="checkbox">` semantics (no custom ARIA roles/attributes were added).

## Token dependencies

Only `@shikho/tokens`: `color.white[950]` (fill), `color.gray[400]` (border), `color.gray[300]` (focus ring), and `radius.xs`/`radius.full` (square vs. sphere corner radius). No typography/spacing/elevation tokens are used — `checkboxes.md` §8 explicitly flags `elevation/e2`/`elevation/e5`/`secondary_button_effect` in this subtree as "likely spillover," not confirmed as genuinely applied to `checkbox` itself, so none of them were used here.
