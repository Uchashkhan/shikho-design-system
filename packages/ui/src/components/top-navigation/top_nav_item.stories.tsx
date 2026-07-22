import type { Meta, StoryObj } from "@storybook/react";
import { TopNavItem, type TopNavItemType } from "./top_nav_item";

const types: TopNavItemType[] = [
  "active_primary",
  "active_primary_accent",
  "active",
  "active_neutral",
  "active_outline",
  "inactive",
  "inactive_outline",
];

const meta: Meta<typeof TopNavItem> = {
  title: "Top Navigation/top_nav_item",
  component: TopNavItem,
  args: { type: "active", size: "md", children: "Nav item" },
  argTypes: {
    type: { control: "select", options: types },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    state: { control: "select", options: ["default", "hover", "focus"] },
  },
};

export default meta;

type Story = StoryObj<typeof TopNavItem>;

export const Playground: Story = {};

/** Confirmed: all 7 types at default state (docs/audit/top-navigation-deep-audit.md §3). */
export const AllTypes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: 16, background: "#fafafa" }}>
      {types.map((type) => (
        <TopNavItem key={type} type={type}>
          {type}
        </TopNavItem>
      ))}
    </div>
  ),
};

/** Confirmed: every focus-eligible type drops its inset shadow for an outer ring (§3). */
export const FocusStates: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: 16, background: "#fafafa" }}>
      {types
        .filter((t) => t !== "inactive" && t !== "inactive_outline")
        .map((type) => (
          <TopNavItem key={type} type={type} state="focus">
            {type}
          </TopNavItem>
        ))}
    </div>
  ),
};

/** Confirmed 5-step size scale (§5). */
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <TopNavItem key={size} size={size} type="active_primary">
          {size}
        </TopNavItem>
      ))}
    </div>
  ),
};
