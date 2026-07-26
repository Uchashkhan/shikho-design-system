import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip, type TooltipDirection } from "./tooltip";

const directions: TooltipDirection[] = [
  "botom_left",
  "top_left",
  "botom_right",
  "top_right",
  "bottom_center",
  "top_center",
  "left_center",
  "right_center",
];

const SAMPLE_HEADING = "Heading";
const SAMPLE_DESCRIPTION = "Gas prices are currently high. It's advisable to delay the transaction for a while.";

const Anchor = ({ direction, label = "Hover target", full = false }: { direction: TooltipDirection; label?: string; full?: boolean }) => (
  <div
    style={{
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 120,
      height: 40,
      border: "1px dashed #c3c6cc",
      borderRadius: 6,
      fontSize: 12,
    }}
  >
    {label}
    <Tooltip
      direction={direction}
      heading={SAMPLE_HEADING}
      description={full ? SAMPLE_DESCRIPTION : undefined}
      secondaryAction={full ? { label: "Learn more" } : undefined}
      primaryAction={full ? { label: "Got it" } : undefined}
    />
  </div>
);

const meta: Meta<typeof Tooltip> = {
  title: "Tooltip/tooltip",
  component: Tooltip,
  args: {
    direction: "top_center",
    heading: SAMPLE_HEADING,
    description: SAMPLE_DESCRIPTION,
    secondaryAction: { label: "Learn more" },
    primaryAction: { label: "Got it" },
  },
  argTypes: {
    direction: { control: "select", options: directions },
  },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Playground: Story = {
  render: (args) => <Anchor direction={args.direction ?? "top_center"} full />,
};

/**
 * All 8 confirmed direction values (docs/audit/tooltips.md §2, §14). Note the confirmed spelling
 * typo — `botom_left`/`botom_right` — preserved verbatim alongside the correctly-spelled
 * `bottom_center`. Also note the tooltip's position relative to the anchor is derived from the
 * confirmed pointer direction (§14): `top_*` renders BELOW its anchor and `botom_*`/
 * `bottom_center` renders ABOVE it — the opposite of the naive "top means above" convention.
 */
export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 64,
        padding: 48,
      }}
    >
      {directions.map((direction) => (
        <div key={direction} style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
          <Anchor direction={direction} label={direction} />
        </div>
      ))}
    </div>
  ),
};

/**
 * The confirmed rich composition (docs/audit/tooltips.md §14) — a heading, a description, and
 * two CTA buttons (a gray secondary action and a primary/500-filled action), previously entirely
 * unimplemented.
 */
export const FullComposition: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 64, padding: 48 }}>
      <Anchor direction="bottom_center" label="Full tooltip" full />
    </div>
  ),
};

/** Heading only, no description or actions — the minimal confirmed content combination. */
export const HeadingOnly: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 48, padding: 24 }}>
      <Anchor direction="bottom_center" label="Heading only" />
    </div>
  ),
};

/** The confirmed spelling typo, shown deliberately rather than corrected. */
export const ConfirmedTypo: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 48, padding: 24 }}>
      <Anchor direction="botom_left" label="botom_left (typo)" />
      <Anchor direction="bottom_center" label="bottom_center (correct)" />
    </div>
  ),
};
