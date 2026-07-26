# Tooltip

Implements the `tooltip` component set audited in `docs/audit/tooltips.md`.

## This rebuild — ground-truth re-audit (docs/audit/tooltips.md §14)

The original audit never ran `get_design_context` — the pre-rebuild implementation reflected that: a bare, contentless bubble with a derived fill/text/radius/shadow and no heading, description, actions, or pointer at all. A deep re-audit (`get_metadata` on all 8 `direction` variants, then `get_design_context` on 6 of them, then downloading the real pointer SVG assets behind 4 samples) found the opposite: `tooltip` is one of the richest single components in this library.

## Public API — changed, and why

The old `children: ReactNode` prop is replaced by `heading`, `description`, `secondaryAction`, and `primaryAction`, because the confirmed structure is these specific named, boolean-gated slots (SemiBold heading, Medium description, a gray secondary CTA, a primary/500-filled CTA) — not free-form content. This is a genuine, warranted API change: the previous API was a placeholder standing in for content that had never been confirmed to exist.

## Confirmed vs. derived

**Exactly confirmed** (`docs/audit/tooltips.md` §14 unless noted):
- `direction` — 8 values (§2), including the confirmed spelling typo `botom_left`/`botom_right` vs. correctly-spelled `bottom_center`, preserved verbatim.
- The `tip` surface: `Color/smoke_base` (white) fill, `radius/border_radius_lg` (16 — this package's `radius.xl`, correcting the prior assumption of `radius/custom/sm`=8), 12px padding, 16px gap between the text block and actions row, and a 1px `gray/100` border omitted on whichever edge touches the pointer (so the two shapes visually fuse).
- `heading` (SemiBold, `body_1` 13/20, `gray-950`), `description` (Medium, `caption_2` 12/16, `gray-700`), and up to 2 CTA buttons: a gray secondary action (`gray/100` fill, the confirmed system-wide "special_drop" inset, `gray-700` SemiBold text) and a primary/500-filled action (`outline/Black 150` border, a distinct confirmed 2-layer inset, white SemiBold text).
- The `pointer`: a rounded-tip triangle (downloaded as real SVG source, not a plain polygon), solid white, 16×8 for vertical placements / 8×16 for horizontal ones.
- The wrapper: a fixed 240px width (not a max-width — resolving the original audit's Fixed-vs-Hug ambiguity), and a 3-layer `elevation/e3`-shaped `filter: drop-shadow()` chain (not `box-shadow`, since it must wrap the pointer's non-rectangular shape as a unit with the tip).

**Derived, documented as such:**
- Corner pointer offset (how far the pointer sits from the tip's edge for `top_left`/`top_right`/`botom_left`/`botom_right`) is approximated via simple flex alignment rather than reproducing Figma's own padded-pointer-asset technique pixel-for-pixel.
- **Anchor-relative positioning** (where the tooltip renders relative to a `position: relative` parent) is not part of Figma's confirmed `direction` variant at all — only the internal tip+pointer visual is confirmed. This pass re-derives the offset *direction* from the newly confirmed pointer geometry (the pointer must visually point toward the anchor), which reverses the naive "`top_*` renders above the anchor" convention the pre-rebuild implementation used: `top_*` now renders BELOW its anchor, `botom_*`/`bottom_center` renders ABOVE it, `left_center` renders to the anchor's right, `right_center` to its left.

**Explicitly not resolved:** any anchor/trigger/portal positioning mechanism, or show/hide/trigger/delay behavior — nothing about how a tooltip attaches to and toggles around a trigger element was confirmed; both are left to the consumer.

## Usage

`Tooltip` expects to be rendered inside a `position: relative` container:

```tsx
import { Tooltip } from "@shikho/ui";

function Example() {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      Hover me
      <Tooltip
        direction="bottom_center"
        heading="Heads up"
        description="Some helpful detail."
        secondaryAction={{ label: "Learn more" }}
        primaryAction={{ label: "Got it", onClick: () => {} }}
      />
    </div>
  );
}
```

## Not implemented

- Any anchor/trigger/portal positioning mechanism.
- Show/hide/trigger behavior — visibility, hover/focus triggering, and delay logic are left to the consumer.

## Token dependencies

`@shikho/tokens`: `color.white`, `color.gray`, `color.primary`, `color.black[150]`, `radius.xl`, `radius.sm`, and `elevation.e3`.
