import type { Meta, StoryObj } from "@storybook/react";
import {
  ButtonSuccess,
  type ButtonSuccessSize,
  type ButtonSuccessState,
  type ButtonSuccessType,
} from "./button_success";

const sizes: ButtonSuccessSize[] = ["xs", "sm", "md", "lg", "xl"];
const types: ButtonSuccessType[] = ["Outline", "Secondary", "Text", "primary"];
const states: ButtonSuccessState[] = ["default", "hover", "focus", "disabled"];

const meta: Meta<typeof ButtonSuccess> = {
  title: "Button/button_success",
  component: ButtonSuccess,
  args: { size: "xs", type: "primary", state: "default", children: "Confirm" },
  argTypes: {
    size: { control: "select", options: sizes },
    type: { control: "select", options: types },
    state: { control: "select", options: states },
  },
};

export default meta;

type Story = StoryObj<typeof ButtonSuccess>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {types.map((type) => (
        <div key={type} style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ width: 72, fontSize: 12 }}>{type}</span>
          {sizes.map((size) =>
            states.map((state) => (
              <ButtonSuccess key={`${size}-${state}`} size={size} type={type} state={state}>
                {size}/{state}
              </ButtonSuccess>
            )),
          )}
        </div>
      ))}
    </div>
  ),
};
