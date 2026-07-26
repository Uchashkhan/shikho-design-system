import type { ComponentDocsMeta } from "../../docs-meta";

export const meta: ComponentDocsMeta = {
  name: "Button",
  slug: "button",
  category: "Actions",
  description:
    "Eight separate button families, each with its own confirmed size/type/state vocabulary — deep re-audited via get_design_context to confirm real borders, shadows, gradients, and color mappings the original metadata-only pass had guessed.",
  status: "deep-audited",
  packageImport: `import { NewBlueButton, ButtonDanger, IconButton } from "@shikho/ui";`,
  storybookTitle: "Button",
  order: 10,
  exports: [
    "NewBlueButton",
    "NewPinkButton",
    "AiRoundedButton",
    "AiRegularButton",
    "ButtonSuccess",
    "ButtonDanger",
    "GreyscaleButton",
    "IconButton",
  ],
  figmaName:
    "new_blue, new_pink, ai_rounded, ai_regular, button_success, button_danger, Greyscale, icon_button",
  auditFile: "docs/audit/buttons.md",
};
