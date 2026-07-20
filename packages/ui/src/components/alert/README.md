# Alert

Implements the `alert` component set audited in `docs/audit/alerts.md` — deep-audited at `state="danger"` via `get_design_context` (§11), giving real confirmed structure. This is the first **composed** component since `List`, and it produced a genuine correction to an already-shipped component: see "Correction to ButtonDanger" below.

## Confirmed vs. derived

**Exactly confirmed** (`docs/audit/alerts.md` §11, the `state="danger"` instance):
- Only one boolean property exists: `leftIcon` (default `true`). **No boolean exists for title, description, actions, or the corner close button** — they render unconditionally, unlike every other component in this library (typically 3–12 booleans). This component's prop surface intentionally mirrors that rigidity rather than inventing toggles Figma doesn't expose.
- **No instance-swap properties** — a confirmed absence, unlike `Field`/`List`/etc.
- Layout: root `flex items-start` (**top-aligned**, a confirmed difference from nearly every other audited component, which used `items-center`), `w-[424px]` fixed width, `gap-[spacing/16]`, `p-[spacing/24]` uniform padding.
- Fill `Color/smoke_base` (white), border color `outline/danger_alpha` (`#f03d3d3d`, ≈24% alpha of `Color/danger/500`), radius `radius/border_radius_xl` (20px — maps to `@shikho/tokens`' `radius["2xl"]`, per the rank-based radius decision in `docs/token-normalization-decisions.md` §6).
- Root shadow = exactly `elevation/e5`'s full 5-layer stack; the corner `icon_button`'s shadow = exactly `elevation/e3`'s full 3-layer stack; both icon slots (24×24 and 18×18) carry `elevation/e2`-matching shadows — all three converted directly from `@shikho/tokens`' `elevation` export, not re-derived.
- Typography: title 15px/24px SemiBold (`web/Title/15 Semibold`), `Text/Gray 950`; description 13px/20px **Regular/400** weight (not SemiBold, correcting the overview stage's own speculation), `Text/Gray 700`; both action button labels 13px/20px SemiBold (`web/Body/13 Semibold`).
- **Confirmed nested dependency on `ButtonDanger`** — the primary action button's literal Figma instance path is `button_danger/md/secondary/default` (§11 — "the clearest cross-component confirmation in this entire audit series"). This component composes the real `ButtonDanger` from `packages/ui/src/components/button`, not a re-drawn button.
- The second action button ("Dismiss"): fill `Color/secondary/500`, text `text/white-950` — both exact values, though **not confirmed to be drawn from any named component set** (§11: "whether the second button... is drawn from a specific named component set... is not confirmed"). Implemented as its own inline `<button>` with these exact values, rather than assumed into a `ButtonDanger`/other Button composition that isn't supported by the citation.
- The corner `icon_button`: absolutely positioned (`top: 11px, right: 11px`, confirmed literal pixel offsets, outside the normal flex flow), 32×32, circular, containing an 18×18 icon — confirmed different from the 24×24 severity icon. Not confirmed to map to any specific `icon_button` type/size from the Button family, so implemented inline with its own confirmed geometry rather than composed from `IconButton`.

**Derived — grounded in the audit's own confirmed alpha-naming pattern, not independently confirmed per severity:**
- Border colors for `success`/`warning`/`info` reuse the audit's own confirmed exact hex values (`outline/success_alpha` = `#35c2203d`, `outline/warning_alpha` = `#fcbf043d`, `outline/info_alpha` = `#118be83d`, §9) — `danger` and `success` are numerically identical to `@shikho/tokens`' existing `focusRingColor.danger`/`.success` and reused directly; `warning`/`info` have no equivalent in `@shikho/tokens` yet, so their exact confirmed hex is used as a cited literal rather than added to the tokens package (the alpha-convention consolidation remains an explicitly deferred decision).
- `Default`'s border color has no confirmed value anywhere (only `danger` was deep-audited, §11) — this uses a neutral `color.gray[200]` as a documented derived baseline, not a fabricated severity color.
- Whether `Default`/`success`/`warning`/`info` share `danger`'s exact structure, or the fill/icon also change per severity, is explicitly out of scope in the audit (§11 "Not confirmed"). This implementation applies the one confirmed fill (`Color/smoke_base`, white) uniformly across all five severities, since nothing suggests otherwise.

**Explicitly not resolved, and not approximated:**
- Whether the "Dismiss" text button and the corner close button are two distinct intended controls or redundant — the audit explicitly could not determine this (§11, §13). Both are implemented as independent, separately-clickable controls with separate handlers (`onDismissClick`/`onCloseClick`), since collapsing them into one would assume an answer the audit doesn't give.
- The real icon glyph content for either icon slot — no `@shikho/icons` glyphs exist yet; both `icon`/`closeIcon` are empty `ReactNode` slots unless a consumer supplies one.
- No default title/description/action text is supplied — the confirmed instance's own placeholder strings ("Notification text", "Learn more", "Dismiss") are demo content in Storybook only, not hardcoded component defaults.

## Correction to `ButtonDanger`

This audit's confirmed nested-instance path (`button_danger/md/secondary/default`) gave the Button family its **first-ever exactly confirmed visual data point for the `button_danger` set**, which had none before (buttons.md itself only deep-audited `new_blue`). `packages/ui/src/components/button/button_danger.tsx` was updated accordingly:
- `type="Secondary"` now uses the confirmed exact fill/text (`Color/gray/100` / `text/danger-600`), replacing an earlier generic derived "soft danger-tinted" placeholder.
- The component's defaults changed from `size="xs" type="primary"` to `size="md" type="Secondary"`, matching this newly confirmed real instance.

See `packages/ui/src/components/button/README.md` for the full note.

## Not implemented

- Whether `Default`/`success`/`warning`/`info` differ structurally (not just by color) from `danger` — never inspected (§11, §13).
- Any severity-specific icon glyph — no icon system exists yet.

## Token dependencies

Only `@shikho/tokens`: `color.white[950]`, `color.gray[200/700/950]`, `color.danger[500]`, `color.success[500]`, `color.secondary[500]`, `radius.md`, `radius["2xl"]`, `radius.full`, and `elevation.e2`/`e3`/`e5` (converted to CSS `box-shadow` strings). Plus two literal, cited hex constants (`outline/warning_alpha`, `outline/info_alpha`) not yet represented in `@shikho/tokens`.
