import type { ComponentDocsMeta } from "../../docs-meta";

export const meta: ComponentDocsMeta = {
  name: "Pagination",
  slug: "pagination",
  category: "Data display",
  description: "Deep-audited page navigator with a confirmed windowing algorithm, plus a separately-exported LoadMorePagination widget confirmed to be a structurally distinct control.",
  status: "deep-audited",
  packageImport: `import { Pagination, LoadMorePagination } from "@shikho/ui";`,
  storybookTitle: "Pagination/pagination",
  order: 40,
  exports: ["Pagination", "LoadMorePagination"],
  figmaName: "pagination",
  auditFile: "docs/audit/pagination-deep-audit.md",
};
