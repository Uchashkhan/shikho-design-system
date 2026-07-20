# Input

Implements the 7 Input component sets + 1 bare instance audited in `docs/audit/input.md`. Unlike Buttons, two nodes here were deep-audited via `get_design_context` — `input_field/active` (§8) and `field/md/default` (§9) — giving real confirmed layout, padding, gaps, booleans, and instance-swap slots, not just enum names.

| Component | Figma set | Confirmed properties |
|---|---|---|
| `InputLabel` | `input_label` | `size`: sm, md |
| `InputHint` | `input_hint` | `size`: sm, md; booleans `hintText`, `leftIcon`, `supportText` (all default `true`) |
| `Field` | `field` | `size`: xl, lg, md, sm; `type`: default, textarea, advanced_with_buttons; 9 booleans (`image` default `false`, the other 8 default `true`); instance-swap `selectLeftIcon`/`selectRightIcon` |
| `InputField` | `input_field` | `state`: default, default_dark, hover, filled, active, error, disabled; booleans `label`, `hint` (default `true`) |
| `Dropdown` | `dropdown` | `state`: 9 values (naked, disabled, error, active, brand, active_no_focus, hover, default_dark, default); `autoLayout` |
| `Textarea` | `textarea` | `state`: same 7-value vocabulary as `input_field` |
| `DigitInput` | `digit_input` | `state`: same 7-value vocabulary |
| `DigitField` | `digit_field` | none — a bare, unaudited single instance |

## What's exactly confirmed vs. derived

**Exactly confirmed** (`docs/audit/input.md` §8, §9) and used as literal ground truth:
- `Field` at `size="md" type="default"`: root `flex items-center`, `gap-[spacing/4]`, padding `py-[spacing/8] px-[spacing/10]`; `radius/custom/md` (10px); fill `Color/smoke_med` (== `Color/gray/100`); `input_inner_shadow` (`inset 0 1px 3px Color/black/50`); icons 18×18 (`sizing/icon/18`); typography `web/Body/13 Medium` (13px/20px); the 9 confirmed booleans and their exact confirmed defaults; the confirmed `selectLeftIcon`/`selectRightIcon` instance-swap slots (`ReactNode | null`, default `null`).
- `InputField` at `state="active"`: nested field fill `Color/smoke_base` (white), border `outline/Secondary 300` (`#f681d7`), and a focus ring numerically identical to `outline/focus_secondary` (`0 0 0 3px Color/Secondary/500_alpha_24`) — this ring is a real, correct binding in the Input family (unlike the confirmed `focus_danger` bug elsewhere), so no correction was needed here.
- `InputLabel`/`InputHint` text color (`Text/Gray 700`) and horizontal-only `spacing/2` padding, both confirmed from the nested rendering inside `input_field`/active.
- The confirmed naming inconsistency in `InputHint`: the prop is named `leftIcon`, but its Figma layer is literally named `right_icon` despite rendering as the row's leading icon (§10) — preserved and documented, not silently corrected.

**Derived, not independently confirmed** — everything else in the family has zero confirmed visual data (§13: "how `field`'s size/type properties change structure beyond md/default" and "how `input_field`'s other six states differ from active" are both explicitly out of scope):
- `Field` accepts all 4 confirmed `size` values and all 3 confirmed `type` values, but only `md`/`default` has real layout numbers — the other combinations currently render identically to `md`/`default` rather than a fabricated scale.
- `InputField`'s 6 non-`active` states (`default`, `default_dark`, `hover`, `filled`, `error`, `disabled`) render using `Field`'s own confirmed default appearance as a neutral baseline, since none of them has independently confirmed styling. `disabled` additionally gets `aria-disabled` and the native `disabled` attribute on its inner controls.
- The audit found the nested `field` inside `input_field`/active uses `radius/custom/lg` (12px) and `w-full`, while the standalone `field` uses `radius/custom/md` (10px) and a fixed width (§11) — a confirmed, unexplained discrepancy between the two contexts. This implementation intentionally uses one `Field` component with its own confirmed `radius/custom/md` consistently in both places, rather than forking an undocumented second radius value.
- `Dropdown`, `Textarea`, and `DigitInput` have no `get_design_context` deep audit at all — only their `state` variant axis is confirmed. They reuse `field`'s confirmed default appearance (radius, fill, inner shadow, typography) as the least-invented available baseline, explicitly documented per-component as a derived reuse, not an independent binding. `Textarea`/`DigitInput` render as real `<textarea>`/`<input>` elements — the only reasonable HTML mapping for their names, not a visual guess.
- `Dropdown`'s `autoLayout` prop reflects a confirmed variant axis, but the audit could not confirm whether it corresponds to a real Figma boolean component property or is only encoded in the variant name (§13) — exposed as a prop regardless, since the axis itself is real.
- `DigitField` is confirmed to be a single bare instance with **no captured properties or structure**, and its relationship to `DigitInput` is explicitly flagged as "not investigated" (§13). This implementation does not invent a multi-cell layout for it — it renders `children` if supplied, or a single `DigitInput` as the most minimal non-invented placeholder.

## Not implemented (by explicit instruction)

- No new states beyond each component's confirmed `state`/variant enum.
- No new properties beyond what §2, §8, and §9 confirm (booleans, instance-swap slots, `size`/`type`/`state`).
- No accessibility behavior beyond native HTML semantics (`<label>`, `<textarea>`, native `disabled`/`aria-disabled`) — no ARIA beyond what those elements provide natively.
- No literal "focus" state — the Input family has none (§4); the closest analog, `active`, is implemented as documented above.
- No `success`/`warning` validation states — only `error` exists in the audit (§4).

## Token dependencies

Only `@shikho/tokens`: `color` (all fill/text/border values above are literal ramp steps — `color.gray[100]`, `color.gray[700]`, `color.gray[950]`, `color.primary[500]`, `color.secondary[300]`, `color.secondary[500]`, `color.white[950]`, `color.black[50]`) and `radius` (`radius.md` = 10, matching the audit's `radius/custom/md`; `radius.lg` = 12, matching `radius/custom/lg`). No typography/spacing/elevation tokens exist in `@shikho/tokens` yet, so the confirmed `web/Body/13 Medium` (13px/20px) and the confirmed spacing numbers (gap/padding) are hardcoded literals, as with Buttons.
