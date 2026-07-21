import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { groupByCategory, searchComponents } from "../registry";
import { ConfidencePill, PageHeader } from "../ui/primitives";

export function ComponentsPage() {
  const [query, setQuery] = useState("");
  const matches = useMemo(() => searchComponents(query), [query]);
  const grouped = useMemo(() => groupByCategory(matches), [matches]);

  return (
    <div className="sk-container">
      <PageHeader
        eyebrow="Library"
        title="Components"
        lede="Every component is rendered live from @shikho/ui — these are real components, not screenshots. Open any card for its variants, props and known gaps."
      />

      <div style={{ maxWidth: 380, marginTop: 24 }}>
        <input
          className="sk-search"
          style={{ marginBottom: 0 }}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter by name, export or Figma set…"
          aria-label="Filter components"
        />
      </div>

      {matches.length === 0 ? (
        <div className="sk-empty" style={{ marginTop: 28 }}>
          No components match “{query}”.
        </div>
      ) : (
        grouped.map(({ category, entries }) => (
          <section className="sk-section" key={category}>
            <div className="sk-section__head">
              <h2 className="sk-h2">{category}</h2>
              <p className="sk-section__desc">
                {entries.length} component{entries.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="sk-grid">
              {entries.map((entry) => (
                <Link key={entry.slug} to={`/components/${entry.slug}`} className="sk-card">
                  <div className="sk-card__preview">{entry.preview()}</div>
                  <div className="sk-card__body">
                    <div className="sk-card__title">
                      {entry.name}
                      <ConfidencePill confidence={entry.confidence} />
                    </div>
                    <p className="sk-card__desc">{entry.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
