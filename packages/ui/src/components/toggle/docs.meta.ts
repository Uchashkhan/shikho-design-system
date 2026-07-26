import type { ComponentDocsMeta } from "../../docs-meta";

export const meta: ComponentDocsMeta = {
  name: "Toggle",
  slug: "toggle",
  category: "Forms",
  description: "Custom-rendered switch (pill track + sliding stadium knob) with a real toggle_label composition.",
  status: "deep-audited",
  packageImport: `import { Toggle, ToggleLabel } from "@shikho/ui";`,
  storybookTitle: "Toggle/toggle",
  order: 40,
  exports: ["Toggle", "ToggleLabel"],
  figmaName: "toggle",
  auditFile: "docs/audit/toggle.md",
};
