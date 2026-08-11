import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Switcher, type SwitcherOption } from "@shikho/ui";
import { CheckIcon, ChevronRightIcon } from "@shikho/icons";
import {
  componentRegistry,
  componentSummaries,
  getPageConfig,
  groupByCategory,
  searchComponents,
  totalVariantValues,
  usedCategories,
  type ComponentDocsCategory,
} from "../registry";
import { FallbackPreview, PageHeader } from "../ui/primitives";

type CategoryFilter = "all" | ComponentDocsCategory;

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
        {/* The Switcher's own segments never wrap internally — on a narrow viewport the row
            scrolls horizontally instead of overflowing the page. */}
        <div className="sk-catalogue__filter-scroll">
          <Switcher
            size="sm"
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={(value) => setCategory(value as CategoryFilter)}
          />
        </div>
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
                      <p className="sk-card__desc">
                        {componentSummaries[entry.slug] ?? entry.description}
                      </p>
                      <div className="sk-card__meta">
                        {variantCount > 0 ? <span>{variantCount} variants</span> : null}
                        {entry.status === "deep-audited" ? (
                          <span className="sk-audit-status">
                            <CheckIcon size={14} /> Audited
                          </span>
                        ) : (
                          <span className="sk-audit-status sk-audit-status--partial">
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
