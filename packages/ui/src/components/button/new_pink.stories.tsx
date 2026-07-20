import type { Meta, StoryObj } from "@storybook/react";
import { NewPinkButton, type NewPinkSize, type NewPinkState, type NewPinkType } from "./new_pink";

const sizes: NewPinkSize[] = ["xs", "sm", "md", "lg", "xxl"];
const types: NewPinkType[] = ["Outline", "Primary", "Secondary", "Text"];
const states: NewPinkState[] = ["Default", "Hover", "Focus", "Disabled"];

const meta: Meta<typeof NewPinkButton> = {
  title: "Button/new_pink",
  component: NewPinkButton,
  args: { size: "xs", type: "Primary", state: "Default", children: "Upgrade" },
  argTypes: {
    size: { control: "select", options: sizes },
    type: { control: "select", options: types },
    state: { control: "select", options: states },
  },
};

export default meta;

type Story = StoryObj<typeof NewPinkButton>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {types.map((type) => (
        <div key={type} style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ width: 72, fontSize: 12 }}>{type}</span>
          {sizes.map((size) =>
            states.map((state) => (
              <NewPinkButton key={`${size}-${state}`} size={size} type={type} state={state}>
                {size}/{state}
              </NewPinkButton>
            )),
          )}
        </div>
      ))}
    </div>
  ),
};
