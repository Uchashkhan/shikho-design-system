---
"@shikho/tokens": minor
"@shikho/icons": minor
"@shikho/ui": minor
---

First release candidate for the Shikho Design System.

**@shikho/tokens** — confirmed color, radius, and elevation tokens, sourced verbatim from the Figma
audit series (`docs/audit/`). No inferred, approximated, or placeholder values. Typography,
spacing, gradients, and subject colors are intentionally not included — see the package README's
"Unresolved token categories" section.

**@shikho/icons** — a tree-shakeable icon package with five confirmed glyphs (`ChevronLeftIcon`,
`ChevronRightIcon`, `CloseIcon`, `InfoCircleIcon`, `CheckIcon`), each exported verbatim from its
Figma source (original viewBox and path data preserved, no re-drawing). This is not a complete
icon library — coverage is limited to glyphs confirmed while auditing `@shikho/ui` components. A
dedicated Figma icon-library audit is required before further glyphs can be added without
guessing.

**@shikho/ui** — the component library, verified against live Figma across a full release
verification pass (see `docs/release-visual-verification.md`): 23 component families audited,
all confirmed defects repaired (P0/P1/P2), and cross-checked against Storybook, the docs site, and
an external consumer app built outside the monorepo.

Note: `@shikho/ui`'s Tailwind `@theme` token layer is still a stub (`styles.css` currently ships
only Tailwind preflight) — consumers cannot yet theme via Tailwind classes bound to
`@shikho/tokens`. This is tracked as follow-up work, not a blocker for this release.
