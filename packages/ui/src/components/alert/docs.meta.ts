import type { ComponentDocsMeta } from "../../docs-meta";

export const meta: ComponentDocsMeta = {
  name: "Alert",
  slug: "alert",
  category: "Feedback",
  description: "Deep-audited banner with real default severity/close icons, a severity-tinted surface and Dismiss button (requested override), a consistently neutral 'Learn more' button, and a rigid, boolean-light prop surface.",
  status: "deep-audited",
  packageImport: `import { Alert } from "@shikho/ui";`,
  storybookTitle: "Alert/alert",
  order: 20,
  exports: ["Alert"],
  figmaName: "alert",
  auditFile: "docs/audit/alerts.md",
};
