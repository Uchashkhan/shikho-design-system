# Tooltip

Implements the `tooltip` component set audited in `docs/audit/tooltips.md` — **the sparsest audit in the entire library**. No `get_design_context` deep audit was ever run on this family, and unlike Radio (which could borrow Checkbox's confirmed styling via a cross-reference in `list.md`), there is no sibling audit to borrow an applied visual from either. Almost everything beyond the `direction` enum and its two bounding-box widths is a documented derived choice, not a confirmed binding.

## Confirmed vs. derived

**Exactly confirmed** (`docs/audit/tooltips.md`):
- Exactly one property, `direction` — 8 values, confirmed against the full symbol list (§2, §3): `botom_left`, `top_left`, `botom_right`, `top_right`, `bottom_center`, `top_center`, `left_center`, `right_center`. **No `size`, `type`, or `state` property exists at all.**
- A confirmed spelling typo within the same property's value set: `botom_left`/`botom_right` are missing the second "t" in "bottom," while `bottom_center` is spelled correctly right next to them (§10, §11). Preserved verbatim, not corrected.
- Confirmed bounding-box dimensions: the six vertically-oriented placements are 240×152; `left_center`/`right_center` are 240×144 (§4).
- `elevation/e3` was newly and fully resolved specifically in this audit's own context — the first full confirmation of that level anywhere in the whole audit series, and the finding that confirmed the additive-stacking-shadow hypothesis (§8, §12).
- `radius/custom/sm` (8) is the only radius token present in this component's own export (§8, §10).

**Derived — the most lightly-grounded values in this library:**
- **Fill (white) and text colour (gray-950)** — not confirmed applied to `tooltip` at all. No deep audit exists, and no sibling audit nests or cross-references a tooltip instance. These reuse the same "white card" surface pattern already established for Alert, Toast, and Field elsewhere in this system — a consistency choice, not a confirmed binding.
- **Radius** uses `radius/custom/sm`, since it's the only radius token present in the export — but the audit itself explicitly could not confirm whether it's genuinely applied here or simply unbound in this subtree (§10, §13: "whether tooltip truly uses only `radius/custom/sm`... is not confirmed").
- **Shadow** uses `elevation.e3` — a defensible choice given it was resolved in this exact context, but §12/§13 stop short of confirming genuine application, the same caveat every effect token in this export carries.
- **The 8px gap** between the tooltip and its anchor, and the 12px internal padding, both come from `spacing/8`/`spacing/12` — present in this component's own confirmed spacing export (§8), but not attributed to any specific side or use.
- **Width is applied as a `max-width`, not a forced size** — consistent with how "confirmed Hug height" is treated everywhere else in this library, since no deep audit confirmed whether these bounding boxes are Fixed or content-driven.

**Explicitly not resolved, and not invented:**
- Whether an arrow/pointer, title, description, button, icon, or any other internal layer exists on `tooltip` — the audit explicitly could not confirm this without `get_design_context` (§5, §13). **None of these are implemented.** `Tooltip` renders only a plain content bubble.
- Any anchor/trigger/portal positioning mechanism — nothing about how a tooltip attaches to a trigger element was confirmed. `direction` is implemented as standard CSS absolute positioning relative to a `position: relative` parent, using the property's own evident purpose (placement), not a floating-UI-style positioning engine.
- Default variant configuration — not confirmed for this component set (§13).

## Usage

`Tooltip` expects to be rendered inside a `position: relative` container:

```tsx
import { Tooltip } from "@shikho/ui";

function Example() {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      Hover me
      <Tooltip direction="top_center">Helpful text</Tooltip>
    </div>
  );
}
```

No show/hide behavior is implemented — visibility, hover/focus triggering, and delay logic are left to the consumer, since none of that was confirmed to exist in the audit either.

## Not implemented

- Arrow/pointer graphic — existence unconfirmed.
- Title/description text slots — existence unconfirmed; only a single `children` content slot exists.
- Show/hide/trigger behavior.

## Token dependencies

Only `@shikho/tokens`: `color.white[950]`, `color.gray[950]`, `radius.sm`, and `elevation.e3` (converted to a CSS `box-shadow` string).
