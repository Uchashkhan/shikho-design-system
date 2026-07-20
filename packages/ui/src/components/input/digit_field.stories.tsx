import type { Meta, StoryObj } from "@storybook/react";
import { DigitField } from "./digit_field";
import { DigitInput } from "./digit_input";

const meta: Meta<typeof DigitField> = {
  title: "Input/digit_field",
  component: DigitField,
};

export default meta;

type Story = StoryObj<typeof DigitField>;

/** No confirmed structure exists (docs/audit/input.md §1, §13) — falls back to one DigitInput. */
export const DefaultFallback: Story = {};

/** A consumer-composed row of DigitInput cells — not an audited structure, just one way to use the container. */
export const ComposedExample: Story = {
  render: () => (
    <DigitField>
      {[0, 1, 2, 3].map((i) => (
        <DigitInput key={i} aria-label={`Digit ${i + 1}`} />
      ))}
    </DigitField>
  ),
};
