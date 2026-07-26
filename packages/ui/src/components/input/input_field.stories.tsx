import type { Meta, StoryObj } from "@storybook/react";
import { InputField, type InputFieldState } from "./input_field";

const states: InputFieldState[] = [
  "default",
  "default_dark",
  "hover",
  "filled",
  "active",
  "error",
  "disabled",
];

const meta: Meta<typeof InputField> = {
  title: "Input/input_field",
  component: InputField,
  args: {
    state: "default",
    labelContent: "Label",
    fieldProps: { textContent: "Input text" },
    hintProps: { hintTextContent: "Hint" },
  },
  argTypes: {
    state: { control: "select", options: states },
  },
};

export default meta;

type Story = StoryObj<typeof InputField>;

/** The active state: confirmed border, fill, and ring (docs/audit/input.md §8). */
export const ConfirmedActiveState: Story = {
  args: { state: "active" },
};

export const Playground: Story = {};

/** All 7 confirmed states now render their own distinct chrome (docs/audit/input.md §14) — previously only `active` did. */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 320 }}>
      {states.map((state) => (
        <InputField
          key={state}
          state={state}
          labelContent={`Label (${state})`}
          fieldProps={{ textContent: "Input text" }}
          hintProps={{ hintTextContent: "Hint" }}
        />
      ))}
    </div>
  ),
};
