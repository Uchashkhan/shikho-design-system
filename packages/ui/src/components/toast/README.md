# Toast

Implements the `toast` component set audited in `docs/audit/toasts.md` — deep-audited at `state="danger"` via `get_design_context`, and explicitly compared node-by-node against `Alert`'s own deep audit (§10). Toast and Alert share the same severity architecture and even the same nested `ButtonDanger` dependency, but the audit found real, confirmed structural differences between them at nearly every level — this component reproduces those differences rather than reusing Alert's implementation.

## Fresh re-audit corrections (docs/audit/toasts.md §14)

§9 only deep-audited the `danger` severity, mirroring the exact same gap already found and closed in `Alert`. A fresh re-check across all 5 severities, plus downloading the real icon SVG assets, found:
- **Both icon glyphs (severity icon + dismiss "X") are byte-identical to Alert's own icons** — same path data — but with their own distinct confirmed tint colors: `default`'s severity icon is `gray-950` (near-black, NOT primary-tinted like Alert's `Default`), and the dismiss icon is fixed `gray-600` (not Alert's `gray-700`). Both now render these confirmed defaults out of the box, still overridable via `icon`/`dismissIcon`.
- **The action button's construction differs by severity, and differs from Alert's own equivalent buttons too**: `danger`/`success` compose `ButtonDanger`/`ButtonSuccess` with a **tinted background** (`{severity}/500_alpha_12`) — confirmed different from Alert's version of the same dependency, which uses a flat neutral background with only the text tinted. `warning`/`info` render a plain neutral gray button. `default` gets its own distinct `secondary/500` + white button (matching Alert's separate "Dismiss" button styling).
- **`default`'s border is `gray/100`**, correcting a prior derived `gray/200` guess.
- **The `feature_icon` glyph is a plain filled circle with no distinguishing shape** — confirmed to be generic placeholder content, not a real icon, so `featureIconContent` intentionally still has no default.

## Confirmed vs. derived

**Exactly confirmed** (`docs/audit/toasts.md` §9, the `state="danger"` instance):
- 5 boolean properties with confirmed defaults: `leftIcon` (true), `desc` (true), `actionButton` (true), `rightIcon` (true), and **`featureIcon` (false — the only boolean across Alert/Toast that defaults off)**. This is 5 booleans vs. Alert's 1 (§10 comparison table).
- No instance-swap properties — same confirmed absence as `Alert`.
- Root layout: `flex items-center` (**confirmed different from Alert's `items-start`**), fixed width `528px`, asymmetric padding `pt-[spacing/12] pb-[spacing/16] px-[spacing/16]` (**the first asymmetric padding confirmed anywhere in the whole audit series** — Alert's is uniform `24px`).
- `alert_cell` is a confirmed flex-**row** (text and the action button sit side-by-side) — despite sharing the identical layer name with Alert's flex-**col** `alert_cell`. Not reconciled into one shared layout; both are reproduced exactly as confirmed.
- Root shadow = exactly `elevation/e6`'s full 6-layer stack — **confirmed different from Alert's `elevation/e5`** (5 layers); Toast is the more heavily elevated of the two (§9, §12).
- Fill (`Color/smoke_base`, white) and radius (`radius/border_radius_xl` → `@shikho/tokens`' `radius["2xl"]`) are identical to Alert's, confirmed.
- Title typography (15px/24px SemiBold, `Text/Gray 950`) is identical to Alert's. **Description color is confirmed different**: `Text/Gray 600` here vs. Alert's `Text/Gray 700`.
- **Confirmed nested dependency on the same `ButtonDanger` component as Alert** — "doubly confirmed across both Alert and Toast" (§12), the strongest possible confidence for this dependency. The instance name here is just `"button_danger"` (shorter than Alert's full `"button_danger/md/secondary/default"` path), but the audit is explicit that it's the same underlying set.
- **The nested button's fill is confirmed different from Alert's**: `Color/danger/500_alpha_12` (`#f03d3d1f`) here vs. `Color/gray/100` in Alert — "a confirmed, deliberate-looking but unexplained visual divergence for nominally the same dependency" (§10, §11) that the audit could not resolve further. The button label color (`text/danger-600`) is unchanged from Alert's.
- The dismiss control is confirmed structurally different: **inline, rounded-square** (`radius/custom/sm`, 8px) here, vs. Alert's **absolutely-positioned, fully circular** (`radius/border_radius_round`, 1000px) corner button — same padding/gap values as Alert's (`p-[spacing/8] gap-[spacing/6]`), just a different shape and position.
- `feature_icon` (28×28, `radius/custom/lg`) — a slot with **no equivalent in Alert at all** (§10).

**Derived — not independently confirmed:**
- Root-level gap between the icon/feature-icon/`alert_cell`/dismiss-button: the audit gives an exact gap for `text` (`spacing/4`) but never explicitly restates a root-level gap value for Toast the way it did for Alert (`spacing/16`). This reuses Alert's confirmed `16px` root gap as the least-invented available baseline — documented here as unconfirmed for Toast specifically, not silently copied without a note.
- `text`'s own flex-direction (stacking title above description) isn't explicitly restated separately from `alert_cell`'s row orientation in §9's layout paragraph — implemented as `flex-col`, the only structural reading consistent with a title rendering above a description visually.
- `feature_icon`'s own padding beyond its 28×28 icon dimension isn't given an exact number (§9: "own padded/rounded container") — this implementation applies `radius.lg` directly to the 28×28 slot without adding an unconfirmed extra padding value.

**Now exactly confirmed** (`docs/audit/toasts.md` §14 — resolving what §9/§27 above left as "Derived"/"Not confirmed"):
- All 5 severities' border colors, icon tints, and action-button construction — see the "Fresh re-audit corrections" section above.
- Whether the shorter, unqualified `"button_danger"` instance name here (vs. Alert's fully path-qualified one) reflects a meaningful binding difference — still not directly confirmed, but the button's exact fill/text values are now confirmed for `danger` AND `success`, so this implementation composes `ButtonDanger`/`ButtonSuccess` with `type="Secondary"` and the confirmed fill override for both.

**Explicitly not resolved, and not approximated:**
- Whether `default`/`success`/`warning`/`info` share `danger`'s exact structural layout — the fills/text ARE now confirmed for all 5, but no additional layer/hierarchy differences were found in any sample.
- Why the same nested `button_danger` instance renders with two different fills across Toast and Alert — confirmed as a real discrepancy, cause unknown (§11, §13).
- `secondary_button_effect` (2 of 4 layers confirmed applied to the action button, §9) — not implemented, same gap as `ButtonDanger` itself already has (the effect isn't part of `@shikho/tokens` yet).
- The `feature_icon` slot's real content — confirmed to be generic placeholder circle content in the audited instance, not a meaningful glyph, so no default is rendered.

## A small fix to `ButtonDanger`, made alongside this component

`ButtonDanger`'s `style` prop previously **replaced** its entire computed style object instead of merging with it, because the JSX spread `{...props}` came after the explicit `style={style}`. Composing it here (to apply Toast's confirmed fill override without discarding its radius/padding/typography) required fixing this: `style={{ ...computedStyle, ...style }}`. This doesn't change `ButtonDanger`'s own default rendering — Alert's existing usage is unaffected (verified: all prior Button/Alert tests still pass) — it only enables a composing component to override a single confirmed property.

## Implementation note (post-audit changes, docs/audit/toasts.md §15)

Same feedback item number/framing as Alert's own §15/§16, resubmitted because it had only been partially implemented. Checked what already existed first: the interactive-preview STATE→ICON→SUPPORTING TEXT→BUTTON→AUTO DISMISS controls and the full auto-dismiss timer (§9/§14 above) were already built exactly to spec — no change needed there. Two items genuinely weren't done:

- **`state="default"`'s action button now uses `primary/500`** instead of the confirmed `secondary/500` pink — "instead of the current accent/pink treatment," matching the reasoning behind Alert's own Dismiss-button color change. `warning`/`info`'s neutral button and `danger`/`success`'s tinted `ButtonDanger`/`ButtonSuccess` are unchanged — Toast's request, unlike Alert's, only named `default`'s color.
- **The leading severity icon is bigger**: slot 24px→28px, glyph 18px→22px — the same bump already applied to Alert's own icon, consistent across every state.

## Not implemented

- The `feature_icon` slot's real glyph — confirmed placeholder content, not implemented as a default.

## Token dependencies

`@shikho/tokens`: `color.white[950]`, `color.gray[100/600/700/950]`, `color.primary[500]` (requested override, §15), `color.danger[500]`, `color.success[500]`, `color.warning[500]`, `color.info[500]`, `radius.md`, `radius.sm`, `radius.lg`, `radius["2xl"]`, and `elevation.e2`/`e6` (converted to CSS `box-shadow` strings). Plus the same two literal, cited hex constants as Alert (`outline/warning_alpha`, `outline/info_alpha`) not yet represented in `@shikho/tokens`.
