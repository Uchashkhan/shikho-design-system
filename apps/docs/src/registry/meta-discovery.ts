import type { ComponentDocsMeta } from "@shikho/ui";

/**
 * Discovers every component family's `docs.meta.ts` directly from `packages/ui/src/components/`
 * using Vite's `import.meta.glob` with eager loading — resolved and bundled at build time, not
 * fetched at runtime, and with no dependency on a running Storybook instance or its `index.json`.
 *
 * This is the entire "add a component" workflow on the `packages/ui` side: create
 * `packages/ui/src/components/<name>/docs.meta.ts` satisfying `ComponentDocsMeta`, and it is
 * picked up here automatically — no import to add, no list to edit, in this file or any other.
 */
const metaModules = import.meta.glob<{ meta: ComponentDocsMeta }>(
  "../../../../packages/ui/src/components/*/docs.meta.ts",
  { eager: true },
);

export const discoveredComponentMeta: ComponentDocsMeta[] = Object.values(metaModules).map(
  (mod) => mod.meta,
);
