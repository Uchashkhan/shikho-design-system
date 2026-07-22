# Tab Navigation

Implements `tab_nav_item`. `tab-navigation.md` (the original audit) already included a full deep audit of `nav_bar_header`, confirming it composes 5 nested `tab_nav_item` instances — but that only observed `tab_nav_item`'s own styling indirectly. This deep re-audit (`docs/audit/tab-navigation-deep-audit.md`) adds the standalone component's own confirmed `type`×`state` matrix.

## What's implemented, and what isn't

- **`TabNavItem`** — the confirmed standalone primitive, the simplest and least-featured nav component in this library.
- **`tab_nav` is not implemented** — very likely a demo composition (size-only, width scales steeply while height matches `tab_nav_item` exactly), the same reasoning already applied to `sidebar_nav`.
- **`nav_bar_header` is not implemented** — it composes a specific page-header layout (title + tab row) that's more of a page template than a reusable primitive; consumers can compose `TabNavItem` directly into their own header.

## Confirmed vs. derived

**Exactly confirmed** (`docs/audit/tab-navigation-deep-audit.md`):
- `tab_nav_item` has the smallest type vocabulary (`inactive`, `active`) and the most restrictive state coverage (no `focus` at all, and **no `active`+`hover` combination exists**) of any nav component in this library.
- **Confirmed genuinely simpler hover mechanism than every sibling nav component**: `tab_nav_item`'s hover only darkens the inactive text color (`gray-600 → gray-700`) — no background fill exists at any type/state combination, unlike `SwitcherItem`/`SidebarItem`, both of which intensify a fill on hover.
- The active-tab indicator is purely a `border-bottom: 2px solid outline/b` (resolves to black) — no separate underline element.
- Confirmed `18×18` icons and `pt-4 pb-12 px-0` padding at `size=md`.

**Derived, documented as such:**
- Icon size for `xs`/`sm`/`lg`/`xl` is interpolated from the confirmed 5-step `sizing/icon` token ramp, the same approach already used for `SwitcherItem` and `SidebarItem`.
- Padding is applied uniformly across all 5 sizes — only `size=md` was directly confirmed.
- Inactive renders a `2px solid transparent` border-bottom (rather than `none`) so switching between active/inactive doesn't shift layout — a standard, low-invention implementation detail, not a Figma-confirmed value.

## Usage

```tsx
import { TabNavItem } from "@shikho/ui";

function Tabs() {
  const [active, setActive] = useState("account");
  return (
    <div style={{ display: "flex", gap: 28 }}>
      <TabNavItem type={active === "account" ? "active" : "inactive"} onClick={() => setActive("account")}>
        Account
      </TabNavItem>
      <TabNavItem type={active === "security" ? "active" : "inactive"} onClick={() => setActive("security")}>
        Security
      </TabNavItem>
    </div>
  );
}
```

## Not implemented

- `tab_nav` — likely a demo composition, not a primitive.
- `nav_bar_header` — a page-header template, not a reusable primitive.
- Any `focus` state — confirmed absent.

## Token dependencies

`@shikho/tokens`: `color.gray`, `color.black`, and `elevation.e2` (used inside a CSS `filter: drop-shadow()` pair, the same pattern confirmed throughout this library).
