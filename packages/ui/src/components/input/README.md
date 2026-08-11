# Input

Implements the 7 Input component sets + 1 bare instance audited in `docs/audit/input.md`. Two nodes were originally deep-audited via `get_design_context` (`input_field/active` §8, `field/md/default` §9); a second re-audit pass (§14, ~14 more `get_design_context` calls) then confirmed the real per-size, per-type, and per-state visual construction that the first pass's implementation had been silently missing — see §14 for the full list of corrections.

## Re-audit pass: real interactivity (§15)

A third pass found that visual fidelity (§14) had been thoroughly re-confirmed, but `Field` — the primitive backing `InputField`, the flagship text input — rendered its editable content as static text inside a `<div>`, not a real `<input>`. Nothing could actually be typed into it. `Dropdown` had the same problem plus no `tabIndex`, making it unreachable by keyboard. `Textarea` accepted a `state` prop that was never actually applied to any style. All fixed:

- **`Field`'s `default`/`advanced_with_buttons` types now render a real `<input>`, and `textarea` a real `<textarea>`**, for their editable content. `textContent` still works exactly as before for every existing caller (it now maps to the input's `defaultValue`, uncontrolled) — but genuinely accepts typing. New `value`/`onChange`/`placeholder`/`name`/`id`/`readOnly`/`disabled`/`inputRef` props support controlled usage.
- **`InputField`/`DigitInput`/`Textarea` now derive `state` from real interaction when left unset**: focus → `active`, a non-empty value → `filled`, pointer hover → `hover`, otherwise `default`. An explicit `state` (Storybook/playground controls) still overrides — the same pointer/focus-driven-state pattern already applied to `SidebarItem`/`SwitcherItem`/`TabNavItem`/`Link`. `error` and `disabled` can only ever be forced; there's no way to auto-derive a validation error, and disabling is a producer decision.
- **`Dropdown` gained `tabIndex={0}`** (previously completely unreachable by keyboard) and the same real hover/focus-driven `state` resolution for `hover`/`active`.
- **`Textarea`'s `state` prop now actually changes its rendering** — it was previously accepted and stored in `data-state` but never read by any style, so every state looked identical to `field`'s bare default.
- **`DatePicker`'s footer date fields** (the one place in this codebase that fed a Figma-derived, re-rendering value into `Field`) were switched from `textContent` (which only sets the *initial* value — fine for static content, but doesn't resync on re-render) to `value` + `readOnly`, since they're a calendar-driven display rather than free text entry.

## Re-audit pass: Textarea's and Dropdown's own component sets (§16)

Asked directly whether `textarea`/`dropdown`/`digit_input` had gotten the same scrutiny as `input_field` — they hadn't. `textarea` (`66056:19282`) had never been independently pulled via `get_design_context` at all (only its `state` axis was confirmed via `get_metadata`; the implementation reused `field`'s derived default chrome). `dropdown` (`66056:19209`) had only 4 of its 9 states spot-checked. Pulling both fresh found real, confirmed divergences:

- **`Textarea` has its own confirmed geometry**: `radius/border_radius_lg` (16px, not `field`'s 10px) and `py-12/px-16` padding (not `field`'s 8px/10px). Its `error` state reddens the input text itself (`danger-500`) — a genuine divergence from `InputField`'s `error`, which keeps `gray-700` text.
- **`Dropdown`'s full 9-state chrome was resolved in a single fetch**, revealing it was never really identical to `InputField`'s chrome: `default`/`hover`/`default_dark` text is `gray-950` (`InputField`'s own default text is the lighter `gray-700`); `brand` has its own primary-tinted fill + `primary-600` text (previously silently fell back to plain default gray, since `brand` wasn't in the implementation's chrome lookup at all); `active_no_focus` is a genuinely distinct white-fill-plus-outer-shadow look, not "`active` minus its ring" as originally assumed. Padding is `spacing/12` uniform (12px, not 8px/10px); gap is `spacing/6` (6px, not 4px).
- `DigitInput` was already fully confirmed in the original pass and needed no further correction.

`Dropdown` now has its own dedicated chrome table instead of reusing `InputField`'s — forcing one shared table to serve both components was the direct cause of the `brand`/`active_no_focus`/text-color bugs found here.

| Component | Figma set | Confirmed properties |
|---|---|---|
| `InputLabel` | `input_label` | `size`: sm, md |
| `InputHint` | `input_hint` | `size`: sm, md; booleans `hintText`, `leftIcon`, `supportText` (all default `true`) |
| `Field` | `field` | `size`: xl, lg, md, sm (each with its own confirmed metrics, §14); `type`: default, textarea, advanced_with_buttons (each with its own confirmed structure, §14); 9 booleans (`image` default `false`, the other 8 default `true`); instance-swap `selectLeftIcon`/`selectRightIcon` |
| `InputField` | `input_field` | `state`: default, default_dark, hover, filled, active, error, disabled — all 7 now render their own confirmed chrome (§14); booleans `label`, `hint` (default `true`) |
| `Dropdown` | `dropdown` | `state`: 9 values (naked, disabled, error, active, brand, active_no_focus, hover, default_dark, default) — all 9 now confirmed via a single fetch and rendered with their own dedicated chrome table (§16) |
| `Textarea` | `textarea` | `state`: 7-value vocabulary; own confirmed radius/padding/error-text-color, distinct from `field`'s (§16) |
| `DigitInput` | `digit_input` | `state`: same 7-value vocabulary, its own confirmed typography and per-state colors (§14) |
| ~~`DigitField`~~ | `digit_field` | **Not exported in v0.1.0** — Figma has only a bare instance with no confirmed structure |

## This rebuild (§14)

The first deep audit pass confirmed real layout for exactly 2 instances (`field/md/default`, `input_field/active`) — but the resulting implementation then reused that single baseline as a silent fallback for every other size, type, and state, rather than treating the gap as unfinished. A second re-audit pass found the real construction was materially different:

- **`Field` never actually varied by `size`** — `sm`/`lg`/`xl` all rendered identically to `md`. Each size now has its own confirmed height/padding/gap/icon-size/radius/typography.
- **Icon slots never carried the system-wide `elevation/e2` drop-shadow filter** — present on every icon in every Input instance sampled, absent from the code entirely.
- **`Field`'s `type` prop was inert** — `textarea`/`advanced_with_buttons` both silently rendered the `default` structure. They now render their own confirmed layouts: `textarea` is a single text row + resizer glyph; `advanced_with_buttons` composes a bordered "lead" chip and 1-3 real `NewPinkButton` actions (the same solid-pink construction confirmed on the Button family's `new_pink`).
- **`InputField` only looked different at `state="active"`** — the other 6 states rendered `Field`'s bare default look regardless of what they should show. All 7 now render their own confirmed fill/border/ring/text combination — including the confirmed `hover` fill+text two-property shift, and the confirmed `error`/`active` ring-color-reuse detail (same ring, different border color).
- **`Dropdown` only ever rendered one generic look** for all 9 states. It now shares `input_field`'s confirmed chrome for 6 states and renders `naked`'s confirmed distinct (fill-less, shadow-only) treatment.
- **`DigitInput` used the wrong typography scale entirely** — `body_1` (13px/20px) instead of the confirmed `heading_1` (22px/32px SemiBold) — and didn't vary its fill/text/border by state at all.

## What's exactly confirmed vs. derived

**Exactly confirmed** (`docs/audit/input.md` §8, §9, §14):
- `Field`'s confirmed size ramp (sm/md/lg/xl — height, padding, gap, icon size, radius, typography) and its confirmed `default` construction at every size (fill `Color/smoke_med`, `input_inner_shadow`, the 9 booleans and their defaults, `selectLeftIcon`/`selectRightIcon`).
- `Field`'s `textarea` and `advanced_with_buttons` type structures at ALL FOUR sizes (P1 repair pass, independently re-sampled — not just `size="md"`) — resizer glyph placement; lead-chip fill/inset-shadow/asymmetric-radius; the 1-3 solid-pink action buttons.
- `advanced_with_buttons`' lead chip has a THIRD confirmed boolean-gated glyph beyond `leftLead`'s own icon slot (P14 — a fresh re-pull on node 66056:19069): a stacked up/down chevron pair (`leadChevron`, default `true`) marking the chip as a select/dropdown control, rendering the real downloaded glyph (`SelectChevronsIcon` in `@shikho/icons`) by default.
- `InputField`'s full 7-state chrome (§14): `default`/`filled` fill; `hover`'s fill+text shift; `active`/`error`'s shared ring color with distinct border colors; `disabled`'s flat recolor across label, field text, and hint.
- `Dropdown`'s `default`/`default_dark`/`hover`/`error`/`active`/`disabled` states (confirmed to share `InputField`'s exact chrome) and `naked`'s confirmed distinct fill-less/shadow-only treatment.
- `DigitInput`'s confirmed `heading_1` typography and full per-state fill/text/border table, including the same active/error ring-sharing pattern.
- `InputLabel`/`InputHint` text color (`Text/Gray 700`) and horizontal-only `spacing/2` padding, confirmed from the nested rendering inside `input_field`/active.
- The confirmed naming inconsistency in `InputHint`: the prop is named `leftIcon`, but its Figma layer is literally named `right_icon` despite rendering as the row's leading icon (§10) — preserved and documented, not silently corrected.

**Derived, not independently confirmed** (`docs/audit/input.md` §14.4-equivalent gaps):
- `Dropdown`'s `brand`/`active_no_focus` states were not independently sampled; they reuse `active`'s confirmed chrome minus the ring, as the closest confirmed analogue.
- The nested `advanced_with_buttons` action buttons (via `NewPinkButton`) are confirmed to match on fill/radius/text, but their outer-shadow depth is confirmed to differ slightly (single e1 layer vs. `new_pink`'s own confirmed full e2) — not overridden, since doing so would require reaching into Button's internals rather than Input's own component.
- `Textarea` (the standalone `<textarea>` element) has no independent `get_design_context` audit and reuses `Field`'s confirmed default appearance — the least-invented available baseline.
- `Dropdown`'s `autoLayout` prop reflects a confirmed variant axis, but whether it's a real Figma boolean component property or only a variant-name convention remains unconfirmed (§13).
- `DigitField` is **excluded from v0.1.0**: Figma contains only a single bare instance with no variant set, properties, or internal structure, so no faithful implementation is possible. Compose `DigitInput` directly instead.

## Not implemented (by explicit instruction)

- No new states beyond each component's confirmed `state`/variant enum.
- No new properties beyond what the audit confirms (booleans, instance-swap slots, `size`/`type`/`state`).
- No accessibility behavior beyond native HTML semantics (`<label>`, `<textarea>`, native `disabled`/`aria-disabled`) — no ARIA beyond what those elements provide natively.
- No literal "focus" state — the Input family has none (§4); the closest analog, `active`, is implemented as documented above.
- No `success`/`warning` validation states — only `error` exists in the audit (§4).

## Token dependencies

`@shikho/tokens`: `color` (all fill/text/border values are literal ramp steps) and `radius` (`radius.sm`/`md`/`lg`/`xl`, matching the confirmed `radius/custom/*` scale at each `Field` size). `Field`'s `advanced_with_buttons` type composes the real `NewPinkButton` from `@shikho/ui`'s Button family. No typography/spacing/elevation tokens exist in `@shikho/tokens` yet, so confirmed typography/spacing numbers remain hardcoded literals, cited inline, as with Buttons.
