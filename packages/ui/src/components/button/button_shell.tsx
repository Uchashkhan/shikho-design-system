// Internal shared DOM/layout renderer for all 8 button families — not exported from index.ts.
//
// docs/audit/buttons.md §14.2 confirms every family (including icon_button, in a single-icon-slot
// mode) shares one construction: a root flex row with an optional border/fill/outer-shadow, an
// optional left/right (or single) icon slot with the confirmed icon-shadow filter, a label span
// wrapped in its own additive-padding div, and — only when the type has an inset effect — a
// second, absolutely-positioned `inset-0` div carrying the inset-shadow layers. Centralizing this
// here is what §14.1/§14.3 mean by "avoid duplicating implementation where a confirmed shared base
// exists" — each family file only computes its own `ResolvedButtonStyle`/`ResolvedAiButtonStyle`
// and hands it to this shell.

import { type ButtonHTMLAttributes, type CSSProperties, type ReactNode, forwardRef } from "react";
import { iconShadowFilter, sizeMetrics, type ButtonSize, type ResolvedAiButtonStyle, type ResolvedButtonStyle } from "./shared";

export interface ButtonShellProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "color"> {
  size: ButtonSize;
  resolved: ResolvedButtonStyle | ResolvedAiButtonStyle;
  /** Text-button mode (7 of 8 families): independent left/right icon slots + label. */
  leftIcon?: boolean;
  rightIcon?: boolean;
  text?: boolean;
  selectLeftIcon?: ReactNode | null;
  selectRightIcon?: ReactNode | null;
  /** icon_button mode: a single fixed-square icon-only slot, no label. */
  iconOnly?: ReactNode;
  dataSize: string;
  dataType: string;
  dataState: string;
}

export const ButtonShell = forwardRef<HTMLButtonElement, ButtonShellProps>(
  (
    {
      size,
      resolved,
      leftIcon = true,
      rightIcon = true,
      text = true,
      selectLeftIcon = null,
      selectRightIcon = null,
      iconOnly,
      dataSize,
      dataType,
      dataState,
      className,
      style,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const metrics = sizeMetrics(size);
    // Defense in depth: every family's own style resolver (rampEmphasisStyle, iconButtonStyle,
    // etc.) is now guaranteed to return a real style rather than `undefined` for an unrecognized
    // variant value, but this unconditional `"filter" in resolved` is exactly the line that threw
    // (a TypeError on `undefined`, unmounting the whole app) when one of them didn't — so it gets
    // its own fallback too, rather than relying solely on every current and future caller getting
    // that right.
    const safeResolved: ResolvedButtonStyle | ResolvedAiButtonStyle = resolved ?? {
      background: "transparent",
      border: "1px solid currentColor",
      textColor: "inherit",
    };
    const filter = "filter" in safeResolved ? safeResolved.filter : undefined;

    const rootStyle: CSSProperties = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: metrics.rootGap,
      height: iconOnly !== undefined ? metrics.height : undefined,
      width: iconOnly !== undefined ? metrics.height : undefined,
      padding: metrics.padding,
      borderRadius: metrics.radius,
      background: safeResolved.background,
      border: safeResolved.border,
      boxShadow: safeResolved.boxShadow,
      filter,
      position: "relative",
      overflow: "hidden",
      cursor: "pointer",
      whiteSpace: "nowrap",
      fontSize: metrics.fontSize,
      lineHeight: metrics.lineHeight,
      fontWeight: 600,
      color: safeResolved.textColor,
      ...style,
    };

    const iconStyle: CSSProperties = {
      width: metrics.iconSize,
      height: metrics.iconSize,
      flexShrink: 0,
      filter: iconShadowFilter,
    };

    return (
      <button
        ref={ref}
        type="button"
        className={buttonBaseClassName + (className ? ` ${className}` : "")}
        style={rootStyle}
        disabled={disabled}
        data-size={dataSize}
        data-type={dataType}
        data-state={dataState}
        {...props}
      >
        {iconOnly !== undefined ? (
          <span style={iconStyle}>{iconOnly}</span>
        ) : (
          <>
            {leftIcon && <span style={iconStyle}>{selectLeftIcon}</span>}
            {text && (
              <span style={{ padding: `0 ${metrics.labelGap}px` }}>{children ?? "Button"}</span>
            )}
            {rightIcon && <span style={iconStyle}>{selectRightIcon}</span>}
          </>
        )}
        {safeResolved.insetShadow && (
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              borderRadius: "inherit",
              boxShadow: safeResolved.insetShadow,
            }}
          />
        )}
      </button>
    );
  },
);

ButtonShell.displayName = "ButtonShell";

const buttonBaseClassName =
  "select-none transition-colors outline-none disabled:cursor-not-allowed";
