import { Outlet } from "react-router-dom";
import { TopNav } from "./TopNav";

/**
 * Full-width shell for the marketing/landing homepage — the same top navigation as the docs
 * shell, but without the documentation sidebar, so the hero can breathe edge to edge.
 */
export function LandingShell() {
  return (
    <div className="sk-shell">
      <TopNav />
      <main className="sk-landing">
        <Outlet />
      </main>
    </div>
  );
}
