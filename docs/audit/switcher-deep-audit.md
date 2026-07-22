# Switcher Deep Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0", same file as `switcher.md`.
**Method:** `get_metadata` and `get_design_context` (via the Figma MCP desktop connection). `switcher.md` already included one deep instance audit (`switcher_item` / `size=lg, type=active_primary_accent, state=hover`); this document extends that with the other 4 `type` values at `size=lg, state=default`, plus the `switcher` container itself.
**Relationship to `switcher.md`:** left unmodified as the historical partial-deep-audit record.

---

## 1. Confirmed: `switcher` is a real composed container, not a demo — unlike `sidebar_nav`

Unlike Sidebar Navigation's `sidebar_nav` (confirmed to be a pure demo composition of `sidebar_item` instances, see `sidebar-navigation-deep-audit.md` §1), `get_design_context` on `switcher`/`size=sm` confirms a genuine, distinct **container** component:

```
switcher — bg Color/gray-100, border 1px Color/gray-100, radius/custom/lg (12px), padding spacing/4 (4px all sides), gap spacing/8 (8px)
└─ switcher_item-shaped children, one per segment, each independently rounded (radius/custom/sm at this size)
```

**This resolves `switcher.md` §4/§8/§11's own flagged mystery**: `switcher`'s outer bounding box is confirmed 8px taller than `switcher_item`'s at every size step, despite identical size labels. The reason is now confirmed: the container applies its own `padding: spacing/4` (4px top + 4px bottom = 8px) around an otherwise **unchanged** inner item height — not a different item scale, just a wrapping container's own padding.

`Switcher` is implemented as a real composed component here (a segmented-control container rendering multiple items), the same treatment already given to `ButtonGroup` — not a demo, in contrast to `sidebar_nav`.

## 2. Confirmed `switcher_item` type × state=default color/typography matrix

All at `size=lg`, root `h-48`, `flex items-center justify-center`, `px-16 py-12`, `gap-8`, `radius.lg` (12px):

| `type` | fill | border | text | shadow |
|---|---|---|---|---|
| `active_primary` | `Color/primary_med_em` (`#85a4ff`, primary/400) | `1px outline/Black 150` | white SemiBold | confirmed 2-layer |
| `active_primary_accent` | `primary_base_em_alpha` (12%) → `primary_low_em_alpha` (20% on hover) | none | `text/primary-600` SemiBold | none (icons only) |
| `active` | `Color/smoke_em` (white) | none | `text/gray-950` SemiBold | confirmed 2-layer |
| `active_neutral` | `Color/inverse_white_neutral` (black) | none | white SemiBold | confirmed 2-layer |
| `inactive` | none (transparent) | none | `text/gray-600` **SemiBold** | none |

**Confirmed genuine difference from `sidebar_item`** (despite the near-identical `type` vocabulary): `switcher_item`'s `inactive` is **SemiBold** at `text/gray-600`; `sidebar_item`'s `inactive` is **Medium** at `text/gray-700` — two structurally similar sibling components with a confirmed, real typography/color divergence at the one type they'd most likely be expected to match.

**Confirmed `default → hover`:** only `active_primary_accent` was directly re-audited at both states (12% → 20% alpha, identical mechanism to `sidebar_item`). The other 4 types' hover treatment is derived by the same pattern, not independently confirmed.

## 3. Confirmed internal structure

```
switcher_item
├─ left_icon (20×20 at size=lg, conditional — boolean `leftIcon`)
├─ text_wrap → label (conditional — boolean `text`)
└─ right_icon (20×20 at size=lg, conditional — boolean `rightIcon`)
```
3 confirmed booleans (`leftIcon`, `rightIcon`, `text`) + 2 instance-swap slots (`selectLeftIcon`, `selectRightIcon`). **No nested component dependency** — icons are plain vector images, unlike `list`'s embedded Checkbox. Simpler than `sidebar_item`: no `tag` slot at all.

## 4. Confirmed vs. derived per-size scaling

Only `size=lg` (icon 20px, `body_1`/13px/20px typography, `px-16 py-12`) was directly deep-audited for the standalone `switcher_item`. The `switcher` container's own `size=sm` sample additionally confirms: item height 32px (matching `switcher_item`'s own confirmed `sm` metadata height), **16px icons**, and **`caption_2` (12px/16px) typography** — both smaller than `lg`'s values, consistent with the confirmed `sizing/icon/14, 16, 18, 20, 24` token ramp (exactly 5 steps for exactly 5 sizes).

**Derived, not independently confirmed for every size:** the full xs/sm/md/lg/xl icon-size and typography ramp is built from these two confirmed anchor points (`lg`=20px/body_1, `sm`=16px/caption_2) plus the confirmed 5-step icon token ramp, interpolated for `xs`/`md`/`xl` — the least-invented mapping available, not independently audited at every step.

## 5. Implementation decision

Two components: `SwitcherItem` (the individual segment/item, matching `sidebar_item`'s architecture but with its own confirmed independent type/state matrix and no `tag` slot) and `Switcher` (the confirmed real container, composing multiple items with the container's own confirmed padding/gap/radius) — unlike `sidebar_nav`, which is not implemented at all.
