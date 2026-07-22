import { useState } from "react";
import { TabNavItem, type TabNavItemSize, type TabNavItemState, type TabNavItemType } from "@shikho/ui";
import type { ComponentPageConfig } from "./types";

const SIZES: TabNavItemSize[] = ["xs", "sm", "md", "lg", "xl"];
const TYPES: TabNavItemType[] = ["active", "inactive"];
const STATES: TabNavItemState[] = ["default", "hover"];

function InteractivePreview() {
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

export const pageConfig: ComponentPageConfig = {
  longDescription:
    "The original audit already deep-audited nav_bar_header (both web and mobile), confirming it composes 5 nested tab_nav_item instances — but that only observed tab_nav_item's own styling indirectly. This deep re-audit adds the standalone component's confirmed type × state matrix directly, revealing it's the simplest, least-featured nav component in this library: no background-fill states at all (the active indicator is purely a border-bottom), no focus state, and no active+hover combination.",
  variants: [
    { name: "size", values: SIZES, note: "Only md was directly confirmed for icon size; xs/sm/lg/xl are interpolated using the confirmed 5-step icon-size token ramp." },
    { name: "type", values: TYPES, note: "The smallest type vocabulary of any nav component in this library — no semantic-color variants." },
    { name: "state", values: STATES, note: "Confirmed: active never has a distinct hover treatment. Inactive's hover only darkens text color — no background fill exists, unlike SwitcherItem/SidebarItem." },
  ],
  states: STATES,
  gaps: [
    "Only size=md was directly confirmed for icon size and padding — the other 4 sizes are derived using the confirmed 5-step icon-size token ramp and a uniformly-applied padding.",
    "No active+hover variant exists, and no focus state exists at all — both confirmed absences, not implementation gaps.",
    "tab_nav (the standalone size-only component set) is very likely a demo composition, matching the confirmed pattern for sidebar_nav — not implemented as its own component.",
    "nav_bar_header is not implemented — it composes a specific page-header layout (title + tab row), more of a page template than a reusable primitive.",
  ],
  usageExample: `import { TabNavItem } from "@shikho/ui";

function Tabs() {
  const [active, setActive] = useState("account");
  return (
    <div style={{ display: "flex", gap: 28 }}>
      <TabNavItem
        type={active === "account" ? "active" : "inactive"}
        onClick={() => setActive("account")}
      >
        Account
      </TabNavItem>
    </div>
  );
}`,
  props: [
    { name: "size", type: "xs | sm | md | lg | xl", defaultValue: "md", description: "Confirmed heights; icon size interpolated beyond the confirmed md anchor." },
    { name: "type", type: "inactive | active", defaultValue: "inactive", description: "The smallest type vocabulary of any nav component in this library." },
    { name: "state", type: "default | hover", defaultValue: "default", description: "No focus state exists. active ignores state entirely — confirmed no active+hover variant." },
    { name: "leftIcon / rightIcon / text", type: "boolean", defaultValue: "true", description: "The 3 confirmed boolean slots." },
  ],
  preview: () => <InteractivePreview />,
  playground: {
    controls: [
      {
        prop: "size",
        label: "Size",
        defaultValue: "md",
        options: SIZES.map((v) => ({ label: v, value: v })),
      },
      {
        prop: "type",
        label: "Type",
        defaultValue: "active",
        options: TYPES.map((v) => ({ label: v, value: v })),
      },
    ],
    render: (v) => (
      <div style={{ borderBottom: "1px solid #f4f4f6" }}>
        <TabNavItem size={v.size as TabNavItemSize} type={v.type as TabNavItemType}>
          Nav item
        </TabNavItem>
      </div>
    ),
  },
  showcases: [
    {
      title: "Both confirmed types",
      description: "The active indicator is purely a border-bottom — no background fill exists on either type.",
      render: () => (
        <div style={{ display: "flex", gap: 24, borderBottom: "1px solid #f4f4f6" }}>
          <TabNavItem type="active">Active</TabNavItem>
          <TabNavItem type="inactive">Inactive</TabNavItem>
        </div>
      ),
    },
    {
      title: "All five confirmed sizes",
      render: () => (
        <div style={{ display: "flex", gap: 16, alignItems: "flex-end", borderBottom: "1px solid #f4f4f6" }}>
          {SIZES.map((size) => (
            <TabNavItem key={size} size={size} type="active">
              {size}
            </TabNavItem>
          ))}
        </div>
      ),
    },
    {
      title: "A real, clickable tab row",
      render: () => <InteractivePreview />,
    },
  ],
};
