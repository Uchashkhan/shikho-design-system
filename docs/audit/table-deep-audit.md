# Table Deep Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0", same file as `table.md`.
**Method:** `get_metadata` and `get_design_context` (via the Figma MCP desktop connection) against 4 of `table_cell`'s 8 confirmed variants: `header/default` (`66084:36289`), `default/default` (`66084:36311`), `default_compact/default` (`66084:36338`), and `default/loading` (`66084:36334`).
**Relationship to `table.md`:** That audit was explicitly overview-only. This document supersedes it for internal structure, resolving nearly every item in its own §5/§14 open-questions list.

---

## 1. Confirmed: `table_cell` is a very rich composed cell — not a simple two-property leaf

`table.md` §12 speculated `table_cell`'s "zero boolean properties in this metadata" meant a simple component. **This deep audit confirms the opposite**: `table_cell` exposes roughly 25 boolean/instance-swap properties, resolving nearly all of `table.md` §5's open questions at once:

| `table.md` §5 question | Confirmed answer |
|---|---|
| Row selection / checkboxes | **Yes** — a real nested `Checkbox` component instance (`checkbox/theme_light/sm/square/unchecked/default`), the identical dependency already confirmed for `List`. |
| Avatars | **Yes** — 3 confirmed circular image slots (`leadItemXs`/`Sm`/`Md`), structurally identical to this library's own `Avatar` `type="image"` (object-cover, `radius.full` applied directly to the image). |
| Tags/chips | **Yes** — 2 confirmed `tags`-named slots, same ID-range pattern as `List`'s and `SidebarItem`'s shared Tag sub-component. |
| Actions | **Yes** — a confirmed `dropdown` slot and a confirmed `icon_button` slot. |
| Sorting, column alignment, pagination, expandable rows, status indicators, sticky headers | **Still not confirmed** — none of these appear anywhere in the 4 audited instances. |

## 2. Confirmed `type` structure — `header` vs. `default`

```
table_cell (type=header, header_compact)
├─ leadIcon (checkbox, conditional)
├─ leadItemSm (24×24 avatar-style image, conditional — no Xs/Md slots on header types)
├─ left_icon (18×18, conditional)
├─ text_group → heading_top (heading text/SemiBold + "• Supporting text"/Medium, both muted gray-600) — no description line
└─ right_icon1 (18×18, conditional)

table_cell (type=default, default_compact)
├─ leadIcon (checkbox, conditional)
├─ leadItemXs / leadItemSm / leadItemMd (3 avatar-style image size slots — all 3 confirmed present simultaneously in the audited instance)
├─ left_icon_group (2 icons, conditional) then left_icon (single, conditional)
├─ text_group → heading_top (heading/SemiBold gray-950 + "• Supporting text"/Medium gray-600) + description (caption_2, gray-600)
├─ right_icon1 / right_icon2 (single icons) then right_icon_group (2 icons)
├─ tag1 (gray/100 fill) / tag2 (primary/500_alpha_12 fill) — both reusing the confirmed shared Tag styling
├─ dropdown (a Field-shaped control: smoke_med fill, radius.sm, chevron icon, confirmed genuine `input_inner_shadow`-style application)
└─ icon_button (40×40, radius.md, single icon)
```

**Confirmed: `header` types have no `description` line and only one avatar slot (`leadItemSm`)** — a genuinely simpler structure than `default`/`default_compact`, not just a text-color difference.

## 3. Confirmed `default` vs. `default_compact` scaling

| | `default` | `default_compact` |
|---|---|---|
| Padding | `px-16 py-8` | `px-12 py-4` |
| Avatar sizes (xs/sm/md) | 24/32/40 | 20/24/32 |
| Icon sizes | 24 (large slots) / 20 (grouped slots) | 20 / 18 |
| Row height (confirmed dimensions) | 56px | 44px |

Same content structure, confirmed uniformly smaller at every dimension — a genuine density variant, not a different composition (unlike `header` vs. `default`, which do differ structurally).

## 4. Confirmed `state=loading` — a real skeleton row, not a dimmed/spinner treatment

```
table_cell (state=loading)
├─ loader (32px circle, radius.full) — a skeleton placeholder for the leading avatar/checkbox area
├─ loader (24px circle, radius.full) — a second skeleton circle
└─ loader (flex-1, 16px tall bar, radius.full) — a skeleton text-line placeholder, filling remaining width
```

This resolves `table.md` §2/§14's open question about what `loading` actually renders: a **skeleton-loading row** (circle + circle + full-width bar), not the cell's real content dimmed or a spinner overlay. This is a genuinely different composition per state, mirrored here as a separate render branch.

## 5. Confirmed vs. still-unresolved

**Newly confirmed** (resolving nearly all of `table.md` §5/§14's questions):
- The full internal structure for both `type` families and both `state` values (§2-§4).
- The real nested `Checkbox` dependency (identical to `List`'s).
- `input_inner_shadow`-style application on the `dropdown` slot, resolving `table.md`'s own uncertainty about `special_drop`/effect application.

**Still not confirmed, not invented:**
- Sorting, column alignment, pagination, expandable rows, status indicators, sticky headers — none appear in any audited instance.
- `header_compact` was not independently re-audited; its structure is derived from `header`'s confirmed structure scaled down by the same `default`→`default_compact` ratio (§3).
- Whether the audited instance's "all 3 avatar slots + both tags + no dropdown/icon_button" combination reflects a genuinely confirmed default, or is simply a spec-sheet instance turned on to illustrate every optional slot at once. This implementation treats it as the latter — a real table row would not usually show 3 avatars in one cell — and defaults every optional slot to hidden, requiring explicit opt-in per slot. This is a derived interpretation in the interest of real usability, not a literal reproduction of the audited instance's overridden defaults.
- The `table` bare instance's own internal composition (rows, headers, toolbar, pagination) — still not expanded; not implemented, consistent with the existing "don't implement unconfirmed compositions" precedent (`sidebar_nav`, `tab_nav`).

## 6. Implementation decision

One component, `TableCell`, covering both confirmed `type` families and both `state` values via explicit render branches (not one shared layout awkwardly toggling structural differences). Reuses the real `Checkbox`, `Tags`, and `Avatar` components internally for their confirmed nested dependencies; the `dropdown` and `icon_button` slots are implemented inline with `table_cell`'s own confirmed exact values (padding/radius) rather than composing the Input family's own `Dropdown` component, whose confirmed radius (`radius.md`=10) doesn't match `table_cell`'s own confirmed `radius.sm`=8. `table` (the bare instance) is not implemented.
