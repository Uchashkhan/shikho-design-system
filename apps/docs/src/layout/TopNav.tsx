import { useState, type FormEvent } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ShikhoLogo } from "../ui/ShikhoLogo";
import { ChevronDownMark, GithubMark, SearchMark } from "../ui/DocsIcons";

/** Repository the design system is published from — surfaced as a nav action. */
const REPO_URL = "https://github.com/Uchashkhan/shikho-design-system";
/** The `docs/` folder is the written documentation; the site itself is the component reference. */
const DOCS_URL = `${REPO_URL}/tree/main/docs`;

/**
 * Every entry points at a destination that actually exists — no nav item leads to a 404.
 * `Patterns` resolves to a real route that states plainly the section is not built yet, rather
 * than being silently dropped or linking nowhere.
 */
const NAV_LINKS = [
  { label: "Components", to: "/components" },
  { label: "Foundations", to: "/foundations/colors" },
  { label: "Patterns", to: "/patterns" },
  { label: "Playground", to: "/playground" },
];

/**
 * Shared site header, used by every shell (landing and docs alike) — one consistent floating
 * nav across the whole site rather than a page-specific variant.
 *
 * Composition follows the homepage reference: brand at the left, the destination group in a
 * light inset pill, then search / GitHub / version on the right. Everything is docs-site chrome
 * themed from `--sk-*` (which are derived from `@shikho/tokens`) — no `@shikho/ui` component is
 * restyled here.
 */
export function TopNav() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  /** Hands the query off to the component gallery, which seeds its own filter from `?q=`. */
  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const q = query.trim();
    navigate(q ? `/components?q=${encodeURIComponent(q)}` : "/components");
  };

  return (
    <div className="sk-topnav-wrap">
      <header className="sk-topnav">
        <NavLink to="/" className="sk-topnav__brand">
          <ShikhoLogo height={30} />
          <span className="sk-topnav__brand-sub">
            Design
            <br />
            System
          </span>
        </NavLink>

        <nav className="sk-topnav__links" aria-label="Primary">
          {NAV_LINKS.map((item) => (
            <NavLink key={item.to} to={item.to} className="sk-topnav__link">
              {item.label}
            </NavLink>
          ))}
          <a className="sk-topnav__link" href={DOCS_URL} target="_blank" rel="noreferrer">
            Documentation
          </a>
        </nav>

        <div className="sk-topnav__spacer" />

        <div className="sk-topnav__actions">
          <form className="sk-topnav__search" role="search" onSubmit={submitSearch}>
            <span className="sk-topnav__search-icon" aria-hidden>
              <SearchMark />
            </span>
            <input
              type="search"
              placeholder="Search"
              aria-label="Search components"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <kbd className="sk-topnav__kbd" aria-hidden>
              ⌘ K
            </kbd>
          </form>

          <a
            className="sk-topnav__github"
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="View the repository on GitHub"
          >
            <GithubMark />
            <span>GitHub</span>
          </a>

          <a
            className="sk-topnav__version"
            href={`${REPO_URL}/releases`}
            target="_blank"
            rel="noreferrer"
          >
            v0.1.0
            <ChevronDownMark />
          </a>
        </div>
      </header>
    </div>
  );
}
