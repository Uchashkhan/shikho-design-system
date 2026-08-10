# @shikho/icons

Tree-shakeable React icon components for the Shikho Design System, exported verbatim from
confirmed Figma glyphs — no re-drawing, re-scaling, or restyling.

**Status: v0.1 — first release, limited glyph coverage.** This package currently contains only the
glyphs that were confirmed while auditing `@shikho/ui` components (see below). It is **not** a
complete icon library. A dedicated Figma icon-library audit is required before further glyphs can
be added without guessing — see `docs/release-visual-verification.md` in the repository.

## Install

```
pnpm add @shikho/icons
```

`react` (`^18.3.0`) is a required peer dependency.

## Import

Each icon is a named, tree-shakeable export:

```tsx
import { ChevronRightIcon } from "@shikho/icons";

function Example() {
  return <ChevronRightIcon size={24} />;
}
```

Icons paint with `currentColor`, so set color via normal CSS (e.g. wrap in an element with a
`color` style, or pass `style={{ color: "..." }}` directly to the icon):

```tsx
<ChevronRightIcon size={18} style={{ color: "#5468ff" }} />
```

Every icon accepts the standard SVG props (`className`, `style`, `aria-label`, etc.) via
`IconProps`, plus a `size` prop (`14 | 16 | 18 | 20 | 22 | 24 | 28`, default `18`).

## Currently exported glyphs (5)

| Icon | Source |
|---|---|
| `ChevronLeftIcon` | pagination prev button |
| `ChevronRightIcon` | pagination next button |
| `CloseIcon` | shared Alert/Toast/Modal dismiss "X" |
| `InfoCircleIcon` | shared Alert/Toast severity glyph |
| `CheckIcon` | shared Checkbox/Toggle checkmark |

Each glyph's original Figma `viewBox` is preserved exactly (several are intentionally
non-square, e.g. the chevrons at `0 0 6.18747 10.6875`) — normalizing them to a square canvas
would silently rescale the glyph.

## Limitation

**Only confirmed, audited glyphs are included.** Several components in `@shikho/ui` still contain
hand-drawn SVG approximations (e.g. pagination's results-per-page caret) rather than exported
Figma assets, because no confirmed source was available for them during the release verification
pass. Promoting an unverified path into this package would misrepresent a guess as confirmed
design data — so those approximations remain local to their component instead, until a proper
icon-library audit resolves their real source.
