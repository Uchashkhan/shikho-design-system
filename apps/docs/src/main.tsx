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

applyTheme();

const container = document.getElementById("root");
if (!container) throw new Error("Root element #root not found");

createRoot(container).render(
  <StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
