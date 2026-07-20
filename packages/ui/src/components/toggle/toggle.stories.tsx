import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Toggle, type ToggleSize } from "./toggle";

const sizes: ToggleSize[] = ["lg", "md", "sm"];

const meta: Meta<typeof Toggle> = {
  title: "Toggle/toggle",
  component: Toggle,
  args: { size: "md", "aria-label": "Toggle" },
  argTypes: {
    size: { control: "select", options: sizes },
  },
};

export default meta;

type Story = StoryObj<typeof Toggle>;

export const Playground: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return <Toggle {...args} checked={checked} onChange={(e) => setChecked(e.target.checked)} />;
  },
};

/** The three confirmed sizes (docs/audit/toggle.md §4) — lg and md share the same confirmed
 * 40×24 bounding box, reproduced faithfully rather than "fixed" into two distinct sizes. */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      {sizes.map((size) => (
        <label key={size} style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12 }}>
          {size}
          <Toggle size={size} aria-label={size} />
        </label>
      ))}
    </div>
  ),
};

/** The ON/OFF axis (Figma's `switch_ON`/`switch_OFF`) as a real, interactive native control. */
export const CheckedVsUnchecked: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Toggle defaultChecked aria-label="On" />
        ON (switch_ON)
      </label>
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Toggle aria-label="Off" />
        OFF (switch_OFF)
      </label>
    </div>
  ),
};

/** switch_ON_disabled / switch_OFF_disabled — both confirmed states (§2). */
export const DisabledComparison: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Toggle disabled defaultChecked={false} aria-label="Disabled off" />
        Disabled + OFF
      </label>
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Toggle disabled defaultChecked aria-label="Disabled on" />
        Disabled + ON
      </label>
    </div>
  ),
};

/**
 * `switch_ON_focused` — the only focused variant in the confirmed state enum (§2); there is no
 * `switch_OFF_focused` at all (§10, §12), so this story only demonstrates the ON case. Tab to
 * this toggle to see the ring (`outline/primary_alpha`, §8 — the only focus-ring token present).
 */
export const FocusRing: Story = {
  args: { defaultChecked: true, autoFocus: true },
};
