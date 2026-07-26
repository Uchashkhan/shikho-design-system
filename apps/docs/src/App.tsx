import type { ReactNode } from "react";
import { Link, Navigate, Route, Routes, useParams } from "react-router-dom";
import { AppShell } from "./layout/AppShell";
import { LandingShell } from "./layout/LandingShell";
import { foundationRegistry } from "./registry";
import { ComponentDetailPage } from "./pages/ComponentDetailPage";
import { ComponentsPage } from "./pages/ComponentsPage";
import { HomePage } from "./pages/HomePage";
import { PlaygroundPage } from "./pages/PlaygroundPage";
import { ColorsPage } from "./pages/foundations/ColorsPage";
import { ElevationPage } from "./pages/foundations/ElevationPage";
import { RadiusPage } from "./pages/foundations/RadiusPage";
import { PageHeader } from "./ui/primitives";

/** Each foundation slug in the registry maps to exactly one page component. */
const FOUNDATION_PAGES: Record<string, ReactNode> = {
  colors: <ColorsPage />,
  radius: <RadiusPage />,
  elevation: <ElevationPage />,
};

function FoundationRoute() {
  const { slug = "" } = useParams();
  const page = FOUNDATION_PAGES[slug];

  if (!page) {
    return (
      <div className="sk-container">
        <PageHeader title="Foundation not found" lede={`No foundation is registered at “${slug}”.`} />
      </div>
    );
  }

  return <>{page}</>;
}

function NotFoundPage() {
  return (
    <div className="sk-container">
      <PageHeader
        title="Page not found"
        lede="That page doesn't exist in the Shikho Design System documentation."
      />
      <p style={{ marginTop: 20 }}>
        <Link to="/" style={{ color: "var(--sk-brand)", fontWeight: 600 }}>
          ← Back to overview
        </Link>
      </p>
    </div>
  );
}

export function App() {
  // Sanity check kept in code rather than a comment: every registered foundation must have a page.
  const missing = foundationRegistry.filter((f) => !FOUNDATION_PAGES[f.slug]);
  if (missing.length > 0 && import.meta.env.DEV) {
    console.warn(
      `[docs] Foundations without a page component: ${missing.map((f) => f.slug).join(", ")}`,
    );
  }

  return (
    <Routes>
      <Route element={<LandingShell />}>
        <Route path="/" element={<HomePage />} />
      </Route>
      <Route element={<AppShell />}>
        <Route path="/components" element={<ComponentsPage />} />
        <Route path="/components/:slug" element={<ComponentDetailPage />} />
        <Route path="/foundations" element={<Navigate to="/foundations/colors" replace />} />
        <Route path="/foundations/:slug" element={<FoundationRoute />} />
        <Route path="/playground" element={<PlaygroundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
