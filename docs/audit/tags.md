# Tags Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0"
Frame audited: `Tags` overview (node `66077:29295`), containing a single component set.

Method: `get_metadata` and `get_variable_defs` via Figma MCP (live desktop selection). No deep instance audit (`get_design_context`) was performed for this component family — only the overview-level audit below.
Status: **Audit only.** No code, components, or project configuration were generated. No variable, style, or layer names were renamed or normalized.

---

## 1. Component set and node ID

| Name | Node ID |
|---|---|
| `tags` | `66077:29313` |

(Plus an unrelated `overview_sheet_sidebar` instance, `66077:29296`.) **This is the only component set in the entire selection** — no additional demo compositions or bare instances, consistent with the sparse single-set pattern seen in Tooltips, Alerts, Toasts, and Chips.

---

## 2. Exposed properties and variant values

`tags` exposes three: **`size`**, **`type`**, **`state`**.

- `size`: **lg, md, sm**
- `type`: **info, warning, danger, Danger Filled, success, Success Filled, tertiary, secondary, primary_outline, primary_light, primary** — 11 values
- `state`: **disabled, hover, default** — 3 values, notably **no `focus` and no `drag`**

**Confirmed major naming inconsistency:** `Danger Filled` and `Success Filled` are **two-word, space-containing, Title Case** values — a first in this entire audit series. Every other type value is a single lowercase or snake_case word.

---

## 3. Variant count and coverage

**99 variants** (11 types × 3 states × 3 sizes), confirmed against the full symbol list, with **no coverage gaps** — every type has all 3 states at all 3 sizes, unlike `chip`'s `Green`/`Red` gap.

Sizes: `lg` (77×32), `md` (67×24), `sm` (35×20). States uniformly available across all 11 types.

**Type groupings suggested by naming:** `primary` / `primary_light` / `primary_outline` (a confirmed three-way visual-style split for the primary brand color — filled, tinted, outlined); `danger` / `Danger Filled` and `success` / `Success Filled` (each paired with an explicit "Filled" counterpart) — but **only danger and success get a "Filled" pair**; `warning`/`info` do not, a confirmed asymmetry.

---

## 4. Whether labels, leading icons, trailing icons, counters, status indicators, and dismiss controls are exposed as properties

**None of these appear as named top-level variant properties** — only `size`/`type`/`state`. Confirming their existence as internal instance slots would require `get_design_context`, not used for this component family.

---

## 5. True component set vs. demo composition

**`tags` is a true, atomic component set** — 99 variants spanning size/type/state. No demo compositions or bare instances exist in this selection.

---

## 6. Typography tokens

```
web/Title/22 Semibold, web/Title/76 Semibold, web/Title/32 Medium   ← likely unrelated spillover
web/Body/12 Semibold, web/Body/11 Semibold
```
**Notably narrower than `chip`'s typography set** — only SemiBold weights appear (12/11), with no Medium weight and no `13` size — consistent with the SemiBold tag-label treatment already confirmed in the `list` and `sidebar_item` deep audits.

---

## 7. Spacing, radius, border, elevation, and effect tokens

```
spacing/0, 2, 4, 6, 8, 12, 16, 24, 32, 40, 48

radius/border_radius_round = 1000
radius/border_radius_xl = 20
radius/custom/md = 10     radius/custom/sm = 8     radius/custom/xs = 6
radius/border_radius_5xl = 40     radius/border_radius_8xl = 64

outline/Black 50 / 100     outline/Gray 400

elevation/e2 = (confirmed 2-layer, identical to prior audits)
elevation/e5 = (confirmed 5-layer, identical to prior audits)
secondary_button_effect = (confirmed 4-layer, identical to Buttons audit — likely spillover)
special_drop = (confirmed 2-layer, identical to the Input/List/Sidebar Navigation audits — confirmed there as
                 the genuine tag inner-shadow mechanism; plausibly identical here, not confirmed without
                 get_design_context)
secondary_special_outline = ""   ← still unresolved, consistent with every prior audit

sizing/icon/14, 16
```
**Three `radius/custom/*` tokens present** (xs/sm/md) — more than `chip`'s zero, suggesting `tags` may use varied corner-radius treatments across types, unlike `chip`'s uniform full-pill shape.

---

## 8. Color and semantic tokens

A rich, notably systematic alpha pattern — every severity/brand color gets exactly `_alpha_12` and `_alpha_20`, with `primary` additionally getting `_alpha_24`:
```
Text/Info 600 = #1080d6        Color/info/500_alpha_20 = #118be833     Color/info/500_alpha_12 = #118be81f
Text/Warning 600 = #ca9802     Color/warning/500_alpha_20 = #fcbf0433  Color/warning/500_alpha_12 = #fcbf041f
Text/Danger 600 = #e92020      Color/danger/500_alpha_20 = #f03d3d33   Color/danger/500_alpha_12 = #f03d3d1f   Color/danger/500 = #f03d3d   Color/danger/600 = #e92020
Text/Success 600 = #2a9919     Color/success/500_alpha_20 = #35c22033  Color/success/500_alpha_12 = #35c2201f  Color/success/500 = #35c220   Color/success/600 = #2a9919
Text/Primary 600 = #3b4ee3     Color/primary/500_alpha_24 = #5468ff3d  Color/primary/500_alpha_20 = #5468ff33  Color/primary/500_alpha_12 = #5468ff1f  Color/primary/500 = #5468ff   Color/primary/600 = #3b4ee3
```
Plus: `Color/gray/100/200`, `Color/white/950`, `outline/Black 50/100`, `outline/Gray 400`, and a **new token — first appearance outside the original Colors audit:** `Color/vanilla_gray/100 = #f6f4ef`, matching that ramp's documented value exactly.

---

## 9. Duplicated, inconsistent, or suspicious variants; naming inconsistencies

- **`Danger Filled`/`Success Filled` — two-word, spaced, Title Case values within a `type` property otherwise composed of single lowercase/snake_case words** — the most severe single-property naming inconsistency confirmed in this entire audit series.
- **Asymmetric "Filled" coverage:** only `danger`/`success` get a "Filled" counterpart; `warning`/`info` do not.
- **`primary_outline`/`primary_light`** use underscores while `Danger Filled`/`Success Filled` use spaces — two different word-separation conventions within the same `type` property.
- **Uniform state coverage** (no gaps) — a positive contrast to `chip`'s `Green`/`Red` gap.
- **The cleanest, most internally consistent alpha-naming system found in this entire audit series** (§8) — a rare positive exception to the naming proliferation documented across prior audits.

---

## 10. Comparing the architecture suggested by Tags with Chips

| Aspect | `chip` | `tags` |
|---|---|---|
| Sizes | 3 (lg/md/sm) | 3 (lg/md/sm) |
| Types | 5 (unselected, selected, selected_neutral, Green, Red) | 11 (info, warning, danger, Danger Filled, success, Success Filled, tertiary, secondary, primary_outline, primary_light, primary) |
| States | 5 (disabled, focus, hover, drag, default) | 3 (disabled, hover, default) — no focus, no drag |
| State coverage gaps | Yes — `Green`/`Red` only get `default` | None — all 11 types get all 3 states |
| Total variants | 51 | 99 |
| Radius tokens | only `border_radius_round` (uniform pill) | `border_radius_round` + `custom/xs/sm/md` — suggests varied shapes |
| Typography weights | Medium and Semibold, size 13/12/11 | Semibold only, size 12/11 — no Medium, no 13 |
| Color-alpha system | ad hoc (`outline/{name}_alpha`, raw `/500` values) | systematic `_alpha_12`/`_alpha_20`(/`_24` for primary) across every severity |
| Focus mechanism | confirmed ring-shadow (`outline/focus_primary`) | not applicable — no `focus` state exists |
| Naming inconsistency severity | moderate (casing: `Green`/`Red` vs. lowercase) | severe (space-containing, Title Case `Danger Filled`/`Success Filled`) |

**Overall architectural inference (not confirmed structurally without `get_design_context`):** `chip` reads as an **interactive, selectable/draggable** control (focus + drag states, selection-oriented types), while `tags` reads as a **static, label-only** element (no interactive states, but a much richer palette of semantic/brand color themes) — consistent with the conventional UI distinction between a chip (user-manipulable) and a tag (a static classification label).

---

## 11. Dependencies on previously audited components

Confirmed reuse of: `elevation/e2`, `elevation/e5` (every prior audit); `secondary_button_effect` (Buttons audit, likely spillover); `special_drop` (Input, List, Sidebar Navigation audits — confirmed there as the genuine tag inner-shadow mechanism); `radius/custom/xs/sm/md`, `radius/border_radius_round/xl/5xl/8xl` (Buttons, Button Group, Input, List, Switcher, Sidebar Navigation, Tooltips, Alerts, Toasts, Chips audits); `Color/gray/100/200`, `Color/white/950` (Colors audit); `Color/vanilla_gray/100` (Colors audit — first cross-referenced use outside that audit); `Color/{severity}/500_alpha_12/20` and `Color/primary/500_alpha_24` (Buttons audit's `_alpha_XX` convention, systematically applied here); `Text/Info/Warning/Danger/Success/Primary 600` families (Colors, Alerts, Toasts audits); `web/Body/11/12 Semibold` (Typography, List, Sidebar Navigation audits); `sizing/icon/14/16` (Buttons, List, Switcher, Sidebar Navigation, Chips audits); `secondary_special_outline` (still unresolved, consistent with every prior audit).

---

## 12. Anything MCP cannot retrieve

- Whether labels, leading/trailing icons, counters, status indicators, or dismiss controls exist as internal layers on `tags`.
- Whether `special_drop` is genuinely applied to `tags`, or is incidental spillover.
- Why only `danger`/`success` get a "Filled" counterpart while `warning`/`info` do not.
- Whether the three `radius/custom/*` tokens map to different `type` values (e.g. outline types vs. filled types).
- Whether `chip`'s and `tags`' architectural differences reflect genuinely different intended use cases or independent design evolution — inferred, not confirmed.
- Default variant configuration for `tags`.
- Variable Collection / Mode metadata — not retrievable, consistent with every prior audit in this series.

---

## 13. Deep re-audit addendum (visual implementation correction pass)

The audit above never called `get_design_context` (§6: "No deep instance audit ... was performed for this component family") — the resulting implementation was built entirely from metadata/token names, with every fill/border/padding/typography value either a plausible-sounding guess or a flat opacity-dimmed placeholder. A second pass (16 `get_design_context` calls — all 11 types at `md`/`default`; `tertiary` at `hover` and `sm`; `primary` at `lg`, `sm`, and `disabled`) found the real construction was materially different:

- **Radius was assumed to be the full pill** (`radius/border_radius_round`), following Chip's shape. Confirmed real: `tags` uses the `radius/custom/xs|sm|md` scale (6/8/10px at sm/md/lg) — a small rounded rectangle, not a pill at all. This is likely the single largest visual miss in the pre-rebuild implementation.
- **Every size rendered at the same font size** (12px) with horizontal-only padding. Confirmed real: `lg` uses `caption_2` (12px), `md`/`sm` use `caption_1` (11px) — a genuine per-size typography split — and padding/gap vary by size (`sm`/`lg` have a root `gap`, `md` does not; `sm` has zero vertical padding).
- **Icon slots did not exist at all.** Confirmed real: every sampled instance has `left_icon`/`right_icon` slots (14/16/12px depending on size) with the same `elevation/e2` drop-shadow filter confirmed system-wide.
- **`tertiary` was guessed as a lighter, borderless gray** (`gray/50` fill, `gray/600` text). Confirmed real: a white fill with a `black/50`(4%) border and `gray/700` text — structurally the neutral analogue of `primary_outline`, not "secondary but lighter." Its `hover` state is independently confirmed: fill darkens from white to `gray/100`.
- **`primary_outline` was guessed as a transparent background with a fully opaque `primary/500` border.** Confirmed real: an opaque white fill with the border at only 24% alpha (`primary/500_alpha_24`).
- **The solid `primary` type was guessed as borderless** (`border: 1px solid transparent`). Confirmed real: a `black/50`(4%) border — while "Danger Filled"/"Success Filled" are confirmed genuinely borderless. This asymmetry between `primary` and the two "Filled" severities is real, not an inconsistency introduced by this rebuild.
- **`disabled` was a generic `opacity: 0.5` dim on top of each type's own resting fill.** Confirmed real (sampled on `primary`): a flat `Color/vanilla_gray/100` (`#f6f4ef`) fill — a genuinely distinct token from the gray ramp's own `gray/100` (`#f4f4f6`) — `gray/400` text, no border regardless of the type's own border, and the resting inset shadow is **kept** (unlike Button/Chip's disabled treatment, which drops it).
- **The confirmed inset shadow (`special_drop`) was never applied at all.**

Every correction above is implemented in `packages/ui/src/components/tags/tags.tsx`'s `TAG_VISUAL`/`SIZE_METRICS` tables and cited inline; see `packages/ui/src/components/tags/README.md` for the consumer-facing confirmed-vs-derived summary. Not independently sampled in this pass: `hover` for `info`/`warning`/`success`/`primary_light` (derived from the confirmed `_alpha_12`→`_alpha_20` system already documented in §8) and for `secondary`/`primary_outline` (derived as one step darker/tinted); `hover` for the 3 solid-fill types (`primary`, `Danger Filled`, `Success Filled` — no confirmed hover exists for any solid fill in this family); icon size at `sm` (derived by rank from the confirmed 14px@md/16px@lg progression).

---

## 14. Fresh re-audit addendum — corrections to §13's own hover derivations (this pass)

§13's rebuild left several hover states as guessed/derived rather than independently confirmed — most notably asserting "no confirmed hover exists for any solid fill in this family." A fresh, non-trusting re-check (6 additional `get_design_context` fetches on real hover node instances: `info`/md, `secondary`/md, `primary_outline`/md, `primary`/md, `Danger Filled`/md, `Success Filled`/md) disproves that and finds concrete corrections:

- **The 3 solid-fill types DO have a real, confirmed hover: the fill darkens from the ramp's `500` step to its `600` step.** `primary`/hover = `Color/primary/600` (`#3b4ee3`, was guessed unchanged at `500`); `Danger Filled`/hover = `Color/danger/600` (`#e92020`, was guessed unchanged); `Success Filled`/hover = `Color/success/600` (`#2a9919`, was guessed unchanged). Borders (where present) and text colors are confirmed unchanged between default/hover for all three.
- **`primary_outline`'s hover fill was guessed as a plain `gray/50`; the confirmed real value is `Color/primary/500_alpha_12`** (a light primary tint, matching `primary_light`'s own default fill) — the border and text color are confirmed unchanged.
- **`info`'s hover fill (`info/500_alpha_20`) and `secondary`'s hover fill (`gray/200`) were already correct** — confirmed exactly, no change needed. This cross-checks the `_alpha_12`→`_alpha_20` system already documented in §8/§13 as genuinely correct for at least one severity type.

Not independently re-sampled in this pass (still derived, same caveats as §13): `hover` for `warning`/`success`/`primary_light` (the `_alpha_12`→`_alpha_20` pattern, now cross-checked correct on `info`) and `tertiary` (already independently confirmed in §13).

## 15. Deep re-audit addendum (2026-08-12) — user-reported "needs a good amount of changes"

A systematic sweep (`get_metadata` on the full `tags` component set, node `66077:29313`, 99 variants; ~20 further `get_design_context`/`get_metadata` calls covering all 11 default fills, 5 previously-"derived" hovers, 3 additional disabled instances of different structural types, and every `sm` instance across 4 types) re-verified essentially everything §13/§14 already confirmed — colors, borders, hover deltas, and the universal disabled recipe all held exactly, across bordered types (`tertiary`, `primary_outline`) and borderless solid types (`Danger Filled`) alike. Two real, previously-unconfirmed bugs were found and fixed:

- **`test_wrap`'s own internal horizontal padding is size-dependent and non-monotonic: `2px` at `sm`, `4px` at `md`, `2px` again at `lg`** (confirmed directly across `primary`, `tertiary`, `secondary`, `primary_outline`, `success`, and `Danger Filled` samples at every size). The implementation hardcoded a flat `2px` (`0 0.125rem`) for every size — correct by coincidence at `sm`/`lg`, wrong at `md` (rendering 2px too little padding around the label). Added `labelPadding` to `SizeMetrics`.
- **`sm` has no icon slot at all.** `get_metadata` on every sampled `sm` instance (`primary`, `danger`, `secondary`, `info`, across `default`/`disabled` states) shows zero `left_icon`/`right_icon` child layers — not toggled off, structurally absent. The previous `iconSize: 12` for `sm` was explicitly flagged in §14's gaps as "derived by rank, not independently sampled" (guessed from the `14px@md`/`16px@lg` progression); it turns out the real answer is that icons never render at `sm` regardless of the `leftIcon`/`rightIcon` props, which now gate off at that size.

## 16. Requested: `md`'s horizontal padding reduced — a deliberate code-only override

Same user feedback and same shape as chips.md §14: `md`/`lg` Tags padding looked "a bit too much... looks like a button." Re-verified `md` (node `66077:29384`) and `lg` (node `66077:29324`) fresh against Figma first: **both confirmed byte-for-byte exact** — `md` is `px-6 py-4` (6px horizontal, 4px vertical), `lg` is `p-8` (8px uniform). Not a bug; the implementation already matched.

Requested anyway, as a deliberate deviation: `md`'s horizontal padding reduced from the confirmed 6px to 4px (now uniform with its own 4px vertical padding). `lg` is unchanged — already uniform (8px horizontal = 8px vertical), no asymmetric "extra" to trim. `sm` untouched (not named). `PILL_PADDING` (the `shape="pill"` requested addition) was left as-is — not part of this request, and the pill shape already intentionally carries more horizontal padding than the default shape by design.

Tests updated in `tags.test.tsx` to assert the new `md` padding, with the override called out inline rather than presented as a Figma value.

## 17. Requested: the remaining horizontal-only asymmetry (`labelPadding`)

Same follow-up and same root cause as chips.md §15: even with the OUTER `padding` above uniform at `md`/`lg`, the sides still looked bigger than top/bottom, because the inner `text_wrap` span carries its own confirmed `labelPadding` (§15/§16 — non-monotonic 2px/4px/2px at sm/md/lg, horizontal-only) STACKED on top of the now-uniform outer padding. At `md`: 4 (outer) + 4 (label) = 8px horizontal vs. 4px vertical.

Fixed by zeroing `labelPadding` at `md`/`lg` (was the confirmed 4px/2px) — `sm` keeps its confirmed 2px, since it wasn't named in this request. Total inset is now genuinely equal on all 4 sides: `md` = 4px everywhere, `lg` = 8px everywhere. `PILL_PADDING` is unaffected (separate, still not part of any request). Verified live: computed outer padding 4px/8px, inner label span padding 0px, matching at both sizes.

Tests updated asserting the label's own padding per size. 703/703 passing (`@shikho/ui`). Typecheck clean. Docs build clean.

## 18. Same icon-slot fix as Chip — applied, padding-rebalance checked and found unnecessary

Direct follow-up: "do the exact same thing for Tag" (referring to chips.md §16/§17 — an empty icon slot reserving dead space, then a horizontal padding bump once that was fixed).

**Icon-slot fix: applied, identical bug.** `leftIcon`/`rightIcon` default to `true` (confirmed, §14), and the component rendered an empty icon-slot `<span>` (`width: metrics.iconSize`) whenever that boolean was true, regardless of whether `selectLeftIcon`/`selectRightIcon` actually had content — the exact same bug as Chip's. Fixed the same way: the slot now only renders when `leftIcon && selectLeftIcon` (was just `leftIcon`).

**Padding-rebalance: checked live, not applied.** Unlike Chip (always `radius.full`, a true pill), Tags' `default` shape uses a much smaller per-size corner radius (`radius.sm`/`radius.md`, 8px/10px — not full-round). Verified live at both `md` (28×24px, 8px radius) and `lg` (38×32px, 10px radius) after the icon-slot fix: at that radius, a rounded rectangle with uniform padding does not read as a circle the way Chip's full-pill shape did — screenshotted at 4x zoom to confirm. `shape="pill"` (the one Tags variant that DOES use `radius.full`) already has its own separate `PILL_PADDING` table with a built-in horizontal bias, untouched by any of this and unaffected either way. No padding change made.

Test added asserting an icon-less tag renders exactly one child (the label span) at `md`/`lg`. 704/704 passing (`@shikho/ui`, up from 703). Typecheck clean. Docs build clean.

## 19. Requested: `md`'s font size bumped, and a small horizontal padding bump for `md`/`lg`

Direct follow-up: "sm and md font sizes are the same, increase md's; also add a bit of side padding for md and lg, proportionally."

**Font size.** `sm` and `md` sharing `11px` is a real, previously-confirmed Figma fact (§14 — both bind to the same `caption_1` token; only `lg` differs at `12px`/`caption_2`) — not a bug. Requested override anyway: `md`'s `fontSize` bumped from `11` to `12`, matching `lg`, so `sm`/`md` read as visually distinct. `sm` stays at the confirmed `11px`; `lg` unchanged.

**Padding.** A small horizontal-only bump on top of §18's uniform values, on both `md` and `lg` (vertical untouched at both): `md` `0.25rem` (4px uniform) → `0.25rem 0.375rem` (4px vertical / 6px horizontal); `lg` `0.5rem` (8px uniform) → `0.5rem 0.625rem` (8px vertical / 10px horizontal). `sm` and `shape="pill"`'s own `PILL_PADDING` are both untouched — neither was named in this request.

Tests updated: the per-size font-size test now covers all three sizes explicitly (`sm` 11px, `md`/`lg` both 12px); the default-shape padding test updated to the new `md` value. 705/705 passing (`@shikho/ui`, up from 704). Typecheck clean. Docs build clean. Verified live: computed `padding`/`fontSize` at each size read `sm: 0px 6px / 11px`, `md: 4px 6px / 12px`, `lg: 8px 10px / 12px`.

## 19. Superseded: `sm` declared the base, `md`/`lg` rebuilt as a pure 1.5x geometric scale

Direct request: "sm looks perfect — treat it as the base; scale md 1.5x from sm, and lg 1.5x from md (2.25x from sm), like Figma's Scale tool (K)." This **replaces** every one of §14/§17/§18's own independently-confirmed and previously-overridden md/lg values with a pure geometric derivation from `sm` alone — the most wholesale departure from confirmed Figma data in this whole audit series, done because it was asked for directly and unambiguously (an exact, mechanical scale factor, not a vague "a bit more").

`sm` is untouched — still §14's own confirmed values (height 20, padding 6px horizontal, `radius.xs`/6px, no icon slot, `fontSize` 11, `labelPadding` 2). Every `md`/`lg` number below is that same value × 1.5 / × 2.25, exactly, with no rounding to a "nicer" number and no snapping to an existing named radius/spacing token (9px and 13.5px don't correspond to any step in `@shikho/tokens`' radius scale):

| Metric | `sm` (base) | `md` (×1.5) | `lg` (×2.25) |
|---|---|---|---|
| height | 20 | 30 | 45 |
| horizontal padding | 6px | 9px | 13.5px |
| `rootGap` | 2 | 3 | 4.5 |
| `radius` | 6 (`radius.xs`) | 9 | 13.5 |
| `iconSize` | 12 | 18 | 27 |
| `fontSize` | 11 | 16.5 | 24.75 |
| `lineHeight` | 16px | 24px | 36px |
| `labelPadding` | 2 | 3 | 4.5 |

This directly supersedes §17's md font-size override (11→12, matching lg) and §18's md/lg `labelPadding` zeroing (done specifically to avoid the inner/outer padding stacking that caused chips.md §15's asymmetry bug) — under the new sm-based model, `labelPadding` deliberately scales up *with* `sm`'s own non-zero value, by design, since the whole point is reproducing `sm`'s exact internal structure at a larger size rather than avoiding a stacking problem `sm` itself never had. `shape="pill"`'s own `PILL_PADDING` table was not part of this request and is unchanged — it no longer relates proportionally to `SIZE_METRICS`' own new numbers the way it originally did when both were independently-confirmed Figma values.

Tests rewritten for the new sm-based values (heights 20/30/45, font sizes 11/16.5/24.75, label padding 0.125rem/0.1875rem/0.28125rem, default-shape radius/padding 9px at md). 705/705 passing (`@shikho/ui`). Typecheck clean. Docs build clean. Verified live: computed height/width/padding/radius/fontSize at each size confirm an exact 1.5x ratio step to step (e.g. width 36.3px → 54.5px → 81.7px, each exactly 1.5× the last).

## 20. Follow-up: 1.5x was "too much bigger" — reduced to 1.25x/step

Direct follow-up, same day: 1.5x per step read as too large a jump. Reduced to **1.25x/step** (1.5625x from `sm` to `lg`) — same base (`sm`, untouched), same mechanical, non-rounded derivation approach as §19, just a smaller multiplier:

| Metric | `sm` (base) | `md` (×1.25) | `lg` (×1.5625) |
|---|---|---|---|
| height | 20 | 25 | 31.25 |
| horizontal padding | 6px | 7.5px | 9.375px |
| `rootGap` | 2 | 2.5 | 3.125 |
| `radius` | 6 (`radius.xs`) | 7.5 | 9.375 |
| `iconSize` | 12 | 15 | 18.75 |
| `fontSize` | 11 | 13.75 | 17.1875 |
| `lineHeight` | 16px | 20px | 25px |
| `labelPadding` | 2 | 2.5 | 3.125 |

All §19 reasoning still applies (pure geometric derivation from `sm`, no rounding, no token-snapping, `PILL_PADDING` untouched). Tests updated to the new 1.25x values throughout. 705/705 passing (`@shikho/ui`). Typecheck clean. Docs build clean. Verified live: width steps 36.3px → 45.4px → 56.7px, each exactly 1.25× the last; height 20px → 25px → 31.25px.
