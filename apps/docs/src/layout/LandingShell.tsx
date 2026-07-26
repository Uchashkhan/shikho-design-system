import { Outlet } from "react-router-dom";
import { LandingNav } from "./LandingNav";

/**
 * Full-width shell for the marketing/landing homepage — a floating pill-style nav distinct from
 * the docs shell's full-width `TopNav`, and no documentation sidebar, so the hero can breathe
 * edge to edge.
 */
export function LandingShell() {
  return (
    <div className="sk-shell lp-page">
      <LandingNav />
      <main className="sk-landing">
        <Outlet />
      </main>
    </div>
  );
}
