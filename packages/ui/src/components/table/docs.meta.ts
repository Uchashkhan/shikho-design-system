import type { ComponentDocsMeta } from "../../docs-meta";

export const meta: ComponentDocsMeta = {
  name: "Table",
  slug: "table",
  category: "Data display",
  description: "Deep-audited table cell — far richer than the original overview suggested: a nested Checkbox, up to 3 avatar slots, 2 Tags, and a confirmed skeleton loading state.",
  status: "deep-audited",
  packageImport: `import { TableCell } from "@shikho/ui";`,
  storybookTitle: "Table/table_cell",
  order: 50,
  exports: ["TableCell"],
  figmaName: "table_cell",
  auditFile: "docs/audit/table-deep-audit.md",
};
