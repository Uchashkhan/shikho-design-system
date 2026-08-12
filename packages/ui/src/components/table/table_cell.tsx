import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { color, elevation, radius } from "@shikho/tokens";
import { Checkbox } from "../checkbox";
import { Tags } from "../tags";

// docs/audit/table-deep-audit.md §1-§2 — table_cell: type (header, header_compact, default,
// default_compact — density folded into type, not a separate property), state (default,
// loading). Confirmed to be a very rich composed cell: a nested Checkbox, up to 3 avatar-style
// image slots, icon groups, a text group, 2 tags, a dropdown, and an icon button.
export type TableCellType = "header" | "header_compact" | "default" | "default_compact";
export type TableCellState = "default" | "loading";

const isHeader = (type: TableCellType) => type === "header" || type === "header_compact";
const isCompact = (type: TableCellType) => type === "header_compact" || type === "default_compact";

// docs/audit/table-deep-audit.md §6 (this pass) — confirmed padding per type, verified against a
// fresh get_design_context on all 4 `default`-state variants: header_compact's padding is now
// independently confirmed (px-12, not derived-by-scaling as originally documented).
const PADDING: Record<TableCellType, string> = {
  header: "0.25rem 1rem 0.75rem", // pt-4 pb-12 px-16 — confirmed
  header_compact: "0.25rem 0.75rem 0.75rem", // pt-4 pb-12 px-12 — confirmed (§6)
  default: "0.5rem 1rem", // py-8 px-16 — confirmed
  default_compact: "0.25rem 0.75rem", // py-4 px-12 — confirmed
};

// docs/audit/table-deep-audit.md §6 — confirmed root gap per type. `default_compact`'s gap
// (8px) is genuinely narrower than `default`'s (12px) — a real, previously-unconfirmed value,
// not the same 12px reused across both densities.
const ROOT_GAP: Record<TableCellType, string> = {
  header: "0.375rem", // 6px
  header_compact: "0.375rem", // 6px — same as header, confirmed (§6)
  default: "0.75rem", // 12px
  default_compact: "0.5rem", // 8px — confirmed distinct from default's 12px (§6)
};

// docs/audit/table-deep-audit.md §6 — confirmed avatar-slot pixel sizes. The `header`/
// `header_compact` family only ever has ONE avatar slot (`leadItemSm`), fixed at 24px for BOTH
// types — it does NOT scale down between header and header_compact the way `default`'s 3-slot
// xs/sm/md table scales into `default_compact`'s. Reusing the `default` density table for header
// types (as the prior implementation did) produced a wrong 32px avatar for `avatar.size="sm"`.
const AVATAR_SIZE = {
  default: { xs: 24, sm: 32, md: 40 },
  compact: { xs: 20, sm: 24, md: 32 },
} as const;
const HEADER_AVATAR_SIZE = 24; // confirmed fixed for both `header` and `header_compact` (§6)

// docs/audit/table-deep-audit.md §6 — confirmed single left/right icon size for the header
// family: 18px at `header`, 16px at `header_compact` (the header family has no icon-group
// concept at all — only ever one left_icon + one right_icon1). The prior implementation applied
// `default`'s icon-GROUP size (20/18) to header icons, and used 18px for header_compact's icons
// too (should be 16px) — both wrong.
const HEADER_ICON_SIZE: Record<"header" | "header_compact", number> = { header: 18, header_compact: 16 };
const ICON_SIZE = { default: 24, group: 20, compact: 20, compactGroup: 18 } as const;

// docs/audit/table-deep-audit.md §6 — confirmed heading_top row typography per type: `header`
// and `default`/`default_compact` all use body_1 (13/20), but `header_compact` uses caption_2
// (12/16) — the ONE type where cell text genuinely shrinks, not just padding/icons/avatars.
const HEADING_TYPOGRAPHY: Record<TableCellType, { fontSize: number; lineHeight: string }> = {
  header: { fontSize: 13, lineHeight: "20px" },
  header_compact: { fontSize: 12, lineHeight: "16px" },
  default: { fontSize: 13, lineHeight: "20px" },
  default_compact: { fontSize: 13, lineHeight: "20px" },
};

const iconShadowFilter = `drop-shadow(0px 1px 0.5px ${elevation.e2[0].color}) drop-shadow(0px 3px 1.5px ${elevation.e2[0].color})`;
// docs/audit/table-deep-audit.md §6 — the confirmed "special_drop" 2-layer inset, matching the
// exact string used system-wide (Chip, Tags, DatePicker, Modal, Pagination, SidebarItem,
// TopNavItem) for the SAME token. Confirmed applied to the `dropdown` field's own background —
// NOT to `icon_button`, which the prior implementation had backwards (icon_button has no inset
// shadow at all in the confirmed source; dropdown's field previously only had a single,
// differently-colored shadow layer instead of this real 2-layer effect).
const restingInsetShadow = `inset 0px 1px 3px -2px ${color.white[50]}, inset 0px -1px 3px -2px rgba(0,0,0,0.07)`;

function AvatarSlot({ size, src, alt }: { size: number; src?: string; alt?: string }) {
  return (
    <span
      style={{
        display: "block",
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: radius.full,
        overflow: "hidden",
        background: color.gray[200],
      }}
    >
      {src && (
        <img
          src={src}
          alt={alt ?? ""}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      )}
    </span>
  );
}

function IconSlot({ size, children }: { size: number; children?: ReactNode }) {
  return (
    <span style={{ width: size, height: size, flexShrink: 0, filter: iconShadowFilter }}>{children}</span>
  );
}

// docs/audit/table-deep-audit.md — P18 repair. A fresh get_design_context re-pull on all 4
// loading-state variants (node 66084:36288 and siblings) found the previous implementation
// invented a single "2 circles + bar" skeleton and applied it to every type unchanged — but
// Figma confirms the loading composition genuinely differs by type: header/header_compact have
// NO circles at all (just a single thin bar), and default_compact's circles/bar are their own
// confirmed smaller sizes, not default's reused. Padding/gap were also confirmed distinct from
// each type's normal-state values, not the same table reused.
interface LoadingConfig {
  padding: string;
  gap: string;
  circleSizes: readonly number[];
  barHeight: number;
}

const LOADING_CONFIG: Record<TableCellType, LoadingConfig> = {
  header: { padding: "0.5rem 1rem 1.25rem", gap: "0.375rem", circleSizes: [], barHeight: 12 },
  header_compact: { padding: "0.75rem 0.75rem 1.25rem", gap: "0.375rem", circleSizes: [], barHeight: 8 },
  default: { padding: "0.75rem 1rem", gap: "1rem", circleSizes: [32, 24], barHeight: 16 },
  default_compact: { padding: "0.75rem", gap: "0.5rem", circleSizes: [24, 20], barHeight: 12 },
};

function SkeletonCircle({ size }: { size: number }) {
  return (
    <span
      aria-hidden
      style={{ width: size, height: size, flexShrink: 0, borderRadius: radius.full, background: color.gray[200] }}
    />
  );
}

export interface TableCellAvatar {
  size: "xs" | "sm" | "md";
  src?: string;
  alt?: string;
}

export interface TableCellProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  type?: TableCellType;
  state?: TableCellState;
  /** Confirmed nested real `Checkbox` dependency (§1) — identical to `List`'s. */
  checkbox?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Confirmed avatar-style image slot (§1-§3). Only one is shown by default — the audited
   * instance's "all 3 sizes at once" is treated as a spec-sheet illustration, not a real default
   * (§5). `header`/`header_compact` types always render this at a fixed confirmed 24px,
   * regardless of `avatar.size` — the header family's single avatar slot is confirmed NOT to
   * scale between header and header_compact the way `default`'s 3-slot table does (§6). */
  avatar?: TableCellAvatar;
  leftIcon?: ReactNode;
  /** Confirmed `default`/`default_compact`-only slot (§6) — the header family has no icon-group
   * concept, only a single `leftIcon`/`rightIcon`; ignored for `header` types. */
  secondaryLeftIcon?: ReactNode;
  rightIcon?: ReactNode;
  secondaryRightIcon?: ReactNode;
  heading?: ReactNode;
  supportText?: ReactNode;
  /** Confirmed absent on `header`/`header_compact` types (§2) — ignored for those types. */
  description?: ReactNode;
  /** Confirmed 2 tag slots, reusing the real `Tags` component (gray/100 and primary_alpha_12 fills). */
  tag1?: ReactNode;
  tag2?: ReactNode;
  /** Confirmed `default`/`default_compact`-only slot (§2) — ignored for `header` types. The
   * confirmed source also shows a 16px icon (a chevron) alongside the text inside this same
   * field; compose it directly into `dropdownContent` (e.g. `<>Admin <ChevronIcon /></>`) rather
   * than a separate prop, since the specific glyph isn't confirmed/decomposable and the field is
   * already a free-form `ReactNode`. */
  dropdownContent?: ReactNode;
  onDropdownClick?: () => void;
  actionIcon?: ReactNode;
  onActionClick?: () => void;
  actionLabel?: string;
}

/**
 * `table_cell` (docs/audit/table-deep-audit.md, deep-audited across `header`, `default`,
 * `default_compact`, and `state=loading`). Confirmed far richer than the original overview
 * suggested — composes a real nested `Checkbox`, up to 3 avatar-style image slots, and 2 `Tags`
 * instances. `state="loading"` renders a confirmed skeleton row (2 circles + a full-width bar),
 * not the real content dimmed. See the deep audit for why every optional slot defaults to hidden
 * here rather than reproducing the audited instance's "everything on at once" override.
 */
export const TableCell = forwardRef<HTMLDivElement, TableCellProps>(
  (
    {
      type = "default",
      state = "default",
      checkbox = false,
      checked,
      onCheckedChange,
      avatar,
      leftIcon,
      secondaryLeftIcon,
      rightIcon,
      secondaryRightIcon,
      heading,
      supportText,
      description,
      tag1,
      tag2,
      dropdownContent,
      onDropdownClick,
      actionIcon,
      onActionClick,
      actionLabel = "Row action",
      style,
      ...props
    },
    ref,
  ) => {
    const header = isHeader(type);
    const compact = isCompact(type);
    const density = compact ? "compact" : "default";
    const iconSize = compact ? ICON_SIZE.compact : ICON_SIZE.default;
    const groupIconSize = compact ? ICON_SIZE.compactGroup : ICON_SIZE.group;
    const headerIconSize = HEADER_ICON_SIZE[type === "header_compact" ? "header_compact" : "header"];
    const avatarPx = header ? HEADER_AVATAR_SIZE : avatar ? AVATAR_SIZE[density][avatar.size] : 0;
    const headingTypography = HEADING_TYPOGRAPHY[type];

    const rootStyle = {
      display: "flex",
      alignItems: "center",
      gap: ROOT_GAP[type],
      padding: PADDING[type],
      borderBottom: `1px solid ${color.gray[100]}`,
      ...style,
    };

    if (state === "loading") {
      const loadingCfg = LOADING_CONFIG[type];
      return (
        <div
          ref={ref}
          data-type={type}
          data-state="loading"
          style={{
            display: "flex",
            alignItems: "center",
            gap: loadingCfg.gap,
            padding: loadingCfg.padding,
            borderBottom: `1px solid ${color.gray[100]}`,
            ...style,
          }}
          {...props}
        >
          {loadingCfg.circleSizes.map((size, i) => (
            <SkeletonCircle key={i} size={size} />
          ))}
          <span
            aria-hidden
            style={{ flex: "1 0 0", height: loadingCfg.barHeight, borderRadius: radius.full, background: color.gray[200] }}
          />
        </div>
      );
    }

    return (
      <div ref={ref} data-type={type} data-state={state} style={rootStyle} {...props}>
        {checkbox && (
          <Checkbox
            size="sm"
            checked={checked}
            onChange={(event) => onCheckedChange?.(event.target.checked)}
            aria-label="Select row"
          />
        )}
        {avatar && <AvatarSlot size={avatarPx} src={avatar.src} alt={avatar.alt} />}
        {leftIcon && <IconSlot size={header ? headerIconSize : groupIconSize}>{leftIcon}</IconSlot>}
        {!header && secondaryLeftIcon && <IconSlot size={groupIconSize}>{secondaryLeftIcon}</IconSlot>}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", ...headingTypography }}>
            {heading && (
              <span
                style={{
                  // docs/audit/table-deep-audit.md §6 — confirmed: only header/header_compact's
                  // heading is SemiBold(600); default/default_compact's heading inherits the
                  // text_group's own Medium(500) default instead.
                  fontWeight: header ? 600 : 500,
                  color: header ? color.gray[600] : color.gray[950],
                }}
              >
                {heading}
              </span>
            )}
            {supportText && (
              <span style={{ fontWeight: 500, color: color.gray[600], whiteSpace: "pre" }}>
                •  {supportText}
              </span>
            )}
          </div>
          {!header && description && (
            <span style={{ fontSize: 12, lineHeight: "16px", color: color.gray[600] }}>{description}</span>
          )}
        </div>
        {rightIcon && <IconSlot size={header ? headerIconSize : iconSize}>{rightIcon}</IconSlot>}
        {!header && secondaryRightIcon && <IconSlot size={groupIconSize}>{secondaryRightIcon}</IconSlot>}
        {!header && tag1 && (
          <Tags size="md" type="secondary">
            {tag1}
          </Tags>
        )}
        {!header && tag2 && (
          <Tags size="md" type="primary_light">
            {tag2}
          </Tags>
        )}
        {!header && dropdownContent && (
          <button
            type="button"
            onClick={onDropdownClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              border: "none",
              padding: "0.5rem",
              borderRadius: radius.sm,
              backgroundColor: color.gray[100],
              boxShadow: restingInsetShadow,
              fontSize: 12,
              lineHeight: "16px",
              fontWeight: 500,
              color: color.gray[950],
              cursor: "pointer",
            }}
          >
            {dropdownContent}
          </button>
        )}
        {!header && actionIcon && (
          <button
            type="button"
            onClick={onActionClick}
            aria-label={actionLabel}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              flexShrink: 0,
              border: "none",
              borderRadius: radius.md,
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <IconSlot size={22}>{actionIcon}</IconSlot>
          </button>
        )}
      </div>
    );
  },
);

TableCell.displayName = "TableCell";
