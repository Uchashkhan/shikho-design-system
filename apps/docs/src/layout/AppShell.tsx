import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { ErrorBoundary } from "../ui/ErrorBoundary";

export function AppShell() {
  const { pathname } = useLocation();

  return (
    <div className="sk-shell">
      <TopNav />
      <div className="sk-body">
        <Sidebar />
        <main className="sk-main">
          {/* `key={pathname}` gives every route its own boundary instance — a crash on one page
              doesn't leave later, unrelated pages stuck showing the old fallback, and nav/sidebar
              stay usable so there's always a way off the broken route. */}
          <ErrorBoundary label="app-shell" resetKey={pathname}>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
