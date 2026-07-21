import { NavLink, Outlet } from "react-router-dom";
import { componentRegistry } from "../registry";
import { ShikhoLogo } from "../ui/ShikhoLogo";
import { Sidebar } from "./Sidebar";

const TOP_NAV = [
  { label: "Docs", to: "/" },
  { label: "Components", to: "/components" },
  { label: "Foundations", to: "/foundations/colors" },
  { label: "Playground", to: "/playground" },
];

function TopNav() {
  return (
    <header className="sk-topnav">
      <NavLink to="/" className="sk-brandmark">
        <ShikhoLogo height={40} />
        <span className="sk-brandmark__sub">
          Design
          <br />
          System
        </span>
      </NavLink>

      <nav className="sk-topnav__links">
        {TOP_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className="sk-topnav__link"
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sk-topnav__spacer" />
      <div className="sk-topnav__meta">
        v0.1 · {componentRegistry.length} components
      </div>
    </header>
  );
}

export function AppShell() {
  return (
    <div className="sk-shell">
      <TopNav />
      <div className="sk-body">
        <Sidebar />
        <main className="sk-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
