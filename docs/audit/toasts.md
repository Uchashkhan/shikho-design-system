# Toasts Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0"
Frames audited:
- `Toasts` overview (node `66074:28372`), containing a single component set
- Deep instance audit: `toast` / `💡 state=danger` (node `66074:28520`), via `get_design_context`, compared directly against the `alert` deep audit

Method: `get_metadata` and `get_variable_defs` for the overview; `get_design_context` (explicitly authorized) for the deep instance audit. Each finding is marked with its source.
Status: **Audit only.** No code, components, or project configuration were generated. No variable, style, or layer names were renamed or normalized.

---

## 1. Component set and node ID

| Name | Node ID |
|---|---|
| `toast` | `66074:28507` |

(Plus an unrelated `overview_sheet_sidebar` instance, `66074:28373`.) **This is the only component set in the entire selection** — no additional demo compositions or bare instances, matching the same minimal pattern as Tooltips and Alerts.

---

## 2. Exposed property and variant values

Exactly one property: **`state`** (💡 icon), functioning as a severity/theme axis rather than an interaction state — same architecture as `alert`.

**5 values, verbatim:** `default`, `danger`, `success`, `warning`, `info`.

**Confirmed cross-component casing inconsistency:** the baseline value here is `default` (lowercase), whereas the equivalent baseline in `alert` was `Default` (capitalized) — the same concept, different casing, across two sibling severity-based components.

---

## 3. Variant count and dimensions

**5 variants** (state only), confirmed against the full symbol list. All 5 share identical dimensions: **528×76**.

---

## 4. Sizes, states, severities — confirmed coverage

- **Sizes:** none.
- **States:** named `state`, functioning as severity: `default, danger, success, warning, info`. No interactive states — consistent with `alert`'s static-severity pattern.
- **Severity vocabulary:** identical 5-value set as `alert`, differing only in the casing of the baseline value.

---

## 5. Whether icons, titles, descriptions, buttons, actions, dismiss controls, and badges are exposed as properties (overview-level)

**None appear as top-level variant properties** — only `state`. The typography signature (`web/Title/15 Semibold`, `web/Body/13 Semibold`) matched `alert`'s confirmed pattern, correctly predicting a similar title/description/action structure — **fully confirmed in the deep audit (§9)**, with several structural differences also confirmed there.

---

## 6. True component set vs. demo composition

**`toast` is a true, atomic component set** — 5 severity variants, uniform 528×76 dimensions. No demo compositions or bare instances exist in this selection.

---

## 7. Typography, spacing, radius, border, elevation, and effect tokens (overview-level)

```
Typography:
web/Title/22 Semibold, web/Title/76 Semibold, web/Title/32 Medium   ← likely unrelated spillover
web/Title/15 Semibold                                                ← confirmed applied to title in the deep audit
web/Body/13 Semibold                                                 ← confirmed applied to the action button label in the deep audit
Primitives without a named composite: font/family/primary, font/size/body_1=13,
  font/line_height/para=20, font/weight/default/normal=400            ← confirmed as the Regular-weight description in the deep audit

Spacing: 4, 6, 8, 12, 16, 24, 32, 40, 48

Radius:
radius/border_radius_round = 1000     radius/border_radius_xl = 20
radius/custom/md = 10     radius/custom/sm = 8
radius/border_radius_5xl = 40     radius/border_radius_8xl = 64

Outline: outline/Black 50/100     outline/Gray 100/200/400

Effects:
elevation/e2 = (confirmed 2-layer, identical to prior audits)
elevation/e5 = (confirmed 5-layer — this is the token alert's root uses, NOT toast's)
elevation/e6 = (confirmed 6-layer — CONFIRMED as toast's own root shadow in the deep audit, §12)
secondary_button_effect = (confirmed 4-layer — 2 of 4 layers confirmed applied to the action button in the deep audit)
secondary_special_outline = ""   ← still unresolved, consistent with every prior audit
```

---

## 8. Color and semantic tokens (overview-level)

```
Text/Danger 500/600, Text/Success 500/600, Text/Warning 500, Text/Info 500
Color/danger/500_alpha_12 = #f03d3d1f     outline/danger_alpha = #f03d3d3d
Color/success/500_alpha_12 = #35c2201f    outline/success_alpha = #35c2203d
outline/warning_alpha = #fcbf043d         outline/info_alpha = #118be83d
Color/gray/100, Color/Secondary/500
Color/smoke_base/low, Color/inverse_black_neutral
Text/White 950, Text/Gray 600/700/950
```
**Confirmed: two different alpha-suffix naming systems coexist for the same severity colors** — `Color/danger/500_alpha_12` (Buttons-style `_alpha_12`, ≈12%) and `outline/danger_alpha` (Alert-style, ≈24%) both derive from `danger/500` as two different, non-duplicate opacity steps under two different naming conventions.

---

## 9. Deep audit: `toast` / state=danger (node `66074:28520`)

*(Source: `get_design_context`)*

### Internal layer hierarchy
```
66074:28520  "toast" (root, state=danger)
├─ 66074:28521  "icon / info" (24×24)        [rendered — leftIcon=true]   ← same mis-naming pattern as alert's icon
│  └─ I66074:28521;4256:129272   "vector"
├─ 66074:28522  "feature_icon"               [NOT rendered — featureIcon=false]  ← new slot, no equivalent in alert
│  └─ I66074:28522;2064:47273   "icon" (28×28)
│     └─ I66074:28522;2064:47273;29:307   "vector"
├─ 66074:28523  "alert_cell" (flex-ROW — differs from alert's flex-COL despite identical layer name)
│  ├─ 66074:28524  "text"
│  │  ├─ 66074:28525  "header"
│  │  │  └─ 66074:28526  <text container>
│  │  │     └─ <p> "Withdrawal Successful"
│  │  └─ 66074:28527  "description" (flex-ROW — differs from alert's flex-COL)   [rendered — desc=true]
│  │     └─ 66074:28528  <p> "Your withdrawal of 0.02 BTC has been processed "
│  └─ 66074:28529  "actions"                 [rendered — actionButton=true]
│     └─ 66074:28530  "button_danger"        ← shorter instance name than alert's full path, same nested dependency
│        ├─ (absolute fill overlay)
│        ├─ I66074:28530;50046:96168   "text_wrap"
│        │  └─ I66074:28530;1126:23382   <text> "UNDO"
│        └─ (absolute inset overlay — inner shadow)
└─ 66074:28531  "icon_button" (32×32)        [rendered — rightIcon=true]  ← inline flex sibling, NOT absolutely positioned (differs from alert)
   └─ I66074:28531;263:4045   "icon" (18×18)
      └─ I66074:28531;263:4045;935:6213   "vector"
```

### Confirmed facts

- **Boolean properties (5):** `actionButton`, `desc`, `featureIcon` (default **false**), `leftIcon`, `rightIcon` — significantly more than `alert`'s single boolean (`leftIcon` only).
- **Instance-swap properties:** none — same confirmed absence as `alert`.
- **Nested component dependency:** confirmed same `button_danger` component set (Buttons audit), instance named simply `"button_danger"` — less descriptive than `alert`'s full `"button_danger/md/secondary/default"` path, but the same underlying dependency.
- **Icon/title/description/action/dismiss:** all confirmed present, plus a new `feature_icon` slot (28×28, own padded/rounded container) with no equivalent in `alert`.
- **Layout:** root `flex items-center` (differs from `alert`'s `items-start`); `alert_cell` is a flex-**row** (differs from `alert`'s flex-**col**, despite the identical layer name); `description` container is likewise a flex-row (vs. `alert`'s flex-col); `text` and `actions` sit side-by-side in the same row (vs. `alert`'s stacked description-above-actions).
- **Sizing:** root `w-[528px]` Fixed, height Hug; icons Fixed; `text`/`alert_cell` Fill/grow.
- **Padding — asymmetric, a first in this audit series:** root `pt-[spacing/12, 12px] pb-[spacing/16, 16px] px-[spacing/16, 16px]` (vs. `alert`'s uniform `p-[spacing/24, 24px]`). `text` gap `spacing/4` (vs. `alert`'s `spacing/16`).
- **Typography:** title — SemiBold, `title_1` (15px/24px), `text/gray-950` — identical token to `alert`. Description — Regular/400, `body_1`/`para`, color **`text/gray-600`** (confirmed **different** from `alert`'s `text/gray-700`). Button label ("UNDO") — SemiBold, `body_1`/`para`, `text/danger-600` — same token/color as `alert`'s "Learn more."
- **Fill/border/radius:** root fill `Color/smoke_base`, border `outline/danger_alpha` (both identical to `alert`), radius `radius/border_radius_xl` (identical to `alert`). `feature_icon` uses `radius/custom/lg` (12px), a token not seen anywhere in `alert`.
- **Elevation — confirmed exactly `elevation/e6`'s complete 6-layer stack on the root** (§12), a clean contrast with `alert`'s `elevation/e5` (5 layers) — Toast is the more heavily elevated of the two.
- **Button fill differs:** `Color/danger/500_alpha_12` (danger-tinted) here vs. `Color/gray/100` (neutral) in `alert`'s equivalent button — same nested component, different fill choice.
- **Dismiss control differs structurally:** `icon_button` here is rounded-square (`radius/custom/sm`, 8px) and sits **inline** as a normal flex sibling — confirmed different from `alert`'s fully **circular** (`radius/border_radius_round`, 1000px), **absolutely positioned** corner `icon_button`.
- **Control count:** Toast has 1 action button ("UNDO") + 1 dismiss icon = 2 controls, vs. `alert`'s 2 action buttons ("Learn more" + "Dismiss") + 1 corner icon = 3 controls.
- **Overrides:** none — all props at plain defaults.

### Not confirmed / unresolved
- Whether `default`/`success`/`warning`/`info` states of `toast` share this exact structure — out of scope, no sibling inference.
- Why the icon layer is named "icon / info" despite the `danger` variant (same unresolved question as `alert`).
- Whether the shorter `"button_danger"` instance name (vs. `alert`'s full path) reflects a meaningful binding difference or is purely cosmetic.
- Real icon/feature-icon glyph content beyond placeholder asset URLs.

---

## 10. Structural similarities and confirmed differences from Alert

**Similarities:** same nested `button_danger` dependency; same root border token/color and radius; same title typography; same Regular/400-weight description pattern (color differs); same button-label typography/color; same "icon / info" naming quirk; same `icon_button` padding/gap values despite shape differences; same partial `secondary_button_effect` match on the action button.

**Confirmed differences:**
| Aspect | Toast | Alert |
|---|---|---|
| Root alignment | `items-center` | `items-start` |
| Root padding | asymmetric (12/16/16) | uniform (24) |
| Root elevation | `elevation/e6` (6 layers) | `elevation/e5` (5 layers) |
| `alert_cell` orientation | flex-row | flex-col |
| `description` orientation | flex-row | flex-col |
| Description text color | `text/gray-600` | `text/gray-700` |
| Text + actions composition | side-by-side | stacked |
| Action button fill | `Color/danger/500_alpha_12` | `Color/gray/100` |
| Dismiss control shape/position | rounded-square, inline | circular, absolutely positioned |
| Control count | 2 (1 action + 1 dismiss) | 3 (2 actions + 1 dismiss) |
| `feature_icon` slot | exists | none |
| Boolean-property count | 5 | 1 |

---

## 11. Duplicated, inconsistent, or suspicious variants; naming inconsistencies

- **`default` (toast) vs. `Default` (alert)** — identical baseline severity value, different casing, across two sibling components.
- **Two alpha-naming conventions applied to the same severity families simultaneously** — `_alpha_12` and `_alpha` (Alert-style) both present for `danger`/`success` in the same subtree.
- **`state` property name doesn't match its actual function** (severity, not interaction state) — same ambiguity as `alert`, `list`, `switcher_item`.
- **Same nested `button_danger` component rendered with two different fills** across Toast and Alert (§10) — a confirmed, deliberate-looking but unexplained visual divergence for nominally the same dependency.

---

## 12. Dependencies on previously audited components

Confirmed reuse of: `elevation/e2` (every prior audit); `elevation/e5` (confirmed as `alert`'s root shadow, not `toast`'s); `elevation/e6` — **confirmed as `toast`'s own root shadow**, resolving the overview's open question and reinforcing the additive-stacking family alongside e2/e3/e5; `secondary_button_effect` (Buttons, List, Sidebar Navigation, Alerts audits — 2 of 4 layers confirmed applied here too); `radius/custom/md/sm`, `radius/border_radius_round/xl/5xl/8xl` (Buttons, Button Group, Input, List, Switcher, Sidebar Navigation, Tooltips, Alerts audits); `radius/custom/lg` (new usage context here, previously seen in Buttons/List); `Color/gray/100`, `Color/Secondary/500`, `Color/smoke_base/low` (Colors, Input, List, Switcher, Sidebar Navigation, Tooltips, Alerts audits); `outline/danger_alpha`, `Color/danger/500_alpha_12` (Alerts audit — confirmed identical values, both naming conventions present); `Text/Gray`, `Text/White`, `Text/Danger` families (Colors, Buttons, Input, Alerts audits); `web/Title/15 Semibold`, `web/Body/13 Semibold` (confirmed applied to title and button-label text respectively — matching the exact roles confirmed in the `alert` deep audit); the same nested **`button_danger`** component set (Buttons audit — the clearest cross-component confirmation in the series, now doubly confirmed across both Alert and Toast); `secondary_special_outline` (still unresolved, consistent with every prior audit).

---

## 13. Anything MCP cannot retrieve

- Whether `default`/`success`/`warning`/`info` states of `toast` share this exact structure with only color changes — out of scope, no sibling inference performed.
- Why the icon layer is named "icon / info" despite the `danger` variant, in both Toast and Alert.
- The real icon/feature-icon glyph content beyond placeholder asset URLs.
- Whether the shorter `"button_danger"` instance name in Toast (vs. Alert's full path) reflects a meaningful binding difference.
- Why the same nested `button_danger` instance renders with different fills across Toast and Alert.
- Default variant configuration for `toast`.
- Variable Collection / Mode metadata — not retrievable, consistent with every prior audit in this series.

---

## 14. Deep re-audit addendum — all 5 severities checked, real icon glyphs recovered (this pass)

§9 deep-audited only the `danger` instance, mirroring the same gap already found and closed in `alert` (docs/audit/alerts.md §14). This section applies the identical re-audit method here: `get_design_context` re-run on `default` (`66074:28508`), `success` (`66074:28532`), `warning` (`66074:28544`), `info` (`66074:28556`), and `danger` again (`66074:28520`, re-verified), then the real `imgVector` asset URLs behind the severity icon, the dismiss icon, and the `feature_icon` glyph were downloaded across multiple severities.

**Confirmed — Toast's severity icon is byte-identical to Alert's** (the same info-circle path data), tinted per state — but `default`'s own tint is confirmed `#0A0C11` (`gray-950`, near-black), genuinely different from Alert's `Default`, which is confirmed primary-tinted (`#5468FF`). `danger`/`success`/`warning`/`info` all match Alert's own severity-500 tints exactly.

**Confirmed — Toast's dismiss icon is byte-identical to Alert's close icon** (the same "X" path data), but fixed `#8C929C` (`gray-600`) fill — confirmed different from Alert's `gray-700`.

**Confirmed — the `feature_icon` glyph is a plain filled circle with no distinguishing shape** (a flat `#0A0C11` circle, no path detail) — this is generic placeholder content in the audited instance, not a real icon worth reproducing as a default. `featureIconContent` remains an opt-in slot with no default content.

**Confirmed — the primary action button's construction genuinely differs by severity, and differs from Alert's equivalent buttons too:**
- `danger`: `button_danger`, fill `Color/danger/500_alpha_12` (already confirmed in §9/§11).
- `success`: `button_success` — newly confirmed, fill `Color/success/500_alpha_12`, text `text/success-600`.
- `warning`/`info`: plainly named `"button"`, flat `gray/100` fill + `gray/700` text — **not** tinted.
- `default` (the baseline severity): also plainly named `"button"`, but confirmed to use `Color/secondary/500` fill + white text — matching the styling Alert uses for its separate "Dismiss" button, not the neutral gray/gray-700 combination `warning`/`info` use here. A third distinct button treatment, not a simple two-way split.

This means Toast's danger/success buttons are confirmed **tinted-background** (unlike Alert's danger/success buttons, which are confirmed flat neutral gray with only the *text* tinted) — a genuine, confirmed divergence between the two sibling components for nominally the same severity concept.

**Confirmed — `default`'s border is `outline/gray-100` (`#f4f4f6`)**, not `gray-200` as previously derived when only `danger` had been sampled — the same correction already made for Alert.

**Confirmed unchanged across all 5 severities:** root fill/radius/elevation, the `items-center` row layout, asymmetric padding, and the dismiss button's inline rounded-square shape/position.

**Rebuild:** `toast.tsx` now renders real default icons — the confirmed info-circle (tinted per `state`, with `default`'s own confirmed near-black tint) for the left icon, and the confirmed "X" (`gray-600`) for the dismiss button — both rendered whenever the caller doesn't supply `icon`/`dismissIcon` overrides. The action button now branches on `state`: `ButtonDanger`/`ButtonSuccess` with a tinted background for `danger`/`success`, a `secondary/500`-filled button for `default`, and a plain neutral `gray/100`/`gray/700` button for `warning`/`info`. `default`'s border color was corrected from a derived `gray/200` guess to the confirmed `gray/100`.

## 15. Requested (resubmitted): default button color, leading icon size — the interactive-preview controls and auto-dismiss timer were already done

Same feedback item number and framing as Alert's own §15/§16 — resubmitted because it had only been partially implemented. Checked what already existed before changing anything:

- **The interactive-preview controls (STATE→ICON→SUPPORTING TEXT→BUTTON→AUTO DISMISS) already existed**, in the requested order, in `apps/docs/src/registry/pages/toast.tsx` — no change needed.
- **The full-width auto-dismiss timer already existed** (`autoDismiss`/`duration` props, §9/§14 above) — a thin bottom progress bar draining over `duration` ms, dismissing on completion, working with or without the action button, and manual dismiss immediately cancels the pending timer. All already matched the spec exactly — no change needed.

Two items genuinely weren't done yet:

1. **`state="default"`'s action button now uses `primary/500`**, replacing the confirmed `secondary/500` pink (§14) — "instead of the current accent/pink treatment," the same override category and reasoning as Alert's own Dismiss-button color change. Hover follows the usual one-step-darker convention (`primary/600`, was `secondary/600`). `warning`/`info`'s neutral button and `danger`/`success`'s tinted `ButtonDanger`/`ButtonSuccess` composition are unchanged — not part of this request (Toast's request, unlike Alert's, didn't ask for a full per-severity color mapping or for the action button to stay neutral across every state).
2. **The leading severity icon is a bit bigger**: slot 24px→28px, glyph 18px (previously unset, the icon's own native default)→22px (explicit `size` prop) — the identical bump already applied to Alert's own icon. `alignItems: "center"` on the icon's row was already in place, so it stays vertically aligned with the title at the new size without any layout change.

Tests updated: the `state=default` action-button color assertion, plus new tests for its hover transition and the icon's new size at every state. 713/713 passing (`@shikho/ui`, up from 711). Typecheck clean. Docs build clean. Verified live: `default`'s "Learn more" computes to `rgb(84, 104, 255)` (`primary/500`); the icon slot/glyph compute to 28px/22px respectively, unchanged across states.
