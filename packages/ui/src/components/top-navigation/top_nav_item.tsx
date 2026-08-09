import { type ButtonHTMLAttributes, type CSSProperties, type ReactNode, forwardRef } from "react";
import { color, elevation, focusRingColor, radius } from "@shikho/tokens";

// docs/audit/top-navigation-deep-audit.md §5 — confirmed directly from the top_nav container's
// own per-size rendering, not interpolated.
export type TopNavItemSize = "xs" | "sm" | "md" | "lg" | "xl";
export type TopNavItemType =
  | "active_primary"
  | "active_primary_accent"
  | "active"
  | "active_neutral"
  | "active_outline"
  | "inactive"
  | "inactive_outline";
export type TopNavItemState = "default" | "hover" | "focus";

const HEIGHT: Record<TopNavItemSize, number> = { xs: 24, sm: 32, md: 40, lg: 48, xl: 56 };
const RADIUS: Record<TopNavItemSize, number> = {
  xs: radius.sm,
  sm: radius.md,
  md: radius.lg,
  lg: radius.xl,
  xl: radius.xl,
};
const GAP: Record<TopNavItemSize, number> = { xs: 0, sm: 2, md: 4, lg: 4, xl: 6 };
const PADDING: Record<TopNavItemSize, string> = {
  xs: "0.25rem 0.375rem", // 4px/6px
  sm: "0.5rem", // 8px uniform
  md: "0.5rem 0.75rem", // 8px/12px
  lg: "0.75rem 1rem", // 12px/16px
  xl: "1rem", // 16px uniform
};
const ICON_SIZE: Record<TopNavItemSize, number> = { xs: 14, sm: 16, md: 18, lg: 20, xl: 24 };
const TYPOGRAPHY: Record<TopNavItemSize, { fontSize: number; lineHeight: string }> = {
  xs: { fontSize: 11, lineHeight: "16px" },
  sm: { fontSize: 12, lineHeight: "16px" },
  md: { fontSize: 13, lineHeight: "20px" },
  lg: { fontSize: 13, lineHeight: "20px" },
  xl: { fontSize: 18, lineHeight: "24px" },
};

const iconShadowFilter = `drop-shadow(0px 1px 0.5px ${elevation.e2[1].color}) drop-shadow(0px 3px 1.5px ${elevation.e2[0].color})`;
// docs/audit/top-navigation-deep-audit.md §3 — the confirmed "special_drop" inset, reusing the
// same literal already established in SidebarItem/SwitcherItem for cross-component consistency.
const specialDropInset = `inset 0px 1px 3px -2px ${color.white[50]}, inset 0px -1px 3px -2px rgba(0,0,0,0.07)`;

interface StateStyle {
  backgroundColor?: string;
  border?: string;
  textColor: string;
  insetShadow?: string;
  ring?: string;
}

// docs/audit/top-navigation-deep-audit.md §3 — the confirmed type x state matrix (12 variants
// fetched directly at size=md). `inactive`/`inactive_outline` have no `focus` entry — confirmed,
// not an oversight (docs/audit/top-navigation.md §2/§11).
const STYLE: Record<TopNavItemType, Partial<Record<TopNavItemState, StateStyle>>> = {
  active_primary: {
    default: {
      backgroundColor: color.primary[400],
      border: `1px solid ${color.black[100]}`,
      textColor: color.white[950],
      insetShadow: specialDropInset,
    },
    hover: {
      backgroundColor: color.primary[500],
      border: `1px solid ${color.black[100]}`,
      textColor: color.white[950],
      insetShadow: specialDropInset,
    },
    focus: {
      backgroundColor: color.primary[400],
      textColor: color.white[950],
      ring: `0 0 0 3px ${focusRingColor.primary}`,
    },
  },
  active_primary_accent: {
    default: {
      backgroundColor: color.gray[100],
      border: `1px solid ${color.black[50]}`,
      textColor: color.primary[500],
      insetShadow: specialDropInset,
    },
    hover: {
      backgroundColor: color.gray[100],
      border: `1px solid ${color.black[50]}`,
      textColor: color.primary[600],
      insetShadow: specialDropInset,
    },
    focus: {
      backgroundColor: color.gray[50],
      textColor: color.primary[600],
      ring: `0 0 0 3px ${focusRingColor.primary}`,
    },
  },
  active: {
    default: { backgroundColor: color.gray[200], textColor: color.gray[950], insetShadow: specialDropInset },
    hover: { backgroundColor: color.gray[100], textColor: color.gray[950], insetShadow: specialDropInset },
    focus: {
      backgroundColor: color.gray[200],
      textColor: color.gray[950],
      ring: `0 0 0 3px ${focusRingColor.gray}`,
    },
  },
  active_neutral: {
    default: { backgroundColor: color.black[950], textColor: color.white[950], insetShadow: specialDropInset },
    hover: { backgroundColor: color.black[900], textColor: color.white[950], insetShadow: specialDropInset },
    focus: {
      backgroundColor: color.black[950],
      textColor: color.white[950],
      ring: `0 0 0 3px ${focusRingColor.gray}`,
    },
  },
  active_outline: {
    default: { border: `2px solid ${color.black[300]}`, textColor: color.gray[950] },
    hover: {
      backgroundColor: color.gray[100],
      border: `2px solid ${color.black[300]}`,
      textColor: color.gray[950],
      insetShadow: specialDropInset,
    },
    focus: {
      backgroundColor: color.gray[100],
      border: `2px solid ${color.black[300]}`,
      textColor: color.gray[950],
      ring: `0 0 0 3px ${focusRingColor.gray}`,
    },
  },
  inactive: {
    default: { textColor: color.gray[600] },
    hover: { backgroundColor: color.gray[100], textColor: color.gray[600] },
  },
  inactive_outline: {
    default: { border: `1px solid ${color.gray[200]}`, textColor: color.gray[600] },
    hover: { backgroundColor: color.gray[100], border: `1px solid ${color.gray[200]}`, textColor: color.gray[600] },
  },
};

export interface TopNavItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  size?: TopNavItemSize;
  type?: TopNavItemType;
  /** `focus` is confirmed to not exist for `inactive`/`inactive_outline` — passing it there falls
   * back to that type's `default` styling. */
  state?: TopNavItemState;
  /** Confirmed boolean slots (§2), all default `true`. No badge/counter/separator slot exists. */
  leftIcon?: boolean;
  rightIcon?: boolean;
  text?: boolean;
  selectLeftIcon?: ReactNode | null;
  selectRightIcon?: ReactNode | null;
  children?: ReactNode;
}

/**
 * `top_nav_item` (docs/audit/top-navigation-deep-audit.md) — deep-audited across all 7 `type`
 * values and every reachable `state` at `size=md` (12 variants fetched directly). `top_nav` (the
 * bare Figma instance) is confirmed a demo composition, not a primitive — same precedent as
 * `sidebar_nav`/`tab_nav` — and is not implemented.
 */
export const TopNavItem = forwardRef<HTMLButtonElement, TopNavItemProps>(
  (
    {
      size = "md",
      type = "inactive",
      state = "default",
      leftIcon = true,
      rightIcon = true,
      text = true,
      selectLeftIcon = null,
      selectRightIcon = null,
      children,
      style,
      ...props
    },
    ref,
  ) => {
    const stateStyle = STYLE[type][state] ?? STYLE[type].default!;
    const typography = TYPOGRAPHY[size];
    const iconSize = ICON_SIZE[size];

    const computedStyle: CSSProperties = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: HEIGHT[size],
      gap: GAP[size],
      padding: PADDING[size],
      borderRadius: RADIUS[size],
      border: stateStyle.border ?? "none",
      backgroundColor: stateStyle.backgroundColor ?? "transparent",
      boxShadow: [stateStyle.insetShadow, stateStyle.ring].filter(Boolean).join(", ") || undefined,
      cursor: "pointer",
      whiteSpace: "nowrap",
      ...style,
    };

    return (
      <button
        ref={ref}
        type="button"
        data-size={size}
        data-type={type}
        data-state={state}
        style={computedStyle}
        {...props}
      >
        {leftIcon && (
          <span style={{ width: iconSize, height: iconSize, flexShrink: 0, filter: iconShadowFilter }}>
            {selectLeftIcon}
          </span>
        )}
        {text && (
          <span
            style={{
              // P1 repair: confirmed `px-6` (6px), not the previous 4px.
              padding: "0 0.375rem",
              fontSize: typography.fontSize,
              lineHeight: typography.lineHeight,
              fontWeight: 600,
              color: stateStyle.textColor,
            }}
          >
            {children ?? "Nav item"}
          </span>
        )}
        {rightIcon && (
          <span style={{ width: iconSize, height: iconSize, flexShrink: 0, filter: iconShadowFilter }}>
            {selectRightIcon}
          </span>
        )}
      </button>
    );
  },
);

TopNavItem.displayName = "TopNavItem";
