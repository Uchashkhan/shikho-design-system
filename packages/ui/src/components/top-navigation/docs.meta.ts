import type { ComponentDocsMeta } from "../../docs-meta";

export const meta: ComponentDocsMeta = {
  name: "Top Navigation",
  slug: "top-navigation",
  category: "Actions",
  description:
    "Deep-audited top nav item — the original overview skipped get_design_context entirely; a deep re-audit confirms the full 7-type x state color matrix, including a confirmed pattern where every active_* type drops its inset shadow for a ring on focus.",
  status: "deep-audited",
  packageImport: `import { TopNavItem } from "@shikho/ui";`,
  storybookTitle: "Top Navigation/top_nav_item",
  order: 60,
  exports: ["TopNavItem"],
  figmaName: "top_nav_item",
  auditFile: "docs/audit/top-navigation-deep-audit.md",
};
