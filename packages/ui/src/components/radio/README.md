# Radio

Implements the `radio` component set audited in `docs/audit/radio-buttons.md`. Structurally the sibling of `Checkbox` — same two-set pairing pattern (`radio`/`radio_label` mirrors `checkbox`/`checkbox_label`). No "RadioWithContent"/"RadioContent" naming exists in Figma; the confirmed component set is literally named `radio` + `radio_label`, so this codebase keeps `Radio` + `RadioLabel`, matching both Figma's own name and the existing `Checkbox`/`CheckboxLabel` convention.

## This rebuild — ground-truth re-audit (docs/audit/radio-buttons.md §15)

A prior pass in this session (§14) treated every `radio` state as an opaque flattened image, since `get_design_context`'s generated code only ever showed an `<img>` tag per state, and reused Checkbox's own confirmed colors by analogy. **That was an incomplete re-audit.** The `imgRadio` src URLs `get_design_context` returns are not rasters — downloading them reveals raw SVG source, decomposable pixel-exact. Re-auditing from those files (not by analogy to Checkbox) found several genuine mismatches in the §14 rebuild:

1. **`hover`'s fill is transparent, not white.** The §14 implementation applied a solid white fill to every unchecked sub-state, indistinguishable from the confirmed transparent fill only on a plain white page background.
2. **`active`/`active_focused` have a punched-out white center dot** — the §14 implementation rendered a flat, fully solid `primary/500` disc with no dot at all. This was the single biggest visual miss: Figma's "selected" radio is a ring-less disc with a small white dot in the middle (inverted from the conventional ring+dot radio convention, but that is what the source draws).
3. **`indeterminate`'s mark is a horizontal rounded-rect ("dash"), not a circular dot** — confirmed `8×2px, rx=1`, not a small filled circle.
4. **`disabled` always renders the same gray dash mark, unconditionally** — there is exactly one confirmed Figma `disabled` variant (not a `disabled+checked`/`disabled+indeterminate` matrix), and it always shows a gray/400 fill + gray/600 dash regardless of the `checked`/`indeterminate` prop values. The §14 implementation only showed a mark when `indeterminate` was *also* set.
5. **No second row of additional states exists.** `get_metadata` on the `radio` frame confirms exactly 14 symbols = 7 states × 2 sizes. The two rows in the frame are the `sm`/`md` size axis, not extra state variants.
6. **`radio_label`'s label typography is size-dependent**, not a single fixed style: at `md` the label uses Regular/400 weight at `body_1` (13/20); at `sm` the label collapses to the same Medium/500, `caption_2` (12/16) typography as the caption itself, differing only by color.

This rebuild replaces every "derived by analogy" color/shape from §14 with the exact values read off the SVG source, downloaded via the asset URLs `get_design_context` returns for all 7 states at both confirmed sizes, plus a re-run of `get_design_context` on all 4 `radio_label` variants (not just `md/left`).

The component keeps the same architecture as `Checkbox`: a real `<input type="radio">` stays for semantics/keyboard/AX but is visually hidden (`opacity: 0`, absolutely positioned, full footprint), while a sibling `aria-hidden` `<span>` renders the confirmed visual (ring, disc, dot, or dash), driven by React state for checked/hover/focus.

## Public API — confirmed correct, unchanged in this pass

The existing prop shape (`size`, `checked`/`defaultChecked`, `indeterminate`, `disabled`, plus forwarded native input props) maps directly onto Figma's confirmed variant axes (`size`: md/sm; `state`: inactive/hover/inactive_focused/active/active_focused/indeterminate/disabled) with no invented or missing properties. No API change was needed — only the internal visual mapping was wrong.

## Confirmed vs. derived

**Exactly confirmed** (`docs/audit/radio-buttons.md` §15 unless noted):
- `size`: `md` (24×24, inner 18×18), `sm` (20×20, inner 16×16) — §4.
- **No `shape`/`type` property exists at all** — radio is always circular (§4).
- Exactly 7 raw Figma `state` values, no more: `disabled`, `indeterminate`, `active_focused`, `active`, `inactive_focused`, `hover`, `inactive` (§2, §15).
- Per-state fill/border/mark, read directly off the SVG source (see the table in §15): `inactive` = white fill + gray/400 2px border; `hover` = **transparent** fill + primary/500 2px border; `inactive_focused` = white fill + gray/600 2px border + gray/300 outer ring; `active`/`active_focused` = edge-to-edge primary/500 fill with a **white center dot** (6px at sm, 8px at md) + primary-alpha outer ring when focused; `indeterminate` = edge-to-edge primary/100 fill + a primary/500 **8×2px dash** (not a dot); `disabled` = edge-to-edge gray/400 fill + a gray/600 8×2px dash, shown **unconditionally**, regardless of `checked`/`indeterminate`.
- The focus rings themselves (`outline/focus_primary` for checked, `outline/focus_gray` for unchecked, both `spread: 3`) — confirmed via `get_design_context` effects, unchanged from §14.
- `radio_label` composition — a real nested `Radio` + a `cell_content` column (`gap: 8px` row gap, `gap: 2px` label/caption gap, `items-start` top alignment, hug width) — confirmed across all 4 size × direction variants. Label typography is confirmed size-dependent (see point 6 above); caption is always `Text/gray-700`, `caption_2` (12/16), Medium/500.

**Explicitly not resolved, and not approximated:**
- Whether `checkbox.shape=sphere` is a literal reuse of this `Radio` primitive — the audit explicitly could not confirm this either way (§12) and it remains out of scope; `Checkbox` and `Radio` stay two independent components in this codebase.
- The default variant configuration in Figma (which state/size is the component's own default) — not retrievable via MCP (§13); this implementation defaults to `size="sm"`, unselected, matching the prior session's choice, since nothing contradicts it.

## Not implemented

- Captions/descriptions, `success`/`warning`/`error` states — none exist on `radio` (§5).

## Token dependencies

Only `@shikho/tokens`: `color.white[950]`, `color.gray[300]`, `color.gray[400]`, `color.gray[600]`, `color.primary[100]`, `color.primary[500]`, `radius.full`. The dash mark's `8×2px` dimensions and the dot's `6px`/`8px` sizes are hardcoded, confirmed-in-Figma pixel values with no matching token — consistent with this project's policy of hardcoding only when a value is confirmed and no token exists.
