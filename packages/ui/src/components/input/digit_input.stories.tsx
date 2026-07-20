import type { Meta, StoryObj } from "@storybook/react";
import { DigitInput, type DigitInputState } from "./digit_input";

const states: DigitInputState[] = ["default", "default_dark", "hover", "filled", "active", "error", "disabled"];

const meta: Meta<typeof DigitInput> = {
  title: "Input/digit_input",
  component: DigitInput,
  args: { state: "default" },
  argTypes: { state: { control: "select", options: states } },
};

export default meta;

type Story = StoryObj<typeof DigitInput>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      {states.map((state) => (
        <DigitInput key={state} state={state} aria-label={state} defaultValue={state === "filled" ? "5" : ""} />
      ))}
    </div>
  ),
};
