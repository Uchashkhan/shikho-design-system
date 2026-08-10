# @shikho/ui

React component library for the Shikho Design System, built with Tailwind CSS v4,
`tailwind-variants`, and `clsx`.

**Status: v0.1 — first release candidate.** 23 component families, each verified against live
Figma — see `docs/release-visual-verification.md` in the repository for the full audit trail and
per-component confirmed-vs-derived breakdown. This is not a placeholder or scaffold release.

## Install

```
pnpm add @shikho/ui @shikho/tokens @shikho/icons react react-dom
```

`@shikho/tokens` and `@shikho/icons` are regular dependencies of `@shikho/ui` and will be
installed automatically as transitive dependencies — you do not need to add them yourself unless
you also want to import from them directly (most consumers do, for tokens).

## Required: import the stylesheet once

`@shikho/ui` ships a compiled Tailwind stylesheet. Import it once, near the root of your app:

```ts
import "@shikho/ui/styles.css";
```

Without this import, components will render with correct markup but no styling.

## Basic usage

```tsx
import "@shikho/ui/styles.css";
import { NewBlueButton, Checkbox, Avatar } from "@shikho/ui";

function Example() {
  return (
    <div>
      <NewBlueButton size="md" type="Primary">
        Continue
      </NewBlueButton>
      <Checkbox aria-label="Accept terms" />
      <Avatar size="md" type="text">
        AT
      </Avatar>
    </div>
  );
}
```

Component names follow their Figma family directly (e.g. `NewBlueButton`, `ButtonDanger`,
`GreyscaleButton`, `IconButton` — there is no single generic `Button`, since Figma defines eight
distinct button families). See each component's own docs page or Storybook story for its full
prop surface.

## Dependency requirements

- **React 18** (`react` and `react-dom`, both `^18.3.0`) as peer dependencies — you must install
  these yourself; they are not bundled.
- **`@shikho/tokens`** and **`@shikho/icons`** — regular dependencies, installed automatically.
- No Tailwind config is required in your app; the compiled `styles.css` is self-contained.

## Known limitations (v0.1)

- The Tailwind `@theme` token layer is still a stub — components consume `@shikho/tokens` values
  directly in TypeScript rather than through Tailwind classes/CSS variables. Theming via Tailwind
  utility classes bound to design tokens is not yet supported.
- A small number of components have confirmed-but-unimplemented variants (e.g. `Avatar`'s sibling
  `avatar_face`/`avatar_group` illustration assets — `AvatarGroup` itself *is* implemented) and
  one deliberately excluded component (`DigitField`, which has no confirmed Figma structure). See
  `docs/release-visual-verification.md` for the complete list.
- Several icon-shaped visuals inside components are still hand-drawn approximations rather than
  exported Figma assets, pending the full icon-library audit tracked in `@shikho/icons`.
