import { NavLink } from "react-router-dom";
import { componentRegistry } from "../registry";
import { ShikhoLogo } from "../ui/ShikhoLogo";

/** Repository the design system is published from — surfaced as a nav action per the homepage brief. */
const REPO_URL = "https://github.com/Uchashkhan/shikho-design-system";

const NAV_LINKS = [
  { label: "Docs", to: "/" },
  { label: "Components", to: "/components" },
  { label: "Foundations", to: "/foundations/colors" },
  { label: "Playground", to: "/playground" },
];

function GithubMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

/**
 * Floating pill-shaped navigation used only on the landing page (`/`) — a marketing-style header,
 * distinct from the full-width sticky `TopNav` used on every other (docs/sidebar) route. Carries
 * the same information as `TopNav` (brand, nav links, GitHub, version/component count), just
 * restyled into a floating pill rather than a full-width bar.
 */
export function LandingNav() {
  return (
    <div className="lp-nav-wrap">
      <header className="lp-nav">
        <NavLink to="/" className="lp-nav__brand">
          <ShikhoLogo height={32} />
          <span className="lp-nav__brand-sub">
            Design
            <br />
            System
          </span>
        </NavLink>

        <nav className="lp-nav__links">
          {NAV_LINKS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"} className="lp-nav__link">
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="lp-nav__spacer" />

        <a
          className="lp-nav__github"
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="View the repository on GitHub"
        >
          <GithubMark />
          <span>GitHub</span>
        </a>

        <div className="lp-nav__meta">v0.1 · {componentRegistry.length} components</div>
      </header>
    </div>
  );
}
