import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Radio, type RadioSize } from "./radio";

const sizes: RadioSize[] = ["md", "sm"];

const meta: Meta<typeof Radio> = {
  title: "Radio/radio",
  component: Radio,
  args: { size: "sm", "aria-label": "Radio" },
  argTypes: {
    size: { control: "select", options: sizes },
  },
};

export default meta;

type Story = StoryObj<typeof Radio>;

export const Playground: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return <Radio {...args} checked={checked} onChange={(e) => setChecked(e.target.checked)} />;
  },
};

/** The two confirmed sizes (docs/audit/radio-buttons.md §4) — identical dimensions to Checkbox's md/sm. */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      {sizes.map((size) => (
        <Radio key={size} size={size} aria-label={size} />
      ))}
    </div>
  ),
};

/** The checked/unchecked axis (Figma's `active`/`inactive`) as a real mutually-exclusive group. */
export const CheckedVsUnchecked: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Radio name="checked-demo" defaultChecked aria-label="Selected option" />
        Selected (checked)
      </label>
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Radio name="checked-demo" aria-label="Unselected option" />
        Unselected (unchecked)
      </label>
    </div>
  ),
};

/** No `checked_disabled`-equivalent variant is confirmed for radio either (§2) — this still
 * allows the combination via independent props, same documented choice as Checkbox. */
export const DisabledComparison: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Radio disabled defaultChecked={false} aria-label="Disabled unchecked" />
        Disabled + unchecked
      </label>
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Radio disabled defaultChecked aria-label="Disabled checked" />
        Disabled + checked
      </label>
    </div>
  ),
};

/**
 * Keyboard-focus ring — same geometry/color decision as Checkbox (`outline/Gray 300`, §8), since
 * the audit could not confirm whether `outline/focus_primary` applies to `active_focused`
 * instead (§8, §13). Tab to this radio to see it.
 */
export const FocusRing: Story = {
  args: { autoFocus: true },
};
