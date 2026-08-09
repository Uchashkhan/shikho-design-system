import type { Meta, StoryObj } from "@storybook/react";
import { List, type ListSize, type ListState } from "./list";

const sizes: ListSize[] = ["md", "lg", "xl"];
const states: ListState[] = ["default", "hover", "active_primary_accent"];

const meta: Meta<typeof List> = {
  title: "List/list",
  component: List,
  args: {
    size: "lg",
    state: "default",
    textContent: "List item",
    description1Content: "Description",
    trailTextContent: "Trail text",
    description2Content: "Description",
    tagContent: "Tag",
    checkboxProps: { "aria-label": "Select row" },
  },
  argTypes: {
    size: { control: "select", options: sizes },
    state: { control: "select", options: states },
  },
};

export default meta;

type Story = StoryObj<typeof List>;

export const Playground: Story = {};

/** state=active_primary_accent: gray-200 row fill, gray-950 text, and a `tertiary` nested Tag. */
export const ConfirmedBinding: Story = {
  args: { size: "lg", state: "active_primary_accent" },
};

/** All three states are now confirmed visually distinct (v0.1.0 repair pass): `default` has no
 * row fill at all, `hover` fills gray-100, `active_primary_accent` fills gray-200 — and the
 * nested Tag switches from `secondary` to `tertiary`. Per-size (lg/xl) internal deltas remain
 * unsampled and still render md's confirmed metrics — see docs/release-visual-verification.md. */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", width: 432 }}>
      {sizes.map((size) =>
        states.map((state) => (
          <List
            key={`${size}-${state}`}
            size={size}
            state={state}
            textContent={`${size} / ${state}`}
            description1Content="Description"
            trailTextContent="Trail text"
            description2Content="Description"
            tagContent="Tag"
            checkboxProps={{ "aria-label": `${size} ${state} row` }}
          />
        )),
      )}
    </div>
  ),
};

/** leadIcon composes the real Checkbox from @shikho/ui — not a re-implementation (requirement 3/8). */
export const CheckboxEnabledComparison: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", width: 432 }}>
      <List
        leadIcon
        textContent="Checkbox enabled (leadIcon=true, default)"
        checkboxProps={{ "aria-label": "Row with checkbox" }}
      />
      <List leadIcon={false} textContent="Checkbox disabled (leadIcon=false)" />
    </div>
  ),
};

export const LeadIconOnOffComparison: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", width: 432 }}>
      <List leadIcon textContent="leadIcon=true" checkboxProps={{ "aria-label": "leadIcon true row" }} />
      <List leadIcon={false} textContent="leadIcon=false" />
    </div>
  ),
};

/** No confirmed disabled/selected/error/focus state exists on `list` itself (docs/audit/list.md
 * §2, §6) — this compares the composed Checkbox's own confirmed disabled/checked states instead,
 * since that's the only confirmed disabled-adjacent behavior reachable from List. */
export const CheckboxCheckedAndDisabledComparison: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", width: 432 }}>
      <List textContent="Unchecked" checkboxProps={{ "aria-label": "Unchecked row", defaultChecked: false }} />
      <List textContent="Checked" checkboxProps={{ "aria-label": "Checked row", defaultChecked: true }} />
      <List
        textContent="Disabled checkbox"
        checkboxProps={{ "aria-label": "Disabled row", disabled: true }}
      />
    </div>
  ),
};

/**
 * A composed example demonstrating actual List usage — multiple rows stacked to form a list,
 * using only the confirmed slots (checkbox, text, description, tag, trailing text). No
 * product-specific content is invented; labels describe the slot being demonstrated.
 */
export const ComposedListExample: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", width: 432, border: "1px solid #ebecf0" }}>
      <List
        textContent="Row with all slots"
        description1Content="Description text"
        trailTextContent="Trail text"
        description2Content="Description text"
        tagContent="Tag"
        checkboxProps={{ "aria-label": "Row with all slots" }}
      />
      <List
        leadItem={false}
        tag={false}
        textGroup2={false}
        textContent="Row with fewer slots"
        description1Content="Description text"
        checkboxProps={{ "aria-label": "Row with fewer slots" }}
      />
      <List
        leadIcon={false}
        leadItem={false}
        textContent="Row without a checkbox"
        description1Content="Description text"
        tagContent="Tag"
      />
    </div>
  ),
};
