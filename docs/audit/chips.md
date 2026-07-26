# Chips Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0"
Frames audited:
- `Chips` overview (node `66075:28761`), containing a single component set
- Deep instance audit: `chip` / `📐 size=md, ☘️ type=selected, 💡 state=focus` (node `66075:28900`), via `get_design_context`

Method: `get_metadata` and `get_variable_defs` for the overview; `get_design_context` (explicitly authorized) for the deep instance audit. Each finding is marked with its source.
Status: **Audit only.** No code, components, or project configuration were generated. No variable, style, or layer names were renamed or normalized.

---

## 1. Component set and node ID

| Name | Node ID |
|---|---|
| `chip` | `66075:28779` |

(Plus an unrelated `overview_sheet_sidebar` instance, `66075:28762`.) **This is the only component set in the entire selection** — no additional demo compositions or bare instances, consistent with the sparse single-set pattern seen in Tooltips, Alerts, and Toasts.

---

## 2. Exposed properties and variant values

`chip` exposes three: **`size`** (lg, md, sm), **`type`** (unselected, selected, selected_neutral, Green, Red), **`state`** (disabled, focus, hover, drag, default).

**Confirmed casing inconsistency within `type`:** `unselected`, `selected`, `selected_neutral` are lowercase, while `Green` and `Red` are capitalized.

**`drag` is a new state value**, not seen in any prior audit in this series — plausible for drag-and-drop chip reordering.

---

## 3. Variant count and coverage gap

**51 variants total**, confirmed against the full symbol list:

| Size | unselected | selected | selected_neutral | Green | Red | Subtotal |
|---|---|---|---|---|---|---|
| lg/md/sm (each) | 5 states | 5 states | 5 states | 1 state (default only) | 1 state (default only) | 17 |

17 variants per size × 3 sizes = 51. **Confirmed coverage gap:** `Green`/`Red` types only ever appear with `state=default` — no `disabled`, `focus`, `hover`, or `drag` variants exist for either.

---

## 4. Sizes, states, types

- **Sizes:** `lg` (≈101×40), `md` (≈82×32), `sm` (≈68×24).
- **States:** `disabled, focus, hover, drag, default` — only fully available for `unselected`/`selected`/`selected_neutral` (§3).
- **Types:** `unselected, selected, selected_neutral, Green, Red` — `Green`/`Red` function as fixed-color "tag-like" themes, distinct from the interactive selection trio.

---

## 5. Whether labels, leading icons, trailing icons, counters, selection indicators, and dismiss controls are exposed as properties (overview-level)

**None appear as top-level variant properties** — only `size`/`type`/`state`. The `selected`/`selected_neutral`/`unselected` type values implied a selection-indicator might exist internally — **the deep audit found no dedicated selection-indicator or dismiss-control layer**, only generic icon slots (§9).

---

## 6. True component set vs. demo composition

**`chip` is a true, atomic component set** — 51 variants spanning size/type/state. No demo compositions or bare instances exist in this selection.

---

## 7. Typography, spacing, radius, border, elevation, and effect tokens (overview-level)

```
Typography:
web/Title/22 Semibold, web/Title/76 Semibold, web/Title/32 Medium   ← likely unrelated spillover
web/Body/13 Medium, web/Body/12 Medium, web/Body/12 Semibold,
web/Body/11 Medium, web/Body/11 Semibold                            ← plausible per-size chip label tokens;
                                                                        web/Body/12 Medium confirmed applied in the deep audit

Spacing: 2, 4, 6, 8, 12, 16, 24, 32, 40, 48

Radius: radius/border_radius_round = 1000   ← the ONLY radius token present, confirmed as the chip's actual
                                                radius in the deep audit; no radius/custom/* tokens at all
radius/border_radius_xl = 20   radius/border_radius_5xl = 40   radius/border_radius_8xl = 64

Outline: outline/Black 50/100/150/300     outline/Gray 300/400

Effects:
elevation/e2 = (confirmed 2-layer, identical to prior audits — confirmed applied to icons in the deep audit)
elevation/e5 = (confirmed 5-layer, identical to prior audits)
secondary_button_effect = (confirmed 4-layer, identical to Buttons audit — likely spillover)
special_drop = (confirmed 2-layer, identical to the Input/List audits)
primary_special_outline = ""     secondary_special_outline = ""   ← both still unresolved, consistent

outline/focus_gray    = Effect(type: DROP_SHADOW, color: outline/Gray 300, offset: (0,0), radius: 0, spread: 3)
outline/focus_primary = Effect(type: DROP_SHADOW, color: outline/primary_alpha, offset: (0,0), radius: 0, spread: 3)
  ← outline/focus_primary CONFIRMED as the exact mechanism for the chip's `focus` state in the deep audit (§9)

sizing/icon/14, 16, 18   ← 16 confirmed applied in the deep audit
```

---

## 8. Color and semantic tokens (overview-level)

```
Text/Gray 400/600/700/950     Text/Primary 600 = #3b4ee3     Text/White 950 = #ffffff
Color/gray/50/100/200     Color/white/950 = #ffffff
Color/primary/200/300/400/500     ← primary/200 confirmed as the "selected" type's fill in the deep audit
Color/success/500 = #35c220     Color/danger/500 = #f03d3d     ← plausible Green/Red fill mapping, not confirmed
outline/primary_alpha = #5468ff3d
```

---

## 9. Deep audit: `chip` / size=md, type=selected, state=focus (node `66075:28900`)

*(Source: `get_design_context`)*

### Internal layer hierarchy
```
66075:28900  "chip" (root)
├─ 66075:28901  "left_icon" (16×16)   [rendered — leftIcon=true, selectLeftIcon=null]
│  └─ I66075:28901;29:307   "vector"
├─ 66075:28902  "text_wrap"           [rendered — text=true]
│  └─ 66075:28903  <text> "Chip"
└─ 66075:28904  "right_icon" (16×16)  [rendered — rightIcon=true, selectRightIcon=null]
   └─ I66075:28904;29:307   "vector"
```
A simple, flat structure — no nested sub-groups, matching the pattern of `switcher_item`.

### Confirmed facts
- **Boolean properties (3):** `leftIcon`, `rightIcon`, `text` — all at plain defaults.
- **Instance-swap properties (2):** `selectLeftIcon`, `selectRightIcon` (both `React.ReactNode | null`) — same pattern as `field`, `list`, `switcher_item`, `sidebar_item`.
- **Nested component dependency:** none — icons are plain vector images, same confirmed absence as `switcher_item`.
- **Labels/icons confirmed; selection indicator/dismiss control NOT confirmed as dedicated elements:** `text_wrap` ("Chip") and generic `left_icon`/`right_icon` slots exist, but no distinct "checkmark" or "dismiss" layer was found — whether a checkmark asset is swapped into one of these generic slots for `selected` chips is not confirmed from this instance (both icons render as the same placeholder vector). No counter/badge found.
- **Layout:** root `flex items-center justify-center` (horizontal, fully centered); `text_wrap` same.
- **Sizing:** root `h-[32px]` Fixed (matches `md`), no explicit width → Hug; icons `size-[16px]` Fixed; `text_wrap` Hug.
- **Padding/gaps:** root `p-[spacing/8, 8px]` uniform, `gap-[spacing/2, 2px]`; `text_wrap` `px-[spacing/2, 2px] gap-[spacing/8, 8px]`.
- **Typography:** Medium weight, `caption_2` (12px/16px), no tracking, color `text/primary-600` (`#3b4ee3`) — confirmed **`web/Body/12 Medium`**.
- **Fill/radius:** fill `Color/primary/200` (`#d5e7ff`) — confirms the `selected` type's light primary-tinted background. Radius `radius/border_radius_round` (1000px, full pill) — the only radius token, exactly as predicted at the overview stage.
- **Border:** none — no separate stroke class.
- **Focus mechanism — fully confirmed:** root box-shadow `0px 0px 0px 3px outline/primary_alpha` **exactly matches** the confirmed `outline/focus_primary` effect definition — focus is implemented purely as this ring shadow, layered on top of the chip's normal fill/content, with no separate border.
- **Icons:** both carry `elevation/e2`-matching drop-shadows.
- **Overrides:** none — all props at plain defaults; `size`/`type`/`state` simply identify this variant.

### Not confirmed / unresolved
- Whether a dedicated selection-indicator (checkmark) exists for `selected`/`selected_neutral`, distinct from the generic icon slots.
- How `drag` is implemented — this variant is `state=focus`; inspecting `drag` would require a separate sibling lookup, out of scope.
- Whether `Green`/`Red` are structurally different from `selected`/`unselected` — not inspected, out of scope.
- Whether `unselected`/`selected_neutral` differ from `selected` only in fill color, or also structurally.
- The real icon glyph content beyond the placeholder asset URL.

---

## 10. Duplicated, inconsistent, or suspicious variants; naming inconsistencies

- **`Green`/`Red` types only support `state=default`** — a confirmed, significant coverage gap versus the other three types' full 5-state set.
- **Casing mismatch within `type`:** `unselected/selected/selected_neutral` (lowercase) vs. `Green/Red` (capitalized) — confirmed within a single property's value set, similar in kind to the `Default`/`danger` mismatch found in `alert` and the `default`/`Default` mismatch between `toast`/`alert`.
- **No `radius/custom/*` tokens at all** — the narrowest radius footprint of any component audited so far, confirmed consistent with the chip's actual pill-shaped rendering.
- **`drag` state** — a genuinely new state name, first seen in this component; no direct inconsistency confirmed yet since it wasn't compared against a sibling term.

---

## 11. Dependencies on previously audited components

Confirmed reuse of: `elevation/e2` (icon shadows, every prior audit); `outline/primary_alpha`/`outline/focus_primary` (Special Effects, Buttons audits — **now confirmed as the exact, genuine mechanism for the chip's `focus` state**, not just incidentally bound); `radius/border_radius_round` (Buttons, Button Group, Input, List, Switcher, Sidebar Navigation, Tooltips, Alerts, Toasts audits); `secondary_button_effect` (Buttons audit, likely spillover); `special_drop` (Input, List audits); `outline/focus_gray` (Special Effects, Buttons audits — bound in this subtree but not confirmed applied to this specific `focus` instance, which used `outline/focus_primary` instead); `spacing/2, 8` (consistent across every prior audit); `Color/primary/200` (Colors audit — confirmed applied as the `selected` fill); `Text/primary-600` (Colors, Switcher, Sidebar Navigation audits); `web/Body/12 Medium` (Typography audit — confirmed applied); `sizing/icon/16` (confirmed applied); `Color/success/500`, `Color/danger/500` (Colors audit — plausible but unconfirmed mapping to `Green`/`Red` types).

---

## 12. Anything MCP cannot retrieve

- Whether a dedicated selection-indicator (checkmark) exists for `selected`/`selected_neutral` types, distinct from the generic icon slots.
- How `drag`, `hover`, `disabled`, and `default` states render — out of scope, no sibling inference performed.
- Whether `Green`/`Red` types are structurally different from `selected`/`unselected`, and whether they genuinely map to `Color/success/500`/`Color/danger/500`.
- Whether `unselected`/`selected_neutral` differ from `selected` only in fill color, or also structurally.
- Why `Green`/`Red` lack `disabled`/`focus`/`hover`/`drag` variants — confirmed absence, design rationale not determinable from metadata.
- The real icon glyph content beyond the placeholder asset URL.
- Default variant configuration for `chip`.
- Variable Collection / Mode metadata — not retrievable, consistent with every prior audit in this series.

---

## 13. Deep re-audit addendum (visual implementation correction pass)

The original audit above deep-audited exactly one instance (`selected`/md/`focus`) and the resulting implementation then reused that single confirmed fill/text/radius as a neutral fallback for every other type, and rendered every non-`focus` state identically regardless of `type`. A second pass (11 more `get_design_context` calls — `unselected` at default/hover/disabled/drag; `selected` at default/hover/disabled; `selected_neutral` at default; `Green`/`Red` at default) found the real construction was materially different:

- **`unselected`'s fill was assumed to be `gray/100`.** Confirmed real: plain white (`Color/white/950`) with a `black/50`(4%) border and a confirmed inset shadow — neither the fill, border, nor inset existed in the pre-rebuild implementation.
- **`selected` was assumed to have no border at all.** Confirmed real: a `primary/400` border on both `default` and `hover` — a materially incomplete visual without it.
- **`selected_neutral`'s text was assumed to be `gray/700` (same as `unselected`).** Confirmed real: `gray/950` (near-black) — a genuinely distinct color, not a duplicate.
- **`Green`/`Red`'s fill/text mapping (`success/500`/`danger/500`, white text) was already correct** (the audit's own "plausible" guess turned out right) — but both were missing their confirmed `black/150`(12%) border.
- **`hover` had no distinct visual for any type** — confirmed real: `unselected` lightens to `gray/50`; `selected` darkens to `primary/300`; both keep their border and inset unchanged.
- **`disabled` had no distinct visual** — confirmed real: a flat `gray/100` fill, no border, `gray/400` text, and — for `selected` specifically — a confirmed **SemiBold** (600) weight, a genuine one-off change from every other state's Medium (500).
- **`drag` was not implemented at all** — confirmed real (sampled on `unselected`): the fill darkens one step, the border is kept, and the resting inset shadow is replaced by a 5-layer outer "lift" shadow identical to `elevation.e5`.
- **Icon slots carried no visual shadow at all** — the pre-rebuild code applied the confirmed `elevation/e2` drop-shadow as a CSS `boxShadow` on the icon's own (empty, transparent) bounding box, which draws a rectangular shadow rather than one following the icon glyph's silhouette. Every other component in this system implements the identical confirmed effect as `filter: drop-shadow()` — this was a genuine rendering bug, not a style choice.

Every correction above is implemented in `packages/ui/src/components/chip/chip.tsx`'s `CHIP_VISUAL` table and cited inline; see `packages/ui/src/components/chip/README.md` for the consumer-facing confirmed-vs-derived summary. Not independently re-sampled in this pass: `selected`/`selected_neutral`'s own `drag` states (derived from `unselected`'s confirmed drag pattern) and `selected_neutral`'s `hover`/`disabled` states (derived from the same family pattern, keeping this type's own confirmed `gray/950` text).
