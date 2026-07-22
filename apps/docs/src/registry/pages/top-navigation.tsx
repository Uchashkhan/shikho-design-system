import { useState } from "react";
import { TopNavItem, type TopNavItemSize, type TopNavItemState, type TopNavItemType } from "@shikho/ui";
import type { ComponentPageConfig } from "./types";

const SIZES: TopNavItemSize[] = ["xs", "sm", "md", "lg", "xl"];
const TYPES: TopNavItemType[] = [
  "active_primary",
  "active_primary_accent",
  "active",
  "active_neutral",
  "active_outline",
  "inactive",
  "inactive_outline",
];
const STATES: TopNavItemState[] = ["default", "hover", "focus"];

function InteractivePreview() {
  const [active, setActive] = useState("home");
  const items = [
    { value: "home", label: "Home" },
    { value: "explore", label: "Explore" },
    { value: "profile", label: "Profile" },
  ];
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {items.map((item) => (
        <TopNavItem
          key={item.value}
          type={item.value === active ? "active_primary" : "inactive"}
          onClick={() => setActive(item.value)}
        >
          {item.label}
        </TopNavItem>
      ))}
    </div>
  );
}

export const pageConfig: ComponentPageConfig = {
  longDescription:
    "The original overview audit deliberately skipped get_design_context, confirming only variant counts and token names from metadata alone. A deep re-audit fetched all 12 reachable type x state variants directly at size=md, confirming the full color matrix and a genuine systematic pattern the metadata-only audit couldn't see: every active_* type's focus state drops its inset shadow entirely and replaces it with an outer ring, and inactive/inactive_outline are confirmed to have no focus state at all.",
  variants: [
    { name: "type", values: TYPES, note: "7 confirmed values — the largest type vocabulary of any nav component in this library, confirmed to be a superset combining switcher_item's and most of sidebar_item's types." },
    { name: "size", values: SIZES, note: "All 5 confirmed directly from the top_nav container's own per-size rendering." },
    { name: "state", values: STATES, note: "focus only applies to the 5 active_* types — inactive/inactive_outline are confirmed to have no focus state." },
  ],
  states: STATES,
  gaps: [
    "Typography pixel sizes at xl/lg/sm/xs were read from the top_nav container fetch rather than independently re-confirmed via a dedicated top_nav_item fetch at each size.",
    "top_nav (the bare Figma instance) is confirmed a demo composition — a fixed row of top_nav_item instances — and is not implemented, matching the sidebar_nav/tab_nav precedent.",
    "No badge, counter, or separator slot exists anywhere in top_nav_item — confirmed absent, not a gap.",
  ],
  usageExample: `import { TopNavItem } from "@shikho/ui";

function Nav() {
  const [active, setActive] = useState("home");
  return (
    <TopNavItem
      type={active === "home" ? "active_primary" : "inactive"}
      onClick={() => setActive("home")}
    >
      Home
    </TopNavItem>
  );
}`,
  props: [
    { name: "type", type: "active_primary | active_primary_accent | active | active_neutral | active_outline | inactive | inactive_outline", defaultValue: "inactive", description: "Confirmed 7-value type vocabulary — the largest of any nav component in this library." },
    { name: "size", type: "xs | sm | md | lg | xl", defaultValue: "md", description: "Confirmed 5-step size scale, read directly from the top_nav container." },
    { name: "state", type: "default | hover | focus", defaultValue: "default", description: "focus is confirmed absent on inactive/inactive_outline — passing it there falls back to default styling." },
    { name: "leftIcon / rightIcon / text", type: "boolean", defaultValue: "true", description: "The 3 confirmed boolean slots. No badge/counter/separator slot exists." },
  ],
  preview: () => <InteractivePreview />,
  playground: {
    controls: [
      {
        prop: "type",
        label: "Type",
        defaultValue: "active_primary",
        options: TYPES.map((v) => ({ label: v, value: v })),
      },
      {
        prop: "size",
        label: "Size",
        defaultValue: "md",
        options: SIZES.map((v) => ({ label: v, value: v })),
      },
      {
        prop: "state",
        label: "State",
        defaultValue: "default",
        options: STATES.map((v) => ({ label: v, value: v })),
      },
    ],
    render: (v) => (
      <TopNavItem
        type={v.type as TopNavItemType}
        size={v.size as TopNavItemSize}
        state={v.state as TopNavItemState}
      >
        Nav item
      </TopNavItem>
    ),
  },
  showcases: [
    {
      title: "All seven confirmed types",
      description: "The largest type vocabulary of any nav component in this library — a confirmed superset combining switcher_item's and most of sidebar_item's types.",
      render: () => (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {TYPES.map((type) => (
            <TopNavItem key={type} type={type}>
              {type}
            </TopNavItem>
          ))}
        </div>
      ),
    },
    {
      title: "Confirmed focus behavior",
      description: "Every active_* type's focus state drops the inset special_drop shadow for an outer ring — a genuine confirmed pattern, not an assumption.",
      render: () => (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {TYPES.filter((t) => t !== "inactive" && t !== "inactive_outline").map((type) => (
            <TopNavItem key={type} type={type} state="focus">
              {type}
            </TopNavItem>
          ))}
        </div>
      ),
    },
    {
      title: "All five confirmed sizes",
      render: () => (
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          {SIZES.map((size) => (
            <TopNavItem key={size} size={size} type="active_primary">
              {size}
            </TopNavItem>
          ))}
        </div>
      ),
    },
    {
      title: "A real, clickable nav row",
      render: () => <InteractivePreview />,
    },
  ],
};
