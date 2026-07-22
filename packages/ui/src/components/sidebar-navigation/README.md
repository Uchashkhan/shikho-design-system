# Sidebar Navigation

Implements `sidebar_item` and `sidebar_item_collapsed`. `sidebar-navigation.md` (the original audit) already included one deep instance audit (`size=lg, type=active_primary_accent, state=hover`) — this deep re-audit (`docs/audit/sidebar-navigation-deep-audit.md`) extends that to all 6 confirmed `type` values, adds `sidebar_item_collapsed`'s structure (previously 0 confirmed variants), and resolves whether `sidebar_nav` is a real primitive.

## What's implemented, and what isn't

- **`SidebarItem`** — the full-size navigation row (3 sizes, 6 types, 2 states).
- **`SidebarItemCollapsed`** — the confirmed reduced icon-over-label tile (no size axis, no tag, no right icon).
- **`sidebar_nav` is not implemented.** Deep-audited and confirmed to be a demo composition — 9 stacked `sidebar_item` instances in a zero-gap column — not a primitive, consistent with this project's existing treatment of `top_nav`/`tab_nav`.
- **`side_bar`, `side_bar_collapsed`, `side_bar_collapsed_2`, `sidebar_nav_collapsed` are not implemented.** All remain bare, unexpanded Figma instances with zero confirmed internal structure.

## Confirmed vs. derived

**Exactly confirmed** (`docs/audit/sidebar-navigation-deep-audit.md` §2-§4):
- The full `type`×`state=default` color/typography matrix for all 6 types, including the confirmed asymmetric icon sizing (22px left icon vs. 24px right icon — a genuine, unexplained discrepancy) and the confirmed shared Tag sub-component.
- **`inactive` is the only type at Medium font-weight** — every `active_*` type is SemiBold.
- Two confirmed `default → hover` transitions: `active_primary_accent` intensifies from 12% to 20% primary alpha; `inactive` gains a subtle `gray-50` fill only on hover (it has no fill at rest).
- `SidebarItemCollapsed`'s confirmed reduced structure: only 2 booleans (`icon`, `text`), no `tag`, no `rightIcon` — a deliberately simpler component, not a resize.

**Derived, documented as such:**
- Hover fill for `active_primary`, `active`, `active_neutral`, and `active_neutral_inverse` was not independently audited — derived by the same "intensify one step" pattern confirmed on the other two types.
- `SidebarItemCollapsed`'s fill/text mapping for 5 of its 6 types reuses `SidebarItem`'s own confirmed §2 matrix (only `active_primary_accent` was independently confirmed for the collapsed variant) — a low-invention extension since both components share the identical `type` vocabulary.
- Rendered as a real `<button>` — a sidebar nav row is fundamentally a navigation control, the same functional-necessity reasoning applied throughout this library.

## Usage

```tsx
import { SidebarItem, SidebarItemCollapsed } from "@shikho/ui";

function Nav() {
  return (
    <SidebarItem type="active_primary_accent" selectLeftIcon={<HomeIcon />}>
      Dashboard
    </SidebarItem>
  );
}
```

## Not implemented

- `sidebar_nav` — confirmed demo composition, not a primitive.
- The four bare Figma instances (`side_bar` and its variants) — zero confirmed internal structure.
- Any `disabled` state — confirmed absent from both component sets.

## Token dependencies

`@shikho/tokens`: `color.primary`, `color.gray`, `color.black`, `color.white`, `radius.sm/md/lg`, and `elevation.e2` (used inside a CSS `filter: drop-shadow()` pair, the same pattern confirmed on Link, Date Picker, Modal, and Pagination's icon slots).
