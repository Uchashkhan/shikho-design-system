import { SidebarItem, SidebarItemCollapsed, type SidebarItemSize, type SidebarItemState, type SidebarItemType } from "@shikho/ui";
import type { ComponentPageConfig } from "./types";

const SIZES: SidebarItemSize[] = ["md", "lg", "xl"];
const TYPES: SidebarItemType[] = [
  "active_primary",
  "active_primary_accent",
  "active",
  "active_neutral_inverse",
  "active_neutral",
  "inactive",
];
const STATES: SidebarItemState[] = ["default", "hover"];

const dot = (
  <span style={{ display: "block", width: "100%", height: "100%", borderRadius: 999, background: "currentColor" }} />
);

export const pageConfig: ComponentPageConfig = {
  longDescription:
    "The original audit already included one deep instance (size=lg, type=active_primary_accent, state=hover). This deep re-audit extends that to all 6 confirmed types at state=default, confirms sidebar_item_collapsed's reduced structure (previously 0 confirmed variants), and resolves that sidebar_nav is a demo composition — 9 stacked sidebar_item instances — not a primitive, so it isn't implemented as its own component.",
  variants: [
    { name: "size", values: SIZES, note: "SidebarItem only — SidebarItemCollapsed has a confirmed fixed 64×56 size with no size axis." },
    { name: "type", values: TYPES, note: "6 confirmed types, each with a distinct confirmed fill/text/weight treatment. inactive is the only type at Medium weight." },
    { name: "state", values: STATES, note: "No disabled state exists — confirmed absence, matching switcher_item." },
  ],
  states: STATES,
  gaps: [
    "The confirmed asymmetric icon sizing (22px left icon vs. 24px right icon) has no known reason — preserved as confirmed, not corrected.",
    "SidebarItemCollapsed's fill/text mapping for 5 of its 6 types reuses SidebarItem's own confirmed matrix — only active_primary_accent was independently confirmed for the collapsed variant.",
    "sidebar_nav is confirmed a demo composition (9 stacked sidebar_item instances), not a primitive — not implemented as its own component, consistent with this project's existing treatment of top_nav/tab_nav.",
    "side_bar, side_bar_collapsed, side_bar_collapsed_2, and sidebar_nav_collapsed all remain bare, unexpanded Figma instances with zero confirmed internal structure — not implemented.",
  ],
  usageExample: `import { SidebarItem, SidebarItemCollapsed } from "@shikho/ui";

function Nav() {
  return (
    <SidebarItem type="active_primary_accent" selectLeftIcon={<HomeIcon />}>
      Dashboard
    </SidebarItem>
  );
}`,
  props: [
    { name: "size", type: "md | lg | xl", defaultValue: "lg", description: "SidebarItem only. Confirmed heights: 40/48/56." },
    { name: "type", type: "6 confirmed values", defaultValue: "inactive", description: "Confirmed distinct fill/text/weight per type." },
    { name: "state", type: "default | hover", description: "Left unset, the real cursor drives it. Pass explicitly to force a preview (e.g. in this playground). No disabled state exists." },
    { name: "leftIcon / rightIcon / tag / text", type: "boolean", defaultValue: "true", description: "SidebarItem's 4 confirmed boolean slots." },
    { name: "icon / text (SidebarItemCollapsed)", type: "boolean", defaultValue: "true", description: "Only 2 booleans — no tag, no rightIcon, a confirmed reduced structure." },
    { name: "selectLeftIcon / selectRightIcon", type: "ReactNode | null", description: "Confirmed instance-swap slots." },
  ],
  preview: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 240 }}>
      <SidebarItem type="active_primary_accent" selectLeftIcon={dot} selectRightIcon={dot} tagContent="12">
        Dashboard
      </SidebarItem>
      <SidebarItem type="inactive" selectLeftIcon={dot} selectRightIcon={dot}>
        Settings
      </SidebarItem>
    </div>
  ),
  playground: {
    controls: [
      {
        prop: "size",
        label: "Size",
        defaultValue: "lg",
        options: SIZES.map((v) => ({ label: v, value: v })),
      },
      {
        prop: "type",
        label: "Type",
        defaultValue: "active_primary_accent",
        options: TYPES.map((v) => ({ label: v, value: v })),
      },
      {
        prop: "state",
        label: "State",
        defaultValue: "default",
        options: STATES.map((v) => ({ label: v, value: v })),
      },
    ],
    render: (v) => (
      <div style={{ width: 240 }}>
        <SidebarItem
          size={v.size as SidebarItemSize}
          type={v.type as SidebarItemType}
          state={v.state as SidebarItemState}
          selectLeftIcon={dot}
          selectRightIcon={dot}
          tagContent="12"
        >
          Nav item
        </SidebarItem>
      </div>
    ),
  },
  showcases: [
    {
      title: "All six confirmed types",
      description: "Each with a distinct confirmed fill/text/weight treatment — inactive is the only Medium-weight type.",
      render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 240, background: "#222732", padding: 16, borderRadius: 12 }}>
          {TYPES.map((type) => (
            <SidebarItem key={type} type={type} selectLeftIcon={dot} selectRightIcon={dot} tagContent="12">
              {type}
            </SidebarItem>
          ))}
        </div>
      ),
    },
    {
      title: "SidebarItemCollapsed — a confirmed reduced structure",
      description: "Fixed 64×56, no size axis, no tag, no right icon.",
      render: () => (
        <div style={{ display: "flex", gap: 8, background: "#222732", padding: 16, borderRadius: 12 }}>
          {TYPES.map((type) => (
            <SidebarItemCollapsed key={type} type={type} selectLeftIcon={dot}>
              {type}
            </SidebarItemCollapsed>
          ))}
        </div>
      ),
    },
  ],
};
