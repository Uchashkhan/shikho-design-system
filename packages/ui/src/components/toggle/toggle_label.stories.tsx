import type { Meta, StoryObj } from "@storybook/react";
import { ToggleLabel, type ToggleLabelDirection, type ToggleLabelSize } from "./toggle_label";

const sizes: ToggleLabelSize[] = ["sm", "md"];
const directions: ToggleLabelDirection[] = ["left", "right"];

const meta: Meta<typeof ToggleLabel> = {
  title: "Toggle/toggle_label",
  component: ToggleLabel,
  args: { size: "md", direction: "left", labelContent: "Label", captionContent: "Caption" },
  argTypes: {
    size: { control: "select", options: sizes },
    direction: { control: "select", options: directions },
  },
};

export default meta;

type Story = StoryObj<typeof ToggleLabel>;

/**
 * `toggle_label` (docs/audit/toggle.md §14, ground-truth re-audited across all 4 size ×
 * direction variants) — previously entirely unimplemented. Composes a real nested Toggle plus a
 * label/caption text column. Unlike Checkbox/Radio, Toggle's own label is confirmed Medium/500
 * weight at BOTH sizes (only the font size/line-height changes between sm and md).
 */
export const Playground: Story = {};

/** Toggle with a label only (no caption). */
export const ToggleWithLabel: Story = {
  args: { caption: false, labelContent: "Enable notifications" },
};

/** Toggle with both a label and a caption. */
export const ToggleWithLabelAndCaption: Story = {
  args: { labelContent: "Enable notifications", captionContent: "Push and email" },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {sizes.map((size) => (
        <div key={size} style={{ display: "flex", gap: 24 }}>
          {directions.map((direction) => (
            <ToggleLabel
              key={`${size}-${direction}`}
              size={size}
              direction={direction}
              labelContent={`${size}/${direction}`}
              captionContent="Caption"
            />
          ))}
        </div>
      ))}
    </div>
  ),
};

/** Confirmed direction property — left puts the toggle first, right puts the label first. */
export const DirectionComparison: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      <ToggleLabel direction="left" labelContent="Left direction" captionContent="Toggle first" />
      <ToggleLabel direction="right" labelContent="Right direction" captionContent="Label first" />
    </div>
  ),
};

/** The caption is a confirmed, optional second line beneath the label. */
export const NoCaption: Story = {
  args: { caption: false },
};
