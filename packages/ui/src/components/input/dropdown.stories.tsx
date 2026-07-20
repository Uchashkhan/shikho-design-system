import type { Meta, StoryObj } from "@storybook/react";
import { Dropdown, type DropdownState } from "./dropdown";

const states: DropdownState[] = [
  "naked",
  "disabled",
  "error",
  "active",
  "brand",
  "active_no_focus",
  "hover",
  "default_dark",
  "default",
];

const meta: Meta<typeof Dropdown> = {
  title: "Input/dropdown",
  component: Dropdown,
  args: { state: "default", autoLayout: false, children: "Select an option" },
  argTypes: {
    state: { control: "select", options: states },
    autoLayout: { control: "boolean" },
  },
};

export default meta;

type Story = StoryObj<typeof Dropdown>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 240 }}>
      {states.map((state) => (
        <Dropdown key={state} state={state}>
          {state}
        </Dropdown>
      ))}
    </div>
  ),
};
