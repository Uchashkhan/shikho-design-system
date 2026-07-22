import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "./progress";

function Interactive({ initial = 35 }: { initial?: number }) {
  const [value, setValue] = useState(initial);
  return (
    <div style={{ width: 176 }}>
      <Progress value={value} onChange={setValue} aria-label="Media progress" />
    </div>
  );
}

const meta: Meta<typeof Progress> = {
  title: "Progress/progress",
  component: Progress,
  args: { value: 35 },
};

export default meta;

type Story = StoryObj<typeof Progress>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ width: 176 }}>
      <Progress {...args} aria-label="Media progress" />
    </div>
  ),
};

/** Confirmed scrubber structure (docs/audit/progress-deep-audit.md §2) — draggable, not just a static bar. */
export const Interactive_: Story = {
  name: "interactive",
  render: () => <Interactive initial={35} />,
};

export const Empty: Story = {
  render: () => (
    <div style={{ width: 176 }}>
      <Progress value={0} aria-label="Media progress" />
    </div>
  ),
};

export const Full: Story = {
  render: () => (
    <div style={{ width: 176 }}>
      <Progress value={100} aria-label="Media progress" />
    </div>
  ),
};

/** A confirmed custom min/max range, e.g. a media scrubber over a track's real duration in seconds. */
export const CustomRange: Story = {
  render: () => (
    <div style={{ width: 176 }}>
      <Progress value={45} min={0} max={180} aria-label="Media progress" />
    </div>
  ),
};
