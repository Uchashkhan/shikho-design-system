# Link

Implements the `link` component set. The original overview audit (`docs/audit/links.md`) deliberately did not run `get_design_context`. A deep re-audit (`docs/audit/links-deep-audit.md`) has since confirmed the real internal structure — an icon/text/icon row with two booleans and two instance-swap slots — across all 30 variants (5 sizes × 2 types × 3 states).

## Confirmed vs. derived

**Exactly confirmed** (`docs/audit/links-deep-audit.md`):
- `size` (xl, lg, md, sm, xs) × `type` (quaternary, primary) × `state` (disabled, hover, default) = 30 variants. **No `focus` state exists at all** — a confirmed gap unlike every other interactive component in this library.
- 3 booleans (`leftIcon`, `rightIcon`, `text`, all default `true`) and 2 instance-swap slots (`selectLeftIcon`, `selectRightIcon`).
- Per-size gap, icon size, and typography (§3) — `lg` and `md` resolve to numerically identical typography, differing only in icon size, reconfirming `typography.md`'s own documented `Title/13`/`Body/13` duplication.
- The full `type`×`state` color/weight matrix (§4): `primary` is SemiBold and moves `primary-500 → primary-600` on hover; `quaternary` is Medium and moves `gray-700 → gray-950` on hover; both types share the exact same `gray-400` disabled color.
- Both icon slots carry a confirmed `elevation/e2`-derived `filter: drop-shadow()` pair (not a `box-shadow` — this is how Figma renders shadows on icon-only vector layers so they follow the glyph silhouette).

**Derived, documented as such:**
- No `focus` state exists, so this component relies on the browser's native `:focus-visible` outline rather than inventing a custom ring.
- `type=quaternary`'s Medium-weight substitution was only directly confirmed at `xl` and is applied uniformly across all sizes as the least-invented extension.
- Rendering as a real `<a>` (with a `role="link"`/`tabIndex` fallback when no `href` is supplied) is a functional necessity — Figma's own export never distinguishes an anchor element from any other container.

## Usage

```tsx
import { Link } from "@shikho/ui";

function Example() {
  return (
    <Link href="/docs" size="md" type="primary">
      Read the docs
    </Link>
  );
}
```

## Not implemented

- A custom focus-ring treatment — none is confirmed to exist; the native browser outline is used instead.
- Real icon glyph content — no `@shikho/icons` inventory exists yet; `leftIcon`/`rightIcon` render empty unless `selectLeftIcon`/`selectRightIcon` supply content.

## Token dependencies

Only `@shikho/tokens`: `color.primary[500/600]`, `color.gray[400/700/950]`, and `elevation.e2` (its color value only, used inside a CSS `filter: drop-shadow()` pair rather than a `box-shadow`).
