# Chip

Implements the `chip` component set audited in `docs/audit/chips.md` — the **only** component set in that audit frame (§1), deep-audited at `size=md type=selected state=focus` via `get_design_context` (§9), giving real confirmed structure comparable to Button/Input rather than the overview-only situation Radio/Toggle were in.

## Confirmed vs. derived

**Exactly confirmed** (`docs/audit/chips.md` §9, the `md`/`selected`/`focus` instance):
- 3 boolean properties — `leftIcon`, `rightIcon`, `text` — all default `true`.
- 2 instance-swap properties — `selectLeftIcon`, `selectRightIcon` (`ReactNode | null`, default `null`).
- Layout: root `flex items-center justify-center` (fully centered, not left-aligned), `gap-[spacing/2]` (2px), `p-[spacing/8]` (8px uniform); text wrapper `px-[spacing/2] gap-[spacing/8]`.
- `type="selected"`'s fill (`Color/primary/200`, `#d5e7ff`) and text color (`Text/primary-600`, `#3b4ee3`) — bound directly to the deep-audited instance.
- Radius: `radius/border_radius_round` (1000, full pill) — the **only** radius token anywhere in this component's export (§7, §10).
- No border — confirmed absent.
- Typography: `web/Body/12 Medium` (12px/16px), confirmed applied.
- **Focus mechanism, fully confirmed and unambiguous** (unlike Checkbox/Radio's primary-vs-gray uncertainty): the root's box-shadow at `state=focus` exactly matches `outline/focus_primary`'s definition — `outline/focus_gray` is present in the token pool but the audit explicitly states it was **not** the one bound to this instance (§9, §11). `focusRingColor.primary` from `@shikho/tokens` is used with full confidence.
- `elevation/e2`-matching drop-shadows on the icon slots (not the root) — confirmed (§9).
- **No dedicated selection-indicator (checkmark) or dismiss-control layer exists** — confirmed absence (§5, §9): "the deep audit found no dedicated selection-indicator or dismiss-control layer." None is invented here.
- **Confirmed coverage gap**: `Green`/`Red` types only ever have `state="default"` — no `disabled`/`focus`/`hover`/`drag` variants exist for either (§3, §10).

**Derived — grounded in tokens present in Chip's own export, not independently confirmed per type:**
- `unselected` (`color.gray[100]` fill / `color.gray[700]` text) and `selected_neutral` (`color.gray[200]` fill / `color.gray[700]` text) — Chip's own §8 export lists `Color/gray/50/100/200` and `Text/Gray .../700`, but the audit never inspected whether these two types differ from `selected` only in color or also structurally (§9, §12, explicitly out of scope). This uses the gray tokens Chip's own export already contains, at two different steps to distinguish "unselected" from "selected, but neutral," rather than reusing `selected`'s primary-blue fill for types whose names explicitly say they aren't primary-colored.
- `Green` (`color.success[500]` fill) / `Red` (`color.danger[500]` fill), both with white text — the audit's own §8/§11 flags `Color/success/500`/`Color/danger/500` as a **"plausible but unconfirmed"** mapping for these two type names. This implementation follows that audit-suggested candidate explicitly, rather than inventing an unrelated color — but it remains unconfirmed, not a verified binding.
- `lg` (40px) and `sm` (24px) heights — the audit's own overview-level bounding-box observations, explicitly prefixed with "≈" (approximate) in §4; only `md` (32px) is exactly confirmed via the deep audit. Reproduced as-is, not further rounded or adjusted.

**Explicitly not resolved, and not approximated:**
- `hover`, `drag`, and `disabled` (beyond generic dimming) have no confirmed visual anywhere in the audit (§9 "Not confirmed", §12: "how drag, hover, disabled, and default states render — out of scope, no sibling inference performed"). All three currently render using the same confirmed per-type fill/text as `default`, with `disabled` additionally getting the native `disabled` attribute and a generic opacity reduction — the same pattern used for every other component in this library, not a fabricated per-state design.
- Whether a checkmark asset is swapped into `selectLeftIcon`/`selectRightIcon` for selected chips — the audit explicitly could not confirm this (§9: "whether a checkmark asset is swapped into one of these generic slots ... is not confirmed"). No default checkmark is supplied; the slots stay empty (`null`) unless a consumer provides one.

## Not implemented

- A dedicated selection-indicator or dismiss control — confirmed not to exist as its own layer (§5, §9).
- Real drag-and-drop reordering behavior for `state="drag"` — the state name is confirmed to exist, but nothing about its implementation is (§9, §12).
- `success`/`warning`/`error` validation states — not part of this component's confirmed enum.

## Token dependencies

Only `@shikho/tokens`: `color.primary[200/600]`, `color.gray[100/200/700]`, `color.success[500]`, `color.danger[500]`, `color.white[950]`, `radius.full`, `focusRingColor.primary`, and `elevation.e2` (converted to a CSS `box-shadow` string for the icon slots).
