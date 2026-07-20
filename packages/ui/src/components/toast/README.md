# Toast

Implements the `toast` component set audited in `docs/audit/toasts.md` — deep-audited at `state="danger"` via `get_design_context`, and explicitly compared node-by-node against `Alert`'s own deep audit (§10). Toast and Alert share the same severity architecture and even the same nested `ButtonDanger` dependency, but the audit found real, confirmed structural differences between them at nearly every level — this component reproduces those differences rather than reusing Alert's implementation.

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
- Border colors for `success`/`warning`/`info`/the `default` baseline follow exactly the same derivation as `Alert`'s (§8 confirms these are the identical hex values, reused directly); `default` again has no confirmed border and uses the same neutral `color.gray[200]` fallback.
- `feature_icon`'s own padding beyond its 28×28 icon dimension isn't given an exact number (§9: "own padded/rounded container") — this implementation applies `radius.lg` directly to the 28×28 slot without adding an unconfirmed extra padding value.

**Explicitly not resolved, and not approximated:**
- Whether `default`/`success`/`warning`/`info` share this exact structure — out of scope in the audit (§9, §13), same situation as Alert.
- Why the same nested `button_danger` instance renders with two different fills across Toast and Alert — confirmed as a real discrepancy, cause unknown (§11, §13).
- Whether the shorter, unqualified `"button_danger"` instance name here (vs. Alert's fully path-qualified one) reflects a meaningful binding difference — explicitly unconfirmed (§9, §13). This implementation still composes `ButtonDanger` with `type="Secondary"` (matching Alert's fully-confirmed type) since no evidence suggests a different type value, applying only the confirmed fill override.
- `secondary_button_effect` (2 of 4 layers confirmed applied to the action button, §9) — not implemented, same gap as `ButtonDanger` itself already has (the effect isn't part of `@shikho/tokens` yet).
- Real icon/feature-icon glyph content — no `@shikho/icons` glyphs exist yet.

## A small fix to `ButtonDanger`, made alongside this component

`ButtonDanger`'s `style` prop previously **replaced** its entire computed style object instead of merging with it, because the JSX spread `{...props}` came after the explicit `style={style}`. Composing it here (to apply Toast's confirmed fill override without discarding its radius/padding/typography) required fixing this: `style={{ ...computedStyle, ...style }}`. This doesn't change `ButtonDanger`'s own default rendering — Alert's existing usage is unaffected (verified: all prior Button/Alert tests still pass) — it only enables a composing component to override a single confirmed property.

## Not implemented

- Whether `default`/`success`/`warning`/`info` differ structurally from `danger` — never inspected.
- Real icon/feature-icon glyph content.

## Token dependencies

Only `@shikho/tokens`: `color.white[950]`, `color.gray[200/600/950]`, `color.danger[500]`, `color.success[500]`, `radius.sm`, `radius.lg`, `radius["2xl"]`, and `elevation.e2`/`e6` (converted to CSS `box-shadow` strings). Plus the same two literal, cited hex constants as Alert (`outline/warning_alpha`, `outline/info_alpha`) not yet represented in `@shikho/tokens`.
