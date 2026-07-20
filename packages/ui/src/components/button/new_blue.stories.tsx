import type { Meta, StoryObj } from "@storybook/react";
import { NewBlueButton, type NewBlueSize, type NewBlueState, type NewBlueType } from "./new_blue";

const sizes: NewBlueSize[] = ["xs", "sm", "md", "lg", "xxl"];
const types: NewBlueType[] = ["Outline", "Primary", "Secondary", "Text"];
const states: NewBlueState[] = ["Default", "Hover", "Focus", "Disabled"];

const meta: Meta<typeof NewBlueButton> = {
  title: "Button/new_blue",
  component: NewBlueButton,
  args: { size: "xs", type: "Primary", state: "Default", children: "Continue" },
  argTypes: {
    size: { control: "select", options: sizes },
    type: { control: "select", options: types },
    state: { control: "select", options: states },
  },
};

export default meta;

type Story = StoryObj<typeof NewBlueButton>;

/** The one exactly confirmed binding: size=xs, type=Primary, state=Default (docs/audit/buttons.md §8). */
export const ConfirmedBinding: Story = {};

export const Playground: Story = {
  args: { size: "md", type: "Primary", state: "Default" },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {types.map((type) => (
        <div key={type} style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ width: 72, fontSize: 12 }}>{type}</span>
          {sizes.map((size) =>
            states.map((state) => (
              <NewBlueButton key={`${size}-${state}`} size={size} type={type} state={state}>
                {size}/{state}
              </NewBlueButton>
            )),
          )}
        </div>
      ))}
    </div>
  ),
};
