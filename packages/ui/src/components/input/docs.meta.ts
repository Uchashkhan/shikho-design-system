import type { ComponentDocsMeta } from "../../docs-meta";

export const meta: ComponentDocsMeta = {
  name: "Input",
  slug: "input",
  category: "Forms",
  description:
    "Seven component sets plus one bare instance, split between sizing and interaction state.",
  status: "deep-audited",
  packageImport: `import { Field, InputField, InputLabel, InputHint } from "@shikho/ui";`,
  storybookTitle: "Input",
  order: 10,
  exports: [
    "InputLabel",
    "InputHint",
    "Field",
    "InputField",
    "Dropdown",
    "Textarea",
    "DigitInput",
    "DigitField",
  ],
  figmaName: "input_label, input_hint, field, input_field, dropdown, textarea, digit_input, digit_field",
  auditFile: "docs/audit/input.md",
};
