import { useEffect, useState, type FormEvent } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { CloseIcon } from "@shikho/icons";
import { ShikhoLogo } from "../ui/ShikhoLogo";
import { ChevronDownMark, GithubMark, MenuMark, SearchMark } from "../ui/DocsIcons";
import { DOCS_URL, REPO_URL } from "../config";

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
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // A route change is the only reliable "the visitor is done with the menu" signal for a
  // client-side nav — closing on link click alone would miss back/forward and programmatic
  // navigation (e.g. the search redirect below).
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

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

        {/* Below 760px this replaces .sk-topnav__links/.sk-topnav__actions entirely (hidden via
            CSS) rather than cramming a shrunk, horizontally-scrolling version of them into the
            same bar. */}
        <button
          type="button"
          className="sk-topnav__menu-btn"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="sk-mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <CloseIcon size={18} /> : <MenuMark size={18} />}
        </button>
      </header>

      {menuOpen ? (
        <div className="sk-topnav__mobile" id="sk-mobile-nav">
          <nav className="sk-topnav__mobile-links" aria-label="Primary">
            {NAV_LINKS.map((item) => (
              <NavLink key={item.to} to={item.to} className="sk-topnav__mobile-link">
                {item.label}
              </NavLink>
            ))}
            <a className="sk-topnav__mobile-link" href={DOCS_URL} target="_blank" rel="noreferrer">
              Documentation
            </a>
          </nav>

          <form className="sk-topnav__mobile-search" role="search" onSubmit={submitSearch}>
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
          </form>

          <div className="sk-topnav__mobile-actions">
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
        </div>
      ) : null}
    </div>
  );
}
