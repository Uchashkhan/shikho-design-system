import type { Meta, StoryObj } from "@storybook/react";
import { CheckboxLabel, type CheckboxLabelDirection, type CheckboxLabelSize } from "./checkbox_label";

const sizes: CheckboxLabelSize[] = ["sm", "md"];
const directions: CheckboxLabelDirection[] = ["left", "right"];

const meta: Meta<typeof CheckboxLabel> = {
  title: "Checkbox/checkbox_label",
  component: CheckboxLabel,
  args: { size: "md", direction: "left", labelContent: "Label", captionContent: "Caption" },
  argTypes: {
    size: { control: "select", options: sizes },
    direction: { control: "select", options: directions },
  },
};

export default meta;

type Story = StoryObj<typeof CheckboxLabel>;

/**
 * `checkbox_label` (docs/audit/checkboxes.md §14, deep-audited at size=md, direction=left) —
 * previously entirely unimplemented. Confirmed to compose a real nested Checkbox plus a label
 * (Regular 400 weight) and optional caption (Medium 500 weight) below it.
 */
export const Playground: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {sizes.map((size) => (
        <div key={size} style={{ display: "flex", gap: 24 }}>
          {directions.map((direction) => (
            <CheckboxLabel
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

/** Confirmed direction property — left puts the checkbox first, right puts the label first. */
export const DirectionComparison: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      <CheckboxLabel direction="left" labelContent="Left direction" captionContent="Checkbox first" />
      <CheckboxLabel direction="right" labelContent="Right direction" captionContent="Label first" />
    </div>
  ),
};

/** The caption is a confirmed, optional second line beneath the label. */
export const NoCaption: Story = {
  args: { caption: false },
};
