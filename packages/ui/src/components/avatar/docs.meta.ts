import type { ComponentDocsMeta } from "../../docs-meta";

export const meta: ComponentDocsMeta = {
  name: "Avatar",
  slug: "avatar",
  category: "Data display",
  description: "Deep-audited circular photo/icon/initials display with confirmed status and verification badges. No auto-layout, no elevation — a confirmed architectural outlier. Ships with AvatarGroup, which composes Avatar at a confirmed per-size overlap.",
  status: "deep-audited",
  packageImport: `import { Avatar, AvatarGroup } from "@shikho/ui";`,
  storybookTitle: "Avatar/avatar",
  order: 40,
  exports: ["Avatar", "AvatarGroup"],
  figmaName: "avatar, avatar_group",
  auditFile: "docs/audit/avatars.md",
};
