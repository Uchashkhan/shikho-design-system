# Sidebar Navigation Deep Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0", same file as `sidebar-navigation.md`.
**Method:** `get_metadata` and `get_design_context` (via the Figma MCP desktop connection). `sidebar-navigation.md` already included one deep instance audit (`sidebar_item` / `size=lg, type=active_primary_accent, state=hover`); this document extends that with **all 6 confirmed `type` values at `state=default`** (plus the already-audited `hover` for `active_primary_accent` and a newly-audited `hover` for `inactive`), one `sidebar_item_collapsed` instance, and `sidebar_nav` itself.
**Relationship to `sidebar-navigation.md`:** left unmodified as the historical partial-deep-audit record; this document supersedes it for the full type × state color matrix and resolves its own §10 open question about `sidebar_nav`.

---

## 1. Confirmed: `sidebar_nav` is a demo composition, not a primitive

`get_design_context` on `sidebar_nav` (`size=md`) confirms it is **9 stacked `sidebar_item` instances** (1 `active_primary_accent` + 8 `inactive`) in a zero-gap column, inside a simple rounded container — resolving `sidebar-navigation.md` §10's open question. This is not implemented as its own component, consistent with this project's existing treatment of `top_nav`/`tab_nav` as demo compositions rather than primitives.

## 2. Confirmed `sidebar_item` type × state color/typography matrix

All at `size=lg`, root `240×48`, `flex items-center justify-center`, `p-12`, `gap-12`, `radius.lg` (12px):

| `type` | `state=default` fill | text color / weight | tag fill | tag text |
|---|---|---|---|---|
| `active_primary` | `Color/primary_med_em` (`#85a4ff`, ≈primary/400) + `1px outline/Black 150` border | `text/inverse_black_neutral` (white) SemiBold | `Color/primary_base_em` (`#f7fbff`, ≈primary/50) | `text/primary-600` |
| `active_primary_accent` | `Color/primary_base_em_alpha` (`rgba(84,104,255,0.12)`) | `text/primary-600` SemiBold | `Color/primary/500` (solid) | white |
| `active` | `Color/smoke_med` (`#f4f4f6`) | `text/gray-950` SemiBold | `Color/primary/500` (solid) | white |
| `active_neutral` | `Color/inverse_white_neutral` (black) | `text/inverse_black_neutral` (white) SemiBold | `Color/primary/500` (solid) | white |
| `active_neutral_inverse` | `Color/smoke_base` (white) | `text/gray-950` SemiBold | `Color/primary/500` (solid) | white |
| `inactive` | none (transparent) | `text/gray-700` **Medium** (the only type at Medium weight — every `active_*` type is SemiBold) | `Color/gray/100` | `text/gray-600` |

**Confirmed `default → hover` transitions** (2 directly audited):
- `active_primary_accent`: fill intensifies `primary_base_em_alpha` (12%) → `primary_low_em_alpha` (20%) — same token family, higher alpha.
- `inactive`: transparent → `Color/gray-50` (a subtle neutral tint appears only on hover).

The remaining 4 types' hover treatment was not independently re-audited; this implementation derives their hover fill by the same confirmed pattern (either intensify to the next step in the same color family, or introduce a subtle neutral tint when no bg exists at rest) — documented as derived, not directly confirmed, for `active_primary`, `active`, `active_neutral`, and `active_neutral_inverse`.

## 3. Confirmed internal structure (reconfirms `sidebar-navigation.md` §7, adds default-state detail)

```
sidebar_item
├─ left_icon (22×22, conditional — boolean `leftIcon`)
├─ label <p> (flex-1, no wrapper — a confirmed structural simplification vs. switcher_item's text_wrap)
├─ right_icon (24×24, conditional — boolean `rightIcon`) — confirmed asymmetric vs. left_icon (22px), reason unknown
└─ tags (conditional — boolean `tag`) — a confirmed shared Tag sub-component (same ID-range pattern as List's tag)
```
4 confirmed booleans (`leftIcon`, `rightIcon`, `tag`, `text`) + 2 instance-swap slots (`selectLeftIcon`, `selectRightIcon`).

**Root shadow**: only `active_primary`/`active_primary_accent` carry a visible drop-shadow + the `secondary_button_effect`-derived inset overlay; `active` (plain) and `inactive` have no root shadow at all — confirmed, not a rendering gap.

## 4. Confirmed `sidebar_item_collapsed` structure (new — was 0 confirmed variants in the overview)

```
sidebar_item_collapsed — 64×56, flex-col, gap-2, px-4 py-8, radius.md (10px)
├─ icon (22×22, conditional — boolean `icon`)
└─ label (below the icon, centered, caption_1 11px/16px SemiBold)
```
Only 2 booleans (`icon`, `text`) + 1 instance-swap slot (`selectLeftIcon`) — **no `tag`, no `rightIcon`** at all, confirming this is a deliberately reduced variant of `sidebar_item`, not a resize. Confirmed for `type=active_primary_accent`: fill `primary_base_em_alpha` (identical token to the full-size item's own `active_primary_accent`), label `text/primary-600`. The other 5 types were not independently re-audited for the collapsed variant; this implementation reuses the same fill/text mapping confirmed for the full-size `sidebar_item` (§2), documented as a reasonable, low-invention extension since both components share the identical `type` vocabulary.

## 5. Confirmed vs. still-unresolved

**Newly confirmed:**
- The full `type` × `state=default` color/typography matrix (§2) — `sidebar-navigation.md` only had one instance (`active_primary_accent`/`hover`).
- `sidebar_nav` is confirmed a demo composition (§1), not implemented as its own component.
- `sidebar_item_collapsed`'s reduced structure (§4) — was previously 0 confirmed variants.

**Still not confirmed, not invented:**
- Hover fill for `active_primary`, `active`, `active_neutral`, `active_neutral_inverse` — derived from the two confirmed hover examples' pattern, not independently audited (§2).
- Why `left_icon`/`right_icon` differ in size (22 vs. 24px) — confirmed discrepancy, reason unknown (`sidebar-navigation.md` §7).
- Whether the Tag sub-component is genuinely byte-identical to List's Tag, or a separate but similarly-built instance.
- The internal structure of `side_bar`, `side_bar_collapsed`, `side_bar_collapsed_2`, `sidebar_nav_collapsed` — all remain bare, unexpanded instances; not in scope for this deep audit and not implemented.
- No `disabled` state exists on either `sidebar_item` or `sidebar_item_collapsed` — confirmed absence, matching the same gap in `switcher_item`.

## 6. Implementation decision

Two components: `SidebarItem` (the full-size, 3-size navigation row) and `SidebarItemCollapsed` (the reduced icon+label tile). `sidebar_nav` and the four bare instances are not implemented — the former is a confirmed demo composition, the latter have zero confirmed internal structure.
