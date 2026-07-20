import type { Meta, StoryObj } from "@storybook/react";
import {
  ButtonDanger,
  type ButtonDangerSize,
  type ButtonDangerState,
  type ButtonDangerType,
} from "./button_danger";

const sizes: ButtonDangerSize[] = ["xs", "sm", "md", "lg", "xl"];
const types: ButtonDangerType[] = ["Secondary", "Text", "primary", "tertiary"];
const states: ButtonDangerState[] = ["default", "hover", "focus", "disabled"];

const meta: Meta<typeof ButtonDanger> = {
  title: "Button/button_danger",
  component: ButtonDanger,
  args: { size: "xs", type: "primary", state: "default", children: "Delete" },
  argTypes: {
    size: { control: "select", options: sizes },
    type: { control: "select", options: types },
    state: { control: "select", options: states },
  },
};

export default meta;

type Story = StoryObj<typeof ButtonDanger>;

export const Playground: Story = {};

/** Demonstrates the corrected focus.danger ring — see docs/token-normalization-decisions.md §10. */
export const FocusRingFix: Story = {
  args: { state: "focus" },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {types.map((type) => (
        <div key={type} style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ width: 72, fontSize: 12 }}>{type}</span>
          {sizes.map((size) =>
            states.map((state) => (
              <ButtonDanger key={`${size}-${state}`} size={size} type={type} state={state}>
                {size}/{state}
              </ButtonDanger>
            )),
          )}
        </div>
      ))}
    </div>
  ),
};
