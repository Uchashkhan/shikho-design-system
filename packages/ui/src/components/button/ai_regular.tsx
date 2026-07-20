import { type ButtonHTMLAttributes, forwardRef } from "react";
import { color, type ColorRamp } from "@shikho/tokens";
import {
  buildButtonStyle,
  buttonBaseClassName,
  emphasisStyle,
  type ButtonSizeScaleB,
  type FocusRingName,
} from "./shared";

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
}

// Same derived color-choice mapping as ai_rounded — see that file's comment.
const rampByType: Record<AiRegularType, ColorRamp> = {
  Primary: color.primary,
  Green: color.success,
  purple: color.shikhoAi,
  "blue gradient": color.primary,
};

const focusRingByType: Record<AiRegularType, FocusRingName> = {
  Primary: "primary",
  Green: "success",
  purple: "primary",
  "blue gradient": "primary",
};

/**
 * `ai_regular` family (docs/audit/buttons.md) — same derivation as `ai_rounded` (see
 * packages/ui/src/components/button/README.md), but keeps the token-driven scale radius
 * instead of a pill shape, per the "regular" vs. "rounded" naming distinction.
 */
export const AiRegularButton = forwardRef<HTMLButtonElement, AiRegularButtonProps>(
  ({ size = "xs", type = "Primary", state = "Default", className, disabled, ...props }, ref) => {
    const hover = state === "Hover";
    const isDisabled = disabled || state === "Disabled";

    const style = buildButtonStyle({
      size,
      radiusScale: "B",
      emphasisColor: emphasisStyle(rampByType[type], "solid", hover),
      focusRing: focusRingByType[type],
      isFocusVariant: state === "Focus",
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

AiRegularButton.displayName = "AiRegularButton";
