# Radio

Implements the `radio` component set audited in `docs/audit/radio-buttons.md`. Structurally the sibling of `Checkbox` — same two-set pairing pattern (`radio`/`radio_label` mirrors `checkbox`/`checkbox_label`) — but **less confirmed data exists for Radio than for Checkbox**: no `get_design_context` deep audit was ever run on this family (§6), and no other audit nests a `radio` instance the way `list.md` nests `checkbox` (§11), so there is no cross-reference pinning down an actual applied visual.

`radio_label` (the second confirmed component set) is **out of scope for this task** — same scoping decision as `checkbox_label`. See "Not implemented" below.

## Confirmed vs. derived

**Exactly confirmed** (`docs/audit/radio-buttons.md`):
- `size`: `md` (24×24), `sm` (20×20) — §4, identical dimensions to `checkbox`.
- **No `shape`/`type` property exists at all** — radio is always circular (§4), unlike `checkbox`'s sphere/square choice.
- 7 raw Figma `state` values (`disabled`, `indeterminate`, `active_focused`, `active`, `inactive_focused`, `hover`, `inactive`) confirmed structurally (§2) — one fewer than `checkbox`'s 8 (no `indeterminate_disabled` counterpart, §10).
- `outline/focus_gray` — identical confirmed geometry/color to `checkbox`'s (§8).
- **Confirmed cross-component naming divergence:** Radio's selection concept is named `active`/`inactive` in Figma, while Checkbox's conceptually equivalent one is `checked`/`unchecked` (§2, §10 — "the clearest cross-component naming divergence" in the whole audit series).
- **Confirmed absence:** no `radius/border_radius_round` or `radius/custom/*` token was found bound anywhere in this component's subtree (§8) — a genuine gap in the Figma data, not something this implementation had to guess around conceptually (a "radio button" is unambiguously circular regardless of which mechanism produces that in Figma).

**Derived / reused from Checkbox — not independently confirmed for Radio:**
- The resting visual (white fill, 2px `Text/gray-400` border) is **reused from `Checkbox`'s own confirmed value**, justified by the audit's own findings that Radio and Checkbox share identical size dimensions and an identical color/token export (§9: "token-for-token identical to the Checkboxes overview's color export"), not by any independent confirmation for Radio itself.
- `radius.full` is used for the circular shape — the only sensible implementation of "always circular," using an already-confirmed general-purpose token, not a new guessed number.
- The focus-ring color (`outline/Gray 300`) — same unconfirmed primary-vs-gray assignment ambiguity as Checkbox (§8, §13), resolved the same way: apply the neutral gray candidate uniformly.
- **Selection prop naming:** rather than invent a nonstandard `active`/`inactive` prop pair to literally match Figma's naming, this component uses the standard native `checked`/`defaultChecked` props — `<input type="radio">` has a real native `checked` semantic, and diverging from it would work against both the browser and assistive technology. This mirrors the same "use native semantics" principle applied to `Checkbox`, and is consistent with the (currently deferred) `checked`/`unchecked` unification direction in `docs/token-normalization-decisions.md` §11 — without pre-emptively renaming Figma's own `state` enum, which is preserved as documented fact above.

**Explicitly not resolved, and not approximated:**
- **`indeterminate`** — a confirmed Figma state value (§2), but flagged by the audit itself as conventionally unusual for a mutually-exclusive control, with no explanation and no confirmed visual (no deep audit exists for this family at all). Critically, `<input type="radio">` has **no native `indeterminate` DOM property** in any browser (HTML only defines that for checkboxes). This prop is exposed only as a `data-indeterminate` attribute — structural fidelity to the confirmed enum, with no native behavior and no invented styling attached.
- No checked-state artwork (selected dot color/size) — left to the browser's native radio rendering, same rationale as `Checkbox`'s unconfirmed checkmark.

## Not implemented

- **`radio_label`** — a separate confirmed component set (§1), out of scope for this task, structurally identical to `checkbox_label` (§11) and deferred for the same reason.
- Captions/descriptions, `success`/`warning`/`error` states — none exist on `radio` (§5).
- Whether `checkbox.shape=sphere` is a literal reuse of this `Radio` primitive — the audit explicitly could not confirm this either way (§12, §13) and it was out of scope to investigate further here; `Checkbox` and `Radio` remain two independent components in this codebase, matching the audit's own inability to confirm a shared primitive.
- Any accessibility behavior beyond native `<input type="radio">` semantics.

## Token dependencies

Only `@shikho/tokens`: `color.white[950]`, `color.gray[400]`, `color.gray[300]`, `radius.full`. No new token category was introduced.
