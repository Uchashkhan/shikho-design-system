import type { Meta, StoryObj } from "@storybook/react";
import { RadioLabel, type RadioLabelDirection, type RadioLabelSize } from "./radio_label";

const sizes: RadioLabelSize[] = ["sm", "md"];
const directions: RadioLabelDirection[] = ["left", "right"];

const meta: Meta<typeof RadioLabel> = {
  title: "Radio/radio_label",
  component: RadioLabel,
  args: { size: "md", direction: "left", labelContent: "Label", captionContent: "Caption" },
  argTypes: {
    size: { control: "select", options: sizes },
    direction: { control: "select", options: directions },
  },
};

export default meta;

type Story = StoryObj<typeof RadioLabel>;

/**
 * `radio_label` (docs/audit/radio-buttons.md §15, ground-truth re-audited across all 4 size ×
 * direction variants). Composes a real nested Radio plus a label/caption text column. Label
 * typography is confirmed size-dependent: `md` uses Regular/400 weight at body_1 (13/20); `sm`
 * collapses the label to the same Medium/500, caption_2 (12/16) typography as the caption itself.
 */
export const Playground: Story = {};

/** Radio with a label only (no caption) — the simplest confirmed layout. */
export const RadioWithLabel: Story = {
  args: { caption: false, labelContent: "Email me about updates" },
};

/** Radio with both a label and a caption — the confirmed two-line text column. */
export const RadioWithLabelAndCaption: Story = {
  args: { labelContent: "Email me about updates", captionContent: "Once a week, no spam" },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {sizes.map((size) => (
        <div key={size} style={{ display: "flex", gap: 24 }}>
          {directions.map((direction) => (
            <RadioLabel
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

/** Confirmed direction property — left puts the radio first, right puts the label first. */
export const DirectionComparison: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      <RadioLabel direction="left" labelContent="Left direction" captionContent="Radio first" />
      <RadioLabel direction="right" labelContent="Right direction" captionContent="Label first" />
    </div>
  ),
};

/** Confirmed: at sm, the label's typography collapses to the same weight/size as the caption — compare against md. */
export const SizeTypographyComparison: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      <RadioLabel size="md" labelContent="md label (Regular 400, 13/20)" captionContent="Caption (Medium 500, 12/16)" />
      <RadioLabel size="sm" labelContent="sm label (Medium 500, 12/16)" captionContent="Caption (Medium 500, 12/16)" />
    </div>
  ),
};

/** The caption is a confirmed, optional second line beneath the label. */
export const NoCaption: Story = {
  args: { caption: false },
};
