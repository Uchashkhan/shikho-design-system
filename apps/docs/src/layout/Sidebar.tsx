import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { groupByCategory, searchComponents, searchFoundations } from "../registry";

/**
 * Every nav item below is derived from the registry — nothing is hand-listed. The search box
 * filters components and foundations together, and empty groups disappear.
 */
export function Sidebar() {
  const [query, setQuery] = useState("");

  const components = useMemo(() => searchComponents(query), [query]);
  const foundations = useMemo(() => searchFoundations(query), [query]);
  const grouped = useMemo(() => groupByCategory(components), [components]);

  const overviewVisible = query.trim() === "" || "overview".includes(query.trim().toLowerCase());
  const nothingMatched = !overviewVisible && components.length === 0 && foundations.length === 0;

  return (
    <aside className="sk-sidebar">
      <input
        className="sk-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search components…"
        aria-label="Search documentation"
      />

      {overviewVisible ? (
        <div className="sk-navgroup">
          <NavLink to="/" end className="sk-navlink">
            Overview
          </NavLink>
        </div>
      ) : null}

      {foundations.length > 0 ? (
        <div className="sk-navgroup">
          <p className="sk-navgroup__title">Foundations</p>
          {foundations.map((foundation) => (
            <NavLink
              key={foundation.slug}
              to={`/foundations/${foundation.slug}`}
              className="sk-navlink"
            >
              {foundation.name}
            </NavLink>
          ))}
        </div>
      ) : null}

      {components.length > 0 ? (
        <div className="sk-navgroup">
          <p className="sk-navgroup__title">Components</p>
          <NavLink to="/components" end className="sk-navlink">
            All components
            <span className="sk-navlink__count">{components.length}</span>
          </NavLink>
        </div>
      ) : null}

      {grouped.map(({ category, entries }) => (
        <div className="sk-navgroup" key={category}>
          <p className="sk-navgroup__title">{category}</p>
          {entries.map((entry) => (
            <NavLink
              key={entry.slug}
              to={`/components/${entry.slug}`}
              className="sk-navlink"
              title={entry.description}
            >
              {entry.name}
            </NavLink>
          ))}
        </div>
      ))}

      {nothingMatched ? (
        <p className="sk-nav-empty">No matches for “{query}”.</p>
      ) : null}
    </aside>
  );
}
