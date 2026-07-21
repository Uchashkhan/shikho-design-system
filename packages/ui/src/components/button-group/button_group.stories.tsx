import type { Meta, StoryObj } from "@storybook/react";
import { ButtonGroup, type ButtonGroupItem, type ButtonGroupSize } from "./button_group";

const sizes: ButtonGroupSize[] = ["xs", "sm", "md", "lg", "xl"];

const threeItems: ButtonGroupItem[] = [
  { label: "One" },
  { label: "Two" },
  { label: "Three" },
];

const meta: Meta<typeof ButtonGroup> = {
  title: "Button Group/button_group",
  component: ButtonGroup,
  args: { size: "md", items: threeItems },
  argTypes: {
    size: { control: "select", options: sizes },
  },
};

export default meta;

type Story = StoryObj<typeof ButtonGroup>;

export const Playground: Story = {};

/** All 5 confirmed sizes (docs/audit/button-group.md §3), each with 3 segments. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
      {sizes.map((size) => (
        <ButtonGroup key={size} size={size} items={threeItems} />
      ))}
    </div>
  ),
};

/** The confirmed supported range: 2 to 6 segments (§5) — no count=1, no count=7+. */
export const SegmentCounts: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
      {[2, 3, 4, 5, 6].map((count) => (
        <ButtonGroup
          key={count}
          items={Array.from({ length: count }, (_, i) => ({ label: `${i + 1}` }))}
        />
      ))}
    </div>
  ),
};

/** Icon slots — left, right, and both, confirmed 14×14 with the shared elevation.e2 icon shadow. */
export const WithIcons: Story = {
  render: () => (
    <ButtonGroup
      items={[
        { label: "Left icon", leftIcon: <span style={{ display: "block", width: 14, height: 14, background: "#e2008d", borderRadius: 3 }} /> },
        { label: "Both", leftIcon: <span style={{ display: "block", width: 14, height: 14, background: "#e2008d", borderRadius: 3 }} />, rightIcon: <span style={{ display: "block", width: 14, height: 14, background: "#e2008d", borderRadius: 3 }} /> },
        { label: "Right icon", rightIcon: <span style={{ display: "block", width: 14, height: 14, background: "#e2008d", borderRadius: 3 }} /> },
      ]}
    />
  ),
};

/**
 * The confirmed first/middle/last treatment (§15, §16): outer corners rounded on the ends only,
 * middle segments square with a top/bottom-only border so adjacent segments join seamlessly.
 */
export const FirstMiddleLastTreatment: Story = {
  render: () => (
    <ButtonGroup
      items={[{ label: "First" }, { label: "Middle" }, { label: "Middle" }, { label: "Last" }]}
    />
  ),
};
