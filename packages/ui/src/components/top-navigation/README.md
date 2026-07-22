# Top Navigation

Implements `top_nav_item`. The original overview audit (`docs/audit/top-navigation.md`)
deliberately skipped `get_design_context`, so it never confirmed internal structure or the actual
type × state color matrix — only variant counts and token names. A deep re-audit
(`docs/audit/top-navigation-deep-audit.md`) fetched all 12 reachable variants directly at
`size=md` and confirms the full matrix.

## What's implemented

- **`TopNavItem`** — all 7 confirmed `type` values (`active_primary`, `active_primary_accent`,
  `active`, `active_neutral`, `active_outline`, `inactive`, `inactive_outline`), all 5 confirmed
  `size` values, and `state` (`default`/`hover`, plus `focus` on the 5 types that have it).
- **`top_nav` (the bare Figma instance) is not implemented** — confirmed to be a demo composition
  (a fixed row of `top_nav_item` instances), not a primitive — same precedent as `SidebarItem`'s
  `sidebar_nav` and `TabNavItem`'s `tab_nav`.

## Confirmed vs. derived

**Exactly confirmed** (`docs/audit/top-navigation-deep-audit.md`):
- The full type × state color/border/text matrix — fetched directly for all 12 reachable variants
  at `size=md`, not interpolated.
- Every `active_*` type's `focus` state **drops the inset `special_drop` shadow** and replaces it
  with an outer ring (`focusRingColor.primary` or `.gray` depending on type) — a genuine confirmed
  behavior, not assumed.
- `inactive`/`inactive_outline` confirmed to have **no `focus` state at all**.
- The full 5-step size scale (height, radius, gap, padding, icon size), read directly from the
  `top_nav` container's own per-size rendering.
- No badge, counter, or separator slot exists anywhere in `top_nav_item`.

**Derived, documented as such:**
- Typography pixel sizes at `xl`/`lg`/`sm`/`xs` were read from the `top_nav` container fetch
  rather than independently re-confirmed via a dedicated `top_nav_item` fetch at each size.
- The inset `special_drop` shadow reuses this codebase's existing literal
  (`inset 0px 1px 3px -2px white/50, inset 0px -1px 3px -2px rgba(0,0,0,0.07)`), already
  established in `SidebarItem`/`SwitcherItem`, instead of the raw 0.04/0.04 figures Figma quotes
  for the same effect — an existing project decision, not a new approximation.

## Usage

```tsx
import { TopNavItem } from "@shikho/ui";

function Nav() {
  return (
    <>
      <TopNavItem type="active_primary">Home</TopNavItem>
      <TopNavItem type="inactive">Explore</TopNavItem>
    </>
  );
}
```

## Not implemented

- `top_nav` (the bare instance) — confirmed a demo composition, not a primitive.
- Badges, counters, separators — none exist as confirmed slots.

## Token dependencies

`@shikho/tokens`: `color.primary/gray/black/white`, `color.focusRingColor`, `radius.sm/md/lg/xl`,
`elevation.e2` (icon-slot drop-shadow filter).
