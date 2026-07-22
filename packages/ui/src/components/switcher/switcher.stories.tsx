import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Switcher, type SwitcherSize } from "./switcher";

const sizes: SwitcherSize[] = ["xs", "sm", "md", "lg", "xl"];

const options = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
];

function Interactive({ size = "lg" as SwitcherSize }) {
  const [value, setValue] = useState("day");
  return <Switcher size={size} options={options} value={value} onChange={setValue} />;
}

const meta: Meta<typeof Switcher> = {
  title: "Switcher/switcher",
  component: Switcher,
  args: { options, value: "day" },
};

export default meta;

type Story = StoryObj<typeof Switcher>;

export const Playground: Story = {
  render: () => <Interactive />,
};

/** Confirmed real composed container (docs/audit/switcher-deep-audit.md §1) — not a demo, unlike sidebar_nav. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
      {sizes.map((size) => (
        <Interactive key={size} size={size} />
      ))}
    </div>
  ),
};
