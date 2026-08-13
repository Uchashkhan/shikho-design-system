# Avatars Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0"
Frames audited:
- `Avatars` overview (node `66063:20864`), containing three component sets
- Deep instance audit: `avatar` / `📐 size=md, ☘️ type=image` (node `66063:20938`), via `get_design_context`

Method: `get_metadata` and `get_variable_defs` for the overview; `get_design_context` (explicitly authorized) for the deep instance audit. Each finding is marked with its source.
Status: **Audit only.** No code, components, or project configuration were generated. No variable, style, or layer names were renamed or normalized.

---

## 1. Overview: component sets and node IDs

*(Source: `get_metadata`)*

| Name | Node ID |
|---|---|
| `avatar_face` | `66063:20882` |
| `avatar` | `66063:20907` |
| `avatar_group` | `66063:20963` |

(Plus an unrelated `overview_sheet_sidebar` instance, `66063:20865`.)

---

## 2. Exposed properties and variant values per set

*(Source: `get_metadata`)*

| Set | Properties | Values |
|---|---|---|
| `avatar_face` | `face` (🐷 icon — a different property-icon convention from 📐/☘️/💡 used elsewhere) | 1–12 |
| `avatar` | `size`, `type` | size: xl, lg, md, sm, xs — type: icon, text, image |
| `avatar_group` | `size` | xl, lg, md, sm, xs |

---

## 3. Variant counts

*(Source: `get_metadata`)*

| Set | Count |
|---|---|
| `avatar_face` | 12 |
| `avatar` | 15 (5 sizes × 3 types) |
| `avatar_group` | 5 |

**Total: 32 variants.**

---

## 4. Sizes, states, types — confirmed coverage

*(Source: `get_metadata`)*

- **Sizes:** `avatar` — xs (24×24), sm (32×32), md (40×40), lg (48×48), xl (64×64), all square. `avatar_group` shares the same 5 size labels; height matches the `avatar` scale exactly, but width (xs=120, sm=176, md=208, lg=240, xl=328) cannot be cross-verified against a `count` property — none exists, unlike `button_group`, so the overlap math cannot be solved here.
- **States:** **none found.** No `state` property or state-named value exists in any of the three sets — no hover/active/disabled variants anywhere in Avatars.
- **Types:** only `avatar` exposes a `type` property (`icon`, `text`, `image`).
- **Initials/status/badge/border as properties:** none of these appear as named top-level variant properties in the metadata; their existence as internal instance slots was confirmed separately in the deep audit (§8).

---

## 5. Typography tokens (overview-level)

*(Source: `get_variable_defs`, overview)*

```
web/Title/22 Semibold, web/Title/76 Semibold, web/Title/32 Medium,
web/Title/13 Semibold, web/Body/13 Semibold, web/Body/12 Semibold, web/Body/11 Semibold
```
The Body/13/12/11 Semibold tokens are plausible candidates for the `avatar type=text` (initials) label at different sizes; 22/76/32 more plausibly belong to unrelated sidebar/heading labels, consistent with the spillover pattern in every prior audit.

---

## 6. Spacing, radius, border, elevation, and effect tokens (overview-level)

*(Source: `get_variable_defs`, overview)*

```
spacing/8, 12, 16, 24, 32, 40, 48

radius/border_radius_round = 1000     ← consistent with avatars rendering as full circles
radius/border_radius_xl = 20
radius/border_radius_5xl = 40
radius/border_radius_8xl = 64

outline/Gray 100 / 200 / 400

elevation/e2 = (confirmed 2-layer, identical to prior audits)
elevation/e5 = (confirmed 5-layer, identical to Button Group/Input audits)
secondary_button_effect = (confirmed 4-layer, identical to Buttons audit — likely spillover, not Avatar-specific)
```

**Confirmed in the deep audit:** the `avatar/md/image` instance itself carries **no elevation or effect token at all** — a notable absence compared to every Button/Input component audited so far (see §8).

---

## 7. Color and semantic tokens (overview-level)

*(Source: `get_variable_defs`, overview)*

Base ramp values already known from the Colors audit:
```
Color/primary/100=#edf6ff  /200=#d5e7ff  /300=#bad5ff  /500=#5468ff
Color/Secondary/100=#fce3f7  /300=#f681d7  /500=#e2008d
Color/warning/100=#fef2cd  /300=#fdd868  /500=#fcbf04
Color/danger/400=#f36363
Color/white/900=#ffffffe0
```

**New semantic-alias naming families, first observed in this audit:**
```
Color/primary_med_em    = #85a4ff   (matches Color/primary/400 exactly)
Color/secondary_med_em  = #ea42b2   (matches Color/Secondary/400 exactly)
Color/primary_base      = #5468ff   (matches Color/primary/500 exactly)
Color/secondary_base    = #e2008d   (matches Color/Secondary/500 exactly)
surface/info_med_em     = #59b0f3   (matches Color/info/400 exactly) ← new "surface/" namespace
neutral_transparent_White/White 88 = #ffffffe0   (same value as Color/white/900 — a third name for the same value)
Color/inverse_black_neutral = #ffffff   (seen previously in Button Group/Input audits)
```

**Confirmed in the deep audit, extending this family further:**
```
surface/success_med_em          = #50df3a   (matches Color/success/400 from the Colors audit)
neutral_transparent_white/white-72 = rgba(255,255,255,0.72)   (closely matches Color/white/800, 72.16%, from the Colors audit)
```

---

## 8. Deep audit: `avatar` / size=md, type=image (node `66063:20938`)

*(Source: `get_design_context`)*

### Internal layer hierarchy
```
66063:20938  "📐 size=md, ☘️ type=image"  (root — props: size="md", type="image", status=false, verification=false)
├─ <img>  (avatar photo fill — no data-node-id returned for this element, unlike every other node)
├─ 66063:20939  "status"              [conditional — NOT rendered, status=false by default]
└─ 66063:20940  "verification_tick"   [conditional — NOT rendered, verification=false by default]
   └─ I66063:20940;98:961   "shape"
      └─ <img>  (checkmark/badge vector — no data-node-id returned)
```
Both `status` and `verification_tick` are defined in the component and visible in the returned code, but **not actually rendered** in this instance since both booleans default to `false`.

### Confirmed facts
- **Image handling:** the photo is a **plain `<img>` fill**, not a nested component instance and not an exposed replaceable slot — no prop (boolean, instance-swap, or otherwise) controls it. It is hardcoded to this variant.
- **Initials / icon fallback:** not present in this `type=image` variant (would apply to sibling `type=text`/`type=icon` — out of scope, no sibling inference).
- **Status indicator:** confirmed to exist (`status` boolean, default false). When rendered, it would be: `size-[10px]`, `rounded-[100px]` (circular), background **`surface/success_med_em`** (`#50df3a`), `border-3` in **`neutral_transparent_white/white-72`** (`rgba(255,255,255,0.72)`), positioned `absolute bottom-0 right-0`.
- **Verification badge:** confirmed to exist (`verification` boolean, default false). When rendered: a 12×12 `verification_tick` container (`absolute top-0 right-0`) wrapping a `shape` child with a checkmark/badge vector image.
- **Layout architecture — confirmed structural difference from every other component audited so far:** this component does **not** use Figma auto-layout. Root is `relative`; every child (image, `status`, `verification_tick`) is `absolute`-positioned. Buttons and Inputs, by contrast, used `flex` auto-layout throughout.
- **Sizing:** root `size-[40px]` (Fixed, matches `md`); image `size-full` (fills parent); `status` `size-[10px]` (Fixed); `verification_tick`/`shape` `size-[12px]` (Fixed).
- **Clipping/masking:** confirmed — the circular crop comes from `border-radius` (`radius/border_radius_round`, 1000px) applied **directly on the `<img>` element itself** (mirrored on the root div), not from a separate clip-path/mask layer or an `overflow-clip` wrapper.
- **Corner radius:** `radius/border_radius_round` = 1000px, applied to both root and image.
- **Border/outline on the avatar itself:** none. Only the (unrendered-by-default) `status` indicator carries its own 3px border.
- **Fill/image-fit:** `object-cover` on the avatar image; no separate background-color fallback fill present in this `type=image` variant.
- **Typography:** none — no text layer exists in this variant.
- **Elevation/effect tokens:** **none applied** — a confirmed absence, unlike every Button/Input component audited so far (all of which carried at least an `elevation/e2` icon shadow).
- **Boolean properties:** `status` (default false), `verification` (default false).
- **Instance-swap properties:** none found — unlike `field`'s `selectLeftIcon`/`selectRightIcon`, this avatar exposes no swappable slot.
- **Image replacement properties:** none found — the photo asset is hardcoded, not exposed via any prop.
- **Overrides applied:** none — this instance is at plain component defaults.
- **Dependency on `avatar_face`:** **not confirmed.** Nothing in this output references `avatar_face` (`66063:20882`) or its 12 `face=` variants; the photo asset used here is a distinct, unrelated URL. Cannot rule out that `avatar_face` symbols are used as source images in *other* avatar instances elsewhere in the file — out of scope for this instance.

---

## 9. Naming inconsistencies (confirmed)

- **`avatar_face` uses a 🐷 (pig) property-icon prefix**, distinct from the 📐/☘️/💡 convention used consistently across Buttons, Button Group, and Input — an unexplained, one-off convention break.
- **Four (now confirmed) parallel naming systems for "brand/functional color at a given emphasis or opacity level"**: `_alpha_12/20/24` (Buttons), `smoke_*` (Input), and `_base`/`_med_em` plus the new `surface/*` namespace (Avatars) — no single canonical convention across the design system.
- **Casing/naming variance for the same opacity-ramp concept**, now confirmed across three audits: `outline/Black 50` (Special Effects), `Color/white/900` and `neutral_transparent_White/White 88` (Avatars overview), and `neutral_transparent_white/white-72` (Avatars deep audit, lowercase, hyphenated) — at least four distinct casing/naming conventions for conceptually the same alpha-ramp idea.

---

## 10. Duplicated / suspicious / cross-referenced findings

- **`Color/primary_med_em`, `Color/secondary_med_em`, `Color/primary_base`, `Color/secondary_base`, `surface/info_med_em`, `surface/success_med_em`** — all duplicate values already documented in the Colors audit under `Color/{family}/{step}`, now confirmed under at least two additional naming systems (`_base`/`_med_em` and `surface/*`).
- **`neutral_transparent_White/White 88` and `neutral_transparent_white/white-72`** duplicate `Color/white/900` and (approximately) `Color/white/800` respectively — same underlying alpha-ramp concept as `outline/Black *`, now confirmed to exist for white too, under yet another casing variant.
- **`avatar_group`'s width-per-size cannot be cross-verified** the way `button_group`'s was — no `count` property exists to solve the overlap arithmetic.
- **No elevation/effect token applied to the `avatar/md/image` instance** — a genuine architectural difference from every Button/Input component audited, worth flagging as a design-system-wide inconsistency (not a defect, simply an observed difference in visual-depth treatment between component families).
- **Auto-layout is absent from `avatar`** — confirmed absolute/relative positioning instead, unlike Buttons/Inputs' consistent flex auto-layout usage.

---

## 11. Dependencies on previously audited components

Confirmed reuse of: `elevation/e2`, `elevation/e5` (Button Group, Input audits — bound in the overview subtree, though **not actually applied** to the specific `md/image` instance audited in depth); `secondary_button_effect` (Buttons audit, likely incidental spillover); `radius/border_radius_round` (Buttons, Button Group audits); the full `Color/primary/*`, `Color/Secondary/*`, `Color/warning/*`, `Color/danger/*`, `Color/white/*` ramps (Colors audit); `Color/inverse_black_neutral` (Button Group, Input audits); `web/Body/11/12/13 Semibold` typography tokens (Typography, Buttons, Button Group audits, though none apply to this specific `type=image` instance, which has no text layer).

---

## 12. Anything MCP cannot retrieve

- Whether initials, icon fallback, status, and badge layers behave identically across the other four `avatar` sizes and the `icon`/`text` types — out of scope, no sibling inference performed.
- The exact overlap/spacing math for `avatar_group` (no `count` property to solve against).
- Whether `avatar_face`'s 12 face variants are actually consumed as swappable source images anywhere in the file.
- The real photo/icon/badge asset content beyond placeholder URLs.
- Which specific color/typography token binds to which `avatar` type/size combination beyond what was directly confirmed for `md/image` — the flat variable export lists everything bound in the subtree without attributing values to specific properties.
- Default variant configuration for any of the three component sets.
- Variable Collection / Mode metadata — not retrievable, consistent with every prior audit in this series.

## 13. Requested: status ring made opaque, verification badge enlarged with a new white ring

Two items of direct user feedback, both deliberate code-only overrides — no Figma re-check contradicted anything here; §8 already confirmed both underlying facts (status border `neutral_transparent_white/white-72`, 72% alpha; `verification_tick` with no border at all), the user just wants a different result than Figma specifies:

1. **Status ring color.** The confirmed border is `white[800]` — 72% translucent white — which lets the avatar's own fill/image show through at the edge, reading as a slightly greenish/washed ring against the green `status` fill rather than a clean white one. Changed to opaque `white[950]`.
2. **Verification badge.** Figma's own confirmed `verification_tick` (§8) is a bare 12×12 (at `md`) container with no border/outline whatsoever. Two changes, both requested with no Figma basis:
   - Size bumped +2px at every step: xs 8→10, sm 10→12, md 12→14, lg 14→16, xl 18→20.
   - A new white ring added, reusing the *same* per-size border-width scale already defined for `status` (`statusBorder`: 2px at xs/sm, 3px at md/lg/xl) so the two corner indicators read as a consistent pair rather than two independently-invented values.

Tests updated in `avatar.test.tsx` to assert the new opaque border color and the new verification size/ring. 697/697 passing (`@shikho/ui`, up from 696). Typecheck clean. Docs build clean. Verified live: computed status border reads `3px solid rgb(255, 255, 255)`; verification renders at 14px (md) with the same white ring.

## 14. Follow-up fix: the §13 changes broke proportion and shape — a real bug, not another override

User feedback with a screenshot: the verification badge looked "peel shaped" (an oval/capsule, not a circle), and the status dot's green fill had visibly shrunk once its ring went opaque ("make it proportional"). Both traced to a real implementation bug in the §13 change, not a further design request:

- Both `status` and `verification` used `box-sizing: border-box`, meaning `metrics.status`/`metrics.verification` specified the TOTAL outer size and the border ATE INTO it. At `md`, a 10px status box with an opaque 3px border left only a 4px visible green center — a real, disproportionate shrink. This was invisible before §13 because the OLD translucent border let the green bleed through the ring itself, visually masking how little of the box was actually opaque green.
- `verification`'s container had no `overflow: hidden`. A consumer-supplied `verificationContent` glyph sized independently of the container (the common case — a fixed-size icon, not one that shrinks to fit) could overflow the ring's inner edge, reading as a pill/capsule rather than a clean circle once the ring shrank the inner content area.

Fixed by switching both to `box-sizing: content-box` — `status`/`verification` now specify the pure fill/content diameter, and the ring is added AROUND it (growing the total footprint, e.g. `status` at `md`: 10px fill + 3px ring each side = 16px total) rather than eating into it — and adding `overflow: hidden` to `verification` so any oversized consumer content clips to the circle rather than bulging past it.

**Important implementation note:** `box-sizing` must be set EXPLICITLY to `"content-box"` — simply removing the `border-box` override is not enough. Both the docs app and most real consumer apps (e.g. anything using Tailwind's preflight) apply a global `* { box-sizing: border-box }` reset, which silently wins over an unset inline style. This was caught only by checking `getComputedStyle`/`getBoundingClientRect` live in the browser after the first attempt (which removed the property instead of overriding it) produced no visible change at all.

Tests added: both `status` and `verification` now assert `boxSizing === "content-box"` explicitly (not just `!== "border-box"`), and `verification` asserts `overflow === "hidden"`. 699/699 passing (`@shikho/ui`, up from 697). Typecheck clean. Docs build clean. Verified live at 4x zoom: both indicators render as clean circles, with the green status fill visibly restored to its full proportioned size.

## 15. `status` re-confirmed against a real reference example — corrects §14's own guess

User follow-up: a direct Figma link to node `66200:18587`, an xl/64px avatar example carrying a real "online-badge" child instance, asked to "take reference and update accordingly on every size." Unlike everything else in §13/§14 (deliberate requested overrides with no Figma basis), this is a genuine confirmed data point — `get_design_context` returned the actual downloaded SVG asset, not a description:

```
<circle cx="8" cy="8" r="6.75" fill="#2ECC70" stroke="white" stroke-width="2.5" />
```
in a 16×16 slot, positioned at the avatar's bottom-right corner (matching `status`, not `verification`).

That gives, at `xl`: **total 16px, 2.5px stroke, 11px inner fill** — i.e. `status` really is the confirmed TOTAL diameter (border-box, matching §8's original `size-[10px]` framing) and the stroke sits INSIDE it, but at a fill/total ratio of 68.75% — nowhere near the ~40% the original `10px/3px` (md) guess produced, which is what actually caused §14's "disproportionate" complaint. §14's content-box fix corrected the *symptom* with an invented ratio; this corrects it with the *real* one, which turns out to still be border-box, just with much larger totals and much thinner (relatively) borders than guessed.

Applied via two confirmed ratios, held constant across all 5 sizes: `status` = avatar `box` ÷ 4 exactly; `statusBorder` = `status` × 0.15625 exactly (both derived from the one confirmed `xl` sample, since this reference doesn't cover the other 4 sizes independently). Only `xl`'s own `status` value actually changes (14 → 16, correcting what the original v0.1.0 measurement apparently got slightly wrong); `xs`/`sm`/`md`/`lg` already sat exactly on the `box÷4` ratio by coincidence, so their `status` values are untouched — only their `statusBorder` values change, from the old flat 2px/3px two-step guess to the newly-derived 0.9375/1.25/1.5625/1.875/2.5px scale. `status`'s `box-sizing` reverts to `border-box` (see its own render comment). `verification` is unrelated to this reference (no sample exists for it here) and stays as `content-box` — but it still reuses `statusBorder` for its own ring width (an intentional shared value, §14), so its ring thinned along with `status`'s.

Tests updated to the new per-size `statusBorder` values and `xl`'s corrected `status`. 699/699 passing (`@shikho/ui`). Typecheck clean. Docs build clean. Verified live at 4x zoom: the green fill is now clearly the dominant visual, with a thin, clean white ring — matching the reference screenshot's proportions.

## 16. New feature: `ring` — a solid border around the whole avatar

The same reference (node `66200:18587`) also drew a second element the status fix above didn't cover: the root `avatar` frame itself carries `border-3 border-[#8f45f5]` — a solid purple 3px ring around the ENTIRE avatar, not just the corner badge. Unlike `status`, this is genuinely new: no property on the actual `avatar` component set exposes it (confirmed absent, same as `verification_tick`'s missing border, §13) — this one Figma instance just has a hardcoded border applied directly to that specific frame, not a documented, reusable variant.

Implemented as `ring?: boolean` + `ringColor?: string` (no default color — the reference's purple is that one example's own choice, not a confirmed universal "ring = active" semantic, so a consumer must supply one). Stroke width reuses the confirmed `3px @ xl` value from the reference, scaled to the other 4 sizes by the same box-ratio approach `statusBorder` used in §15 (`ringWidth` = avatar `box` × 0.046875, i.e. 3/64): xs 1.125, sm 1.5, md 1.875, lg 2.25, xl 3.

Implementation note, same caveat as `status`/`verification`'s own `box-sizing` fix (§14): the avatar's root div now explicitly sets `box-sizing: content-box`, otherwise a global `border-box` reset (present in the docs app and most real consumer apps) would make the ring's border eat into the declared `box` size and shrink the avatar image itself, rather than adding a ring around it.

Tests added for default (no border), color, per-size scaling, and the explicit `content-box`. 703/703 passing (`@shikho/ui`, up from 699). Typecheck clean. Docs build clean. Verified live: all 5 sizes render a clean, proportionally-scaled ring around the avatar image, matching the reference.

## 17. `ring` renamed to `badge`; `verification` removed entirely

Direct follow-up request: "rename ring with badge and remove the current badge." Two changes:

- `ring`/`ringColor` (§16) renamed to `badge`/`badgeColor` — same behavior, same confirmed-3px-at-xl reference, same per-size scaling, just a different name. The internal `ringWidth` metric field is now `badgeWidth`.
- `verification`/`verificationContent` (§8's confirmed top-right checkmark container, later given a requested white ring and +2px size bump in §13) is **removed entirely** — no longer a prop on `Avatar` at all. This is a real deletion, not a rename: `verification` was a small corner badge; `badge` is an unrelated whole-avatar ring. Consumers who want a checkmark-style corner indicator now have no built-in slot for it — only `status` (bottom-right dot) and `badge` (whole-avatar ring) remain.

Updated everywhere `verification`/`ring` were referenced: `avatar.tsx` (props, metrics table, render), `avatar.test.tsx`, `avatar.stories.tsx` (`WithVerification`/`StatusAndVerification` stories replaced with `WithBadge`/`StatusAndBadge`), `apps/docs/src/registry/pages/avatar.tsx` (playground control, props table, gaps, showcases), `docs.meta.ts`, and `README.md` (added an "Implementation note" section pointing at this history rather than rewriting the original confirmed/derived findings, which stay accurate to what the original Figma audit found).

700/700 passing (`@shikho/ui`, `verification`'s own describe block removed, `badge`'s tests carried over from `ring` unchanged in substance). Typecheck clean in both packages. Docs build clean. Verified live: the playground now shows a single "Badge" control (the old separate verification checkmark toggle is gone), correctly rendering the whole-avatar ring.

## 18. Requested: a real default glyph for `type="icon"`

Direct request: "On the avatar, there is a type name 'Icon'. On the icon update this svg" (a downloaded reference asset, `user.svg` — a flat person silhouette on its own light-blue circle background). `type="icon"` previously had no default content at all — every usage across stories/docs/playground supplied a 👤 emoji as a manual placeholder, per §10's own note that `@shikho/icons` had no glyphs yet.

Not a Figma correction — this glyph doesn't exist anywhere in the audited `avatar` component set, so it's implemented as a genuinely new, non-Figma-sourced icon:

- Added `UserIcon` to `@shikho/icons` (`packages/icons/src/icons/user.tsx`), combining the reference's two shapes (shoulders path + head circle, the circle converted to an equivalent arc path) into one `d`. The reference's own light-blue background circle was dropped — `Avatar`'s `type="icon"` root already draws its own confirmed secondary gradient fill (§9), and stacking a second circle behind the glyph would double up backgrounds. Documented in the icon's own doc comment as the one exception to this package's "every icon is Figma-sourced" convention.
- `avatar.tsx`'s `type="icon"` slot now renders `children ?? <UserIcon width="100%" height="100%" />`, so any consumer-supplied `children` still takes priority (unchanged existing behavior) and only the previously-empty default case is filled in. Colored via `color: initialsColor` (the confirmed `white/900` token already used for `type="text"`'s initials) on the container span, so the glyph paints via `currentColor` consistent with the rest of the icon system.

Updated everywhere the 👤 placeholder appeared: `avatar.stories.tsx` (`Types` story), `apps/docs/src/registry/pages/avatar.tsx` (playground render, "The three types" showcase, `children` prop description, gaps), and `README.md`.

Tests added: `@shikho/icons` gets a dedicated `UserIcon` describe block (name, viewBox, two-subpath path) kept separate from the existing "real bezier data" assertion, which doesn't apply to this arc-based glyph. `avatar.test.tsx` gets two new tests — the default glyph renders when `children` is omitted, and explicit `children` still take priority over it. 14/14 `@shikho/icons` tests (up from 11), 41/41 avatar+avatar_group tests, 715/715 full `@shikho/ui` suite. Typecheck clean in both packages. Docs build/test clean.
