import { Outlet, useLocation } from "react-router-dom";
import { TopNav } from "./TopNav";
import { ErrorBoundary } from "../ui/ErrorBoundary";

/**
 * Full-width shell for the marketing/landing homepage — the same shared `TopNav` as the docs
 * shell, but no documentation sidebar, so the hero can breathe edge to edge.
 */
export function LandingShell() {
  const { pathname } = useLocation();

  return (
    <div className="sk-shell lp-page">
      {/* One full-page decorative layer, a SIBLING of the sticky nav rather than an ancestor or a
          descendant of `.lp` — so its own `overflow: hidden` (needed to contain the glow blobs'
          bleed) can never interfere with the nav's `position: sticky`, and the wash/grid/blobs
          read as one continuous backdrop behind both the nav and the hero, with no boundary at
          `.lp`'s own edges. */}
      <div className="lp-page__bg" aria-hidden>
        <div className="lp-page__grid" />
        <div className="lp__glow lp__glow--a" />
        <div className="lp__glow lp__glow--b" />
      </div>
      <TopNav />
      <main className="sk-landing">
        <ErrorBoundary label="landing-shell" resetKey={pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
}
