import { useEffect, useRef, useState } from "react";
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

/** Dispatches a real `focus()` call on mount so the story shows the actual resolved focus-ring
 * visual, rather than a CSS override recreated in Storybook (docs/audit/toggle.md §14). */
function SimulatedFocus(props: React.ComponentProps<typeof Toggle>) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return <Toggle ref={ref} {...props} />;
}

function MatrixLabel({ children }: { children: React.ReactNode }) {
  return <span style={{ fontSize: 11, color: "#6b7280", marginTop: 6 }}>{children}</span>;
}

/**
 * The confirmed 5-state matrix (docs/audit/toggle.md §2, §14): `switch_OFF`, `switch_ON`,
 * `switch_ON_focused`, `switch_OFF_disabled`, `switch_ON_disabled`. There is no hover state and
 * no `switch_OFF_focused` — both confirmed absent, not omitted by oversight.
 */
export const StateMatrix: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {sizes.map((size) => (
        <div key={size} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>size={size}</span>
          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Toggle size={size} aria-label={`${size} switch_OFF`} />
              <MatrixLabel>switch_OFF</MatrixLabel>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Toggle size={size} checked readOnly aria-label={`${size} switch_ON`} />
              <MatrixLabel>switch_ON</MatrixLabel>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <SimulatedFocus size={size} checked readOnly aria-label={`${size} switch_ON_focused`} />
              <MatrixLabel>switch_ON_focused</MatrixLabel>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Toggle size={size} disabled aria-label={`${size} switch_OFF_disabled`} />
              <MatrixLabel>switch_OFF_disabled</MatrixLabel>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Toggle size={size} disabled checked readOnly aria-label={`${size} switch_ON_disabled`} />
              <MatrixLabel>switch_ON_disabled</MatrixLabel>
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
};

/** The three confirmed sizes (docs/audit/toggle.md §4) — lg and md share the same confirmed
 * 40×24 outer box, but the track/knob drawn inside are confirmed different sizes (§14). */
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
export const SelectedVsUnselected: Story = {
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

/** switch_ON_disabled / switch_OFF_disabled — confirmed to share the same muted gray/100 track
 * and translucent-black knob (docs/audit/toggle.md §14); only the checkmark differs. */
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
export const FocusComparison: Story = {
  args: { defaultChecked: true, autoFocus: true },
};
