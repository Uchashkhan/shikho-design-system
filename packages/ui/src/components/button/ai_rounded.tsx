import { type ButtonHTMLAttributes, forwardRef } from "react";
import { color, radius, type ColorRamp } from "@shikho/tokens";
import {
  buildButtonStyle,
  buttonBaseClassName,
  emphasisStyle,
  type ButtonSizeScaleB,
  type FocusRingName,
} from "./shared";

// docs/audit/buttons.md §2 — ai_rounded: size xs/sm/md/lg/xxl, type Green/Primary/Purple/
// "blue gradient", state Default/Disabled/Focus/Hover.
export type AiRoundedSize = ButtonSizeScaleB;
export type AiRoundedType = "Green" | "Primary" | "Purple" | "blue gradient";
export type AiRoundedState = "Default" | "Disabled" | "Focus" | "Hover";

export interface AiRoundedButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "color"> {
  size?: AiRoundedSize;
  type?: AiRoundedType;
  state?: AiRoundedState;
}

// `type` here is a literal color choice, not an emphasis level, so every value renders "solid".
// Green -> Color/success (visually green), Purple -> Color/Shikho AI (visually purple, per
// docs/audit/colors.md hex values). "blue gradient" has no resolved value anywhere in the audit
// (Gradient/G1-G6 never resolve, §7) — it falls back to the primary ramp as a solid color, which
// is a deliberate placeholder, not an attempt to approximate the gradient.
const rampByType: Record<AiRoundedType, ColorRamp> = {
  Primary: color.primary,
  Green: color.success,
  Purple: color.shikhoAi,
  "blue gradient": color.primary,
};

const focusRingByType: Record<AiRoundedType, FocusRingName> = {
  Primary: "primary",
  Green: "success",
  Purple: "primary", // no dedicated focus-ring color exists for the Shikho AI ramp
  "blue gradient": "primary",
};

/**
 * `ai_rounded` family (docs/audit/buttons.md). Only `Primary` reuses the confirmed `new_blue`
 * emphasis binding, via the shared primary ramp. `Green`/`Purple` are a derived, always-solid
 * color-choice mapping; `blue gradient` is an explicit unresolved-gradient placeholder. See
 * packages/ui/src/components/button/README.md.
 */
export const AiRoundedButton = forwardRef<HTMLButtonElement, AiRoundedButtonProps>(
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
        // "rounded" in the family name is treated as pill-shaped (radius.full) vs. ai_regular's
        // scale radius — a naming-derived assumption, not an independently confirmed binding.
        style={{ ...style, borderRadius: radius.full }}
        disabled={isDisabled}
        data-size={size}
        data-type={type}
        data-state={state}
        {...props}
      />
    );
  },
);

AiRoundedButton.displayName = "AiRoundedButton";
