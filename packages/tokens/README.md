# @shikho/tokens

Design tokens for the Shikho Design System.

**Status: v0.1 — first accurate, production-usable release.** Implements only the token categories with values fully confirmed in `docs/audit/`: **color, radius, elevation**. Every exported value is cited back to a specific audit file; nothing was inferred, approximated, or filled in with an industry-default. See `docs/token-normalization-decisions.md` for the full naming-decision rationale.

## Install

```
pnpm add @shikho/tokens
```

## Import

```ts
import { color, radius, elevation, focusRingColor, tokens } from "@shikho/tokens";

color.primary[500]; // "#5468ff"
radius.lg; // 12
elevation.e2; // [{ type: "DROP_SHADOW", color: "#0000000a", x: 0, y: 3, blur: 3, spread: -1.5 }, ...]
```

`tokens` is a convenience aggregate: `{ color, radius, elevation }` — nothing else. It intentionally has no `typography`/`spacing`/`gradient` keys; see "Deferred and unresolved" below.

## Implemented categories

### `color`
11-step ramps (`50…950`) for `primary`, `secondary`, `shikhoAi`, `secondary2`, `info`, `success`, `danger`, `warning`, `gray`, `vanillaGray`, `dark`; plus 12-step opacity ramps `black` and `white`. All values are exact hex, quoted verbatim from `docs/audit/colors.md`.

`focusRingColor` exports the five focus-ring **colors only** (`primary`, `secondary`, `success`, `danger`, `gray`) — ring geometry (offset/blur/spread) was never resolved in any audit, so no ring/effect token is implemented; this is a color value export, not a full effect.

### `radius`
A single rank-based scale (`none` through `10xl`, plus one-off `track` and `full`), assigned by the **numeric rank of confirmed values**, not by either of Figma's two colliding raw naming systems (`radius/custom/*` vs. `radius/border_radius_*`). See "Radius naming decision" below.

### `elevation`
All six levels, `e1`–`e6`, each a list of `{ type, color, x, y, blur, spread }` shadow layers, matching the exact `DROP_SHADOW` values confirmed across the audit series (see `docs/audit/elevations.md`, `tooltips.md`, `date-picker.md`, `button-group.md`, `table.md`).

## Canonical naming examples

| Concept | Canonical | Example |
|---|---|---|
| Color primitive | `color.{ramp}.{step}` | `color.danger[500]` → `"#f03d3d"` |
| Opacity primitive | `color.{black\|white}.{step}` | `color.black[100]` → `"#00000012"` |
| Radius | `radius.{rank-name}` | `radius.xl` → `16` |
| Elevation | `elevation.e{1-6}` | `elevation.e6` → 6-layer shadow list |

## focus.danger correction

Figma's `focus_danger` style is bound to `Color/Secondary/500_alpha_24` (`#e2008d3d`) — the exact same value as `focus_secondary`. This is a confirmed binding bug, independently reproduced in `docs/audit/special-effects.md`, `docs/audit/buttons.md`, and `docs/audit/input.md`.

This package's `focusRingColor.danger` is mapped instead to the danger ramp's own alpha-24 value, `#f03d3d3d` — confirmed verbatim as `outline/danger_alpha` in `docs/audit/alerts.md` ("≈24% alpha of danger/500"). **This fix is applied only in this code package. Figma itself was not modified, and no audit document was edited.**

## Radius naming decision

Figma has two parallel radius systems that disagree with each other: `radius/custom/*` (`xs=6, sm=8, md=10, lg=12, xl=16`) and `radius/border_radius_*` (`xs=6, sm=8, sm_2=10, md=12, lg=16, xl=20, xxl=24, 2xl=28, 4xl=32, 5xl=40, 6xl=48, 7xl=56, 8xl=64, 9xl=72, 100, round=1000`). The same label (`md`, `lg`, `xl`) means a different number in each system.

**Decision (approved):** assign canonical names by the ascending rank of the confirmed numeric value across both systems combined, ignoring which legacy system a value came from. E.g. canonical `radius.lg` = `12`, sourced from `radius/custom/lg` — not from `radius/border_radius_lg`, which is `16` and instead becomes canonical `radius.xl`.

## Backward-compatible aliases

`radiusLegacyAliases` preserves three deprecated aliases, each documented with `@deprecated` in code, for the specific raw Figma names that were confirmed to collide in value with a canonical entry:

| Deprecated alias | Value | Canonical replacement |
|---|---|---|
| `radiusLegacyAliases.borderRadiusSm2` | 10 | `radius.md` |
| `radiusLegacyAliases.borderRadiusMd` | 12 | `radius.lg` |
| `radiusLegacyAliases.borderRadiusLg` | 16 | `radius.xl` |

No other legacy aliases are exported — per the implementation rule, aliases are only added where the mapping is certain (confirmed identical value) and useful (a real naming collision the audit flagged), not for every raw name that happens to exist.

## Deferred decisions

Approved but **not implemented in this package** — tracked in `docs/token-normalization-decisions.md`:
- Selection-vocabulary unification (`checked`/`unchecked` vs. `active`/`inactive` vs. `switch_ON`/`switch_OFF`) — a component-API concern, out of scope for a token package.
- Black/white opacity renaming from step-number keys to percentage-based keys — the current `black`/`white` exports use the raw Figma step numbers (`50…950`) as-is; renaming these keys is deferred.
- Alpha/opacity convention consolidation (`_alpha_XX` vs. `smoke_*` vs. `_base`/`_med_em` vs. `surface/*`) — only the five specific, already-computed focus-ring colors are exported here; a general alpha-suffix API is not introduced.
- Any Figma cleanup, renaming, or re-binding — this package changes code only.
- Any component API changes — `packages/ui` is untouched by this release.

## Unresolved token categories (not exported)

Not implemented, and not exported even as placeholders, because exact values are not documented in the audit:
- **Typography** — the 15-step scale's step *names* and a handful of composite examples are documented, but full family/weight/line-height resolution has gaps (`Body 2`, `Overline`, `Para` have no resolved composite).
- **Spacing** — no dedicated spacing audit exists; only 5 incidental values were sighted (`0, 4, 6, 20, 28`), not a full scale.
- **Gradients** — `Gradient/G1`–`G6` never resolved (empty string) in any of the 27 audits.
- **Subject colors** — only 5 of ~35 subjects resolved; the other ~30 aren't even named in the audit, so no keys could be stubbed without guessing.

**Missing values were not inferred, approximated, or filled with a common industry default anywhere in this package.** Where a category or value is not confirmed in `docs/audit/`, it is simply absent from the export surface — not `null`, not a placeholder, not estimated.
