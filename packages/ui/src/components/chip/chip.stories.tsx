import type { Meta, StoryObj } from "@storybook/react";
import { Chip, type ChipSize, type ChipState, type ChipType } from "./chip";

const sizes: ChipSize[] = ["lg", "md", "sm"];
const types: ChipType[] = ["unselected", "selected", "selected_neutral", "Green", "Red"];
const interactiveStates: ChipState[] = ["default", "hover", "focus", "drag", "disabled"];

const meta: Meta<typeof Chip> = {
  title: "Chip/chip",
  component: Chip,
  args: { size: "md", type: "selected", state: "default", textContent: "Chip" },
  argTypes: {
    size: { control: "select", options: sizes },
    type: { control: "select", options: types },
    state: { control: "select", options: interactiveStates },
  },
};

export default meta;

type Story = StoryObj<typeof Chip>;

/** The one exactly confirmed instance: size=md, type=selected, state=focus (docs/audit/chips.md §9). */
export const ConfirmedBinding: Story = {
  args: { state: "focus" },
};

export const Playground: Story = {};

/** Every confirmed size × type combination. Green/Red only have a confirmed `state=default`
 * variant (§3) — shown here at default only, per that confirmed coverage gap. */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {sizes.map((size) => (
        <div key={size} style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ width: 32, fontSize: 12 }}>{size}</span>
          {types.map((type) => (
            <Chip key={type} size={size} type={type} textContent={type} />
          ))}
        </div>
      ))}
    </div>
  ),
};

/**
 * `unselected`/`selected`/`selected_neutral` are the interactive selection trio (§4) — this
 * compares their confirmed/derived resting fills side by side.
 */
export const SelectedVsUnselectedComparison: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      <Chip type="unselected" textContent="Unselected" />
      <Chip type="selected" textContent="Selected" />
      <Chip type="selected_neutral" textContent="Selected (neutral)" />
    </div>
  ),
};

/**
 * All 5 confirmed `state` values (§2) for the interactive trio — `disabled`, `focus`, `hover`,
 * `drag`, `default`. `drag` is confirmed (docs/audit/chips.md §13) to replace the resting inset
 * with a 5-layer outer "lift" shadow identical to `elevation.e5`.
 */
export const AllConfirmedStates: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      {interactiveStates.map((state) => (
        <Chip key={state} state={state} textContent={state} />
      ))}
    </div>
  ),
};

/** Green/Red's confirmed coverage gap: only `state=default` exists for them (§3). */
export const GreenRedCoverageGap: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      <Chip type="Green" textContent="Green" />
      <Chip type="Red" textContent="Red" />
    </div>
  ),
};

/**
 * Disabled comparison across the interactive trio — `Green`/`Red` are excluded here since they
 * have no confirmed `disabled` variant (§3).
 */
export const DisabledComparison: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      <Chip type="unselected" state="disabled" textContent="Unselected" />
      <Chip type="selected" state="disabled" textContent="Selected" />
      <Chip type="selected_neutral" state="disabled" textContent="Selected (neutral)" />
    </div>
  ),
};

/** Hover comparison — confirmed (§13): `selected` darkens from `primary/200` to `primary/300`. */
export const HoverComparison: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      <Chip type="selected" state="default" textContent="Default" />
      <Chip type="selected" state="hover" textContent="Hover" />
    </div>
  ),
};
