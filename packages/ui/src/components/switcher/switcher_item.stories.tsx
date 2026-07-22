import type { Meta, StoryObj } from "@storybook/react";
import { SwitcherItem, type SwitcherItemSize, type SwitcherItemState, type SwitcherItemType } from "./switcher_item";

const sizes: SwitcherItemSize[] = ["xs", "sm", "md", "lg", "xl"];
const types: SwitcherItemType[] = ["active_primary", "active_primary_accent", "active", "active_neutral", "inactive"];
const states: SwitcherItemState[] = ["default", "hover"];

const meta: Meta<typeof SwitcherItem> = {
  title: "Switcher/switcher_item",
  component: SwitcherItem,
  args: { size: "lg", type: "inactive", state: "default" },
  argTypes: {
    size: { control: "select", options: sizes },
    type: { control: "select", options: types },
    state: { control: "select", options: states },
  },
};

export default meta;

type Story = StoryObj<typeof SwitcherItem>;

export const Playground: Story = {};

/** All 5 confirmed types (docs/audit/switcher-deep-audit.md §2). */
export const AllTypes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, background: "#222732", padding: 16, borderRadius: 12 }}>
      {types.map((type) => (
        <SwitcherItem key={type} type={type}>
          {type}
        </SwitcherItem>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {sizes.map((size) => (
        <SwitcherItem key={size} size={size} type="active_primary_accent">
          {size}
        </SwitcherItem>
      ))}
    </div>
  ),
};

/** Confirmed default->hover for active_primary_accent (12%->20% alpha). */
export const States: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      {states.map((state) => (
        <SwitcherItem key={state} type="active_primary_accent" state={state}>
          {state}
        </SwitcherItem>
      ))}
    </div>
  ),
};
