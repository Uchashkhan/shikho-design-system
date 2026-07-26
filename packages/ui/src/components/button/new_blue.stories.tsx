import type { Meta, StoryObj } from "@storybook/react";
import { NewBlueButton, type NewBlueSize, type NewBlueState, type NewBlueType } from "./new_blue";

const sizes: NewBlueSize[] = ["xs", "sm", "md", "lg", "xxl"];
const types: NewBlueType[] = ["Outline", "Primary", "Secondary", "Text"];
const states: NewBlueState[] = ["Default", "Hover", "Focus", "Disabled"];

const meta: Meta<typeof NewBlueButton> = {
  title: "Button/new_blue",
  component: NewBlueButton,
  args: { size: "xs", type: "Primary", state: "Default", children: "Continue" },
  argTypes: {
    size: { control: "select", options: sizes },
    type: { control: "select", options: types },
    state: { control: "select", options: states },
  },
};

export default meta;

type Story = StoryObj<typeof NewBlueButton>;

/** The exactly confirmed anchor binding: size=xs, type=Primary, state=Default (docs/audit/buttons.md §14.2). */
export const ConfirmedBinding: Story = {};

export const Playground: Story = {
  args: { size: "md", type: "Primary", state: "Default" },
};

/** Confirmed 5-step size ramp (docs/audit/buttons.md §14.2) — height/padding/gap/icon-size/radius/typography. */
export const SizeComparison: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      {sizes.map((size) => (
        <NewBlueButton key={size} size={size}>
          {size}
        </NewBlueButton>
      ))}
    </div>
  ),
};

/** Confirmed type construction: Primary=solid, Secondary=soft, Outline=bordered, Text=bare (§14.2). */
export const TypeComparison: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      {types.map((type) => (
        <NewBlueButton key={type} type={type}>
          {type}
        </NewBlueButton>
      ))}
    </div>
  ),
};

/**
 * Confirmed state deltas (§14.2): hover jumps Primary's fill ramp[500]->ramp[700] (not [600]);
 * focus replaces the border/shadow construction with a ring; disabled recolors, not dims.
 */
export const StateComparison: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      {states.map((state) => (
        <NewBlueButton key={state} state={state}>
          {state}
        </NewBlueButton>
      ))}
    </div>
  ),
};

/** Confirmed independent left/right icon slots (§14.2) — each hideable without affecting the other. */
export const IconSlotComparison: Story = {
  render: () => {
    const dot = <span style={{ display: "block", width: 8, height: 8, borderRadius: 9999, background: "currentColor" }} />;
    return (
      <div style={{ display: "flex", gap: 12 }}>
        <NewBlueButton selectLeftIcon={dot} selectRightIcon={dot}>
          Both icons
        </NewBlueButton>
        <NewBlueButton selectLeftIcon={dot} rightIcon={false}>
          Left only
        </NewBlueButton>
        <NewBlueButton leftIcon={false} selectRightIcon={dot}>
          Right only
        </NewBlueButton>
        <NewBlueButton leftIcon={false} rightIcon={false}>
          No icons
        </NewBlueButton>
      </div>
    );
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {types.map((type) => (
        <div key={type} style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ width: 72, fontSize: 12 }}>{type}</span>
          {sizes.map((size) =>
            states.map((state) => (
              <NewBlueButton key={`${size}-${state}`} size={size} type={type} state={state}>
                {size}/{state}
              </NewBlueButton>
            )),
          )}
        </div>
      ))}
    </div>
  ),
};
