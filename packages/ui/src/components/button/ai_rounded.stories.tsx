import type { Meta, StoryObj } from "@storybook/react";
import {
  AiRoundedButton,
  type AiRoundedSize,
  type AiRoundedState,
  type AiRoundedType,
} from "./ai_rounded";

const sizes: AiRoundedSize[] = ["xs", "sm", "md", "lg", "xxl"];
const types: AiRoundedType[] = ["Green", "Primary", "Purple", "blue gradient"];
const states: AiRoundedState[] = ["Default", "Hover", "Focus", "Disabled"];

const meta: Meta<typeof AiRoundedButton> = {
  title: "Button/ai_rounded",
  component: AiRoundedButton,
  args: { size: "xs", type: "Primary", state: "Default", children: "Ask AI" },
  argTypes: {
    size: { control: "select", options: sizes },
    type: { control: "select", options: types },
    state: { control: "select", options: states },
  },
};

export default meta;

type Story = StoryObj<typeof AiRoundedButton>;

export const Playground: Story = {};

/**
 * Confirmed real gradients (docs/audit/buttons.md §14.3) — not solid ramp fills. `Primary`/
 * `blue gradient`/`Green` are linear gradients with exact confirmed stop colors/angles; `Purple`
 * is a 6-stop radial gradient, approximated in CSS (exact colors, non-pixel-exact geometry).
 */
export const GradientTypes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      {types.map((type) => (
        <AiRoundedButton key={type} type={type}>
          {type}
        </AiRoundedButton>
      ))}
    </div>
  ),
};

/** Confirmed true pill radius at every size — height/2, independently confirmed at xs and lg (§14.2). */
export const PillRadiusAcrossSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      {sizes.map((size) => (
        <AiRoundedButton key={size} size={size}>
          {size}
        </AiRoundedButton>
      ))}
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {types.map((type) => (
        <div key={type} style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ width: 96, fontSize: 12 }}>{type}</span>
          {sizes.map((size) =>
            states.map((state) => (
              <AiRoundedButton key={`${size}-${state}`} size={size} type={type} state={state}>
                {size}/{state}
              </AiRoundedButton>
            )),
          )}
        </div>
      ))}
    </div>
  ),
};
