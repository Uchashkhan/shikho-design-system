import type { Meta, StoryObj } from "@storybook/react";
import { Link, type LinkSize, type LinkState, type LinkType } from "./link";

const sizes: LinkSize[] = ["xl", "lg", "md", "sm", "xs"];
const types: LinkType[] = ["primary", "quaternary"];
const states: LinkState[] = ["default", "hover", "disabled"];

const dot = (
  <span style={{ display: "block", width: "100%", height: "100%", borderRadius: 999, background: "currentColor" }} />
);

const meta: Meta<typeof Link> = {
  title: "Link/link",
  component: Link,
  args: { size: "md", type: "primary", state: "default", href: "#", children: "Link" },
  argTypes: {
    size: { control: "select", options: sizes },
    type: { control: "select", options: types },
    state: { control: "select", options: states },
  },
};

export default meta;

type Story = StoryObj<typeof Link>;

export const Playground: Story = {};

/** All 5 confirmed sizes (docs/audit/links-deep-audit.md §3). lg/md share identical typography. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      {sizes.map((size) => (
        <Link key={size} size={size} href="#">
          {size}
        </Link>
      ))}
    </div>
  ),
};

/** The 2 confirmed types — primary (SemiBold, brand color) and quaternary (Medium, neutral gray). */
export const Types: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      {types.map((type) => (
        <Link key={type} type={type} href="#">
          {type}
        </Link>
      ))}
    </div>
  ),
};

/** default, hover, disabled — confirmed absent: a focus state (§5), unlike every other interactive component in this library. */
export const States: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {types.map((type) => (
        <div key={type} style={{ display: "flex", gap: 24 }}>
          {states.map((state) => (
            <Link key={state} type={type} state={state} href="#">
              {state}
            </Link>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      <Link href="#" selectLeftIcon={dot}>
        Left icon
      </Link>
      <Link href="#" selectRightIcon={dot}>
        Right icon
      </Link>
      <Link href="#" selectLeftIcon={dot} selectRightIcon={dot}>
        Both
      </Link>
    </div>
  ),
};
