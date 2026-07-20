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

/** "blue gradient" has no resolved value anywhere in the audit — renders as a solid placeholder. */
export const UnresolvedGradientPlaceholder: Story = {
  args: { type: "blue gradient" },
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
