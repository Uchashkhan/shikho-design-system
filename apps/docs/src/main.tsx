import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// The design system's own compiled styles. Components from @shikho/ui are rendered exactly as
// published — this site never restyles them.
import "@shikho/ui/styles.css";

// Docs-site chrome, themed from @shikho/tokens at runtime.
import "./styles.css";

import { App } from "./App";
import { applyTheme } from "./theme";
import { ErrorBoundary } from "./ui/ErrorBoundary";

applyTheme();

// React error boundaries only catch render-time errors — NOT exceptions thrown from event
// handlers, timers, or rejected promises. These two listeners are the diagnostic net for that
// other half: they can't stop a crash the way a boundary can, but they guarantee it's logged
// with enough context (message + stack) to trace back to a cause, instead of silently vanishing
// into a blank tab.
window.addEventListener("error", (event) => {
  console.error("[docs:window-error] Uncaught error", event.error ?? event.message);
});
window.addEventListener("unhandledrejection", (event) => {
  console.error("[docs:unhandled-rejection] Unhandled promise rejection", event.reason);
});

const container = document.getElementById("root");
if (!container) throw new Error("Root element #root not found");

createRoot(container).render(
  <StrictMode>
    {/* Last-resort net: catches anything that somehow escapes the per-shell boundaries in
        AppShell/LandingShell (e.g. a crash in the shell chrome itself, outside their own
        Outlet). Has no resetKey since there's no narrower scope left to key off of here. */}
    <ErrorBoundary label="root">
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
