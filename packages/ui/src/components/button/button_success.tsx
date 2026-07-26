import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from "react";
import { color } from "@shikho/tokens";
import { rampEmphasisStyle, type ButtonPhase, type ButtonSizeScaleA, type Emphasis } from "./shared";
import { ButtonShell } from "./button_shell";

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
  leftIcon?: boolean;
  rightIcon?: boolean;
  text?: boolean;
  selectLeftIcon?: ReactNode | null;
  selectRightIcon?: ReactNode | null;
}

const emphasisByType: Record<ButtonSuccessType, Emphasis> = {
  primary: "solid",
  Secondary: "soft",
  Outline: "outline",
  Text: "text",
};

const phaseByState: Record<ButtonSuccessState, ButtonPhase> = {
  default: "default",
  hover: "hover",
  focus: "focus",
  disabled: "disabled",
};

/**
 * `button_success` family (docs/audit/buttons.md §14) — confirmed structurally identical to
 * `new_blue` against `Color/success`, with one confirmed family-specific exception: `disabled`
 * renders a flat neutral `Color/gray/100` fill (re-confirmed via a second, independent fetch),
 * not the tinted `success/100`/`success/50` a plain ramp-rank reading would predict.
 */
export const ButtonSuccess = forwardRef<HTMLButtonElement, ButtonSuccessProps>(
  ({ size = "xs", type = "primary", state = "default", disabled, ...props }, ref) => {
    const phase = disabled ? "disabled" : phaseByState[state];

    let resolved = rampEmphasisStyle(color.success, emphasisByType[type], phase, "success");
    if (phase === "disabled") {
      // docs/audit/buttons.md §14.2 — confirmed exception: button_success's disabled fill is a
      // flat neutral gray, not a tinted success color.
      resolved = { ...resolved, background: color.gray[100], border: "none", textColor: color.gray[400] };
    }

    return (
      <ButtonShell
        ref={ref}
        size={size}
        resolved={resolved}
        disabled={phase === "disabled"}
        dataSize={size}
        dataType={type}
        dataState={state}
        {...props}
      />
    );
  },
);

ButtonSuccess.displayName = "ButtonSuccess";
