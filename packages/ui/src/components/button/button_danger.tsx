import { type ButtonHTMLAttributes, forwardRef } from "react";
import { color } from "@shikho/tokens";
import {
  buildButtonStyle,
  buttonBaseClassName,
  emphasisStyle,
  type ButtonSizeScaleA,
} from "./shared";

// docs/audit/buttons.md §2 — button_danger: size xs/sm/md/lg/xl, type Secondary/Text/primary/
// tertiary (no "Outline" in this family, unlike button_success/Greyscale — §4), state
// default/disabled/focus/hover (lowercase).
export type ButtonDangerSize = ButtonSizeScaleA;
export type ButtonDangerType = "Secondary" | "Text" | "primary" | "tertiary";
export type ButtonDangerState = "default" | "disabled" | "focus" | "hover";

export interface ButtonDangerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "color"> {
  size?: ButtonDangerSize;
  type?: ButtonDangerType;
  state?: ButtonDangerState;
}

const emphasisByType: Record<ButtonDangerType, "solid" | "soft" | "outline" | "text"> = {
  primary: "solid",
  Secondary: "soft",
  tertiary: "outline",
  Text: "text",
};

/**
 * `button_danger` family (docs/audit/buttons.md). This is the family whose focus ring the audit
 * confirms is buggy in Figma — `outline/focus_danger` is bound to the Secondary brand color, not
 * a danger color (§13). This component uses the *corrected* `focusRingColor.danger` from
 * @shikho/tokens (docs/token-normalization-decisions.md §10) — the fix approved for code, not
 * for Figma.
 */
export const ButtonDanger = forwardRef<HTMLButtonElement, ButtonDangerProps>(
  ({ size = "xs", type = "primary", state = "default", className, disabled, ...props }, ref) => {
    const hover = state === "hover";
    const isDisabled = disabled || state === "disabled";

    const style = buildButtonStyle({
      size,
      radiusScale: "A",
      emphasisColor: emphasisStyle(color.danger, emphasisByType[type], hover),
      focusRing: "danger",
      isFocusVariant: state === "focus",
    });

    return (
      <button
        ref={ref}
        type="button"
        className={buttonBaseClassName + (className ? ` ${className}` : "")}
        style={style}
        disabled={isDisabled}
        data-size={size}
        data-type={type}
        data-state={state}
        {...props}
      />
    );
  },
);

ButtonDanger.displayName = "ButtonDanger";
