import type { ComponentDocsMeta } from "../../docs-meta";

export const meta: ComponentDocsMeta = {
  name: "Progress",
  slug: "progress",
  category: "Feedback",
  description: "Deep-audited media scrubber (the confirmed 'Media' variant). Its sibling variant, 'Load More', is a confirmed byte-identical duplicate of LoadMorePagination and is not re-implemented here.",
  status: "deep-audited",
  packageImport: `import { Progress } from "@shikho/ui";`,
  storybookTitle: "Progress/progress",
  order: 50,
  exports: ["Progress"],
  figmaName: "Progress",
  auditFile: "docs/audit/progress-deep-audit.md",
};
