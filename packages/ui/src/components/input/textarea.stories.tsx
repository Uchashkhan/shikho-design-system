import type { Meta, StoryObj } from "@storybook/react";
import { Textarea, type TextareaState } from "./textarea";

const states: TextareaState[] = ["default", "default_dark", "hover", "filled", "active", "error", "disabled"];

const meta: Meta<typeof Textarea> = {
  title: "Input/textarea",
  component: Textarea,
  args: { state: "default", placeholder: "Write something…" },
  argTypes: { state: { control: "select", options: states } },
};

export default meta;

type Story = StoryObj<typeof Textarea>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 280 }}>
      {states.map((state) => (
        <Textarea key={state} state={state} aria-label={state} placeholder={state} />
      ))}
    </div>
  ),
};
