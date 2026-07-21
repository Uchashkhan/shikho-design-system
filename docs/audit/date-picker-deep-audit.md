# Date Picker Deep Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0", same file as `date-picker.md`.
**Method:** `get_metadata` and `get_design_context` (via the Figma MCP desktop connection) against all four confirmed variant instances: `type=range,size=lg` (`66083:34379`), `type=range,size=md` (`66083:34507`), `type=single,size=lg` (`66083:34635`), `type=single,size=md` (`66083:34705`), plus `get_screenshot` on `range/lg` and `single/md` for visual confirmation.
**Relationship to `date-picker.md`:** That audit was explicitly overview-only — its own method note states `get_design_context` was deliberately not used. This document supersedes it for internal structure while leaving its `type`/`size`/bounding-box findings intact (they are reconfirmed, not contradicted, below). `date-picker.md` is left unmodified as the historical overview-only record; this file is the deep structural audit that the original scope excluded.

**Why the previous `@shikho/ui` implementation was a placeholder:** it was built strictly from `date-picker.md`, which only exposed `type`×`size` and four bounding-box numbers — by its own admission, no internal layer structure was inferred. The component that resulted was consequently just an empty, fixed-size, styled `<div>`. This document replaces that gap with the actual confirmed internal hierarchy.

---

## 1. Root variants — reconfirmed

Exactly `type` (`range`, `single`) × `size` (`lg`, `md`) = 4 variants, matching `date-picker.md` §2–§3 exactly. Root styling, newly confirmed via `get_design_context` on all four instances:

- Fill: `Color/smoke_base` (white, `color.white[950]`).
- Border: `1px solid outline/Gray 100` (`#f4f4f6`, matches `color.gray[100]`).
- Radius: `radius/border_radius_xxl` = **24px** (not `20px`/`radius["2xl"]` as the placeholder assumed — `border_radius_xxl` is a distinct, larger token; `@shikho/tokens`' `radius["3xl"]` = 24 is the correct match).
- Shadow: exactly `elevation/e4`'s 4-layer stack (`(0,32,32,-16)`, `(0,6,6,-3)`, `(0,3,3,-1.5)`, `(0,1,1,-0.5)`) — this reconfirms `date-picker.md` §9's own finding that `e4` was first fully resolved here, and cross-validates the placeholder's choice of `elevation.e4` for the shell shadow.

## 2. Single vs. range — confirmed structural difference (not just width)

- **`type=single`**: exactly **one** `date_wrap` calendar panel. No divider.
- **`type=range`**: exactly **two** `date_wrap` calendar panels side by side, separated by an 8px-wide `divider_vertical` column containing a 1px vertical line asset.
- Each panel is fully self-contained: its own `navigator` (prev/next + month label) and its own 5-row day grid. In `range`, the two panels' navigators are **independent** — each has its own prev/next controls (not a single shared pair), meaning each calendar panel can move to a different month independently of its sibling. (Default relative positioning — e.g. right panel = left panel + 1 month — is a UX convention, not a Figma-confirmed constraint; not enforced by the audited layers themselves.)

## 3. md vs. lg — confirmed composition differences

| | `size=lg` | `size=md` |
|---|---|---|
| Presets sidebar width | 200px | 160px |
| Calendar day-cell width | 48px | 40px |
| Day-cell height | 40px (both) | 40px (both) |
| Weekday header row width | 336px (7×48) | 280px (7×40) |
| Calendar week rows | 5 (both sizes, both types) | 5 |

The confirmed 408px vs. 352px (`lg` vs. `md`) height difference from `date-picker.md` §3 is **not** an extra calendar week row (both sizes render 5 week rows) — it comes from the larger sidebar/cell dimensions and (not independently isolable from the static frame) internal padding. This audit does not force a literal fixed pixel height in the real component (see §12).

## 4. Presets sidebar — confirmed present in all 4 variants

A permanent left column (`sidebar_nav`), **not conditional on `type`** — present identically in `single` and `range`, `lg` and `md`. Confirmed content, in order, all 7 items (`get_design_context` on `single/md` returns all 7 in the layer tree even though the screenshot visually clips the 7th — see below):

1. Today
2. Last 7 days
3. Last 14 days
4. Last 30 days
5. Last 3 months
6. Last 12 months
7. All time

Each `sidebar_item`: `40px` height, `px-16 py-8` padding, `gap-12`, `radius/custom/md` (10px), full width, text `Text/Gray 700` (`color.gray[700]`), `web/Body/13 Medium` (13px/20px/500). Sidebar itself: `border-right: 1px solid outline/Gray 100`, rounded top-left/bottom-left `radius/border_radius_lg` (16px), `padding-top: spacing/8` only.

**Confirmed visual clipping at `single/md`, not a missing preset:** the screenshot at `single/md` shows only 6 of the 7 items before the sidebar is visually cut off by the shell's fixed height — the 7th (`All time`) exists in the layer tree (confirmed via `get_design_context`, same node structure as `lg`) but renders outside the visible frame in that specific static demo. This is a genuine constraint of a fixed-height static Figma frame, not a confirmed "7th preset doesn't exist at md" design decision. The real component makes the sidebar independently scrollable so all 7 presets stay reachable at any size (see §12 — a deliberate deviation from the literal clipped rendering, not an invented feature).

## 5. Calendar header (`navigator`)

Per panel: `prev` button, centered month/year label, `next` button, `padding: spacing/16` all sides.
- Nav buttons: `40×40`-ish (`px-12 py-8`), `radius/custom/md` (10px), filled `Color/gray/100`, containing an `18×18` icon with `elevation/e2`-style drop-shadow, plus the confirmed 2-layer inset overlay (`inset 0px 1px 3px -2px white/50`, `inset 0px -1px 3px -2px black/7`) — this exact 2-layer inset combination recurs throughout this component (see §8) and matches the inner-shadow half of `secondary_button_effect` (confirmed in `buttons.md`), applied here without its outer 2 drop-shadow layers.
- Month/year label: `web/Title/18 Semibold`-equivalent (18px/24px/600, `Title 2` scale), `Text/Gray 950`.

## 6. Weekday row

7 labels, `SUN MON TUE WED THU FRI SAT`, uppercase, `overline` typography (11px/16px, weight 500 — the same `font/size/overline` token `date-picker.md` §8 flagged as newly-bound-but-speculative; this deep audit confirms it **is** the day-of-week header's typography), color `Text/Gray 400` (`color.gray[400]`), each cell `48px` (`lg`) / `40px` (`md`) wide matching the day-cell grid below it.

## 7. Calendar grid — 5 rows × 7 columns, confirmed

Each day cell: a `button`-named node, `px-12 py-8`, `radius/custom/md` (10px) by default, containing one `text_wrap` (`px-4`) wrapping the day number, `web/Body/13 Semibold` (13px/20px/600).

**Important structural finding:** the day-cell `button` nodes carry **plain, locally-scoped node IDs** (`66083:34405`, etc.), not the `I<parentId>;<componentId>` nested-instance ID pattern that `alert.md`/`toasts.md`/`button-group.md` confirmed for genuine nested Button-family instances. **The day cells, nav arrows, and footer Cancel/Set Date buttons are locally-drawn frames, not confirmed nested instances of any specific `@shikho/ui` Button family member.** (This differs from the footer date-display fields — see §10 — which *do* structurally and token-for-token match the `Input` family's own `field`/`input_field` naming and styling.)

## 8. Day-cell visual states — confirmed from the `range/lg` instance (Nov 7 → Dec 12 selected)

Every state below was read directly off rendered cells in the `range/lg` screenshot and cross-checked against the code:

| Cell role | Radius | Fill | Text | Border | Shadow |
|---|---|---|---|---|---|
| Default (current month, unselected) | `radius/custom/md` all corners (inert — no bg) | none | `Text/Gray 700` | none | none |
| Adjacent-month (leading/trailing) | none | none | `Text/Gray 400` | none | none |
| **Absolute range start** | left corners only (`bl`+`tl`) | solid `Color/primary/500` | `text/white-950` | `1px outline/Black 150` | full `primary_button_effect`-equivalent (2 inset layers, matching the Set Date CTA's own overlay exactly) |
| **Absolute range end** | right corners only (`br`+`tr`) | solid `Color/primary/500` | `text/white-950` | `1px outline/Black 150` | same as range start |
| Row-segment start (Sunday, mid-range, not the absolute start) | left corners only | `Color/primary/500_alpha_12` | `text/primary-600` | none | 2-layer inset (`white/50` + `black/7`, the same combo as §5's nav buttons) |
| Row-segment end (Saturday, mid-range, not the absolute end) | right corners only | `Color/primary/500_alpha_12` | `text/primary-600` | none | same 2-layer inset |
| Range middle (neither row-start nor row-end nor absolute start/end) | none | `Color/primary/500_alpha_12` | `text/primary-600` | none | same 2-layer inset |
| **Single selection** (`type=single`) | **all 4 corners** (`radius/custom/md`) | solid `Color/primary/500` | `text/white-950` | `1px outline/Black 150` | same as range start/end |

This confirms a genuine, deliberate "row-segmented pill" range-rendering pattern (visible directly in the `range/lg` screenshot: Nov 7 is rounded only on the left since it's mid-week, Nov 9 gets its own right-corner rounding purely because it's the last cell of *its calendar row* — not because it's the range end, which is Dec 12). Single selection is visually equivalent to "both start and end at once" — a full rounded pill.

**Not confirmed by any of the four instances:** hover and disabled cell states. None of the four static frames shows either. `date-picker.md` §2 already confirmed the component-set level exposes **no `state` property at all**; this deep audit adds that no example instance shows a hover- or disabled-styled day cell either. **Not invented here** as a distinct visual (see §12).

## 9. Range highlight direction

Both examples read left-to-right, earliest-to-latest (Nov 7 → Dec 12). No reversed-range (end date picked before start date) example exists in any instance. The real component normalizes any two picked dates into `{start, end}` by chronological order — a functional necessity, not a Figma-confirmed visual, documented as derived.

## 10. Footer — genuine, confirmed per-variant differences

- **`type=range`**: two date-display fields + a `TO` label between them (`overline` typography, uppercase, `Text/Gray 400`). Confirmed literal display format: `DD / MM / YYYY` (e.g. `07 / 11 / 2024`).
- **`type=single`**: exactly **one** date-display field, no `TO` label.
- **Date-display fields are a confirmed match to the `Input` family's own `field`/`input_field` components** — not just similar tokens, but identical layer naming (`data-name="input_field"` wrapping `data-name="field"`) and an exact token match: `radius/custom/md` (10px), fill `Color/gray-100`, text `Text/Gray 700` `web/Body/13 Medium`, and — critically — the exact `input_inner_shadow` effect (`inset 0px 1px 3px 0px Color/black/50`) that `date-picker.md` §9/§12 could only speculate was "plausibly real". This deep audit **confirms** it.
- **CTAs**: `Cancel` (fill `Color/gray/100`, text `Text/Gray 700`, 2-layer inset shadow) and `Set Date` (fill `Color/primary/500`, text `text/white-950`, `1px outline/Black 150` border, full inset-overlay shadow — the exact same visual treatment confirmed on range-start/range-end/single-selected day cells in §8, meaning this component reuses one consistent "primary pill" treatment across its CTA and its selected-date cells).
- **Genuinely confirmed footer layout difference at `type=single, size=md` specifically** (not a general `size=md` rule — `range/md` still shows its two date fields + `TO`, confirmed via a separate `get_design_context` call): the date-display field is entirely absent, and Cancel/Set Date both carry `flex-[1_0_0]`, stretching to fill the footer's full width edge-to-edge. This is a one-off, deliberately confirmed combination, not extrapolated to any other size/type pairing.

## 11. Nested components / instance-swap properties

- **No confirmed nested Button-family instance** anywhere in `date_picker` (see §7) — unlike Alert/Toast's confirmed `button_danger` dependency.
- **A confirmed structural/token match to the Input family's `field`/`input_field`** for the footer date-display fields (see §10) — the strongest evidence of intentional reuse found in this audit, even without a literal `I<parent>;<componentId>` instance reference (Figma's own metadata layer for these nodes is a locally-drawn frame using the same name and token set, not a linked instance).
- No instance-swap (image-replacement) properties were found on any node.

## 12. Confirmed vs. unresolved — summary, and implementation decisions

**Exactly confirmed**, used directly:
- All dimensions, radii, colors, typography, and shadow values quoted in §1–§10 above.
- The 7 preset labels (§4), the `DD / MM / YYYY` date format (§10), and the row-segmented range-highlight algorithm (§8).

**Not confirmed by any Figma instance, and NOT visually invented — implemented as plain functional behavior only, using already-established system conventions:**
- **Hover** on day cells / nav buttons / preset items: no confirmed hover example exists. The real component applies the same `Color/gray/100` resting fill already confirmed on the nav buttons (§5) as a hover affordance on interactive elements that have no fill by default (day cells, preset items) — this is the same "reuse an already-confirmed value from elsewhere in this exact component" reasoning applied throughout this library, not a fabricated new color.
- **Disabled dates**: no confirmed visual exists anywhere in the audit. The real component exposes a purely functional `isDateDisabled` prop (`aria-disabled` + `pointer-events: none` + the same `opacity: 0.5` convention already used by every other disabled control in this library — Button, Checkbox, Chip) — not a new invented color or border.
- **Preset date-range math** ("Last 7 days" = today − 6 days → today, etc.): Figma confirms only the label text, never date arithmetic (out of scope for a visual audit by definition). Implemented using the ordinary, unambiguous interpretation of each label; documented as derived, not confirmed.
- **The exact vertical padding breakdown that produces 408px vs. 352px** (§3): not isolable from a static frame. The real component does not hardcode either total height — it hugs its content (sidebar height matches calendar height naturally; a month needing a 6th week row will simply be one row taller) rather than forcing a fixed pixel box that would either clip a real 6-row month or leave dead space on a 4-row month. This is a deliberate improvement over reproducing the literal static-frame pixel height, consistent with this task's explicit instruction not to preserve placeholder behavior that doesn't reflect how a working date picker must behave.
- **Independent panel navigation in `range` mode**: confirmed each panel has its own nav controls (§2); the *default* relative offset (right panel = left panel + 1 month) is a UX convention applied on first render, not a Figma-confirmed rule — the component still lets each panel move independently after that, matching what's actually confirmed.

**Explicitly out of scope, not implemented:**
- Any month/year "jump" picker (clicking the label) — no such control exists in any instance.
- Time selection — still no evidence anywhere, consistent with `date-picker.md` §7.
- Adjacent-month day cells are rendered inert (no click handler) — Figma shows them structurally as plain `button` nodes with no distinguishing "disabled" attribute, so their intended interactivity is genuinely ambiguous; treating them as display-only is the least-invented reading, not a confirmed behavior.

## 13. Proposed component architecture

```
DatePicker                     (public component; controlled/uncontrolled value + month state)
├── presets sidebar            (internal; DATE_PICKER_PRESETS, only rendered when `presets` !== false)
├── CalendarPanel × 1 or 2     (internal; one per `type=single`, two per `type=range`)
│   ├── header                 (prev/next nav + month/year label)
│   ├── weekday row             (SUN..SAT)
│   └── day grid                (5 rows × 7 columns of day cells, row-segmented range styling)
└── footer                     (Field-based date display, conditionally hidden; Cancel/Set Date CTAs)
```

This matches the architecture proposed in the task brief. The only deviation: `CalendarHeader`/`WeekdayRow`/`CalendarGrid`/`CalendarDay` are implemented as internal render functions/sub-components within one file (`date_picker.tsx`) plus a pure-logic `date-utils.ts`, rather than separate exported components — none of them have any confirmed standalone existence as their own Figma component set (unlike, say, `Checkbox` inside `List`), so they are not part of the public `@shikho/ui` API, consistent with the task's instruction not to expose Figma-only internal structure as public API surface.

**Reuse decisions:**
- Footer date-display fields reuse the real `Field` component from the `Input` family (§10/§11 — the strongest-evidenced reuse candidate in this audit).
- Cancel/Set Date reuse the real `GreyscaleButton` (`type="Secondary"`) and `NewBlueButton` (`type="Primary"`) components respectively, with a `style` override layering in this audit's own newly-confirmed exact padding/radius/shadow (the same "compose + style-merge override" pattern already established by `Toast`'s use of `ButtonDanger`) — chosen per this task's explicit instruction to reuse existing Button primitives, even though no literal nested-instance reference was confirmed for these specific nodes (§7).
- Day cells and nav arrows are **not** composed from any Button family member — no confirmed nesting relationship exists, and their exact geometry (row-segmented range corners, 40/48px grid cells) has no equivalent in any existing Button variant. They are implemented as plain native `<button>` elements using this audit's own confirmed tokens directly, the same "implement inline when composition isn't confirmed" precedent already established by Alert's second action button and corner close button.
