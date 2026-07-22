import type { Meta, StoryObj } from "@storybook/react";
import { SidebarItemCollapsed } from "./sidebar_item_collapsed";
import type { SidebarItemType } from "./sidebar_item";

const types: SidebarItemType[] = [
  "active_primary",
  "active_primary_accent",
  "active",
  "active_neutral_inverse",
  "active_neutral",
  "inactive",
];

const dot = <span style={{ display: "block", width: "100%", height: "100%", borderRadius: 999, background: "currentColor" }} />;

const meta: Meta<typeof SidebarItemCollapsed> = {
  title: "Sidebar Navigation/sidebar_item_collapsed",
  component: SidebarItemCollapsed,
  args: { type: "inactive", selectLeftIcon: dot },
};

export default meta;

type Story = StoryObj<typeof SidebarItemCollapsed>;

export const Playground: Story = {};

/** Confirmed fixed 64x56 size (docs/audit/sidebar-navigation-deep-audit.md §4) — no size axis, unlike SidebarItem. */
export const AllTypes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, background: "#222732", padding: 16, borderRadius: 12 }}>
      {types.map((type) => (
        <SidebarItemCollapsed key={type} type={type} selectLeftIcon={dot}>
          {type}
        </SidebarItemCollapsed>
      ))}
    </div>
  ),
};

/** Confirmed reduced structure — no tag, no right icon, unlike the full-size SidebarItem. */
export const IconOnly: Story = {
  args: { text: false },
};
