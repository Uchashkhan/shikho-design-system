import { NavLink } from "react-router-dom";
import { componentRegistry, foundationRegistry, groupByCategory } from "../registry";

const grouped = groupByCategory(componentRegistry);

/**
 * Every nav item below is derived from the registry — nothing is hand-listed.
 *
 * This is navigation only: filtering the catalogue lives on the Components page itself (its own
 * search field plus category filter), so the sidebar always shows the full, real information
 * architecture rather than a second, narrower search surface for the same task.
 */
export function Sidebar() {
  return (
    <aside className="sk-sidebar">
      <div className="sk-navgroup">
        <NavLink to="/" end className="sk-navlink">
          Overview
        </NavLink>
      </div>

      <div className="sk-navgroup">
        <p className="sk-navgroup__title">Foundations</p>
        {foundationRegistry.map((foundation) => (
          <NavLink
            key={foundation.slug}
            to={`/foundations/${foundation.slug}`}
            className="sk-navlink"
          >
            {foundation.name}
          </NavLink>
        ))}
      </div>

      <div className="sk-navgroup">
        <p className="sk-navgroup__title">Components</p>
        <NavLink to="/components" end className="sk-navlink">
          All components
          <span className="sk-navlink__count">{componentRegistry.length}</span>
        </NavLink>
      </div>

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
    </aside>
  );
}
