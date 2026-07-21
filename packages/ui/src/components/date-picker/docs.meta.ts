import type { ComponentDocsMeta } from "../../docs-meta";

export const meta: ComponentDocsMeta = {
  name: "Date Picker",
  slug: "date-picker",
  category: "Forms",
  description: "Deep-audited calendar with presets, single/range selection, and confirmed row-segmented range highlighting.",
  status: "deep-audited",
  packageImport: `import { DatePicker } from "@shikho/ui";`,
  storybookTitle: "Date Picker/date_picker",
  order: 50,
  exports: ["DatePicker", "DATE_PICKER_PRESETS"],
  figmaName: "date_picker",
  auditFile: "docs/audit/date-picker-deep-audit.md",
};
