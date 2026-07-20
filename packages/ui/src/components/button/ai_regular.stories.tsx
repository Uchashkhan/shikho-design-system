import type { Meta, StoryObj } from "@storybook/react";
import {
  AiRegularButton,
  type AiRegularSize,
  type AiRegularState,
  type AiRegularType,
} from "./ai_regular";

const sizes: AiRegularSize[] = ["xs", "sm", "md", "lg", "xxl"];
const types: AiRegularType[] = ["Green", "Primary", "blue gradient", "purple"];
const states: AiRegularState[] = ["Default", "Hover", "Focus", "Disabled"];

const meta: Meta<typeof AiRegularButton> = {
  title: "Button/ai_regular",
  component: AiRegularButton,
  args: { size: "xs", type: "Primary", state: "Default", children: "Ask AI" },
  argTypes: {
    size: { control: "select", options: sizes },
    type: { control: "select", options: types },
    state: { control: "select", options: states },
  },
};

export default meta;

type Story = StoryObj<typeof AiRegularButton>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {types.map((type) => (
        <div key={type} style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ width: 96, fontSize: 12 }}>{type}</span>
          {sizes.map((size) =>
            states.map((state) => (
              <AiRegularButton key={`${size}-${state}`} size={size} type={type} state={state}>
                {size}/{state}
              </AiRegularButton>
            )),
          )}
        </div>
      ))}
    </div>
  ),
};
