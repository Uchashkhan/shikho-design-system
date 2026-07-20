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
