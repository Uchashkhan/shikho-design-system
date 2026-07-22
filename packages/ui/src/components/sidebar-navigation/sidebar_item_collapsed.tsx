import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from "react";
import { color, elevation, radius } from "@shikho/tokens";
import type { SidebarItemState, SidebarItemType } from "./sidebar_item";

// docs/audit/sidebar-navigation-deep-audit.md §4 — sidebar_item_collapsed: type (same 6 values
// as sidebar_item), state (default, hover). Confirmed no `size` property — one fixed 64×56 size.

const iconShadowFilter = `drop-shadow(0px 1px 0.5px ${elevation.e2[0].color}) drop-shadow(0px 3px 1.5px ${elevation.e2[0].color})`;
const restingInsetShadow = `inset 0px 1px 3px -2px ${color.white[50]}, inset 0px -1px 3px -2px rgba(0,0,0,0.07)`;

interface TypeStyle {
  defaultFill: string;
  hoverFill: string;
  border?: string;
  textColor: string;
  shadow?: string;
}

// docs/audit/sidebar-navigation-deep-audit.md §4 — confirmed for active_primary_accent only
// (same fill token as the full-size sidebar_item); the other 5 types reuse sidebar_item's own
// confirmed §2 mapping, a low-invention extension since both share the identical type vocabulary.
const TYPE_STYLE: Record<SidebarItemType, TypeStyle> = {
  active_primary: {
    defaultFill: color.primary[400],
    hoverFill: color.primary[400],
    border: `1px solid ${color.black[150]}`,
    textColor: color.white[950],
    shadow: `0px 1px 1px -0.5px rgba(0,0,0,0.04), ${restingInsetShadow}`,
  },
  active_primary_accent: {
    defaultFill: `${color.primary[500]}1f`, // confirmed
    hoverFill: `${color.primary[500]}33`,
    textColor: color.primary[600],
    shadow: `0px 1px 1px -0.5px rgba(0,0,0,0.04), ${restingInsetShadow}`,
  },
  active: {
    defaultFill: color.gray[100],
    hoverFill: color.gray[200],
    textColor: color.gray[950],
  },
  active_neutral: {
    defaultFill: color.black[950],
    hoverFill: color.black[950],
    textColor: color.white[950],
  },
  active_neutral_inverse: {
    defaultFill: color.white[950],
    hoverFill: color.gray[100],
    textColor: color.gray[950],
  },
  inactive: {
    defaultFill: "transparent",
    hoverFill: color.gray[50],
    textColor: color.gray[700],
  },
};

export interface SidebarItemCollapsedProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  type?: SidebarItemType;
  state?: SidebarItemState;
  /** The 2 confirmed boolean slots (§4), both default `true`. No `tag`, no `rightIcon` — a
   * confirmed deliberately reduced structure vs. `SidebarItem`. */
  icon?: boolean;
  text?: boolean;
  selectLeftIcon?: ReactNode | null;
  children?: ReactNode;
}

/**
 * `sidebar_item_collapsed` (docs/audit/sidebar-navigation-deep-audit.md §4) — a confirmed 64×56
 * icon-over-label tile, structurally simpler than `SidebarItem` (no size axis, no tag, no right
 * icon). Used for a collapsed sidebar layout.
 */
export const SidebarItemCollapsed = forwardRef<HTMLButtonElement, SidebarItemCollapsedProps>(
  ({ type = "inactive", state = "default", icon = true, text = true, selectLeftIcon = null, children, style, ...props }, ref) => {
    const typeStyle = TYPE_STYLE[type];
    const isHover = state === "hover";

    return (
      <button
        ref={ref}
        type="button"
        data-type={type}
        data-state={state}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.125rem",
          width: 64,
          height: 56,
          padding: "0.5rem 0.25rem",
          border: typeStyle.border ?? "none",
          borderRadius: radius.md,
          backgroundColor: isHover ? typeStyle.hoverFill : typeStyle.defaultFill,
          boxShadow: typeStyle.shadow,
          cursor: "pointer",
          ...style,
        }}
        {...props}
      >
        {icon && (
          <span style={{ width: 22, height: 22, flexShrink: 0, filter: iconShadowFilter }}>{selectLeftIcon}</span>
        )}
        {text && (
          <span
            style={{
              width: "100%",
              textAlign: "center",
              fontSize: 11,
              lineHeight: "16px",
              fontWeight: 600,
              color: typeStyle.textColor,
            }}
          >
            {children ?? "Item"}
          </span>
        )}
      </button>
    );
  },
);

SidebarItemCollapsed.displayName = "SidebarItemCollapsed";
