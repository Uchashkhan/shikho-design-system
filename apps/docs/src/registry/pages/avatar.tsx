import { Avatar, type AvatarSize, type AvatarType } from "@shikho/ui";
import type { ComponentPageConfig } from "./types";

const SIZES: AvatarSize[] = ["xl", "lg", "md", "sm", "xs"];
const TYPES: AvatarType[] = ["image", "icon", "text"];
const PHOTO = "https://i.pravatar.cc/128?img=12";

const badgeGlyph = (
  <span style={{ width: 12, height: 12, borderRadius: 1000, background: "#5468ff", display: "block" }} />
);

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
    "The status badge's 10px/3px dimensions are applied uniformly across all five sizes — only confirmed at size=md; scaling for the other four was never inspected.",
    "The verification badge's container has no confirmed radius or fill — only its child checkmark vector was audited. No @shikho/icons glyphs exist yet, so the checkmark itself is an empty slot unless a consumer supplies one.",
    "avatar_face (12 face variants) and avatar_group (multi-avatar composition, no count property to solve its width math) are both out of scope and not implemented.",
    "No hover/active/disabled variant exists anywhere in Avatars — this is confirmed to be a purely static display component, not an interactive control.",
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
    { name: "children", type: "ReactNode", description: "type=\"icon\" / type=\"text\" content — an icon glyph or initials text. Structurally unconfirmed." },
    { name: "status", type: "boolean", defaultValue: "false", description: "Confirmed 10px circular badge, bottom-right, surface/success_med_em fill." },
    { name: "verification / verificationContent", type: "boolean / ReactNode", defaultValue: "false", description: "Confirmed 12×12 container, top-right. No glyph asset exists yet." },
    { name: "ring / ringColor", type: "boolean / string", defaultValue: "false", description: "Requested addition, not part of the original Figma audit — a solid ring around the whole avatar (e.g. \"currently active\"). Stroke width (3px at xl) reused from a one-off reference example (node 66200:18587); no confirmed reusable ring color exists, so ringColor has no default and is required when ring is true." },
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
          { label: "icon", value: "icon" },
        ],
      },
      {
        prop: "ring",
        label: "Ring",
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
      const verification = v.badge === "icon";
      const ring = v.ring === "on";
      if (type === "image") {
        return (
          <Avatar
            size={v.size as AvatarSize}
            type="image"
            src={PHOTO}
            alt="Profile"
            status={status}
            verification={verification}
            verificationContent={badgeGlyph}
            ring={ring}
            ringColor="#8f45f5"
          />
        );
      }
      if (type === "text") {
        return (
          <Avatar size={v.size as AvatarSize} type="text" status={status} verification={verification} verificationContent={badgeGlyph} ring={ring} ringColor="#8f45f5">
            AB
          </Avatar>
        );
      }
      return (
        <Avatar size={v.size as AvatarSize} type="icon" status={status} verification={verification} verificationContent={badgeGlyph} ring={ring} ringColor="#8f45f5">
          <span aria-hidden>👤</span>
        </Avatar>
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
          <Avatar type="icon">
            <span aria-hidden>👤</span>
          </Avatar>
          <Avatar type="text">AB</Avatar>
        </>
      ),
    },
    {
      title: "Status and verification badges",
      description: "Status is bottom-right (surface/success_med_em); verification is top-right — both confirmed positions, no default asset exists for the checkmark glyph.",
      render: () => (
        <>
          <Avatar type="image" src={PHOTO} status />
          <Avatar type="image" src={PHOTO} verification verificationContent={badgeGlyph} />
          <Avatar type="image" src={PHOTO} status verification verificationContent={badgeGlyph} />
        </>
      ),
    },
    {
      title: "Ring — requested addition, all five sizes",
      description: "Not part of the original Figma audit — reuses the confirmed 3px stroke width from a reference example (node 66200:18587) scaled per size, same ratio used for status's own border. ringColor has no default; #8f45f5 shown here is that reference's own color, not a confirmed universal value.",
      layout: "stack",
      render: () => (
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {(["xs", "sm", "md", "lg", "xl"] as AvatarSize[]).map((size) => (
            <Avatar key={size} size={size} type="image" src={PHOTO} ring ringColor="#8f45f5" />
          ))}
        </div>
      ),
    },
  ],
};
