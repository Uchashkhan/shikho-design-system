import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from "react";
import { color } from "@shikho/tokens";
import { rampEmphasisStyle, type ButtonPhase, type ButtonSizeScaleB, type Emphasis } from "./shared";
import { ButtonShell } from "./button_shell";

// docs/audit/buttons.md §2 — new_pink: size xs/sm/md/lg/xxl, type Outline/Primary/Secondary/Text,
// state Default/Disabled/Focus/Hover. Structurally identical to new_blue (§14.2), confirmed via
// new_pink/xs/Primary/Default: same border/effect/typography construction, only the fill ramp
// differs (Color/secondary/500 — the pink brand ramp, not Color/primary).
export type NewPinkSize = ButtonSizeScaleB;
export type NewPinkType = "Outline" | "Primary" | "Secondary" | "Text";
export type NewPinkState = "Default" | "Disabled" | "Focus" | "Hover";

export interface NewPinkButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "color"> {
  size?: NewPinkSize;
  type?: NewPinkType;
  state?: NewPinkState;
  leftIcon?: boolean;
  rightIcon?: boolean;
  text?: boolean;
  selectLeftIcon?: ReactNode | null;
  selectRightIcon?: ReactNode | null;
}

const emphasisByType: Record<NewPinkType, Emphasis> = {
  Primary: "solid",
  Secondary: "soft",
  Outline: "outline",
  Text: "text",
};

const phaseByState: Record<NewPinkState, ButtonPhase> = {
  Default: "default",
  Hover: "hover",
  Focus: "focus",
  Disabled: "disabled",
};

/**
 * `new_pink` button family (docs/audit/buttons.md §14) — confirmed structurally identical to
 * `new_blue`, with `Color/secondary` (the pink brand ramp) substituted for `Color/primary`.
 * `Secondary`/`Outline`/`Text`'s own hover/focus/disabled deltas were not independently
 * re-sampled for this family and reuse `new_blue`'s confirmed transition rules.
 */
export const NewPinkButton = forwardRef<HTMLButtonElement, NewPinkButtonProps>(
  ({ size = "xs", type = "Primary", state = "Default", disabled, ...props }, ref) => {
    const phase = disabled ? "disabled" : phaseByState[state];
    const resolved = rampEmphasisStyle(color.secondary, emphasisByType[type], phase, "secondary");

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

NewPinkButton.displayName = "NewPinkButton";
