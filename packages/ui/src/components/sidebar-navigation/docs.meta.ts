import type { ComponentDocsMeta } from "../../docs-meta";

export const meta: ComponentDocsMeta = {
  name: "Sidebar Navigation",
  slug: "sidebar-navigation",
  category: "Actions",
  description: "Deep-audited nav row (6 types, 3 sizes) plus a confirmed reduced collapsed-tile variant. sidebar_nav itself is confirmed to be a demo composition, not implemented.",
  status: "deep-audited",
  packageImport: `import { SidebarItem, SidebarItemCollapsed } from "@shikho/ui";`,
  storybookTitle: "Sidebar Navigation/sidebar_item",
  order: 40,
  exports: ["SidebarItem", "SidebarItemCollapsed"],
  figmaName: "sidebar_item, sidebar_item_collapsed",
  auditFile: "docs/audit/sidebar-navigation-deep-audit.md",
};
