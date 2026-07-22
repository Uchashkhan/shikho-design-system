import { useState } from "react";
import { Switcher, SwitcherItem, type SwitcherItemState, type SwitcherItemType, type SwitcherSize } from "@shikho/ui";
import type { ComponentPageConfig } from "./types";

const SIZES: SwitcherSize[] = ["xs", "sm", "md", "lg", "xl"];
const TYPES: SwitcherItemType[] = ["active_primary", "active_primary_accent", "active", "active_neutral", "inactive"];
const STATES: SwitcherItemState[] = ["default", "hover"];

const options = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
];

function InteractivePreview() {
  const [value, setValue] = useState("day");
  return <Switcher options={options} value={value} onChange={setValue} />;
}

export const pageConfig: ComponentPageConfig = {
  longDescription:
    "The original audit already included one deep instance (size=lg, type=active_primary_accent, state=hover). This deep re-audit extends that to all 5 confirmed types, and — critically — confirms switcher itself is a real composed container (bg gray-100, padding, radius), not a demo composition. This resolves the original audit's own flagged mystery: switcher's bounding box being 8px taller than switcher_item's at every size is just the container's own 4px top+bottom padding, not a different inner item scale. This is a genuine contrast with Sidebar Navigation's sidebar_nav, confirmed to be a pure demo.",
  variants: [
    { name: "size (SwitcherItem)", values: SIZES, note: "Only lg and sm were directly confirmed for icon size/typography; xs/md/xl are interpolated using the confirmed 5-step icon-size token ramp." },
    { name: "type (SwitcherItem)", values: TYPES, note: "5 confirmed types. inactive is confirmed SemiBold at gray-600, genuinely different from SidebarItem's Medium at gray-700 despite near-identical type vocabulary." },
    { name: "state (SwitcherItem)", values: STATES, note: "Only active_primary_accent's hover transition was directly re-confirmed (12% → 20% alpha)." },
  ],
  states: STATES,
  gaps: [
    "Only size=lg was directly deep-audited for icon size, typography, and padding. The switcher container's own size=sm nested sample additionally confirms 16px icons and caption_2 typography at that size — xs/md/xl are interpolated, not independently audited.",
    "Hover fill for active_primary, active, and active_neutral is derived by the same \"intensify one step\" pattern confirmed for active_primary_accent.",
    "No disabled state exists on switcher_item at all — confirmed absence.",
    "SwitcherItem has no tag slot — confirmed simpler than SidebarItem, which does have one.",
  ],
  usageExample: `import { Switcher } from "@shikho/ui";

function ViewToggle() {
  const [value, setValue] = useState("day");
  return (
    <Switcher
      value={value}
      onChange={setValue}
      options={[
        { label: "Day", value: "day" },
        { label: "Week", value: "week" },
        { label: "Month", value: "month" },
      ]}
    />
  );
}`,
  props: [
    { name: "Switcher: options / value / onChange", type: "SwitcherOption[] / string / (value) => void", description: "The confirmed real composed container." },
    { name: "Switcher: size", type: "xs | sm | md | lg | xl", defaultValue: "lg", description: "Propagated to every SwitcherItem segment." },
    { name: "SwitcherItem: type", type: "5 confirmed values", defaultValue: "inactive", description: "Confirmed distinct fill/text per type." },
    { name: "SwitcherItem: leftIcon / rightIcon / text", type: "boolean", defaultValue: "true", description: "The 3 confirmed boolean slots — no tag slot exists." },
  ],
  preview: () => <InteractivePreview />,
  playground: {
    controls: [
      {
        prop: "size",
        label: "Size",
        defaultValue: "lg",
        options: SIZES.map((v) => ({ label: v, value: v })),
      },
    ],
    render: (v) => {
      function Demo() {
        const [value, setValue] = useState("day");
        return <Switcher size={v.size as SwitcherSize} options={options} value={value} onChange={setValue} />;
      }
      return <Demo />;
    },
  },
  showcases: [
    {
      title: "All five confirmed sizes",
      layout: "stack",
      render: () => {
        function Demo() {
          const [values, setValues] = useState<Record<string, string>>(
            Object.fromEntries(SIZES.map((s) => [s, "day"])),
          );
          return (
            <>
              {SIZES.map((size) => (
                <div key={size} style={{ marginBottom: 12 }}>
                  <Switcher
                    size={size}
                    options={options}
                    value={values[size]}
                    onChange={(v) => setValues((prev) => ({ ...prev, [size]: v }))}
                  />
                </div>
              ))}
            </>
          );
        }
        return <Demo />;
      },
    },
    {
      title: "All five confirmed SwitcherItem types",
      description: "inactive is SemiBold at gray-600 — confirmed different from SidebarItem's Medium at gray-700.",
      render: () => (
        <div style={{ display: "flex", gap: 8, background: "#222732", padding: 16, borderRadius: 12 }}>
          {TYPES.map((type) => (
            <SwitcherItem key={type} type={type}>
              {type}
            </SwitcherItem>
          ))}
        </div>
      ),
    },
  ],
};
