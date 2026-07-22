import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TabNavItem, type TabNavItemSize, type TabNavItemState } from "./tab_nav_item";

const sizes: TabNavItemSize[] = ["xs", "sm", "md", "lg", "xl"];
const states: TabNavItemState[] = ["default", "hover"];

const meta: Meta<typeof TabNavItem> = {
  title: "Tab Navigation/tab_nav_item",
  component: TabNavItem,
  args: { size: "md", type: "inactive", state: "default" },
  argTypes: {
    size: { control: "select", options: sizes },
    type: { control: "select", options: ["inactive", "active"] },
    state: { control: "select", options: states },
  },
};

export default meta;

type Story = StoryObj<typeof TabNavItem>;

export const Playground: Story = {};

/** Confirmed: no background fill at any state — the active indicator is purely a border-bottom (docs/audit/tab-navigation-deep-audit.md §1). */
export const Types: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24, borderBottom: "1px solid #f4f4f6" }}>
      <TabNavItem type="active">Active</TabNavItem>
      <TabNavItem type="inactive">Inactive</TabNavItem>
    </div>
  ),
};

/** Confirmed: hover only darkens inactive's text color (gray-600 → gray-700) — no fill, unlike SwitcherItem/SidebarItem. */
export const States: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24, borderBottom: "1px solid #f4f4f6" }}>
      {states.map((state) => (
        <TabNavItem key={state} type="inactive" state={state}>
          {state}
        </TabNavItem>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-end", borderBottom: "1px solid #f4f4f6" }}>
      {sizes.map((size) => (
        <TabNavItem key={size} size={size} type="active">
          {size}
        </TabNavItem>
      ))}
    </div>
  ),
};

/** A row of tabs with real click-to-select behavior. */
export const InteractiveTabRow: Story = {
  render: () => {
    function Demo() {
      const [active, setActive] = useState("account");
      const tabs = [
        { value: "account", label: "Account" },
        { value: "security", label: "Security" },
        { value: "preferences", label: "Preferences" },
      ];
      return (
        <div style={{ display: "flex", gap: 28, borderBottom: "1px solid #f4f4f6" }}>
          {tabs.map((tab) => (
            <TabNavItem
              key={tab.value}
              type={tab.value === active ? "active" : "inactive"}
              onClick={() => setActive(tab.value)}
            >
              {tab.label}
            </TabNavItem>
          ))}
        </div>
      );
    }
    return <Demo />;
  },
};
