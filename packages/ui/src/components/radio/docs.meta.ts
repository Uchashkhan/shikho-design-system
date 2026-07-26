import type { ComponentDocsMeta } from "../../docs-meta";

export const meta: ComponentDocsMeta = {
  name: "Radio",
  slug: "radio",
  category: "Forms",
  description: "Custom-rendered radio with confirmed sm/md sizes, resolved focus rings, and a real radio_label composition.",
  status: "deep-audited",
  packageImport: `import { Radio, RadioLabel } from "@shikho/ui";`,
  storybookTitle: "Radio/radio",
  order: 30,
  exports: ["Radio", "RadioLabel"],
  figmaName: "radio",
  auditFile: "docs/audit/radio-buttons.md",
};
