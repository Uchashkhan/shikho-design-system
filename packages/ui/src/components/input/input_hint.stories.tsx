import type { Meta, StoryObj } from "@storybook/react";
import { InputHint } from "./input_hint";

const meta: Meta<typeof InputHint> = {
  title: "Input/input_hint",
  component: InputHint,
  args: {
    size: "md",
    hintText: true,
    leftIcon: true,
    supportText: true,
    hintTextContent: "Hint",
    supportTextContent: "(Support text)",
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md"] },
  },
};

export default meta;

type Story = StoryObj<typeof InputHint>;

export const Playground: Story = {};

/** Matches the one deep-audited instance (input_field/active): supportText overridden to false. */
export const ConfirmedInstanceOverride: Story = {
  args: { supportText: false },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <InputHint hintTextContent="Hint text only" supportText={false} leftIcon={false} />
      <InputHint hintTextContent="Hint" supportTextContent="(Support text)" />
      <InputHint hintTextContent="Hint" supportTextContent="(Support text)" leftIcon={false} />
    </div>
  ),
};
