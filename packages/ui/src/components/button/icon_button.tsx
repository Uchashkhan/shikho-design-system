import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from "react";
import { color, type ColorRamp } from "@shikho/tokens";
import {
  buildButtonStyle,
  buttonBaseClassName,
  emphasisStyle,
  type ButtonSizeScaleA,
  type Emphasis,
  type FocusRingName,
} from "./shared";

// docs/audit/buttons.md §2 — icon_button: size xs/sm/md/lg/xl, type neutral/primary/
// primary_light/quaternary/secondary/tertiary/tertiary_light (7 values, the largest type
// vocabulary of the 8 families), state default/disabled/focus/hover.
export type IconButtonSize = ButtonSizeScaleA;
export type IconButtonType =
  | "neutral"
  | "primary"
  | "primary_light"
  | "quaternary"
  | "secondary"
  | "tertiary"
  | "tertiary_light";
export type IconButtonState = "default" | "disabled" | "focus" | "hover";

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "color"> {
  size?: IconButtonSize;
  type?: IconButtonType;
  state?: IconButtonState;
  /**
   * The icon to render. Required because `icon_button` is icon-only and @shikho/icons has no
   * glyphs implemented yet (docs/npm-design-system-implementation-plan.md §2.3) — this mirrors
   * the instance-swap `ReactNode`-slot pattern the audit found used system-wide for icon slots.
   */
  icon: ReactNode;
  "aria-label": string;
}

// No instance in this family was deep-audited (§11 — internal layer hierarchy unresolved for
// every one of the 8 sets). This is a derived, minimal color-choice + emphasis mapping:
// `_light` suffix -> "soft" emphasis of the same ramp as its non-light sibling; `quaternary`
// mirrors `link`'s same-named type value (docs/audit/links.md — the one confirmed deliberate
// cross-component naming reuse in the whole audit series), treated here as a ghost/text style.
const styleByType: Record<IconButtonType, { ramp: ColorRamp; emphasis: Emphasis }> = {
  primary: { ramp: color.primary, emphasis: "solid" },
  primary_light: { ramp: color.primary, emphasis: "soft" },
  secondary: { ramp: color.secondary, emphasis: "solid" },
  tertiary: { ramp: color.gray, emphasis: "soft" },
  tertiary_light: { ramp: color.gray, emphasis: "text" },
  neutral: { ramp: color.gray, emphasis: "solid" },
  quaternary: { ramp: color.gray, emphasis: "text" },
};

const focusRingByType: Record<IconButtonType, FocusRingName> = {
  primary: "primary",
  primary_light: "primary",
  secondary: "secondary",
  tertiary: "gray",
  tertiary_light: "gray",
  neutral: "gray",
  quaternary: "gray",
};

/**
 * `icon_button` family (docs/audit/buttons.md). See
 * packages/ui/src/components/button/README.md for the derived color/emphasis mapping.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { size = "xs", type = "primary", state = "default", icon, className, disabled, ...props },
    ref,
  ) => {
    const hover = state === "hover";
    const isDisabled = disabled || state === "disabled";
    const { ramp, emphasis } = styleByType[type];

    const style = buildButtonStyle({
      size,
      radiusScale: "A",
      emphasisColor: emphasisStyle(ramp, emphasis, hover),
      focusRing: focusRingByType[type],
      isFocusVariant: state === "focus",
    });

    return (
      <button
        ref={ref}
        type="button"
        className={buttonBaseClassName + (className ? ` ${className}` : "")}
        style={{ ...style, padding: style.padding, aspectRatio: "1 / 1" }}
        disabled={isDisabled}
        data-size={size}
        data-type={type}
        data-state={state}
        {...props}
      >
        {icon}
      </button>
    );
  },
);

IconButton.displayName = "IconButton";
