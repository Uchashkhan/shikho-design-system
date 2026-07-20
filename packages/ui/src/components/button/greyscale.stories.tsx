import type { Meta, StoryObj } from "@storybook/react";
import {
  GreyscaleButton,
  type GreyscaleSize,
  type GreyscaleState,
  type GreyscaleType,
} from "./greyscale";

const sizes: GreyscaleSize[] = ["xs", "sm", "md", "lg", "xl"];
const types: GreyscaleType[] = ["Outline", "Secondary", "Text", "primary"];
const states: GreyscaleState[] = ["default", "hover", "focus", "disabled"];

const meta: Meta<typeof GreyscaleButton> = {
  title: "Button/Greyscale",
  component: GreyscaleButton,
  args: { size: "xs", type: "primary", state: "default", children: "Cancel" },
  argTypes: {
    size: { control: "select", options: sizes },
    type: { control: "select", options: types },
    state: { control: "select", options: states },
  },
};

export default meta;

type Story = StoryObj<typeof GreyscaleButton>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {types.map((type) => (
        <div key={type} style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ width: 72, fontSize: 12 }}>{type}</span>
          {sizes.map((size) =>
            states.map((state) => (
              <GreyscaleButton key={`${size}-${state}`} size={size} type={type} state={state}>
                {size}/{state}
              </GreyscaleButton>
            )),
          )}
        </div>
      ))}
    </div>
  ),
};
