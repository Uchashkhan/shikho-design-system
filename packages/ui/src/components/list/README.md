# List

Implements the `list` component set audited in `docs/audit/list.md`. This is the first **composed** component in the library — it nests the real `Checkbox` component (`@shikho/ui`'s checkbox module) rather than reimplementing checkbox visuals.

## Architecture (checked against the audit, not assumed)

`docs/audit/list.md` §1–§2 confirms `list` is **one component set** exposing exactly two properties, `size` (md, lg, xl) and `state` (default, hover, active_primary_accent) — no `type` property. There is no wrapping "List container" component and no separate "ListItem" child component anywhere in the audit; `list` itself *is* the single row. `drop_menu` (also in the same Figma frame) is an unrelated bare instance with zero confirmed structure and is **not** implemented here. This is why the package has one file, `list.tsx`, exporting one component, `List` — not a `List`/`ListItem` pair.

## Confirmed vs. derived

**Exactly confirmed** (`docs/audit/list.md` §7, deep-audited at `size="lg" state="active_primary_accent"`):
- Root layout: `flex items-center justify-center`, `gap-[spacing/12]` (12px), `p-[spacing/12]` (12px uniform).
- Root fill `Color/Gray` (`#ebecf0`, unnumbered — matches `color.gray[200]`), bottom-only divider border `outline/Gray 100` (`#f4f4f6` — matches `color.gray[100]`), and **no corner radius at all** — a confirmed absence, reproduced as an explicit `borderRadius: 0`.
- The 12 confirmed boolean properties and their exact defaults, inferred directly from the deep-audited instance's `[rendered]`/`[NOT rendered]` annotations: `leadIcon`, `leadItem`, `leftIcon`, `rightIcon`, `tag`, `text`, `textGroup1`, `description1`, `textGroup2`, `trailText`, `description2` all default `true`; `leadItemLg` defaults `false`.
- The confirmed instance-swap properties `selectLeftIcon`/`selectRightIcon` (`ReactNode | null`, default `null`).
- Typography: main text 13px/20px Medium (`Text/Gray 950`); both descriptions 12px/16px Medium (`Text/Gray 600`); trailing text same 13px/20px scale as main text but `Text/Gray 700`; tag text 11px/16px SemiBold (`Text/Gray 700`).
- `tags` element: `outline/black-50` border, `Color/white/950` fill, `radius/custom/sm` (8px).
- **The confirmed nested Checkbox dependency**: `leadIcon` renders a real Checkbox at `shape="square" size="sm"` — the audit explicitly flags the boolean's name as a mismatch (`leadIcon` controls a checkbox, not a generic icon), preserved here rather than renamed.
- **The state-name/fill discrepancy**: the state is named `active_primary_accent`, but its only confirmed fill is plain gray, with no primary-brand color anywhere in the confirmed bindings. This implementation does not tint anything primary-blue for this state — reproducing the discrepancy faithfully rather than "fixing" it into something the name implies but the audit doesn't support.

**Derived, not independently confirmed** — the audit explicitly marks these out of scope (§7 "Not confirmed / unresolved", §9):
- Whether `default`/`hover` states, or `md`/`xl` sizes, differ structurally from the one confirmed `lg`/`active_primary_accent` instance. They render using that same confirmed visual as a shared baseline rather than an invented per-variant design.
- `leadItem`/`leadItemLg`'s real image content — confirmed to be plain `<img>` layers, not confirmed nested Avatar instances (§7). No default `src` is supplied; nothing renders unless a consumer passes `leadItemSrc`/`leadItemLgSrc`.
- `special_drop`'s inset shadow on the `tags` element — **explicitly not implemented**. `docs/audit/input.md` §6 gives this effect's second layer an exact color (`Color/white/50`), but its first layer's color, `neutral_transparent_Black/Black 4`, has **no confirmed hex value anywhere in any audit file** (only "Black 7", "Black 12", and "Black 24" were ever resolved to hex elsewhere). Per the strict source-of-truth rule, this shadow is left out entirely rather than guessed from the nearby percentage-literal pattern.
- No default text content is supplied for `text`/`description1`/`trailText`/`description2`/`tagContent` — the audit's own confirmed instance has a placeholder-content bug (the right-side description literally repeats the trailing text's placeholder, §7), so reproducing *that specific string* as this component's default would encode a known Figma authoring mistake as if it were real API behavior.

## How Checkbox is reused

`List` imports `Checkbox` directly from the sibling `../checkbox` module (the established internal pattern — also re-exported from the `@shikho/ui` package root) and renders `<Checkbox size="sm" shape="square" {...checkboxProps} />` when `leadIcon` is true. `size`/`shape` are fixed to the one confirmed nested configuration and are intentionally excluded from `checkboxProps`'s type, so a consumer cannot accidentally request an unconfirmed nested size/shape combination. No checkbox border/fill/radius/focus-ring styling is re-declared in `list.tsx` — every checked/unchecked/indeterminate/disabled/focus behavior comes from `Checkbox` itself (requirement 8). This also means there is no circular dependency: `checkbox.tsx` has no knowledge of `list.tsx`.

## Not implemented

- `drop_menu` — a bare, unexpanded instance with zero confirmed structure (§1, §6).
- Any `disabled`/`selected`/`error`/`focus` state on `List` itself — none exist in the confirmed `state` enum (§2, §6). The composed Checkbox's own confirmed disabled/checked states are still reachable via `checkboxProps` and are demonstrated in Storybook.
- `special_drop`'s tag inset shadow (see above — unresolved color reference).
- Real Avatar/Radio/Badge components in the `leadItem`/`leadItemLg` slots — not confirmed to exist (§7, §9).

## Token dependencies

Only `@shikho/tokens`: `color.gray[100/200/600/700/950]`, `color.black[50]`, `color.white[950]`, and `radius.sm`. No typography/spacing/elevation tokens exist yet, so the confirmed 12px/13px typography and spacing numbers are hardcoded literals, consistent with Button/Input/Checkbox. `Checkbox`'s own token usage (documented in its own README) is not duplicated here.
