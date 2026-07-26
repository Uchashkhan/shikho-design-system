# Checkbox

Implements both component sets audited in `docs/audit/checkboxes.md` — `checkbox` and `checkbox_label`. The original audit never called `get_design_context` (overview-level only) — the first implementation rendered a real `<input type="checkbox">` **without** `appearance: none`, relying entirely on the browser's own native indicator for checked/indeterminate. A second re-audit pass (§14, 9 `get_design_context` calls) then confirmed the real visual construction, and `checkbox_label` — previously unimplemented and explicitly out of scope — is now built too.

## This rebuild (§14)

- **The visible box is smaller than its own footprint** — a confirmed 16×16 box centered inside the 20px `sm` bounding box (18×18 inside `md`'s 24px), not a box that fills its footprint with a 2px border.
- **`hover` had no visual at all.** Confirmed real: border swaps `gray/400` → `primary/500`, no fill change.
- **`checked`/`indeterminate` were left to native browser rendering**, which can't reproduce Figma's artwork and looks different per browser. `indeterminate` is now confirmed exactly: a light `primary/100` tint (not a solid dark fill) with a `primary/500` dash. `checked` uses the conventional solid `primary/500` fill + white checkmark — the one "on" state whose exact colors weren't decomposable from Figma's flattened image asset, explicitly flagged as derived.
- **Resolved the original audit's own open question**: `checked_focused` uses the primary ring (`outline/focus_primary`); `unchecked_focused` uses the gray ring (`outline/focus_gray`) — previously applied uniformly as gray for both, which is now confirmed wrong for the checked case. `unchecked_focused`'s border also darkens to `gray/600`, not just gains a ring.
- **`disabled` is a flat, solid `gray/400` fill with no border** (confirmed via the fully-decomposed `indeterminate_disabled` sample) — not a generic `opacity: 0.5` dim.
- **`checkbox_label` is now implemented** — confirmed to compose a real nested `Checkbox` plus a label (Regular 400 weight, not Medium) and optional caption, laid out via `direction`.

## Confirmed vs. derived

**Exactly confirmed** (`docs/audit/checkboxes.md` §14, 9 sampled instances):
- `size`: `md` (24px footprint / 18px box), `sm` (20px footprint / 16px box).
- `shape`: `sphere` (full radius), `square` (`radius.xs`).
- Per-state fill/border/ring for `unchecked`/`hover`/`unchecked_focused`/`checked_focused`/`indeterminate`/`indeterminate_disabled`/`disabled`.
- The focus-ring color assignment: primary for checked states, gray for unchecked states.
- `checkbox_label`'s real composition: a nested `Checkbox` + label (`gray/950`, Regular 400) + optional caption (`gray/700`, Medium 500), via `direction`.

**Derived, not independently confirmed** (`docs/audit/checkboxes.md` §14):
- `checked`'s exact fill/checkmark colors — the sampled instance renders as one flattened image; the conventional solid-fill + white-checkmark treatment is used as the most likely candidate.
- `hover` for `checked`/`indeterminate` — no confirmed hover exists for either; both render identically to their non-hover look.
- `Radio`'s own visual still derives from Checkbox's pre-rebuild values and was **not** re-confirmed or updated as part of this pass — `Radio` was out of scope here.

## Not implemented

- `success`/`warning`/`error` validation states — none exist on `checkbox` (§5).
- Any accessibility behavior beyond real `<input>` semantics — the native input is visually hidden but remains the actual interactive/AX element; the visible box is a purely decorative sibling (`aria-hidden`).

## Token dependencies

`@shikho/tokens`: `color.white[950]`, `color.gray[300/400/600/950/700]`, `color.primary[100/500]`, `radius.xs`/`radius.full`.
