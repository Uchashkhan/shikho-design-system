import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from "react";
import { aiGradientStyle, type AiGradientType, type ButtonPhase, type ButtonSizeScaleB } from "./shared";
import { ButtonShell } from "./button_shell";

// docs/audit/buttons.md §2, §4 — ai_regular: size xs/sm/md/lg/xxl, type Green/Primary/
// "blue gradient"/purple (lowercase "purple" here vs. "Purple" in ai_rounded — a confirmed
// casing inconsistency between the two sibling families, preserved as-is), state Default/
// Disabled/Focus/Hover.
export type AiRegularSize = ButtonSizeScaleB;
export type AiRegularType = "Green" | "Primary" | "blue gradient" | "purple";
export type AiRegularState = "Default" | "Disabled" | "Focus" | "Hover";

export interface AiRegularButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "color"> {
  size?: AiRegularSize;
  type?: AiRegularType;
  state?: AiRegularState;
  leftIcon?: boolean;
  rightIcon?: boolean;
  text?: boolean;
  selectLeftIcon?: ReactNode | null;
  selectRightIcon?: ReactNode | null;
}

const phaseByState: Record<AiRegularState, ButtonPhase> = {
  Default: "default",
  Hover: "hover",
  Focus: "focus",
  Disabled: "disabled",
};

// ai_regular's lowercase "purple" maps to the same confirmed AiGradientType key as ai_rounded's
// capitalized "Purple" — same gradient definition, both directly confirmed (§14.3).
const typeKey: Record<AiRegularType, AiGradientType> = {
  Primary: "Primary",
  Green: "Green",
  purple: "Purple",
  "blue gradient": "blue gradient",
};

/**
 * `ai_regular` family (docs/audit/buttons.md §14.3) — confirmed to share the exact same 4
 * gradient definitions as `ai_rounded` (identical stop colors/angles, re-confirmed directly on
 * `Primary`), but keeps the ordinary scale radius (confirmed `radius.xs`=6 at `xs`, not a pill)
 * instead of `ai_rounded`'s confirmed height/2 pill shape — the one confirmed difference between
 * these two otherwise-identical sibling families.
 */
export const AiRegularButton = forwardRef<HTMLButtonElement, AiRegularButtonProps>(
  ({ size = "xs", type = "Primary", state = "Default", disabled, ...props }, ref) => {
    const phase = disabled ? "disabled" : phaseByState[state];
    const resolved = aiGradientStyle(typeKey[type], phase);

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

AiRegularButton.displayName = "AiRegularButton";
