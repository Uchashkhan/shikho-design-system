import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from "react";
import { color } from "@shikho/tokens";
import { rampEmphasisStyle, type ButtonPhase, type ButtonSizeScaleB, type Emphasis } from "./shared";
import { ButtonShell } from "./button_shell";

// docs/audit/buttons.md §2 — new_blue: size xs/sm/md/lg/xxl, type Outline/Primary/Secondary/Text,
// state Default/Disabled/Focus/Hover (capitalized, per that family). Casing preserved exactly.
export type NewBlueSize = ButtonSizeScaleB;
export type NewBlueType = "Outline" | "Primary" | "Secondary" | "Text";
export type NewBlueState = "Default" | "Disabled" | "Focus" | "Hover";

export interface NewBlueButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "color"> {
  size?: NewBlueSize;
  type?: NewBlueType;
  state?: NewBlueState;
  leftIcon?: boolean;
  rightIcon?: boolean;
  text?: boolean;
  selectLeftIcon?: ReactNode | null;
  selectRightIcon?: ReactNode | null;
}

const emphasisByType: Record<NewBlueType, Emphasis> = {
  Primary: "solid",
  Secondary: "soft",
  Outline: "outline",
  Text: "text",
};

const phaseByState: Record<NewBlueState, ButtonPhase> = {
  Default: "default",
  Hover: "hover",
  Focus: "focus",
  Disabled: "disabled",
};

/**
 * `new_blue` button family (docs/audit/buttons.md §14 deep re-audit) — the anchor family every
 * other ramp-based button was cross-checked against. `Primary`/`Secondary`/`Outline`/`Text` are
 * all directly confirmed at every size; `hover`/`focus`/`disabled` deltas are directly confirmed
 * on `Primary`/`Outline` and applied uniformly per `rampEmphasisStyle`'s documented rules.
 */
export const NewBlueButton = forwardRef<HTMLButtonElement, NewBlueButtonProps>(
  ({ size = "xs", type = "Primary", state = "Default", disabled, ...props }, ref) => {
    const phase = disabled ? "disabled" : phaseByState[state];
    const resolved = rampEmphasisStyle(color.primary, emphasisByType[type], phase, "primary");

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

NewBlueButton.displayName = "NewBlueButton";
