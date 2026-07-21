# @shikho/docs

The public-facing documentation website for the Shikho Design System.

This is **not** a replacement for Storybook. The two serve different jobs:

| | `apps/storybook` | `apps/docs` (this app) |
|---|---|---|
| Purpose | Internal component testing & isolation | Polished browsing & documentation |
| Audience | Design-system contributors | Consumers of the system |
| Content | Every variant permutation, ad hoc | Curated previews, props, usage, known gaps |

Both consume `@shikho/ui` as a package. Neither duplicates component code.

## Running locally

```bash
pnpm --filter @shikho/docs dev      # http://localhost:5173
```

`@shikho/ui` is resolved from its **built** output (`packages/ui/dist`), so build the packages
first if you have not already:

```bash
pnpm build
```

## The component registry

Everything on this site is driven by one array: `src/registry/index.ts`.

The sidebar, the gallery cards, the search index, the routes and each component's own page all
read from the same `ComponentEntry` objects. There is no second list to keep in sync — adding a
component to the docs means adding one file and one line:

```
src/registry/components/<name>.tsx   ← new entry
src/registry/index.ts                ← add it to componentRegistry
```

Each entry carries its metadata (name, category, summary, audit source), its confirmed variant
axes and states, its props reference, its known gaps, a live gallery `preview()`, an optional
interactive `playground`, and static `showcases`. `src/registry/registry.test.tsx` enforces that
every entry is complete and that playground controls only ever offer confirmed values.

## Constraints this app respects

- **No component code is duplicated.** Every design-system component shown is imported from
  `@shikho/ui` and rendered as published. Nothing here restyles them.
- **No screenshots.** Gallery cards render real, interactive components.
- **No invented variants.** Playground controls are limited to values the audit confirmed; a
  test asserts this.
- **Theme comes from tokens.** The site's own chrome (`src/theme.ts` → CSS custom properties)
  is derived from `@shikho/tokens`, not hardcoded.
- **Gaps stay visible.** Every component page ends with the unresolved audit information for
  that component, so derived styling is never presented as confirmed.

## Structure

```
src/
├── registry/     Single source of truth — entries, types, lookups, search
├── layout/       App shell, top nav, searchable sidebar
├── pages/        Overview, gallery, component detail, playground, foundations
├── ui/           Docs-site chrome only (cards, tables, code blocks)
├── theme.ts      CSS custom properties derived from @shikho/tokens
└── styles.css    Site layout, consuming those properties
```
