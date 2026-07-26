import type { ComponentDocsMeta } from "../../docs-meta";

export const meta: ComponentDocsMeta = {
  name: "Checkbox",
  slug: "checkbox",
  category: "Forms",
  description: "Custom-rendered checkbox with confirmed sm/md sizes and a square/sphere shape choice, plus the CheckboxLabel composition — deep re-audited to replace native browser rendering with the real confirmed checkmark/indeterminate visuals.",
  status: "deep-audited",
  packageImport: `import { Checkbox, CheckboxLabel } from "@shikho/ui";`,
  storybookTitle: "Checkbox/checkbox",
  order: 20,
  exports: ["Checkbox", "CheckboxLabel"],
  figmaName: "checkbox",
  auditFile: "docs/audit/checkboxes.md",
};
