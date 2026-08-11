import { type ButtonHTMLAttributes, type CSSProperties, type MouseEvent, type ReactNode, forwardRef, useState } from "react";
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

/**
 * Per-size metrics — all three rows confirmed by live `get_design_context` samples during the
 * P1 repair pass. The previous implementation carried a per-size HEIGHT table but single values
 * for padding (12px), radius (`radius.lg`), typography (13/20) and right-icon size (24px) — all
 * of which were `lg`'s values, the only size the original audit sampled. Figma confirms md and
 * xl differ on four properties each.
 *
 * The left icon is confirmed 22px at EVERY size (it does not scale) — kept as a shared constant
 * rather than an invented per-size row.
 */
interface SidebarItemSizeMetrics {
  height: number;
  padding: string;
  radius: number;
  fontSize: number;
  lineHeight: string;
  rightIconSize: number;
}

const SIZE_METRICS: Record<SidebarItemSize, SidebarItemSizeMetrics> = {
  md: { height: 40, padding: "0.5rem 0.75rem", radius: radius.md, fontSize: 13, lineHeight: "20px", rightIconSize: 20 },
  lg: { height: 48, padding: "0.75rem", radius: radius.lg, fontSize: 13, lineHeight: "20px", rightIconSize: 24 },
  xl: { height: 56, padding: "1rem", radius: radius.lg, fontSize: 18, lineHeight: "24px", rightIconSize: 24 },
};

const LEFT_ICON_SIZE = 22; // confirmed identical at md, lg and xl

const iconShadowFilter = `drop-shadow(0px 1px 0.5px ${elevation.e2[0].color}) drop-shadow(0px 3px 1.5px ${elevation.e2[0].color})`;
// Two distinct inset-overlay strengths, confirmed via get_design_context: the black-7 (7% alpha)
// variant dresses active_primary/active_primary_accent/active_neutral/active_neutral_inverse;
// `active` (plain) gets a visibly lighter black-4 (4% alpha) variant instead of no shadow at all
// — the previous implementation omitted `active`/`active_neutral`/`active_neutral_inverse`'s
// shadow entirely, which the deep-audit doc had (incorrectly) generalized as "no root shadow".
const restingInsetShadow = `inset 0px 1px 3px -2px ${color.white[50]}, inset 0px -1px 3px -2px rgba(0,0,0,0.07)`;
const activeInsetShadow = `inset 0px 1px 3px 0px ${color.white[50]}, inset 0px -1px 3px -2px rgba(0,0,0,0.04)`;

interface TypeStyle {
  defaultFill: string;
  hoverFill: string;
  border?: string;
  textColor: string;
  fontWeight: number;
  shadow?: string;
}

// docs/audit/sidebar-navigation-deep-audit.md §2, re-confirmed against a live Figma
// get_design_context pull — the full type x state (default/hover) matrix for all 6 types.
const TYPE_STYLE: Record<SidebarItemType, TypeStyle> = {
  active_primary: {
    defaultFill: color.primary[400], // Color/primary_med_em
    hoverFill: color.primary[500], // Color/primary_base — confirmed via get_design_context
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
    shadow: activeInsetShadow, // inset-only, no outer drop-shadow — confirmed via get_design_context
  },
  active_neutral: {
    defaultFill: color.black[950], // Color/inverse_white_neutral
    hoverFill: color.black[900], // alpha_88 (~88% opaque black) — confirmed via get_design_context
    textColor: color.white[950], // text/inverse_black_neutral
    fontWeight: 600,
    shadow: `0px 1px 1px -0.5px rgba(0,0,0,0.04), ${restingInsetShadow}`, // confirmed via get_design_context
  },
  active_neutral_inverse: {
    defaultFill: color.white[950], // Color/smoke_base
    hoverFill: color.gray[50], // Color/smoke_low — confirmed via get_design_context
    textColor: color.gray[950],
    fontWeight: 600,
    shadow: `0px 1px 1px -0.5px rgba(0,0,0,0.04), ${restingInsetShadow}`, // confirmed via get_design_context
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
  /** Forces a specific state (used by Storybook/playground controls to preview `hover` without a
   * pointer). Left unset, the real cursor drives it via onMouseEnter/onMouseLeave — consumers
   * don't need to wire hover up themselves. */
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
      state,
      leftIcon = true,
      rightIcon = true,
      tag = true,
      text = true,
      selectLeftIcon = null,
      selectRightIcon = null,
      tagContent,
      children,
      style,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref,
  ) => {
    const typeStyle = TYPE_STYLE[type];
    const tagStyle = TAG_STYLE[type];

    // `state` left unset (the normal case for real usage) → hover is driven by the actual
    // pointer. An explicit `state` (Storybook/playground controls) always wins, so a forced
    // preview never flickers back to whatever the cursor happens to be doing.
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

    const metrics = SIZE_METRICS[size];

    const computedStyle: CSSProperties = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: metrics.height,
      gap: "0.75rem", // spacing/12 — confirmed identical at all three sizes
      padding: metrics.padding,
      border: typeStyle.border ?? "none",
      borderRadius: metrics.radius,
      backgroundColor: isHover ? typeStyle.hoverFill : typeStyle.defaultFill,
      boxShadow: typeStyle.shadow,
      cursor: "pointer",
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
          <span style={{ width: LEFT_ICON_SIZE, height: LEFT_ICON_SIZE, flexShrink: 0, filter: iconShadowFilter }}>
            {selectLeftIcon}
          </span>
        )}
        {text && (
          <span
            style={{
              flex: "1 0 0",
              minWidth: 1,
              textAlign: "left",
              fontSize: metrics.fontSize,
              lineHeight: metrics.lineHeight,
              fontWeight: typeStyle.fontWeight,
              color: typeStyle.textColor,
            }}
          >
            {children ?? "Nav item"}
          </span>
        )}
        {rightIcon && (
          <span
            style={{
              width: metrics.rightIconSize,
              height: metrics.rightIconSize,
              flexShrink: 0,
              filter: iconShadowFilter,
            }}
          >
            {selectRightIcon}
          </span>
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
