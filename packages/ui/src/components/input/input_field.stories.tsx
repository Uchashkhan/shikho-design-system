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

/** The one deep-audited state (docs/audit/input.md §8): confirmed border, fill, and focus ring. */
export const ConfirmedActiveState: Story = {
  args: { state: "active" },
};

export const Playground: Story = {};

/** Only `active` has a confirmed distinct visual — the other 6 states share field's confirmed default look. */
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
