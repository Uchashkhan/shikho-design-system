import type { Meta, StoryObj } from "@storybook/react";
import { Field, type FieldSize, type FieldType } from "./field";

const sizes: FieldSize[] = ["xl", "lg", "md", "sm"];
const types: FieldType[] = ["default", "textarea", "advanced_with_buttons"];

const meta: Meta<typeof Field> = {
  title: "Input/field",
  component: Field,
  args: {
    size: "md",
    type: "default",
    textContent: "Input text",
    supportTextContent: "(12)",
    trailTextContent: "Text",
  },
  argTypes: {
    size: { control: "select", options: sizes },
    type: { control: "select", options: types },
  },
};

export default meta;

type Story = StoryObj<typeof Field>;

/** The one exactly confirmed instance: size=md, type=default (docs/audit/input.md §9). */
export const ConfirmedBinding: Story = {};

export const Playground: Story = {};

/** size/type values beyond md/default have no confirmed layout data and currently render identically. */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {sizes.map((size) =>
        types.map((type) => (
          <Field
            key={`${size}-${type}`}
            size={size}
            type={type}
            textContent={`${size}/${type}`}
            supportTextContent="(12)"
            trailTextContent="Text"
          />
        )),
      )}
    </div>
  ),
};

export const BooleanSlots: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Field textContent="All slots on" supportTextContent="(12)" trailTextContent="Text" />
      <Field textContent="No left icon" leftLead={false} supportText={false} trailText={false} />
      <Field textContent="No right icon" rightIcon={false} trailText={false} />
      <Field text={false} supportText={false} trailText={false} rightIcon={false} />
    </div>
  ),
};
