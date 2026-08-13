# Alerts Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0"
Frames audited:
- `Alerts` overview (node `66071:27944`), containing a single component set
- Deep instance audit: `alert` / `💡 state=danger` (node `66071:28138`), via `get_design_context`

Method: `get_metadata` and `get_variable_defs` for the overview; `get_design_context` (explicitly authorized) for the deep instance audit. Each finding is marked with its source.
Status: **Audit only.** No code, components, or project configuration were generated. No variable, style, or layer names were renamed or normalized.

---

## 1. Component set and node ID

| Name | Node ID |
|---|---|
| `alert` | `66071:28125` |

(Plus an unrelated `overview_sheet_sidebar` instance, `66071:27945`.) **This is the only component set in the entire selection** — no additional demo compositions or bare instances exist here, same minimal pattern as the Tooltips audit.

---

## 2. Exposed property and variant values

Exactly one property: **`state`** (💡 icon — reusing the same property-icon convention as interaction states in other components, though here it functions as a severity/theme axis, not an interaction state — see §7 and §11).

**5 values, verbatim:** `Default`, `danger`, `success`, `warning`, `info`.

**Confirmed casing inconsistency within a single property's value set:** `Default` is capitalized while `danger`, `success`, `warning`, `info` are all lowercase.

---

## 3. Variant count

**5 variants** (state only), confirmed against the full symbol list. All 5 share identical bounding-box dimensions, **424×156**.

---

## 4. Sizes, states, severities — confirmed coverage

- **Sizes:** none — no `size` property exists.
- **States:** named `state`, but functionally a **severity/theme** axis, not an interactive state: `Default` (baseline/neutral), `danger`, `success`, `warning`, `info`. No hover/focus/disabled/active values exist — consistent with alerts typically being static, non-interactive UI.

---

## 5. Whether icons, titles, descriptions, buttons, actions, dismiss controls, and badges are exposed as properties

**None of these appear as named top-level variant properties.** Only `state` exists. However, the variable export suggested a plausible title + description structure: `web/Title/15 Semibold` (new composite, 15px/Semibold) alongside `web/Body/13 Semibold` (13px/Semibold) both bound in this subtree — a plausible inference from token presence, not a confirmed structural fact at the overview stage. **Confirmed structurally in the deep audit below (§9).**

---

## 6. True component set vs. demo composition

**`alert` is a true, atomic component set** — 5 severity variants, uniform 424×156 dimensions. No demo compositions or bare instances exist in this selection, matching the sparse pattern already seen in the Tooltips audit.

---

## 7. Typography tokens (overview-level)

```
web/Title/22 Semibold, web/Title/76 Semibold, web/Title/32 Medium,   ← likely unrelated sidebar/heading spillover
web/Title/15 Semibold,                                                ← new composite, confirmed as title text in the deep audit
web/Body/13 Semibold                                                  ← confirmed in the deep audit as the ACTION BUTTON label
                                                                          typography, not the description (correction, see §11)

Primitives present without an accompanying named composite in this export:
font/family/primary = "Noto Sans Bengali"
font/size/body_1 = 13
font/line_height/para = 20
font/weight/default/normal = 400
```
Same anomaly flagged in the Tooltips audit: raw `body_1`/`para`/`normal` primitives appear without a corresponding named composite — consistent with the pattern of missing normal/400-weight composites documented in the original Typography audit.

---

## 8. Spacing, radius, border, elevation, and effect tokens (overview-level)

```
spacing/4, 6, 8, 12, 16, 24, 32, 40, 48

radius/border_radius_round = 1000
radius/border_radius_xl = 20
radius/custom/md = 10          ← only one "custom/*" token present, similar to Tooltips' single custom/sm
radius/border_radius_5xl = 40
radius/border_radius_8xl = 64

outline/Black 50 / 100     outline/Gray 100 / 200 / 400

elevation/e2 = (confirmed 2-layer, identical to prior audits)
elevation/e3 = (confirmed 3-layer, identical to the Tooltips audit — additive-stacking pattern confirmed there)
elevation/e5 = (confirmed 5-layer, identical to prior audits)
secondary_button_effect = (confirmed 4-layer, identical to Buttons audit — likely spillover)
secondary_special_outline = ""   ← still unresolved, consistent with every prior audit
```

---

## 9. Color and semantic tokens (overview-level)

A clean, internally consistent pattern — a notable exception to the naming proliferation flagged elsewhere:
```
outline/danger_alpha  = #f03d3d3d   (≈24% alpha of danger/500)
outline/success_alpha = #35c2203d   (≈24% alpha of success/500)
outline/warning_alpha = #fcbf043d   (≈24% alpha of warning/500)
outline/info_alpha    = #118be83d   (≈24% alpha of info/500)
```
All four follow the identical `outline/{severity}_alpha` naming convention with matching ≈24% opacity — the most internally consistent alpha-naming pattern found in this audit series so far, even though it is still a *sixth* distinct naming style overall.

Paired severity text colors:
```
Text/Danger 500 = #f03d3d     Text/Danger 600 = #e92020
Text/Success 500 = #35c220    Text/Success 600 = #2a9919
Text/Warning 500 = #fcbf04
Text/Info 500 = #118be8
```
Plus known values: `Text/Primary 500`, `Text/Gray 600/700/950`, `Text/White 950`, `Color/White 100`, `Color/gray/100`, `Color/Secondary/500`, `Color/smoke_base/low`, `Color/inverse_black_neutral`.

---

## 10. Duplicated, inconsistent, or suspicious variants; naming inconsistencies (overview-level)

- **`Default` capitalized vs. `danger/success/warning/info` lowercase** within the same property.
- **`state` property name doesn't match its actual function** — it encodes severity/theme, not an interaction state, continuing the same type-vs-state architectural ambiguity already flagged between `list` and `switcher_item`.
- **Only one `radius/custom/*` token present** (`md`, 10) — consistent with the same narrow-radius-subset pattern observed in the Tooltips audit.
- **`outline/{severity}_alpha` is a sixth alpha-suffix naming convention**, though notably the most internally consistent one found so far.

---

## 11. Deep audit: `alert` / state=danger (node `66071:28138`)

*(Source: `get_design_context`)*

### Internal layer hierarchy
```
66071:28138  "alert" (root, state=danger)
├─ (absolute fill overlay — background layer, no separate node-id given)
├─ 66071:28139  "icon / info" (24×24)   [rendered — leftIcon=true]  ← literal layer name says "info" despite this being the DANGER variant
│  └─ I66071:28139;4256:129272   "vector"
├─ 66071:28140  "alert_cell"
│  ├─ 66071:28141  "text"
│  │  ├─ 66071:28142  "header"
│  │  │  └─ 66071:28143  <text container>
│  │  │     └─ <p> "Notification text"
│  │  └─ 66071:28144  "description"
│  │     └─ 66071:28145  <text container>
│  │        └─ <p> "A short description followed by two actions items."
│  └─ 66071:28146  "actions"
│     ├─ 66071:28147  "button_danger/md/secondary/default"   ← literal instance name, confirms a direct nested dependency on the Buttons audit's `button_danger` component set
│     │  ├─ (absolute fill overlay)
│     │  ├─ I66071:28147;50046:96165   "text_wrap"
│     │  │  └─ I66071:28147;1126:23398   <text> "Learn more"
│     │  └─ (absolute inset overlay — inner shadow)
│     └─ 66071:28148  "button"
│        ├─ (absolute fill overlay)
│        ├─ I66071:28148;50046:96070   "text_wrap"
│        │  └─ I66071:28148;48:2050   <text> "Dismiss"
│        └─ (absolute inset overlay — inner shadow)
└─ 66071:28149  "icon_button"   ← ABSOLUTE-positioned (right-11px, top-11px), outside the main flex flow
   └─ I66071:28149;263:4093   "icon" (18×18)
      └─ I66071:28149;263:4093;935:6213   "vector"
```

### Confirmed facts

- **Boolean properties:** only **`leftIcon`** (default `true`). No boolean exists for title, description, actions, or the corner `icon_button` — they render unconditionally in this component, unlike every prior component family (typically 3–12 booleans).
- **Instance-swap properties:** **none.** A confirmed absence, distinct from `field`, `list`, `switcher_item`, and `sidebar_item`, all of which exposed `selectLeftIcon`/`selectRightIcon` swap slots.
- **Nested component dependency — the clearest cross-component confirmation in this entire audit series:** the first action button's layer is literally named `button_danger/md/secondary/default`, directly citing its source component set, size, type, and state from the Buttons audit. The second button (`"button"`) has a structurally consistent layout but is not explicitly path-named.
- **Icons/title/description/actions/dismiss confirmed:** icon (mis-named "icon / info" internally despite the `danger` variant); title "Notification text" (`web/Title/15 Semibold`); description "A short description followed by two actions items." (Regular/400 weight, `text/gray-700`, `#5b616d` — **not** `web/Body/13 Semibold` as speculated at the overview stage, see §7 correction); two action buttons ("Learn more" via the nested `button_danger` instance, "Dismiss" via a second button instance — both `web/Body/13 Semibold`); **and a second, separate dismiss-like control** — a floating circular `icon_button` in the top-right corner, absolutely positioned outside the normal layout flow. No badges found.
- **Layout:** root `flex items-start` — **top-aligned**, not centered, a confirmed difference from nearly every other component audited (which used `items-center`). `alert_cell` `flex-col items-start justify-center flex-[1_0_0]`; `text`/`header`/`description`/`actions` each `flex` with their own alignment; both buttons and `icon_button` `flex items-center justify-center`.
- **Sizing:** root `w-[424px]` (Fixed), height **Hug** (no explicit height class, matching the confirmed 156px); `left_icon` `size-[24px]` Fixed; `alert_cell` `flex-[1_0_0]` (Fill/grow); buttons `h-[40px]` Fixed, width Hug; `icon_button` `size-[32px]` Fixed, circular, **absolutely positioned** — breaks out of the flex flow entirely.
- **Padding/gaps:** root `p-[spacing/24, 24px]` uniform, `gap-[spacing/16, 16px]`; `alert_cell` `gap-[spacing/16, 16px]`; `text`/`header`/`description`/`actions` each `gap-[spacing/8, 8px]`; buttons `px-[spacing/12, 12px] py-[spacing/8, 8px] gap-[spacing/4, 4px]`; `icon_button` `p-[spacing/8, 8px] gap-[spacing/6, 6px]`.
- **Typography — corrects the overview's speculation:** title is SemiBold, `title_1` (15px/24px), `text/gray-950` (`#0a0c11`) — confirmed `web/Title/15 Semibold`. **Description is Regular/400 weight** (`font/weight/default/normal`), `body_1`/`para` (13px/20px), `text/gray-700` (`#5b616d`) — **not** SemiBold. Both button labels are SemiBold, `body_1`/`para` — confirmed `web/Body/13 Semibold` genuinely belongs to the **button labels**, not the description as originally speculated. "Learn more" → `text/danger-600` (`#e92020`); "Dismiss" → `text/white-950` (white).
- **Fill/border/radius:** root fill `Color/smoke_base` (white); root border full solid, color **`outline/danger_alpha`** (`rgba(240,61,61,0.24)`) — confirmed genuinely applied for the `danger` state; root radius `radius/border_radius_xl` (20px).
- **Elevation — two fully, cleanly confirmed applications, a first in this audit series:**
  - Root shadow = **exactly `elevation/e5`'s complete 5-layer stack** (all five offset/blur/spread values match precisely).
  - `icon_button`'s shadow = **exactly `elevation/e3`'s complete 3-layer stack** — reinforcing the additive-stacking pattern first identified in the Tooltips audit.
  - `left_icon` and `icon_button`'s inner icon both carry `elevation/e2`-matching drop-shadows; the inner icon is 18×18, **confirmed different** from `left_icon`'s 24×24.
  - Both action buttons: fill `Color/gray/100` (`button_danger`) / `Color/secondary/500` ("Dismiss"), radius `radius/custom/md` (10px), a single-layer shadow matching `elevation/e2`'s smaller layer, plus an inner-shadow overlay matching **2 of `secondary_button_effect`'s 4 layers** (the same partial-match pattern seen in the List/Sidebar Navigation audits).
- **Overrides:** none — `leftIcon` at its default, `state="danger"` is simply this variant's identity.
- **Severity — layout vs. styling:** **not fully confirmed** without inspecting `Default`/`success`/`warning`/`info` (out of scope, no sibling inference). The full structure is present in this `danger` instance with no severity-conditional layer visible; the most plausible severity-driven differences are the border color and the "Learn more" label color, but this isn't confirmed against siblings.

### Not confirmed / unresolved

- Whether `Default`/`success`/`warning`/`info` share this exact structure with only color changes.
- Why the icon layer is literally named "icon / info" despite being used in the `danger` variant.
- Whether the second button ("Dismiss") is drawn from a specific named component set the way "Learn more" explicitly is.
- Whether the "Dismiss" text button and the corner `icon_button` reflect two distinct intended controls or redundancy.
- The real icon glyph content beyond placeholder asset URLs.

---

## 12. Dependencies on previously audited components

- **Confirmed direct nested dependency on `button_danger`** (Buttons audit) — explicit literal instance name (§11), the strongest cross-component confirmation in this entire series.
- `elevation/e2` (icon shadows, single-layer button shadows — every prior audit).
- `elevation/e3` — **fully confirmed applied** to `icon_button`, reinforcing the Tooltips audit's discovery and the additive-stacking hypothesis.
- `elevation/e5` — **fully confirmed applied** to the root, the first complete (non-spillover) confirmation of this token in the whole series.
- `secondary_button_effect` — 2 of 4 layers confirmed present on both action buttons (Buttons, List, Sidebar Navigation audits — same partial pattern).
- `radius/custom/md`, `radius/border_radius_round/xl/5xl/8xl` (Buttons, Button Group, Input, List, Switcher, Sidebar Navigation, Tooltips audits).
- `spacing/4, 6, 8, 12, 16, 24` (consistent across every prior audit).
- `Color/gray/100`, `Color/secondary/500`, `Color/smoke_base/low` (Colors, Input, List, Switcher, Sidebar Navigation, Tooltips audits).
- `Text/gray-950/700`, `Text/danger-600`, `Text/white-950` (Colors, Buttons, Input audits).
- `web/Title/15 Semibold` — confirmed genuinely applied to the title, resolving the overview's flagged new composite.
- `web/Body/13 Semibold` — confirmed applied to **both button labels**, correcting the overview's speculation that it belonged to the description.
- `secondary_special_outline` (still unresolved, consistent with every prior audit).

---

## 13. Anything MCP cannot retrieve

- Whether `Default`/`success`/`warning`/`info` share the audited `danger` instance's exact structure with only color changes — out of scope, no sibling inference performed.
- Why the icon layer is literally named "icon / info" despite being used in the `danger` variant — confirmed mismatch, reason unknown.
- Whether the second button ("Dismiss") is drawn from a specific named component set the way "Learn more" explicitly is.
- Whether the "Dismiss" text button and the corner `icon_button` reflect two distinct intended controls or redundancy.
- The real icon glyph content beyond placeholder asset URLs.
- Whether `alert` truly uses only `radius/custom/md`, or additional radius steps exist unbound in this subtree.
- Default variant configuration for `alert`.
- Variable Collection / Mode metadata — not retrievable, consistent with every prior audit in this series.

---

## 14. Deep re-audit addendum — all 5 severities checked, real icon glyphs recovered (this pass)

§11 deep-audited only the `danger` instance and left every other severity's structure/icon unconfirmed. This section closes that gap: `get_design_context` was re-run on `Default` (`66071:28126`), `success` (`66071:28150`), `warning` (`66071:28162`), `info` (`66071:28174`), and `danger` again (`66071:28138`, re-verified rather than trusted from memory), then the actual `imgVector` asset URLs behind the severity icon and the corner close icon were downloaded across multiple severities to recover their real SVG source.

**Confirmed — the severity icon is the SAME glyph in every state, only re-tinted.** Downloading the icon asset behind all 5 severities shows byte-identical path data (an info-circle) in every case — the confirmed literal layer name "icon / info" is not a mislabeling artifact, it turns out to genuinely always be an info-circle, regardless of severity. Only the `fill` differs, and it exactly matches that severity's own `500` color:

| `state` | Icon fill |
|---|---|
| `Default` | `#5468FF` (`primary/500`) |
| `danger` | `#F03D3D` (`danger/500`) |
| `success` | `#35C220` (`success/500`) |
| `warning` | `#FCBF04` (`warning/500`) |
| `info` | `#118BE8` (`info/500`) |

**Confirmed — the corner close-button icon is ALSO the same glyph in every state**, a simple "X", downloaded and byte-compared across `Default`/`success` — identical path data, fixed fill `#5B616D` (`text/gray-700`), not tinted by severity at all.

**Confirmed — the corner `icon_button` has a `gray/100` fill**, not transparent as the pre-rebuild implementation assumed (every one of the 5 re-fetched samples shows `bg-[var(--color/gray/100,#f4f4f6)]` on this element).

**Confirmed — `Default`'s border is `outline/gray-100` (`#f4f4f6`)**, not `gray-200` as previously derived when only `danger` had been sampled (there was no `Default` data to check that guess against before).

**Confirmed — the primary action button's construction genuinely differs by severity, not just by color:**
- `danger`: literally named `button_danger/md/secondary/default` — the real `ButtonDanger` component, `text/danger-600` text (already confirmed in §11).
- `success`: literally named `button_success/md/secondary/default` — a newly confirmed second cross-component dependency, on `ButtonSuccess`, `text/success-600` text.
- `Default`/`warning`/`info`: named plainly `"button"` (no severity-specific path), with a flat `gray/100` fill and `gray/700` text — **confirmed NOT color-tinted**, unlike `danger`/`success`. This is a real, non-trivial asymmetry: only 2 of the 5 severities compose a themed Button family member for their first action; the other 3 share one plain neutral button.

**Confirmed unchanged across all 5 severities:** the second action button ("Dismiss": `secondary/500` fill, white text), the root's fill/radius/shadow, the layout structure, and the typography.

**Rebuild:** `alert.tsx` now renders real default icons — the confirmed info-circle (tinted per `state`) for the left icon slot, and the confirmed "X" for the corner close button — both as inline SVGs built from the exact downloaded path data, rendered whenever the caller doesn't supply `icon`/`closeIcon` overrides. The primary action button now branches on `state`: `ButtonDanger` for `danger`, `ButtonSuccess` for `success` (a newly confirmed nested dependency), and a plain neutral button for `Default`/`warning`/`info`. `Default`'s border color was corrected from a derived `gray/200` guess to the confirmed `gray/100`, and the corner `icon_button`'s fill was corrected from transparent to the confirmed `gray/100`.

## 15. Requested: color mapping reversed — "Learn more" stays neutral, "Dismiss" inherits state, surface tinted, icon bigger

Direct request, resubmitted because it had only been partially implemented previously (the interactive-preview STATE→ICON→BUTTONS controls already existed; the color mapping and icon-size items below did not). This **inverts** §14's own confirmed per-severity button construction — a deliberate departure, not a further correction:

1. **"Learn more" (first action button) now stays plain neutral gray at every severity**, including `danger`/`success` — it no longer composes `ButtonDanger`/`ButtonSuccess` (§11/§14's confirmed construction). The `ButtonDanger`/`ButtonSuccess` imports were removed from `alert.tsx` entirely; the primary button is now a single unconditional neutral `<button>`, matching what `Default`/`warning`/`info` already rendered.
2. **"Dismiss" (second action button, "the primary semantic action" per the request) now inherits `state`'s own color**, replacing the confirmed flat `secondary/500` pink (§11/§14, unchanged across all 5 severities until now):
   - `Default` → `primary/500` (explicitly named: "instead of the current pink/accent action treatment")
   - `danger` → `danger/500`
   - `success` → `success/500`
   - `warning` → `warning/500`, with text **`warning/950`** specifically (explicitly named — `warning/500` is a bright yellow that fails contrast with white text; every other state keeps white text)
   - `info` → `info/500` — **not named in the request's mapping list**; extended by analogy to match its own already-confirmed icon tint, the same "least invented extension" pattern used elsewhere in this codebase
   
   Hover darkens from each state's own `500` to `600`, replacing the flat `secondary/500`→`600` hover.
3. **The root surface fill is now severity-tinted** (`X/50`) for `danger`/`success`/`warning`/`info`, replacing the confirmed flat `white/smoke_base` (§11, unchanged across all 5 until now). `Default`'s fill is **unchanged** — not named in the request. `info`'s fill wasn't named either; extended by the same `X/50` pattern for consistency with the stated "Alert state controls the semantic surface" rule.
4. **The severity icon is a bit bigger**: slot 24px→28px, glyph 18px (previously unset, the icon's own native default)→22px (an explicit `size` prop).

Every color table (`fillByState`, `dismissColorByState`, `dismissHoverColorByState`, `dismissTextColorByState`) lives in `alert.tsx` with its own comment citing exactly which values were named in the request vs. extended by analogy for `info`. Tests rewritten throughout `alert.test.tsx` — the two describe blocks that asserted `ButtonDanger`/`ButtonSuccess` composition and `data-state` attributes were replaced with tests asserting the new neutral-everywhere / state-tinted-Dismiss behavior. 709/709 passing (`@shikho/ui`, up from 704 — net +5 after removing/replacing several ButtonDanger/ButtonSuccess-specific tests and adding new coverage). Typecheck clean in both packages. Docs build clean. Verified live: `danger` shows a light red surface with a solid red Dismiss; `Default` shows its unchanged white surface with a blue (`primary/500`) Dismiss; `warning` shows a light yellow surface with a yellow Dismiss and dark (`warning/950`) text for contrast; "Learn more" stays the same neutral gray button in all three.
