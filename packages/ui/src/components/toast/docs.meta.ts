import type { ComponentDocsMeta } from "../../docs-meta";

export const meta: ComponentDocsMeta = {
  name: "Toast",
  slug: "toast",
  category: "Feedback",
  description: "Alert's structural near-sibling, with real default severity/dismiss icons and per-severity tinted-background action buttons — confirmed different from Alert at nearly every layout dimension.",
  status: "deep-audited",
  packageImport: `import { Toast } from "@shikho/ui";`,
  storybookTitle: "Toast/toast",
  order: 30,
  exports: ["Toast"],
  figmaName: "toast",
  auditFile: "docs/audit/toasts.md",
};
