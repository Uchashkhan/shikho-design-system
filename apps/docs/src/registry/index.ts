import { buttonEntry } from "./components/button";
import { checkboxEntry } from "./components/checkbox";
import { chipEntry } from "./components/chip";
import { inputEntry } from "./components/input";
import { listEntry } from "./components/list";
import { radioEntry } from "./components/radio";
import { toggleEntry } from "./components/toggle";
import { COMPONENT_CATEGORIES, type ComponentCategory, type ComponentEntry, type FoundationEntry } from "./types";

/**
 * THE registry. Sidebar, gallery, routes and search all read from this one array — adding a
 * component here makes it appear everywhere, with no other file to touch.
 *
 * Order is deliberate and matches the documented sidebar order.
 */
export const componentRegistry: ComponentEntry[] = [
  buttonEntry,
  inputEntry,
  checkboxEntry,
  listEntry,
  radioEntry,
  toggleEntry,
  chipEntry,
];

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

/* --------------------------------------------------------------------- lookups */

export function getComponent(slug: string): ComponentEntry | undefined {
  return componentRegistry.find((entry) => entry.slug === slug);
}

export function getFoundation(slug: string): FoundationEntry | undefined {
  return foundationRegistry.find((entry) => entry.slug === slug);
}

/** Categories that actually contain at least one registered component, in canonical order. */
export function usedCategories(entries: ComponentEntry[] = componentRegistry): ComponentCategory[] {
  return COMPONENT_CATEGORIES.filter((category) =>
    entries.some((entry) => entry.category === category),
  );
}

export function groupByCategory(
  entries: ComponentEntry[] = componentRegistry,
): { category: ComponentCategory; entries: ComponentEntry[] }[] {
  return usedCategories(entries).map((category) => ({
    category,
    entries: entries.filter((entry) => entry.category === category),
  }));
}

/**
 * Free-text filter used by both the sidebar search and the gallery search. Matches on name,
 * summary, category, Figma set name and every exported symbol, so searching "IconButton" or
 * "input_field" finds the right page.
 */
export function searchComponents(query: string, entries: ComponentEntry[] = componentRegistry) {
  const q = query.trim().toLowerCase();
  if (!q) return entries;

  return entries.filter((entry) =>
    [entry.name, entry.summary, entry.category, entry.figmaName, entry.slug, ...entry.exports]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
}

export function searchFoundations(query: string, entries: FoundationEntry[] = foundationRegistry) {
  const q = query.trim().toLowerCase();
  if (!q) return entries;

  return entries.filter((entry) =>
    [entry.name, entry.summary, entry.slug].join(" ").toLowerCase().includes(q),
  );
}

export * from "./types";
