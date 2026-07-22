import type { ComponentDocsMeta } from "../../docs-meta";

export const meta: ComponentDocsMeta = {
  name: "Switcher",
  slug: "switcher",
  category: "Actions",
  description: "Deep-audited segmented control. Unlike Sidebar Navigation's demo-only wrapper, switcher itself is confirmed to be a real composed container.",
  status: "deep-audited",
  packageImport: `import { Switcher, SwitcherItem } from "@shikho/ui";`,
  storybookTitle: "Switcher/switcher",
  order: 50,
  exports: ["Switcher", "SwitcherItem"],
  figmaName: "switcher, switcher_item",
  auditFile: "docs/audit/switcher-deep-audit.md",
};
