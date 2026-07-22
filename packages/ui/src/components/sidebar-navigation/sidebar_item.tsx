import { type ButtonHTMLAttributes, type CSSProperties, type ReactNode, forwardRef } from "react";
import { color, elevation, radius } from "@shikho/tokens";

// docs/audit/sidebar-navigation-deep-audit.md §2-§3 — sidebar_item: size (md, lg, xl), type (6
// values), state (default, hover). No `disabled` state exists — confirmed absence, matching the
// same gap in switcher_item.
export type SidebarItemSize = "md" | "lg" | "xl";
export type SidebarItemType =
  | "active_primary"
  | "active_primary_accent"
  | "active"
  | "active_neutral_inverse"
  | "active_neutral"
  | "inactive";
export type SidebarItemState = "default" | "hover";

const HEIGHT: Record<SidebarItemSize, number> = { md: 40, lg: 48, xl: 56 };

const iconShadowFilter = `drop-shadow(0px 1px 0.5px ${elevation.e2[0].color}) drop-shadow(0px 3px 1.5px ${elevation.e2[0].color})`;
const restingInsetShadow = `inset 0px 1px 3px -2px ${color.white[50]}, inset 0px -1px 3px -2px rgba(0,0,0,0.07)`;

interface TypeStyle {
  defaultFill: string;
  hoverFill: string;
  border?: string;
  textColor: string;
  fontWeight: number;
  shadow?: string;
}

// docs/audit/sidebar-navigation-deep-audit.md §2 — the confirmed type x state=default matrix, for
// all 6 types. hover fills for active_primary_accent and inactive are directly confirmed (12%->
// 20% alpha, and transparent->gray-50 respectively); the other 4 types' hover fill is derived by
// the same "intensify one step" pattern, not independently audited.
const TYPE_STYLE: Record<SidebarItemType, TypeStyle> = {
  active_primary: {
    defaultFill: color.primary[400], // Color/primary_med_em
    hoverFill: color.primary[400],
    border: `1px solid ${color.black[150]}`,
    textColor: color.white[950], // text/inverse_black_neutral
    fontWeight: 600,
    shadow: `0px 1px 1px -0.5px rgba(0,0,0,0.04), ${restingInsetShadow}`,
  },
  active_primary_accent: {
    defaultFill: `${color.primary[500]}1f`, // Color/primary_base_em_alpha (12%) — confirmed
    hoverFill: `${color.primary[500]}33`, // Color/primary_low_em_alpha (20%) — confirmed
    textColor: color.primary[600],
    fontWeight: 600,
    shadow: `0px 1px 1px -0.5px rgba(0,0,0,0.04), ${restingInsetShadow}`,
  },
  active: {
    defaultFill: color.gray[100], // Color/smoke_med
    hoverFill: color.gray[200], // Color/smoke_high — derived, one step darker
    textColor: color.gray[950],
    fontWeight: 600,
  },
  active_neutral: {
    defaultFill: color.black[950], // Color/inverse_white_neutral
    hoverFill: color.black[950], // unconfirmed hover — kept static, derived
    textColor: color.white[950], // text/inverse_black_neutral
    fontWeight: 600,
  },
  active_neutral_inverse: {
    defaultFill: color.white[950], // Color/smoke_base
    hoverFill: color.gray[100], // derived, one step darker (smoke_med)
    textColor: color.gray[950],
    fontWeight: 600,
  },
  inactive: {
    defaultFill: "transparent",
    hoverFill: color.gray[50], // confirmed
    textColor: color.gray[700],
    fontWeight: 500, // the only type at Medium weight — confirmed
  },
};

const TAG_STYLE: Record<SidebarItemType, { fill: string; text: string; border?: string }> = {
  active_primary: { fill: color.primary[50], text: color.primary[600] }, // Color/primary_base_em
  active_primary_accent: { fill: color.primary[500], text: color.white[950], border: `1px solid ${color.black[50]}` },
  active: { fill: color.primary[500], text: color.white[950], border: `1px solid ${color.black[50]}` },
  active_neutral: { fill: color.primary[500], text: color.white[950], border: `1px solid ${color.black[50]}` },
  active_neutral_inverse: { fill: color.primary[500], text: color.white[950], border: `1px solid ${color.black[50]}` },
  inactive: { fill: color.gray[100], text: color.gray[600] },
};

export interface SidebarItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  size?: SidebarItemSize;
  type?: SidebarItemType;
  state?: SidebarItemState;
  /** The 4 confirmed boolean slots (§3), all default `true`. */
  leftIcon?: boolean;
  rightIcon?: boolean;
  tag?: boolean;
  text?: boolean;
  selectLeftIcon?: ReactNode | null;
  selectRightIcon?: ReactNode | null;
  tagContent?: ReactNode;
  children?: ReactNode;
}

/**
 * `sidebar_item` (docs/audit/sidebar-navigation-deep-audit.md, deep-audited across all 6 `type`
 * values at `state=default`, plus 2 confirmed `hover` transitions). Renders a real `<button>` —
 * a sidebar nav row is fundamentally a navigation control, the same functional-necessity
 * reasoning already applied throughout this library.
 */
export const SidebarItem = forwardRef<HTMLButtonElement, SidebarItemProps>(
  (
    {
      size = "lg",
      type = "inactive",
      state = "default",
      leftIcon = true,
      rightIcon = true,
      tag = true,
      text = true,
      selectLeftIcon = null,
      selectRightIcon = null,
      tagContent,
      children,
      style,
      ...props
    },
    ref,
  ) => {
    const typeStyle = TYPE_STYLE[type];
    const tagStyle = TAG_STYLE[type];
    const isHover = state === "hover";

    const computedStyle: CSSProperties = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: HEIGHT[size],
      gap: "0.75rem",
      padding: "0.75rem",
      border: typeStyle.border ?? "none",
      borderRadius: radius.lg,
      backgroundColor: isHover ? typeStyle.hoverFill : typeStyle.defaultFill,
      boxShadow: typeStyle.shadow,
      cursor: "pointer",
      ...style,
    };

    return (
      <button ref={ref} type="button" data-size={size} data-type={type} data-state={state} style={computedStyle} {...props}>
        {leftIcon && (
          <span style={{ width: 22, height: 22, flexShrink: 0, filter: iconShadowFilter }}>{selectLeftIcon}</span>
        )}
        {text && (
          <span
            style={{
              flex: "1 0 0",
              minWidth: 1,
              textAlign: "left",
              fontSize: 13,
              lineHeight: "20px",
              fontWeight: typeStyle.fontWeight,
              color: typeStyle.textColor,
            }}
          >
            {children ?? "Nav item"}
          </span>
        )}
        {rightIcon && (
          <span style={{ width: 24, height: 24, flexShrink: 0, filter: iconShadowFilter }}>{selectRightIcon}</span>
        )}
        {tag && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 24,
              flexShrink: 0,
              padding: "0.25rem 0.375rem",
              borderRadius: radius.sm,
              border: tagStyle.border,
              backgroundColor: tagStyle.fill,
              color: tagStyle.text,
              fontSize: 11,
              lineHeight: "16px",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            {tagContent ?? "Tag"}
          </span>
        )}
      </button>
    );
  },
);

SidebarItem.displayName = "SidebarItem";
