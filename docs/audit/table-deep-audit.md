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

---

## 7. Fresh re-audit addendum — corrections found on re-inspection (this pass)

The `TableCell` implementation was already built from this deep audit and was structurally sound (real `Checkbox`/`Tags` reuse, correct type/state branching, correct skeleton loading row) — unlike Button/Input/Chip/Tags/Checkbox/Radio/Toggle in this session, it was never falling back to unstyled native rendering. Re-running `get_design_context` fresh on all 4 `state=default` variants (not trusting the existing padding/size/typography values without re-checking them) found several concrete, previously-unconfirmed or wrong values:

1. **`header_compact`'s padding is now independently confirmed** (`pt-4 pb-12 px-12`) — it happened to exactly match what the original deep audit had only *derived* by scaling `header`'s padding the same way `default`→`default_compact` scales. No implementation change needed here, just an upgrade from "derived" to "confirmed."
2. **`default_compact`'s root gap is confirmed 8px, genuinely narrower than `default`'s 12px** — the prior implementation used a single `header ? 6px : 12px` gap, applying `default`'s 12px to `default_compact` too. **Fixed.**
3. **The header family's avatar slot (`leadItemSm`) is confirmed fixed at 24px for BOTH `header` and `header_compact`** — it does not scale down between the two the way `default`'s 3-slot xs/sm/md table scales into `default_compact`'s. The prior implementation instead applied `default`'s own xs/sm/md size table to header types, so requesting `avatar={{ size: "sm" }}` on a `header` cell produced a wrong 32px avatar instead of the confirmed 24px. **Fixed** — header-family avatars now always render at a fixed 24px regardless of the `avatar.size` value passed.
4. **The header family's single left/right icon is confirmed 18px at `header`, 16px at `header_compact`** — the header family has no icon-*group* concept at all (only ever one `left_icon` + one `right_icon1`), unlike `default`/`default_compact`'s optional 2-icon groups. The prior implementation applied `default`'s icon-*group* size (20px/18px) to header icons, and used 18px uniformly for both header and header_compact (missing header_compact's confirmed 16px). **Fixed.**
5. **`header_compact`'s heading_top row is confirmed `caption_2` (12px/16px)** — every other type (`header`, `default`, `default_compact`) uses `body_1` (13px/20px) for this row; only `header_compact` genuinely shrinks its text. The prior implementation hardcoded 13px/20px for every type. **Fixed.**
6. **`default`/`default_compact`'s heading text is confirmed Medium (500) weight, not SemiBold** — only `header`/`header_compact`'s heading `<p>` carries an explicit SemiBold override; `default`/`default_compact`'s heading inherits the `text_group`'s own Medium(500) default instead. The prior implementation hardcoded `fontWeight: 600` for every type's heading. **Fixed** — heading is now `600` only for the header family, `500` for `default`/`default_compact`.
7. **`tag1`/`tag2` are confirmed to match the shared `Tags` component's own `md` size** (24px height, `radius.sm`=8, 6px/4px padding) — the prior implementation passed `size="sm"` to the nested `Tags`, which renders at 20px height with a `radius.xs`=6 and 0px vertical padding, not matching `table_cell`'s own confirmed tag construction at all. **Fixed.**
8. **The confirmed system-wide "special_drop" 2-layer inset shadow (`inset 0px 1px 3px -2px ${color.white[50]}, inset 0px -1px 3px -2px rgba(0,0,0,0.07)` — the exact string already used by Chip/Tags/DatePicker/Modal/Pagination/SidebarItem/TopNavItem for this same token) applies to the `dropdown` field's background, NOT to `icon_button`.** The prior implementation had this backwards: `icon_button` had this shadow applied (it's confirmed to have none at all), while `dropdown` only had a single, differently-colored, single-layer shadow instead of the real 2-layer effect. **Fixed** — the shadow moved from the action `icon_button` to the `dropdown` field, using the project's own established `restingInsetShadow` constant that was already defined in this file but misapplied.

**Not changed:** `secondary`/`primary_light` as the `Tags` `type` mapping for `tag1`/`tag2` (colors were already correct); the `Checkbox` nested dependency (`size="sm"`, unchanged); the confirmed skeleton loading row; the `header`/`default` structural branching itself.
