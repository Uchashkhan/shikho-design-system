import type { ComponentDocsCategory, ComponentDocsMeta } from "@shikho/ui";
import { discoveredComponentMeta } from "./meta-discovery";

export type { ComponentDocsCategory, ComponentDocsMeta, ComponentDocsStatus } from "@shikho/ui";
export { getPageConfig } from "./pages";
export type {
  Control,
  ControlOption,
  ComponentPageConfig,
  PropRow,
  VariantAxis,
  VariantShowcase,
} from "./pages";

/**
 * Canonical display order for categories. This is a docs-site presentation concern, so it lives
 * here rather than in `@shikho/ui`'s `ComponentDocsCategory` type — the package only defines
 * which category values are valid, not which order to show them in.
 */
export const CATEGORY_ORDER: ComponentDocsCategory[] = [
  "Actions",
  "Forms",
  "Data display",
  "Feedback",
];

function categoryRank(category: ComponentDocsCategory): number {
  const index = CATEGORY_ORDER.indexOf(category);
  return index === -1 ? CATEGORY_ORDER.length : index;
}

/**
 * THE component registry. Every entry is discovered automatically from each component family's
 * `docs.meta.ts` under `packages/ui/src/components` (see `./meta-discovery.ts`) — sidebar,
 * gallery, routes, and search all derive from this one array. Nothing is manually re-listed here.
 */
export const componentRegistry: ComponentDocsMeta[] = [...discoveredComponentMeta].sort(
  (a, b) => categoryRank(a.category) - categoryRank(b.category) || a.order - b.order,
);

export function getComponent(slug: string): ComponentDocsMeta | undefined {
  return componentRegistry.find((entry) => entry.slug === slug);
}

/** Categories that actually contain at least one registered component, in canonical order. */
export function usedCategories(
  entries: ComponentDocsMeta[] = componentRegistry,
): ComponentDocsCategory[] {
  return CATEGORY_ORDER.filter((category) => entries.some((entry) => entry.category === category));
}

export function groupByCategory(
  entries: ComponentDocsMeta[] = componentRegistry,
): { category: ComponentDocsCategory; entries: ComponentDocsMeta[] }[] {
  return usedCategories(entries).map((category) => ({
    category,
    entries: entries.filter((entry) => entry.category === category),
  }));
}

/**
 * Free-text filter used by both the sidebar search and the gallery search. Matches on name,
 * description, category, Figma set name and every exported symbol, so searching "IconButton" or
 * "input_field" finds the right page.
 */
export function searchComponents(
  query: string,
  entries: ComponentDocsMeta[] = componentRegistry,
): ComponentDocsMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return entries;

  return entries.filter((entry) =>
    [entry.name, entry.description, entry.category, entry.figmaName, entry.slug, ...entry.exports]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
}

/* ------------------------------------------------------------------ foundations */
/* Foundations are a fixed, small set of token-driven pages — not part of this component
   discovery system, and out of scope for it. */

export interface FoundationEntry {
  slug: string;
  name: string;
  summary: string;
  description: string;
}

export const foundationRegistry: FoundationEntry[] = [
  {
    slug: "colors",
    name: "Colors",
    summary: "Eleven confirmed ramps plus two 12-step opacity ramps.",
    description:
      "Every value is quoted verbatim from the colour audit. Gradients and the bulk of the subject colours are deliberately absent — they never resolved, and were not approximated.",
  },
  {
    slug: "radius",
    name: "Radius",
    summary: "One rank-based scale resolving two colliding Figma naming systems.",
    description:
      "Figma carries two parallel radius systems that disagree on what `md`, `lg` and `xl` mean. Canonical names here are assigned by the ascending rank of the confirmed numeric value, not inherited from either legacy label.",
  },
  {
    slug: "elevation",
    name: "Elevation",
    summary: "Six fully-resolved levels sharing one shadow colour.",
    description:
      "All six levels were resolved across the audit series — each from a different component. Every layer uses the same 3.9%-black shadow colour with a purely vertical offset.",
  },
];

export function getFoundation(slug: string): FoundationEntry | undefined {
  return foundationRegistry.find((entry) => entry.slug === slug);
}

export function searchFoundations(
  query: string,
  entries: FoundationEntry[] = foundationRegistry,
): FoundationEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return entries;

  return entries.filter((entry) =>
    [entry.name, entry.summary, entry.slug].join(" ").toLowerCase().includes(q),
  );
}
