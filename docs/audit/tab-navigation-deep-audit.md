# Tab Navigation Deep Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0", same file as `tab-navigation.md`.
**Method:** `get_metadata` and `get_design_context` (via the Figma MCP desktop connection). `tab-navigation.md` already included a full deep audit of `nav_bar_header` (both `device=web` and `device=mobile`), confirming its composition of 5 nested `tab_nav_item` instances. This document adds the standalone `tab_nav_item` component set's own confirmed `type`×`state` matrix, which the original audit only observed indirectly through those nested instances.
**Relationship to `tab-navigation.md`:** left unmodified as the historical record; this document adds the missing standalone-component confirmation.

---

## 1. Confirmed `tab_nav_item` type × state matrix (new — the standalone component set, not just nested instances)

At `size=md` (h-40px):

| `type` / `state` | border | text |
|---|---|---|
| `active` / `default` (no `hover` variant exists — confirmed absence) | `border-bottom: 2px solid outline/b` (resolves to black) | `text/gray-950` SemiBold |
| `inactive` / `default` | none | `text/gray-600` SemiBold |
| `inactive` / `hover` | none | `text/gray-700` SemiBold (darker — the only hover effect confirmed: a text-color darken, no background fill at all) |

This confirms `tab_nav_item` is genuinely simpler in its hover mechanism than every sibling nav component: `switcher_item`/`sidebar_item` intensify a *background fill* on hover; `tab_nav_item` only darkens its *text color* — consistent with `tab-navigation.md` §4's own observation that tabs use a simpler monochrome model.

Both `left_icon`/`right_icon` are confirmed `18×18` at `size=md`; padding is confirmed `pt-4 pb-12` (asymmetric, to accommodate the active indicator's `border-bottom` sitting flush at the box edge), `px-0` (no horizontal padding — inter-tab spacing comes entirely from the parent's own `gap`, confirmed in `tab-navigation.md` §11 for `nav_bar_header`'s nested `tab_nav`).

## 2. Confirmed vs. derived per-size scaling

Only `size=md` was directly deep-audited for icon size. `tab-navigation.md` §7 confirms a 5-step `sizing/icon/14,16,18,20,24` token set exists — the same ramp already used to interpolate `SwitcherItem`'s and `SidebarItem`'s per-size icon scale — applied here identically: `xs`=14, `sm`=16, `md`=18 (confirmed), `lg`=20, `xl`=24. Padding (`pt-4 pb-12`) is applied uniformly across all 5 sizes, since no per-size padding data was confirmed and this is the least-invented option (reusing the one confirmed value), the same reasoning already applied to `SwitcherItem`'s per-size padding.

## 3. Confirmed active-indicator mechanism (reconfirms `tab-navigation.md` §11)

The active tab's `border-bottom: 2px solid outline/b` is the entire indicator mechanism — no separate underline element, no absolute-positioned bar. `outline/b`'s oddly truncated name is preserved verbatim, not corrected (the same "preserve confirmed naming oddities" precedent as Link's spelling typo and Tags' Title Case values).

## 4. Confirmed vs. still-unresolved

**Newly confirmed:** the standalone `tab_nav_item` component set's own `type`×`state` color/border matrix (§1) — the original audit only observed this indirectly through `nav_bar_header`'s nested instances.

**Still not confirmed, not invented** (all carried over from `tab-navigation.md`):
- Why no `active`+`hover` variant exists.
- Why `tab_nav_item` has zero focus-state coverage.
- Whether `tab_nav` (the standalone 5-variant size-only component set) is a demo composition like `sidebar_nav`, or a real primitive like `switcher` — not directly inspected in either audit. Given `nav_bar_header` is confirmed to compose 5 nested `tab_nav_item` instances directly (not via a `tab_nav` wrapper), and no independent evidence supports `tab_nav` being anything other than a sized demo row (matching `top_nav`/`sidebar_nav`'s confirmed pattern), it is not implemented here.
- `nav_bar_header`'s own web/mobile responsive differences (`tab-navigation.md` §11) — not re-implemented as part of this component; `TabNavItem` is the confirmed, reusable primitive.

## 5. Implementation decision

One component, `TabNavItem` — the confirmed standalone primitive. `tab_nav` and `nav_bar_header` are not implemented: `tab_nav` for the same "likely demo composition" reasoning already applied to `sidebar_nav`/`top_nav`, and `nav_bar_header` because it composes a specific page-header layout (title + tabs) that is more of a page template than a reusable design-system primitive — consumers can compose `TabNavItem` directly into their own header layout.
