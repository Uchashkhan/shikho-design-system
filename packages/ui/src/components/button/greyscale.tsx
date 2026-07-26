import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from "react";
import { color } from "@shikho/tokens";
import { greyscalePrimaryStyle, rampEmphasisStyle, type ButtonPhase, type ButtonSizeScaleA, type Emphasis } from "./shared";
import { ButtonShell } from "./button_shell";

// docs/audit/buttons.md §2 — Greyscale: size xs/sm/md/lg/xl, type Outline/Secondary/Text/primary,
// state default/disabled/focus/hover.
export type GreyscaleSize = ButtonSizeScaleA;
export type GreyscaleType = "Outline" | "Secondary" | "Text" | "primary";
export type GreyscaleState = "default" | "disabled" | "focus" | "hover";

export interface GreyscaleButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "color"> {
  size?: GreyscaleSize;
  type?: GreyscaleType;
  state?: GreyscaleState;
  leftIcon?: boolean;
  rightIcon?: boolean;
  text?: boolean;
  selectLeftIcon?: ReactNode | null;
  selectRightIcon?: ReactNode | null;
}

const emphasisByType: Record<Exclude<GreyscaleType, "primary">, Emphasis> = {
  Secondary: "soft",
  Outline: "outline",
  Text: "text",
};

const phaseByState: Record<GreyscaleState, ButtonPhase> = {
  default: "default",
  hover: "hover",
  focus: "focus",
  disabled: "disabled",
};

/**
 * `Greyscale` family (docs/audit/buttons.md §14). `type="primary"` is confirmed to fill
 * `Color/black[900]` (rgba(0,0,0,0.88), near-black) — NOT `color.gray[500]`, the pre-rebuild
 * implementation's guess (§14.1 point 4) — visually identical in kind to `icon_button`'s
 * `neutral` type and Switcher's `active_neutral`. `Secondary`/`Outline`/`Text` were not
 * independently re-sampled for this family and still derive from the gray ramp.
 */
export const GreyscaleButton = forwardRef<HTMLButtonElement, GreyscaleButtonProps>(
  ({ size = "xs", type = "primary", state = "default", disabled, ...props }, ref) => {
    const phase = disabled ? "disabled" : phaseByState[state];

    const resolved =
      type === "primary"
        ? greyscalePrimaryStyle(phase)
        : rampEmphasisStyle(color.gray, emphasisByType[type], phase, "gray");

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

GreyscaleButton.displayName = "GreyscaleButton";
