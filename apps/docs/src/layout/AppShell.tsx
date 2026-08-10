import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

export function AppShell() {
  return (
    <div className="sk-shell">
      <TopNav variant="docs" />
      <div className="sk-body">
        <Sidebar />
        <main className="sk-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
