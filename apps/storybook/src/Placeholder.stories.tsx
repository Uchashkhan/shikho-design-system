import type { Meta, StoryObj } from "@storybook/react";
import { Placeholder } from "@shikho/ui";

const meta: Meta<typeof Placeholder> = {
  title: "Foundation/Placeholder",
  component: Placeholder,
};

export default meta;

type Story = StoryObj<typeof Placeholder>;

export const Default: Story = {
  args: {
    children: "Scaffold placeholder — real components land in a later phase",
  },
};
