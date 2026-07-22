# Switcher

Implements `switcher_item` and `switcher`. `switcher.md` already included one deep instance audit (`size=lg, type=active_primary_accent, state=hover`) — this deep re-audit (`docs/audit/switcher-deep-audit.md`) extends that to the other 4 types, and — critically — confirms `switcher` itself is a **real composed container**, unlike Sidebar Navigation's `sidebar_nav` (confirmed to be a pure demo).

## What's implemented

- **`SwitcherItem`** — the individual segment (5 sizes, 5 types, 2 states).
- **`Switcher`** — the confirmed real segmented-control container, composing multiple items (the same "compose, don't duplicate" treatment already given to `ButtonGroup`).

## Confirmed vs. derived

**Exactly confirmed** (`docs/audit/switcher-deep-audit.md`):
- `switcher` is a real container — `bg gray-100`, `border gray-100`, `radius.lg`, `padding: spacing/4`, `gap: spacing/8` — not a demo. This **resolves `switcher.md`'s own flagged mystery**: the container's bounding box is 8px taller than `switcher_item`'s at every size step purely because of this 4px top+bottom padding, not a different inner item scale.
- The full `type`×`state=default` color/typography matrix for all 5 types.
- A confirmed genuine divergence from `SidebarItem` at the one type they'd most plausibly match: `switcher_item`'s `inactive` is **SemiBold** at `gray-600`; `SidebarItem`'s is **Medium** at `gray-700`.
- `SwitcherItem` has no `tag` slot at all — confirmed simpler than `SidebarItem`.
- The confirmed `default → hover` transition for `active_primary_accent` (12% → 20% primary alpha) — identical mechanism to `SidebarItem`.

**Derived, documented as such:**
- Only `size=lg` was directly deep-audited for icon size/typography/padding. The `switcher` container's own `size=sm` nested sample additionally confirms 16px icons and `caption_2` typography at that size — the full `xs`/`md`/`xl` scale is interpolated between these two confirmed anchor points using the confirmed 5-step `sizing/icon/14,16,18,20,24` token ramp, not independently audited at every step.
- Hover fill for `active_primary`, `active`, and `active_neutral` is derived by the same "intensify one step" pattern confirmed for `active_primary_accent`.

## Usage

```tsx
import { Switcher } from "@shikho/ui";

function ViewToggle() {
  const [value, setValue] = useState("day");
  return (
    <Switcher
      value={value}
      onChange={setValue}
      options={[
        { label: "Day", value: "day" },
        { label: "Week", value: "week" },
        { label: "Month", value: "month" },
      ]}
    />
  );
}
```

## Not implemented

- Any `disabled` state — confirmed absent from `switcher_item`.

## Token dependencies

`@shikho/tokens`: `color.primary`, `color.gray`, `color.black`, `color.white`, `radius.lg`, and `elevation.e2` (used inside a CSS `filter: drop-shadow()` pair, the same pattern confirmed throughout this library).
