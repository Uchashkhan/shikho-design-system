import type { Meta, StoryObj } from "@storybook/react";
import { SidebarItem, type SidebarItemSize, type SidebarItemState, type SidebarItemType } from "./sidebar_item";

const sizes: SidebarItemSize[] = ["md", "lg", "xl"];
const types: SidebarItemType[] = [
  "active_primary",
  "active_primary_accent",
  "active",
  "active_neutral_inverse",
  "active_neutral",
  "inactive",
];
const states: SidebarItemState[] = ["default", "hover"];

const dot = <span style={{ display: "block", width: "100%", height: "100%", borderRadius: 999, background: "currentColor" }} />;

const meta: Meta<typeof SidebarItem> = {
  title: "Sidebar Navigation/sidebar_item",
  component: SidebarItem,
  args: { size: "lg", type: "inactive", state: "default", selectLeftIcon: dot, selectRightIcon: dot, tagContent: "12" },
  argTypes: {
    size: { control: "select", options: sizes },
    type: { control: "select", options: types },
    state: { control: "select", options: states },
  },
  decorators: [(Story) => <div style={{ width: 240 }}><Story /></div>],
};

export default meta;

type Story = StoryObj<typeof SidebarItem>;

export const Playground: Story = {};

/** All 6 confirmed types (docs/audit/sidebar-navigation-deep-audit.md §2), each with a distinct confirmed fill/text treatment. */
export const AllTypes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 240, background: "#222732", padding: 16, borderRadius: 12 }}>
      {types.map((type) => (
        <SidebarItem key={type} type={type} selectLeftIcon={dot} selectRightIcon={dot} tagContent="12">
          {type}
        </SidebarItem>
      ))}
    </div>
  ),
};

/** Confirmed default->hover transitions for active_primary_accent and inactive; the other 4 types are derived. */
export const States: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 240 }}>
      {states.map((state) => (
        <SidebarItem key={state} type="active_primary_accent" state={state} selectLeftIcon={dot} selectRightIcon={dot}>
          {state}
        </SidebarItem>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 240 }}>
      {sizes.map((size) => (
        <SidebarItem key={size} size={size} type="active_primary_accent" selectLeftIcon={dot} selectRightIcon={dot}>
          {size}
        </SidebarItem>
      ))}
    </div>
  ),
};

export const WithoutTagOrIcons: Story = {
  args: { leftIcon: false, rightIcon: false, tag: false, type: "active_primary_accent" },
};
