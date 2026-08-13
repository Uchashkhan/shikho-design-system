import { Avatar, type AvatarSize, type AvatarType } from "@shikho/ui";
import type { ComponentPageConfig } from "./types";

const SIZES: AvatarSize[] = ["xl", "lg", "md", "sm", "xs"];
const TYPES: AvatarType[] = ["image", "icon", "text"];
const PHOTO = "https://i.pravatar.cc/128?img=12";
const BADGE_COLOR = "#8f45f5";

export const pageConfig: ComponentPageConfig = {
  longDescription:
    "Deep-audited at size=md, type=image — the first component confirmed to skip Figma auto-layout entirely (root relative, children absolute-positioned) and the first confirmed to carry no elevation or effect token at all, unlike every Button/Input component audited so far. The circular crop comes directly from a border-radius applied to the <img> itself, not a clip-path or mask layer. Two sibling component sets, avatar_face (12 face images) and avatar_group (a multi-avatar composition with no way to verify its per-size width math), are out of scope and not implemented here.",
  variants: [
    { name: "size", values: SIZES, note: "Confirmed square dimensions (64/48/40/32/24), all rendered as full circles." },
    {
      name: "type",
      values: TYPES,
      note: "Only image was deep-audited. icon and text render on a derived neutral fill — no deep audit exists for either.",
    },
  ],
  states: [],
  gaps: [
    "type=icon and type=text have no deep audit at all — only size=md, type=image was inspected with get_design_context. Both render on a derived neutral gray fill, the same \"least invented\" reasoning applied to Tags' secondary/tertiary types.",
    "type=text's font size per avatar size is a derived approximation: only three candidate tokens (Body/13/12/11 Semibold) exist for five avatar sizes, with no confirmed per-size binding.",
    "avatar_face (12 face variants) and avatar_group (multi-avatar composition, no count property to solve its width math) are both out of scope and not implemented.",
    "No hover/active/disabled variant exists anywhere in Avatars — this is confirmed to be a purely static display component, not an interactive control.",
    "Requested: status's border is opaque white (was the confirmed 72%-alpha white[800]) and its size/border-width were re-derived per size from a reference example (node 66200:18587), replacing the original flat 10px/3px.",
    "Requested: the confirmed verification badge (a top-right checkmark container) was removed entirely, replaced by badge — a solid ring around the WHOLE avatar. badge has no Figma basis at all: reuses a 3px stroke width sampled from that same one-off reference example, scaled per size. badgeColor has no default.",
    "Requested: type=\"icon\" now renders a default UserIcon glyph (@shikho/icons) when no children are supplied, replacing the previous bare/emoji placeholder. Not sourced from a Figma audit — a generic person icon added directly per request, overridable via children.",
  ],
  usageExample: `import { Avatar } from "@shikho/ui";

function ProfileBadge() {
  return (
    <Avatar
      size="md"
      type="image"
      src="/user/photo.jpg"
      alt="Jane Doe"
      status
    />
  );
}`,
  props: [
    { name: "size", type: "xl | lg | md | sm | xs", defaultValue: "md", description: "Confirmed square dimension, rendered as a full circle." },
    { name: "type", type: "icon | text | image", defaultValue: "image", description: "Only image has confirmed internal structure." },
    { name: "src / alt", type: "string", description: "type=\"image\" only — the confirmed plain <img> fill." },
    { name: "children", type: "ReactNode", description: "type=\"icon\" / type=\"text\" content — an icon glyph or initials text. type=\"icon\" renders a requested default UserIcon glyph (gray/500, not a Figma value) when omitted; pass children to override it. Structurally unconfirmed." },
    { name: "status", type: "boolean", defaultValue: "false", description: "Confirmed circular badge, bottom-right, surface/success_med_em fill. Border color/proportions requested and re-derived — see gaps." },
    { name: "badge / badgeColor", type: "boolean / string", defaultValue: "false", description: "Requested addition, not part of the original Figma audit — replaces the removed verification prop. A solid ring around the whole avatar (e.g. \"currently active\"). Stroke width (3px at xl) reused from a one-off reference example (node 66200:18587); no confirmed reusable badge color exists, so badgeColor has no default and is required when badge is true." },
  ],
  preview: () => <Avatar size="md" type="image" src={PHOTO} alt="Profile" status />,
  playground: {
    controls: [
      {
        prop: "size",
        label: "Size",
        defaultValue: "md",
        options: SIZES.map((v) => ({ label: v, value: v })),
      },
      {
        prop: "type",
        label: "Type",
        defaultValue: "image",
        options: TYPES.map((v) => ({ label: v, value: v })),
      },
      {
        prop: "status",
        label: "Status",
        defaultValue: "inactive",
        options: [
          { label: "inactive", value: "inactive" },
          { label: "active", value: "active" },
        ],
      },
      {
        prop: "badge",
        label: "Badge",
        defaultValue: "none",
        options: [
          { label: "none", value: "none" },
          { label: "on", value: "on" },
        ],
      },
    ],
    render: (v) => {
      const type = v.type as AvatarType;
      const status = v.status === "active";
      const badge = v.badge === "on";
      if (type === "image") {
        return (
          <Avatar
            size={v.size as AvatarSize}
            type="image"
            src={PHOTO}
            alt="Profile"
            status={status}
            badge={badge}
            badgeColor={BADGE_COLOR}
          />
        );
      }
      if (type === "text") {
        return (
          <Avatar size={v.size as AvatarSize} type="text" status={status} badge={badge} badgeColor={BADGE_COLOR}>
            AB
          </Avatar>
        );
      }
      return (
        <Avatar size={v.size as AvatarSize} type="icon" status={status} badge={badge} badgeColor={BADGE_COLOR} />
      );
    },
  },
  showcases: [
    {
      title: "All five confirmed sizes",
      render: () => (
        <>
          {SIZES.map((size) => (
            <Avatar key={size} size={size} type="image" src={PHOTO} alt={size} />
          ))}
        </>
      ),
    },
    {
      title: "The three types",
      description: "Only image is deep-audited; icon and text use a derived neutral fill.",
      render: () => (
        <>
          <Avatar type="image" src={PHOTO} alt="Image" />
          <Avatar type="icon" />
          <Avatar type="text">AB</Avatar>
        </>
      ),
    },
    {
      title: "Status",
      description: "Bottom-right, surface/success_med_em fill — confirmed position; size/border re-derived from a fresh reference example (node 66200:18587).",
      render: () => (
        <>
          <Avatar type="image" src={PHOTO} status />
          <Avatar type="text" status>
            AB
          </Avatar>
        </>
      ),
    },
    {
      title: "Badge — requested addition, all five sizes",
      description: "Not part of the original Figma audit — replaces the removed verification prop. Reuses the confirmed 3px stroke width from a reference example (node 66200:18587) scaled per size, same ratio used for status's own border. badgeColor has no default; #8f45f5 shown here is that reference's own color, not a confirmed universal value.",
      layout: "stack",
      render: () => (
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {(["xs", "sm", "md", "lg", "xl"] as AvatarSize[]).map((size) => (
            <Avatar key={size} size={size} type="image" src={PHOTO} badge badgeColor={BADGE_COLOR} />
          ))}
        </div>
      ),
    },
  ],
};
