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

// docs/audit/table-deep-audit.md §3 — confirmed padding per type.
const PADDING: Record<TableCellType, string> = {
  header: "0.25rem 1rem 0.75rem", // pt-4 pb-12 px-16 — confirmed
  header_compact: "0.25rem 0.75rem 0.75rem", // derived, scaled like default->default_compact
  default: "0.5rem 1rem", // py-8 px-16 — confirmed
  default_compact: "0.25rem 0.75rem", // py-4 px-12 — confirmed
};

// docs/audit/table-deep-audit.md §3 — confirmed avatar-slot pixel sizes per density.
const AVATAR_SIZE = {
  default: { xs: 24, sm: 32, md: 40 },
  compact: { xs: 20, sm: 24, md: 32 },
} as const;

const ICON_SIZE = { default: 24, group: 20, compact: 20, compactGroup: 18, header: 18 } as const;

const iconShadowFilter = `drop-shadow(0px 1px 0.5px ${elevation.e2[0].color}) drop-shadow(0px 3px 1.5px ${elevation.e2[0].color})`;
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
   * (§5). `header` types only ever have the `sm` size confirmed. */
  avatar?: TableCellAvatar;
  leftIcon?: ReactNode;
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
  /** Confirmed `default`/`default_compact`-only slots (§2) — ignored for `header` types. */
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
    const avatarPx = avatar ? AVATAR_SIZE[density][avatar.size] : 0;

    const rootStyle = {
      display: "flex",
      alignItems: "center",
      gap: header ? "0.375rem" : "0.75rem",
      padding: PADDING[type],
      borderBottom: `1px solid ${color.gray[100]}`,
      ...style,
    };

    if (state === "loading") {
      return (
        <div ref={ref} data-type={type} data-state="loading" style={{ ...rootStyle, gap: "1rem" }} {...props}>
          <SkeletonCircle size={32} />
          <SkeletonCircle size={24} />
          <span
            aria-hidden
            style={{ flex: "1 0 0", height: 16, borderRadius: radius.full, background: color.gray[200] }}
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
        {leftIcon && <IconSlot size={groupIconSize}>{leftIcon}</IconSlot>}
        {secondaryLeftIcon && <IconSlot size={groupIconSize}>{secondaryLeftIcon}</IconSlot>}
        <div style={{ display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: 13, lineHeight: "20px" }}>
            {heading && (
              <span
                style={{
                  fontWeight: 600,
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
        {rightIcon && <IconSlot size={header ? ICON_SIZE.header : iconSize}>{rightIcon}</IconSlot>}
        {!header && secondaryRightIcon && <IconSlot size={groupIconSize}>{secondaryRightIcon}</IconSlot>}
        {!header && tag1 && (
          <Tags size="sm" type="secondary">
            {tag1}
          </Tags>
        )}
        {!header && tag2 && (
          <Tags size="sm" type="primary_light">
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
              boxShadow: "inset 0px 1px 3px 0px rgba(0,0,0,0.04)",
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
              boxShadow: restingInsetShadow,
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
