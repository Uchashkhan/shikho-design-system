import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Switcher, type SwitcherOption } from "@shikho/ui";
import { CheckIcon, ChevronRightIcon } from "@shikho/icons";
import {
  componentRegistry,
  getPageConfig,
  groupByCategory,
  searchComponents,
  totalVariantValues,
  usedCategories,
  type ComponentDocsCategory,
} from "../registry";
import { FallbackPreview, PageHeader } from "../ui/primitives";

type CategoryFilter = "all" | ComponentDocsCategory;

/**
 * Short, user-facing blurbs for the catalogue grid — deliberately separate from
 * `ComponentDocsMeta.description` (the long, audit-history copy sourced from each component's
 * `docs.meta.ts`), which stays exactly as-is and is still what the component detail page shows.
 * A card here should read in one glance; the full technical description lives one click away.
 */
const CARD_SUMMARY: Record<string, string> = {
  button: "Primary actions and calls to action.",
  "button-group": "Grouped, related actions in one row.",
  link: "Text or icon links for navigation.",
  "sidebar-navigation": "Vertical navigation for app sidebars.",
  switcher: "Segmented control for switching views.",
  "tab-navigation": "Tabs for organizing related content.",
  "top-navigation": "Horizontal navigation for primary sections.",
  list: "Rows of structured, scannable content.",
  chip: "Compact tags for filters and selections.",
  tags: "Small labels for status and metadata.",
  avatar: "User or entity profile images.",
  pagination: "Page controls for long result sets.",
  table: "Structured rows for tabular data.",
  tooltip: "Contextual hints on hover or focus.",
  alert: "Inline messages for important context.",
  toast: "Brief, temporary status notifications.",
  modal: "Focused dialogs for a single task.",
  progress: "Visual indicator of task completion.",
  input: "Text fields for collecting user input.",
  checkbox: "Multi-select choices in a list.",
  radio: "Single-select choices in a group.",
  toggle: "On/off switches for settings.",
  "date-picker": "Calendar input for choosing dates.",
};

function filterLabel(text: string, count: number) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      {text}
      <span className="sk-catalogue__filter-count">{count}</span>
    </span>
  );
}

const CATEGORY_OPTIONS: SwitcherOption[] = [
  { value: "all", label: filterLabel("All", componentRegistry.length) },
  ...usedCategories().map((category) => ({
    value: category,
    label: filterLabel(
      category,
      componentRegistry.filter((entry) => entry.category === category).length,
    ),
  })),
];

export function ComponentsPage() {
  // Seeded from `?q=` so the header's search field can hand off a real query here rather than
  // just dropping the visitor on an unfiltered gallery.
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const byQuery = useMemo(() => searchComponents(query), [query]);
  const matches = useMemo(
    () => (category === "all" ? byQuery : byQuery.filter((entry) => entry.category === category)),
    [byQuery, category],
  );
  const grouped = useMemo(() => groupByCategory(matches), [matches]);

  return (
    <div className="sk-container">
      <PageHeader
        title="Components"
        lede="Every component is rendered live from @shikho/ui — these are real components, not screenshots. Open any card for its variants, props and implementation details."
      />

      <div className="sk-catalogue__toolbar">
        <p className="sk-catalogue__count">{componentRegistry.length} components</p>
        <Switcher
          size="sm"
          options={CATEGORY_OPTIONS}
          value={category}
          onChange={(value) => setCategory(value as CategoryFilter)}
        />
        <input
          className="sk-search sk-catalogue__search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter components by name, category or description…"
          aria-label="Filter components"
        />
      </div>

      {matches.length === 0 ? (
        <div className="sk-empty" style={{ marginTop: 28 }}>
          No components match “{query}”.
        </div>
      ) : (
        grouped.map(({ category: groupCategory, entries }) => (
          <section className="sk-section" key={groupCategory}>
            <div className="sk-section__head">
              <h2 className="sk-h2">{groupCategory}</h2>
              <p className="sk-section__desc">
                {entries.length} component{entries.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="sk-grid">
              {entries.map((entry) => {
                const page = getPageConfig(entry.slug);
                const variantCount = totalVariantValues(entry.slug);

                return (
                  <Link key={entry.slug} to={`/components/${entry.slug}`} className="sk-card">
                    <div className="sk-card__preview">
                      {page ? page.preview() : <FallbackPreview name={entry.name} />}
                    </div>
                    <div className="sk-card__body">
                      <div className="sk-card__head">
                        <span className="sk-card__title">{entry.name}</span>
                        <ChevronRightIcon size={14} className="sk-card__arrow" />
                      </div>
                      <p className="sk-card__desc">{CARD_SUMMARY[entry.slug] ?? entry.description}</p>
                      <div className="sk-card__meta">
                        {variantCount > 0 ? <span>{variantCount} variants</span> : null}
                        {entry.status === "deep-audited" ? (
                          <span className="sk-card__meta-audited">
                            <CheckIcon size={14} /> Audited
                          </span>
                        ) : (
                          <span className="sk-card__meta-audited sk-card__meta-audited--partial">
                            Partly derived
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
