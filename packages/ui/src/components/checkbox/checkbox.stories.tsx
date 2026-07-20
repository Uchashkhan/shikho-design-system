import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox, type CheckboxShape, type CheckboxSize } from "./checkbox";

const sizes: CheckboxSize[] = ["md", "sm"];
const shapes: CheckboxShape[] = ["square", "sphere"];

const meta: Meta<typeof Checkbox> = {
  title: "Checkbox/checkbox",
  component: Checkbox,
  args: { size: "sm", shape: "square", "aria-label": "Checkbox" },
  argTypes: {
    size: { control: "select", options: sizes },
    shape: { control: "select", options: shapes },
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Playground: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return <Checkbox {...args} checked={checked} onChange={(e) => setChecked(e.target.checked)} />;
  },
};

/**
 * Every confirmed size × shape combination (docs/audit/checkboxes.md §3: 32 raw Figma variants —
 * this collapses the audit's single conflated `state` enum into the checked/indeterminate/
 * disabled/interaction props this task asked for, per component §9).
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {shapes.map((shape) => (
        <div key={shape} style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span style={{ width: 64, fontSize: 12 }}>{shape}</span>
          {sizes.map((size) => (
            <Checkbox key={size} size={size} shape={shape} aria-label={`${shape} ${size}`} />
          ))}
        </div>
      ))}
    </div>
  ),
};

/** The `checked`/`unchecked` axis — the one confirmed resting visual (white fill, gray border, 6px radius). */
export const CheckedVsUnchecked: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Checkbox defaultChecked={false} aria-label="Unchecked" />
        Unchecked
      </label>
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Checkbox defaultChecked aria-label="Checked" />
        Checked
      </label>
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Checkbox indeterminate aria-label="Indeterminate" />
        Indeterminate
      </label>
    </div>
  ),
};

/** `disabled` combined with each checked value — no `checked_disabled` variant exists in the
 * audit (§2), so this demonstrates the implementation's documented choice to still allow the
 * combination via independent props, rather than blocking a valid native HTML state. */
export const DisabledComparison: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Checkbox disabled defaultChecked={false} aria-label="Disabled unchecked" />
        Disabled + unchecked
      </label>
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Checkbox disabled defaultChecked aria-label="Disabled checked" />
        Disabled + checked
      </label>
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Checkbox disabled indeterminate aria-label="Disabled indeterminate" />
        Disabled + indeterminate
      </label>
    </div>
  ),
};

/**
 * Keyboard-focus ring — confirmed geometry (0-blur, 3px-spread) and color (`outline/Gray 300`)
 * from `docs/audit/checkboxes.md` §8. Tab to this checkbox to see it; the audit could not confirm
 * whether `outline/focus_primary` applies instead for the checked state (§13), so this
 * implementation uses the gray ring uniformly — see the component README.
 */
export const FocusRing: Story = {
  args: { autoFocus: true },
};
