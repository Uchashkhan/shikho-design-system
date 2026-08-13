import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, type AvatarSize, type AvatarType } from "./avatar";
import { AvatarGroup } from "./avatar_group";

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
 * derived neutral fill, not an independently confirmed binding. `icon` now renders a requested
 * default `UserIcon` glyph (docs/audit/avatars.md §18) when no `children` are supplied.
 */
export const Types: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      <Avatar type="image" src={PHOTO} alt="Image" />
      <Avatar type="icon" />
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

/** `badge` (docs/audit/avatars.md §16/§17) — a requested addition, not part of the original
 * Figma audit: a solid ring around the whole avatar. Renamed from `ring`; replaces the removed
 * `verification` (top-right checkmark) feature entirely. */
export const WithBadge: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      <Avatar type="image" src={PHOTO} badge badgeColor="#8f45f5" />
    </div>
  ),
};

/** `status` and `badge` together — status bottom-right, badge wrapping the whole avatar. */
export const StatusAndBadge: Story = {
  render: () => <Avatar type="image" src={PHOTO} status badge badgeColor="#8f45f5" />,
};

/**
 * `avatar_group` — composes the real `Avatar` at the confirmed per-size overlap
 * (xs/sm 8px, md 12px, lg 16px, xl 20px), with a 1px white-88 ring on each avatar and an
 * optional trailing `+N` counter.
 */
export const Group: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <AvatarGroup key={size} size={size} overflowCount={2}>
          <Avatar size={size} type="image" src={PHOTO} alt="Photo" />
          <Avatar size={size} type="text">
            AT
          </Avatar>
          <Avatar size={size} type="image" src={PHOTO} alt="Photo" />
        </AvatarGroup>
      ))}
    </div>
  ),
};
