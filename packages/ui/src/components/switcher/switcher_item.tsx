import { type ButtonHTMLAttributes, type CSSProperties, type MouseEvent, type ReactNode, forwardRef, useState } from "react";
import { color, elevation, radius } from "@shikho/tokens";

// docs/audit/switcher-deep-audit.md §2-§4 — switcher_item: size (xs, sm, md, lg, xl), type
// (inactive, active_neutral, active, active_primary_accent, active_primary), state (hover,
// default). No `disabled` state exists.
export type SwitcherItemSize = "xs" | "sm" | "md" | "lg" | "xl";
export type SwitcherItemType =
  | "active_primary"
  | "active_primary_accent"
  | "active"
  | "active_neutral"
  | "inactive";
export type SwitcherItemState = "default" | "hover";

// docs/audit/switcher-deep-audit.md §4 — confirmed heights (size metadata); confirmed icon size
// only at lg (20px) and sm (16px), interpolated for xs/md/xl using the confirmed 5-step
// sizing/icon/14,16,18,20,24 token ramp — the least-invented mapping available.
const HEIGHT: Record<SwitcherItemSize, number> = { xs: 24, sm: 32, md: 40, lg: 48, xl: 56 };
const ICON_SIZE: Record<SwitcherItemSize, number> = { xs: 14, sm: 16, md: 18, lg: 20, xl: 24 };
// Confirmed via a live get_design_context pull on 66065:22392 — xs/sm/md use radius.sm (8px),
// lg/xl use radius.lg (12px). Previously hardcoded to radius.lg at every size.
const RADIUS: Record<SwitcherItemSize, number> = {
  xs: radius.sm,
  sm: radius.sm,
  md: radius.sm,
  lg: radius.lg,
  xl: radius.lg,
};
// Confirmed lg=body_1 (13/20 SemiBold), sm=caption_2 (12/16 SemiBold); xs shares sm's smaller
// scale, md/xl share lg's — derived, not independently confirmed at every step.
const TYPOGRAPHY: Record<SwitcherItemSize, { fontSize: number; lineHeight: string }> = {
  // P1 repair: xs is confirmed `caption_1` 11px/16px, not sm's 12px.
  xs: { fontSize: 11, lineHeight: "16px" },
  sm: { fontSize: 12, lineHeight: "16px" },
  md: { fontSize: 13, lineHeight: "20px" },
  lg: { fontSize: 13, lineHeight: "20px" },
  xl: { fontSize: 13, lineHeight: "20px" },
};
// Confirmed lg (px-16 py-12) and sm (p-8 uniform, from the switcher container's own nested
// sample) — xs/md/xl interpolated between those two confirmed anchors.
const PADDING: Record<SwitcherItemSize, string> = {
  xs: "0.375rem", // 6px uniform, derived
  sm: "0.5rem", // 8px uniform — confirmed (via switcher container's nested sm item)
  md: "0.625rem 0.75rem", // derived
  lg: "0.75rem 1rem", // confirmed
  xl: "0.875rem 1.25rem", // derived
};

const iconShadowFilter = `drop-shadow(0px 1px 0.5px ${elevation.e2[0].color}) drop-shadow(0px 3px 1.5px ${elevation.e2[0].color})`;

interface TypeStyle {
  defaultFill: string;
  hoverFill: string;
  border?: string;
  textColor: string;
  shadow?: string;
}

// docs/audit/switcher-deep-audit.md §2, re-confirmed against a live get_design_context pull on
// 66065:22392 (all 5 types x both states x all 5 sizes) — the full type x state matrix.
const TYPE_STYLE: Record<SwitcherItemType, TypeStyle> = {
  active_primary: {
    // Intentional deviation from Figma (see sidebar_item.tsx's identical note) — bumps the
    // default/hover pair one ramp step: 500/600 instead of the confirmed 400/500.
    defaultFill: color.primary[500],
    hoverFill: color.primary[600],
    border: `1px solid ${color.black[150]}`,
    textColor: color.white[950],
    shadow: "0px 1px 1px -0.5px rgba(0,0,0,0.04), 0px 3px 3px -1.5px rgba(0,0,0,0.04)",
  },
  active_primary_accent: {
    defaultFill: `${color.primary[500]}1f`, // confirmed 12%
    hoverFill: `${color.primary[500]}33`, // confirmed 20%
    textColor: color.primary[600],
  },
  active: {
    defaultFill: color.white[950], // Color/smoke_em
    hoverFill: color.gray[100], // Color/smoke_med — confirmed via get_design_context
    textColor: color.gray[950],
    shadow: "0px 1px 1px -0.5px rgba(0,0,0,0.04), 0px 3px 3px -1.5px rgba(0,0,0,0.04)",
  },
  active_neutral: {
    defaultFill: color.black[950], // Color/inverse_white_neutral
    hoverFill: color.black[900], // alpha_88 (~88% opaque black) — confirmed via get_design_context
    textColor: color.white[950],
    shadow: "0px 1px 1px -0.5px rgba(0,0,0,0.04), 0px 3px 3px -1.5px rgba(0,0,0,0.04)",
  },
  inactive: {
    defaultFill: "transparent",
    hoverFill: color.gray[50], // Color/gray-50 — confirmed via get_design_context
    textColor: color.gray[600], // confirmed — text/gray-600, SemiBold (differs from sidebar_item's gray-700 Medium)
  },
};

export interface SwitcherItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  size?: SwitcherItemSize;
  type?: SwitcherItemType;
  /** Forces a specific state (used by Storybook/playground controls to preview `hover` without a
   * pointer). Left unset, the real cursor drives it via onMouseEnter/onMouseLeave. */
  state?: SwitcherItemState;
  /** The 3 confirmed boolean slots (§3), all default `true`. No `tag` slot exists — a confirmed
   * simpler structure than `SidebarItem`. */
  leftIcon?: boolean;
  rightIcon?: boolean;
  text?: boolean;
  selectLeftIcon?: ReactNode | null;
  selectRightIcon?: ReactNode | null;
  children?: ReactNode;
}

/**
 * `switcher_item` (docs/audit/switcher-deep-audit.md, deep-audited across all 5 `type` values at
 * `size=lg, state=default`, plus the confirmed `active_primary_accent` hover transition).
 * Confirmed genuinely simpler than `SidebarItem` — no `tag` slot — and confirmed to diverge from
 * it at the one type they'd most plausibly match: `inactive` here is SemiBold at `gray-600`,
 * vs. `SidebarItem`'s Medium at `gray-700`.
 */
export const SwitcherItem = forwardRef<HTMLButtonElement, SwitcherItemProps>(
  (
    {
      size = "lg",
      type = "inactive",
      state,
      leftIcon = true,
      rightIcon = true,
      text = true,
      selectLeftIcon = null,
      selectRightIcon = null,
      children,
      style,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref,
  ) => {
    const typeStyle = TYPE_STYLE[type];
    const typography = TYPOGRAPHY[size];
    const iconSize = ICON_SIZE[size];

    // `state` left unset (the normal case for real usage, including Switcher's own items) →
    // hover is driven by the actual pointer. An explicit `state` (Storybook/playground controls)
    // always wins. See sidebar_item.tsx for the identical fix and its rationale.
    const [pointerHover, setPointerHover] = useState(false);
    const isHover = state ? state === "hover" : pointerHover;

    const handleMouseEnter = (event: MouseEvent<HTMLButtonElement>) => {
      setPointerHover(true);
      onMouseEnter?.(event);
    };
    const handleMouseLeave = (event: MouseEvent<HTMLButtonElement>) => {
      setPointerHover(false);
      onMouseLeave?.(event);
    };

    const computedStyle: CSSProperties = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: HEIGHT[size],
      gap: "0.5rem",
      padding: PADDING[size],
      border: typeStyle.border ?? "none",
      borderRadius: RADIUS[size],
      backgroundColor: isHover ? typeStyle.hoverFill : typeStyle.defaultFill,
      boxShadow: typeStyle.shadow,
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
        data-state={isHover ? "hover" : "default"}
        style={computedStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
              padding: "0 0.125rem",
              fontSize: typography.fontSize,
              lineHeight: typography.lineHeight,
              fontWeight: 600,
              color: typeStyle.textColor,
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

SwitcherItem.displayName = "SwitcherItem";
