import { type ButtonHTMLAttributes, type MouseEvent, type ReactNode, forwardRef, useState } from "react";
import { color, elevation, radius } from "@shikho/tokens";
import type { SidebarItemState, SidebarItemType } from "./sidebar_item";

// docs/audit/sidebar-navigation-deep-audit.md §4 — sidebar_item_collapsed: type (same 6 values
// as sidebar_item), state (default, hover). Confirmed no `size` property — one fixed 64×56 size.

const iconShadowFilter = `drop-shadow(0px 1px 0.5px ${elevation.e2[0].color}) drop-shadow(0px 3px 1.5px ${elevation.e2[0].color})`;
// Two distinct inset-overlay strengths, confirmed via get_design_context on the collapsed frame
// itself (66068:24628) — see sidebar_item.tsx for the matching full-size confirmation.
const restingInsetShadow = `inset 0px 1px 3px -2px ${color.white[50]}, inset 0px -1px 3px -2px rgba(0,0,0,0.07)`;
const activeInsetShadow = `inset 0px 1px 3px 0px ${color.white[50]}, inset 0px -1px 3px -2px rgba(0,0,0,0.04)`;

interface TypeStyle {
  defaultFill: string;
  hoverFill: string;
  border?: string;
  textColor: string;
  shadow?: string;
}

// docs/audit/sidebar-navigation-deep-audit.md §4, re-confirmed against a live Figma
// get_design_context pull — shares sidebar_item's confirmed type x state mapping.
const TYPE_STYLE: Record<SidebarItemType, TypeStyle> = {
  active_primary: {
    // Intentional deviation from Figma (see sidebar_item.tsx's identical note) — bumps the
    // default/hover pair one ramp step: 500/600 instead of the confirmed 400/500.
    defaultFill: color.primary[500],
    hoverFill: color.primary[600],
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
    shadow: activeInsetShadow,
  },
  active_neutral: {
    defaultFill: color.black[950],
    hoverFill: color.black[900], // alpha_88 — confirmed via get_design_context
    textColor: color.white[950],
    shadow: `0px 1px 1px -0.5px rgba(0,0,0,0.04), ${restingInsetShadow}`,
  },
  active_neutral_inverse: {
    defaultFill: color.white[950],
    hoverFill: color.gray[50], // Color/smoke_low — confirmed via get_design_context
    textColor: color.gray[950],
    shadow: `0px 1px 1px -0.5px rgba(0,0,0,0.04), ${restingInsetShadow}`,
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
  /** Forces a specific state (used by Storybook/playground controls to preview `hover` without a
   * pointer). Left unset, the real cursor drives it via onMouseEnter/onMouseLeave. */
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
  (
    { type = "inactive", state, icon = true, text = true, selectLeftIcon = null, children, style, onMouseEnter, onMouseLeave, ...props },
    ref,
  ) => {
    const typeStyle = TYPE_STYLE[type];

    // See sidebar_item.tsx for the rationale: unset `state` → real pointer drives hover;
    // an explicit `state` (Storybook/playground) always wins.
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

    return (
      <button
        ref={ref}
        type="button"
        data-type={type}
        data-state={isHover ? "hover" : "default"}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
