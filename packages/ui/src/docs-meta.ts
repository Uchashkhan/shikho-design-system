/**
 * The one typed contract every component family's `docs.meta.ts` must satisfy.
 *
 * This lives in `@shikho/ui`, not `apps/docs`, so the dependency direction stays correct:
 * `apps/docs` already depends on `@shikho/ui`; `@shikho/ui` must never depend on `apps/docs`.
 * Each `packages/ui/src/components/<name>/docs.meta.ts` file imports this type from within the
 * same package (a relative import), and the docs site consumes discovered metadata objects
 * structurally — it only needs the *type*, exported here as a type-only export from the
 * package's public entry point.
 *
 * Keep this to fields the docs site's sidebar, gallery, routes, and search genuinely need.
 * Richer per-component documentation (variant tables, props reference, interactive playgrounds,
 * known audit gaps) is intentionally NOT part of this contract — it lives in
 * `apps/docs/src/registry/pages/*.tsx`, discovered separately and only for components that have
 * it. A component with just a `docs.meta.ts` and no page config still renders a safe fallback
 * page from this metadata alone.
 */

export type ComponentDocsCategory = "Actions" | "Forms" | "Data display" | "Feedback";

/**
 * How much of this component's visual design is backed by a confirmed Figma deep audit
 * (`get_design_context`) versus derived from already-confirmed tokens/siblings. Mirrors the
 * confirmed-vs-derived split each component's own README documents.
 */
export type ComponentDocsStatus = "deep-audited" | "partially-derived";

export interface ComponentDocsMeta {
  /** Display name, e.g. "Checkbox". */
  name: string;
  /** URL segment for the docs site: /components/:slug. Must be unique across all components. */
  slug: string;
  category: ComponentDocsCategory;
  /** One or two sentences. Used on gallery cards and as the fallback page's lede. */
  description: string;
  status: ComponentDocsStatus;
  /** The exact import line to show in docs, e.g. `import { Checkbox } from "@shikho/ui";`. */
  packageImport: string;
  /**
   * The `title` used in this family's own `*.stories.tsx` (or the shared group title, for
   * families with multiple stories files, e.g. Button's eight). Not resolved from a running
   * Storybook instance — just a plain string for cross-referencing.
   */
  storybookTitle: string;
  /** Sort key within a category; lower sorts first. */
  order: number;
  /** Every symbol this family exports from `@shikho/ui` — powers search. */
  exports: string[];
  /** Verbatim Figma component-set name(s), e.g. "checkbox" or "new_blue, new_pink, ...". */
  figmaName: string;
  /** Audit file this component was built from, relative to repo root. */
  auditFile: string;
}
