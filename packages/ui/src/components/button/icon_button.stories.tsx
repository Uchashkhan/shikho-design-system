import type { Meta, StoryObj } from "@storybook/react";
import { IconButton, type IconButtonSize, type IconButtonState, type IconButtonType } from "./icon_button";

const sizes: IconButtonSize[] = ["xs", "sm", "md", "lg", "xl"];
const types: IconButtonType[] = [
  "neutral",
  "primary",
  "primary_light",
  "quaternary",
  "secondary",
  "tertiary",
  "tertiary_light",
];
const states: IconButtonState[] = ["default", "hover", "focus", "disabled"];

// @shikho/icons has no glyphs yet (see packages/icons/README.md) — a plain dot stands in for a
// real icon so every variant is still visually distinguishable in Storybook.
const placeholderGlyph = (
  <span style={{ display: "block", width: 8, height: 8, borderRadius: 9999, background: "currentColor" }} />
);

const meta: Meta<typeof IconButton> = {
  title: "Button/icon_button",
  component: IconButton,
  args: { size: "xs", type: "primary", state: "default", "aria-label": "Action", icon: placeholderGlyph },
  argTypes: {
    size: { control: "select", options: sizes },
    type: { control: "select", options: types },
    state: { control: "select", options: states },
  },
};

export default meta;

type Story = StoryObj<typeof IconButton>;

export const Playground: Story = {};

/**
 * Confirmed 7-type mapping (docs/audit/buttons.md §14.2) — `secondary` is a neutral gray/100
 * fill, NOT the pink `color.secondary` brand ramp the pre-rebuild implementation guessed from
 * the type name (§14.1 point 3). `neutral` is pure black, distinct from `Greyscale`'s
 * 88%-alpha `black[900]`.
 */
export const TypeComparison: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      {types.map((type) => (
        <IconButton key={type} type={type} aria-label={type} icon={placeholderGlyph} />
      ))}
    </div>
  ),
};

/** Confirmed fixed-square dimensions — the icon_button's own footprint, distinct from its nested icon size (§14.1 point 10). */
export const SizeComparison: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      {sizes.map((size) => (
        <IconButton key={size} size={size} aria-label={size} icon={placeholderGlyph} />
      ))}
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {types.map((type) => (
        <div key={type} style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ width: 96, fontSize: 12 }}>{type}</span>
          {sizes.map((size) =>
            states.map((state) => (
              <IconButton
                key={`${size}-${state}`}
                size={size}
                type={type}
                state={state}
                aria-label={`${type} ${size} ${state}`}
                icon={placeholderGlyph}
              />
            )),
          )}
        </div>
      ))}
    </div>
  ),
};
