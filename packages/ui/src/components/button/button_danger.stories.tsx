import type { Meta, StoryObj } from "@storybook/react";
import {
  ButtonDanger,
  type ButtonDangerSize,
  type ButtonDangerState,
  type ButtonDangerType,
} from "./button_danger";

const sizes: ButtonDangerSize[] = ["xs", "sm", "md", "lg", "xl"];
const types: ButtonDangerType[] = ["Secondary", "Text", "primary", "tertiary"];
const states: ButtonDangerState[] = ["default", "hover", "focus", "disabled"];

const meta: Meta<typeof ButtonDanger> = {
  title: "Button/button_danger",
  component: ButtonDanger,
  args: { size: "md", type: "Secondary", state: "default", children: "Learn more" },
  argTypes: {
    size: { control: "select", options: sizes },
    type: { control: "select", options: types },
    state: { control: "select", options: states },
  },
};

export default meta;

type Story = StoryObj<typeof ButtonDanger>;

/**
 * The exactly confirmed instance — `button_danger/md/secondary/default`, discovered via the
 * Alert audit's literal nested-instance path (docs/audit/alerts.md §11): fill `Color/gray/100`,
 * label color `text/danger-600`. This replaced an earlier, less-confirmed derived placeholder.
 */
export const ConfirmedBinding: Story = {};

export const Playground: Story = {
  args: { size: "xs", type: "primary" },
};

/** Demonstrates the corrected focus.danger ring — see docs/token-normalization-decisions.md §10. */
export const FocusRingFix: Story = {
  args: { state: "focus" },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {types.map((type) => (
        <div key={type} style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ width: 72, fontSize: 12 }}>{type}</span>
          {sizes.map((size) =>
            states.map((state) => (
              <ButtonDanger key={`${size}-${state}`} size={size} type={type} state={state}>
                {size}/{state}
              </ButtonDanger>
            )),
          )}
        </div>
      ))}
    </div>
  ),
};
