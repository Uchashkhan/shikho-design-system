import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, type AvatarSize, type AvatarType } from "./avatar";

const sizes: AvatarSize[] = ["xl", "lg", "md", "sm", "xs"];
const types: AvatarType[] = ["image", "icon", "text"];

const PHOTO = "https://i.pravatar.cc/128?img=12";

const meta: Meta<typeof Avatar> = {
  title: "Avatar/avatar",
  component: Avatar,
  args: { size: "md", type: "image", src: PHOTO, alt: "Profile photo" },
  argTypes: {
    size: { control: "select", options: sizes },
    type: { control: "select", options: types },
  },
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Playground: Story = {};

/** All 5 confirmed sizes (docs/audit/avatars.md §4), rendered as the deep-audited type=image. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
      {sizes.map((size) => (
        <Avatar key={size} size={size} type="image" src={PHOTO} alt={size} />
      ))}
    </div>
  ),
};

/**
 * The 3 confirmed types. Only `image` was deep-audited (§8) — `icon`/`text` render on a
 * derived neutral fill, not an independently confirmed binding.
 */
export const Types: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      <Avatar type="image" src={PHOTO} alt="Image" />
      <Avatar type="icon">
        <span aria-hidden>👤</span>
      </Avatar>
      <Avatar type="text">AB</Avatar>
    </div>
  ),
};

/** The confirmed status indicator (§8) — 10px, surface/success_med_em, defaults to false. */
export const WithStatus: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      <Avatar type="image" src={PHOTO} status />
      <Avatar type="text" status>
        AB
      </Avatar>
    </div>
  ),
};

/** The confirmed verification badge (§8) — 12×12, no glyph asset exists yet so the checkmark is a supplied slot. */
export const WithVerification: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      <Avatar
        type="image"
        src={PHOTO}
        verification
        verificationContent={
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: 1000,
              background: "#5468ff",
              display: "block",
            }}
          />
        }
      />
    </div>
  ),
};

/** Both badges together — status bottom-right, verification top-right, per the confirmed layer positions (§8). */
export const StatusAndVerification: Story = {
  render: () => (
    <Avatar
      type="image"
      src={PHOTO}
      status
      verification
      verificationContent={
        <span
          style={{ width: 12, height: 12, borderRadius: 1000, background: "#5468ff", display: "block" }}
        />
      }
    />
  ),
};
