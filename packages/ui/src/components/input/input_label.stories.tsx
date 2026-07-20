import type { Meta, StoryObj } from "@storybook/react";
import { InputLabel, type InputLabelSize } from "./input_label";

const sizes: InputLabelSize[] = ["sm", "md"];

const meta: Meta<typeof InputLabel> = {
  title: "Input/input_label",
  component: InputLabel,
  args: { size: "md", children: "Label" },
  argTypes: { size: { control: "select", options: sizes } },
};

export default meta;

type Story = StoryObj<typeof InputLabel>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      {sizes.map((size) => (
        <InputLabel key={size} size={size}>
          Label ({size})
        </InputLabel>
      ))}
    </div>
  ),
};
