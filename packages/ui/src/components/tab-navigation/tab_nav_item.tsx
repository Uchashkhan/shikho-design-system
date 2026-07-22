import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from "react";
import { color, elevation } from "@shikho/tokens";

// docs/audit/tab-navigation-deep-audit.md §1 — tab_nav_item: size (xl, lg, md, sm, xs), type
// (inactive, active — the smallest type vocabulary of any nav component in this library), state
// (hover, default). Confirmed: `active` only ever has `state=default` — no `active`+`hover`
// variant exists. No `focus` state exists at all — the most restrictive interaction coverage of
// any nav component audited.
export type TabNavItemSize = "xs" | "sm" | "md" | "lg" | "xl";
export type TabNavItemType = "inactive" | "active";
export type TabNavItemState = "default" | "hover";

// docs/audit/tab-navigation-deep-audit.md §1-§2 — confirmed heights (size metadata); icon size
// confirmed only at md (18px), interpolated for xs/sm/lg/xl using the confirmed 5-step
// sizing/icon/14,16,18,20,24 token ramp, the same approach already used for SwitcherItem.
const HEIGHT: Record<TabNavItemSize, number> = { xs: 24, sm: 32, md: 40, lg: 48, xl: 56 };
const ICON_SIZE: Record<TabNavItemSize, number> = { xs: 14, sm: 16, md: 18, lg: 20, xl: 24 };

const iconShadowFilter = `drop-shadow(0px 1px 0.5px ${elevation.e2[0].color}) drop-shadow(0px 3px 1.5px ${elevation.e2[0].color})`;

// docs/audit/tab-navigation-deep-audit.md §1 — confirmed: unlike every sibling nav component
// (SwitcherItem, SidebarItem), tab_nav_item's hover mechanism is a text-color darken only — no
// background fill exists at any type/state combination.
const TEXT_COLOR: Record<TabNavItemType, Record<TabNavItemState, string>> = {
  active: { default: color.gray[950], hover: color.gray[950] },
  inactive: { default: color.gray[600], hover: color.gray[700] },
};

export interface TabNavItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  size?: TabNavItemSize;
  type?: TabNavItemType;
  state?: TabNavItemState;
  /** The 3 confirmed boolean slots, all default `true`. */
  leftIcon?: boolean;
  rightIcon?: boolean;
  text?: boolean;
  selectLeftIcon?: ReactNode | null;
  selectRightIcon?: ReactNode | null;
  children?: ReactNode;
}

/**
 * `tab_nav_item` (docs/audit/tab-navigation-deep-audit.md, deep-audited across both confirmed
 * types at `size=md`). The simplest, least-featured nav component in this library: no
 * background-fill states at all (unlike `SwitcherItem`/`SidebarItem`), no focus state, and no
 * `active`+`hover` combination — the active indicator is purely a `border-bottom`, and hover only
 * darkens the inactive text color.
 */
export const TabNavItem = forwardRef<HTMLButtonElement, TabNavItemProps>(
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
    const iconSize = ICON_SIZE[size];
    // Confirmed: active never has a hover variant — the default text color is used regardless of
    // the `state` prop when type="active".
    const textColor = type === "active" ? TEXT_COLOR.active.default : TEXT_COLOR.inactive[state];

    return (
      <button
        ref={ref}
        type="button"
        data-size={size}
        data-type={type}
        data-state={state}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: HEIGHT[size],
          gap: "0.5rem",
          padding: "0.25rem 0 0.75rem", // pt-4 pb-12, px-0 — confirmed
          border: "none",
          borderBottom: type === "active" ? `2px solid ${color.black[950]}` : "2px solid transparent", // outline/b
          background: "transparent",
          cursor: "pointer",
          whiteSpace: "nowrap",
          ...style,
        }}
        {...props}
      >
        {leftIcon && (
          <span style={{ width: iconSize, height: iconSize, flexShrink: 0, filter: iconShadowFilter }}>
            {selectLeftIcon}
          </span>
        )}
        {text && (
          <span style={{ fontSize: 13, lineHeight: "20px", fontWeight: 600, color: textColor }}>
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

TabNavItem.displayName = "TabNavItem";
