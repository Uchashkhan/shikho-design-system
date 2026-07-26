import type { Meta, StoryObj } from "@storybook/react";
import { Tags, type TagSize, type TagState, type TagType } from "./tags";

const sizes: TagSize[] = ["lg", "md", "sm"];
const types: TagType[] = [
  "info",
  "warning",
  "danger",
  "Danger Filled",
  "success",
  "Success Filled",
  "tertiary",
  "secondary",
  "primary_outline",
  "primary_light",
  "primary",
];
const states: TagState[] = ["default", "hover", "disabled"];

const meta: Meta<typeof Tags> = {
  title: "Tags/tags",
  component: Tags,
  args: { size: "md", type: "info", state: "default", children: "Tag" },
  argTypes: {
    size: { control: "select", options: sizes },
    type: { control: "select", options: types },
    state: { control: "select", options: states },
  },
};

export default meta;

type Story = StoryObj<typeof Tags>;

export const Playground: Story = {};

/** All 11 confirmed types (docs/audit/tags.md §2) — no coverage gaps, unlike Chip's Green/Red. */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {types.map((type) => (
        <Tags key={type} type={type}>
          {type}
        </Tags>
      ))}
    </div>
  ),
};

/**
 * The confirmed severity trio: tinted (alpha-12) vs. the explicit "Filled" solid counterpart —
 * note the confirmed asymmetry that warning/info have no Filled pair (§3, §9).
 */
export const SeverityTintVsFilled: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Tags type="danger">danger (tint)</Tags>
        <Tags type="Danger Filled">Danger Filled (solid)</Tags>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Tags type="success">success (tint)</Tags>
        <Tags type="Success Filled">Success Filled (solid)</Tags>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Tags type="warning">warning (no Filled pair)</Tags>
        <Tags type="info">info (no Filled pair)</Tags>
      </div>
    </div>
  ),
};

/** The confirmed three-way primary emphasis split: outlined, tinted, and solid. */
export const PrimaryEmphasisTrio: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      <Tags type="primary_outline">primary_outline</Tags>
      <Tags type="primary_light">primary_light</Tags>
      <Tags type="primary">primary</Tags>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {sizes.map((size) => (
        <Tags key={size} size={size}>
          {size}
        </Tags>
      ))}
    </div>
  ),
};

/** default, hover, and disabled — no focus, no drag exists on this component (§2). */
export const States: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      {states.map((state) => (
        <Tags key={state} state={state}>
          {state}
        </Tags>
      ))}
    </div>
  ),
};

/** Confirmed left/right icon slots (docs/audit/tags.md §14) — previously entirely absent. */
export const IconSlotComparison: Story = {
  render: () => {
    const dot = <span style={{ display: "block", width: "100%", height: "100%", borderRadius: 9999, background: "currentColor" }} />;
    return (
      <div style={{ display: "flex", gap: 8 }}>
        <Tags selectLeftIcon={dot} selectRightIcon={dot}>
          Both icons
        </Tags>
        <Tags selectLeftIcon={dot} rightIcon={false}>
          Left only
        </Tags>
        <Tags leftIcon={false} selectRightIcon={dot}>
          Right only
        </Tags>
      </div>
    );
  },
};
