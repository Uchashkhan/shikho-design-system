import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip, type TooltipDirection } from "./tooltip";

const directions: TooltipDirection[] = [
  "botom_left",
  "top_left",
  "botom_right",
  "top_right",
  "bottom_center",
  "top_center",
  "left_center",
  "right_center",
];

const Anchor = ({ direction, label = "Hover target" }: { direction: TooltipDirection; label?: string }) => (
  <div
    style={{
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 120,
      height: 40,
      border: "1px dashed #c3c6cc",
      borderRadius: 6,
      fontSize: 12,
    }}
  >
    {label}
    <Tooltip direction={direction}>Tooltip content</Tooltip>
  </div>
);

const meta: Meta<typeof Tooltip> = {
  title: "Tooltip/tooltip",
  component: Tooltip,
  args: { direction: "top_center", children: "Tooltip content" },
  argTypes: {
    direction: { control: "select", options: directions },
  },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Playground: Story = {
  render: (args) => <Anchor direction={args.direction ?? "top_center"} />,
};

/**
 * All 8 confirmed direction values (docs/audit/tooltips.md §2). Note the confirmed spelling
 * typo — `botom_left`/`botom_right` — preserved verbatim alongside the correctly-spelled
 * `bottom_center`.
 */
export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 64,
        padding: 48,
      }}
    >
      {directions.map((direction) => (
        <div key={direction} style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
          <Anchor direction={direction} label={direction} />
        </div>
      ))}
    </div>
  ),
};

/** The confirmed spelling typo, shown deliberately rather than corrected. */
export const ConfirmedTypo: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 48, padding: 24 }}>
      <Anchor direction="botom_left" label="botom_left (typo)" />
      <Anchor direction="bottom_center" label="bottom_center (correct)" />
    </div>
  ),
};
