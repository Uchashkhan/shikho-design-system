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

## 2. Confirmed per-size scaling (re-confirmed via a live `get_design_context` pull on `66081:32109` — all 5 sizes, not just `md`)

Unlike `SwitcherItem`'s and `TopNavItem`'s per-size geometry (both of which turned out to have real bugs from generalizing a single sampled size to all five), `tab_nav_item`'s per-size values were re-checked directly against all 5 size samples and the existing implementation matches exactly — no bugs found here:

| size | gap | padding (top/—/bottom) | icon | font/line-height |
|---|---|---|---|---|
| xs | `spacing/4` (4px) | 2px / 0 / 8px | 14px | `caption_1` 11/16 |
| sm | `spacing/6` (6px) | 4px / 0 / 8px | 16px | `caption_2` 12/16 |
| md | `spacing/8` (8px) | 4px / 0 / 12px | 18px | `body_1` 13/20 |
| lg | `spacing/8` (8px) | 6px / 0 / 16px | 20px | `body_1` 13/20 |
| xl | `spacing/12` (12px) | 8px / 0 / 20px | 24px | `title_2` 18/24 |

Text color and the `active` border-bottom are also confirmed identical across all 5 sizes (no per-size color variation, unlike some other components' shadow treatment).

## 3. Confirmed active-indicator mechanism (reconfirms `tab-navigation.md` §11)

The active tab's `border-bottom: 2px solid outline/b` is the entire indicator mechanism — no separate underline element, no absolute-positioned bar. `outline/b`'s oddly truncated name is preserved verbatim, not corrected (the same "preserve confirmed naming oddities" precedent as Link's spelling typo and Tags' Title Case values).

## 4. Confirmed vs. still-unresolved

**Newly confirmed:** the standalone `tab_nav_item` component set's own `type`×`state` color/border matrix (§1) — the original audit only observed this indirectly through `nav_bar_header`'s nested instances.

**Also fixed:** `state` was previously a static prop with no `onMouseEnter`/`onMouseLeave` — hovering an `inactive` tab did nothing regardless of color correctness, the same interactivity gap already found and fixed on `sidebar_item`/`switcher_item`. Left unset, the real cursor now drives it; an explicit `state` (Storybook/playground controls) still overrides it.

**Still not confirmed, not invented** (all carried over from `tab-navigation.md`):
- Why no `active`+`hover` variant exists.
- Why `tab_nav_item` has zero focus-state coverage.
- Whether `tab_nav` (the standalone 5-variant size-only component set) is a demo composition like `sidebar_nav`, or a real primitive like `switcher` — not directly inspected in either audit. Given `nav_bar_header` is confirmed to compose 5 nested `tab_nav_item` instances directly (not via a `tab_nav` wrapper), and no independent evidence supports `tab_nav` being anything other than a sized demo row (matching `top_nav`/`sidebar_nav`'s confirmed pattern), it is not implemented here.
- `nav_bar_header`'s own web/mobile responsive differences (`tab-navigation.md` §11) — not re-implemented as part of this component; `TabNavItem` is the confirmed, reusable primitive.

## 5. Implementation decision

One component, `TabNavItem` — the confirmed standalone primitive. `tab_nav` and `nav_bar_header` are not implemented: `tab_nav` for the same "likely demo composition" reasoning already applied to `sidebar_nav`/`top_nav`, and `nav_bar_header` because it composes a specific page-header layout (title + tabs) that is more of a page template than a reusable design-system primitive — consumers can compose `TabNavItem` directly into their own header layout.
