import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from "react";
import { radius } from "@shikho/tokens";
import { aiGradientStyle, type AiGradientType, type ButtonPhase, type ButtonSizeScaleB } from "./shared";
import { ButtonShell } from "./button_shell";

// docs/audit/buttons.md §2, §14.3 — ai_rounded: size xs/sm/md/lg/xxl, type Green/Primary/Purple/
// "blue gradient", state Default/Disabled/Focus/Hover.
export type AiRoundedSize = ButtonSizeScaleB;
export type AiRoundedType = "Green" | "Primary" | "Purple" | "blue gradient";
export type AiRoundedState = "Default" | "Disabled" | "Focus" | "Hover";

export interface AiRoundedButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "color"> {
  size?: AiRoundedSize;
  type?: AiRoundedType;
  state?: AiRoundedState;
  leftIcon?: boolean;
  rightIcon?: boolean;
  text?: boolean;
  selectLeftIcon?: ReactNode | null;
  selectRightIcon?: ReactNode | null;
}

const phaseByState: Record<AiRoundedState, ButtonPhase> = {
  Default: "default",
  Hover: "hover",
  Focus: "focus",
  Disabled: "disabled",
};

/**
 * `ai_rounded` family (docs/audit/buttons.md §14.3) — all 4 types are confirmed real CSS
 * gradients (2 linear, 1 radial), not solid ramp fills as the pre-rebuild implementation assumed.
 * `Purple`'s gradient is a documented, non-pixel-exact CSS approximation of Figma's confirmed
 * affine-transformed radial gradient (§14.3). Radius is confirmed to be a true pill at every
 * size (height/2, independently confirmed at both `xs` and `lg`) — `radius.full` reproduces that
 * exactly since it's larger than any button's own height/2.
 */
export const AiRoundedButton = forwardRef<HTMLButtonElement, AiRoundedButtonProps>(
  ({ size = "xs", type = "Primary", state = "Default", disabled, style, ...props }, ref) => {
    const phase = disabled ? "disabled" : phaseByState[state];
    const resolved = aiGradientStyle(type as AiGradientType, phase);

    return (
      <ButtonShell
        ref={ref}
        size={size}
        resolved={resolved}
        disabled={phase === "disabled"}
        style={{ borderRadius: radius.full, ...style }}
        dataSize={size}
        dataType={type}
        dataState={state}
        {...props}
      />
    );
  },
);

AiRoundedButton.displayName = "AiRoundedButton";
