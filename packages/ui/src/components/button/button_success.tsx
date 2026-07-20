import { type ButtonHTMLAttributes, forwardRef } from "react";
import { color } from "@shikho/tokens";
import {
  buildButtonStyle,
  buttonBaseClassName,
  emphasisStyle,
  type ButtonSizeScaleA,
} from "./shared";

// docs/audit/buttons.md §2 — button_success: size xs/sm/md/lg/xl, type Outline/Secondary/Text/
// primary (mixed casing, preserved exactly as audited), state default/disabled/focus/hover
// (lowercase, per that family).
export type ButtonSuccessSize = ButtonSizeScaleA;
export type ButtonSuccessType = "Outline" | "Secondary" | "Text" | "primary";
export type ButtonSuccessState = "default" | "disabled" | "focus" | "hover";

export interface ButtonSuccessProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "color"> {
  size?: ButtonSuccessSize;
  type?: ButtonSuccessType;
  state?: ButtonSuccessState;
}

const emphasisByType: Record<ButtonSuccessType, "solid" | "soft" | "outline" | "text"> = {
  primary: "solid",
  Secondary: "soft",
  Outline: "outline",
  Text: "text",
};

/**
 * `button_success` family (docs/audit/buttons.md). Applies the same confirmed emphasis pattern
 * as `new_blue` against `Color/success` — no instance in this family was deep-audited, so the
 * per-emphasis treatment is derived, not independently confirmed. See
 * packages/ui/src/components/button/README.md.
 */
export const ButtonSuccess = forwardRef<HTMLButtonElement, ButtonSuccessProps>(
  ({ size = "xs", type = "primary", state = "default", className, disabled, ...props }, ref) => {
    const hover = state === "hover";
    const isDisabled = disabled || state === "disabled";

    const style = buildButtonStyle({
      size,
      radiusScale: "A",
      emphasisColor: emphasisStyle(color.success, emphasisByType[type], hover),
      focusRing: "success",
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

ButtonSuccess.displayName = "ButtonSuccess";
