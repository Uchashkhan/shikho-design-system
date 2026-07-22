import type { ComponentDocsMeta } from "../../docs-meta";

export const meta: ComponentDocsMeta = {
  name: "Tab Navigation",
  slug: "tab-navigation",
  category: "Actions",
  description: "Deep-audited tab item — the simplest nav component in this library: no background-fill states, no focus state, and no active+hover combination.",
  status: "deep-audited",
  packageImport: `import { TabNavItem } from "@shikho/ui";`,
  storybookTitle: "Tab Navigation/tab_nav_item",
  order: 60,
  exports: ["TabNavItem"],
  figmaName: "tab_nav_item",
  auditFile: "docs/audit/tab-navigation-deep-audit.md",
};
