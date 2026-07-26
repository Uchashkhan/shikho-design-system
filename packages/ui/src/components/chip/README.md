# Chip

Implements the `chip` component set audited in `docs/audit/chips.md` — the **only** component set in that audit frame (§1). Originally deep-audited at one instance (`size=md type=selected state=focus`, §9); a second re-audit pass (§13, 11 more `get_design_context` calls) then confirmed the real per-type, per-state visual construction that the first pass's implementation had been silently guessing at.

## This rebuild (§13)

The first deep audit confirmed one instance and the resulting implementation reused its fill/text/radius as a fallback for every other type, rendering every non-`focus` state identically regardless of `type`. A second pass found the real construction was materially different:

- **`unselected`'s fill was assumed to be `gray/100`.** Confirmed real: plain white with a `black/50`(4%) border and an inset shadow — none of which existed in the pre-rebuild code.
- **`selected` was assumed to have no border.** Confirmed real: a `primary/400` border on both `default` and `hover`.
- **`selected_neutral`'s text was assumed to equal `unselected`'s (`gray/700`).** Confirmed real: `gray/950` — genuinely distinct, not a duplicate.
- **`hover` had no distinct visual for any type.** Confirmed real: `unselected` lightens to `gray/50`; `selected` darkens to `primary/300`.
- **`disabled` had no distinct visual.** Confirmed real: flat `gray/100` fill, no border, `gray/400` text — and, for `selected` specifically, a confirmed **SemiBold** weight, a genuine one-off change from every other state's Medium.
- **`drag` was not implemented at all.** Confirmed real (sampled on `unselected`): fill darkens one step, border is kept, and the resting inset is replaced by a 5-layer outer shadow identical to `elevation.e5`.
- **Icon slots had no real shadow.** The confirmed `elevation/e2` drop-shadow was applied as a CSS `boxShadow` on the icon's own empty bounding box (a rectangular shadow), not the confirmed `filter: drop-shadow()` used everywhere else in this system for the identical effect — a genuine rendering bug.

## Confirmed vs. derived

**Exactly confirmed** (`docs/audit/chips.md` §9, §13 — 12 sampled instances total):
- 3 boolean properties (`leftIcon`, `rightIcon`, `text`) and 2 instance-swap properties (`selectLeftIcon`, `selectRightIcon`), all at their confirmed defaults.
- Layout: root `flex items-center justify-center`, `gap-[spacing/2]`, `p-[spacing/8]` uniform; text wrapper `px-[spacing/2] gap-[spacing/8]`; radius `radius/border_radius_round` (the only radius token in this export).
- `unselected` at `default`/`hover`/`disabled`/`drag`; `selected` at `default`/`hover`/`disabled`; `selected_neutral` at `default`; `Green`/`Red` at `default` — every fill, border, text color, and font weight documented in `chip.tsx`'s `CHIP_VISUAL` table is cited to a directly-rendered instance.
- The focus mechanism: `outline/focus_primary` (`focusRingColor.primary`), confirmed exactly for `type="selected"`.
- `elevation/e2`-matching drop-shadows on icon slots, now implemented as `filter: drop-shadow()` (§13 correction).
- **No dedicated selection-indicator (checkmark) or dismiss-control layer exists** — confirmed absence (§5, §9). None is invented here.
- **Confirmed coverage gap**: `Green`/`Red` types only ever have `state="default"` — passing any other state value renders their one confirmed look unchanged, not an unconfirmed guess.

**Derived, not independently confirmed** (`docs/audit/chips.md` §13):
- `selected`/`selected_neutral`'s own `drag` states — derived from `unselected`'s confirmed drag pattern (fill one step darker, border kept, e5-equivalent outer shadow), keeping each type's own confirmed text color.
- `selected_neutral`'s `hover`/`disabled` states — derived from the same family pattern (one step darker on hover, flat gray with no border on disabled), keeping this type's own confirmed `gray/950` text.
- `unselected`/`selected_neutral`/`Green`/`Red`'s `focus` ring color uses `focusRingColor.gray` as the nearest confirmed analogue — only `selected`'s ring color was independently confirmed.
- `lg` (40px) and `sm` (24px) heights — confirmed exactly via a second metadata pass (§14 of the original audit's own bounding-box data); `md` (32px) remains the only size with a full `get_design_context` structural sample.

## Not implemented

- A dedicated selection-indicator or dismiss control — confirmed not to exist as its own layer (§5, §9).
- Real drag-and-drop reordering behavior for `state="drag"` — the visual is now confirmed and implemented; the interaction itself is a consumer concern, not part of this component.
- `success`/`warning`/`error` validation states — not part of this component's confirmed enum.

## Token dependencies

`@shikho/tokens`: `color.primary[200/300/400/600]`, `color.gray[50/100/200/700/950]`, `color.black[50/150]`, `color.success[500]`, `color.danger[500]`, `color.white[50/950]`, `radius.full`, `focusRingColor.primary/gray`. The `elevation.e5`-equivalent drag shadow and the icon-slot drop-shadow filter are hardcoded literals (no elevation/effect token category exists in `@shikho/tokens` yet), cited inline to their confirmed source.
