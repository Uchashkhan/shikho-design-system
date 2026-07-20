import { type ButtonHTMLAttributes, forwardRef } from "react";
import { color } from "@shikho/tokens";
import {
  buildButtonStyle,
  buttonBaseClassName,
  emphasisStyle,
  type ButtonSizeScaleA,
} from "./shared";

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
}

const emphasisByType: Record<GreyscaleType, "solid" | "soft" | "outline" | "text"> = {
  primary: "solid",
  Secondary: "soft",
  Outline: "outline",
  Text: "text",
};

/**
 * `Greyscale` family (docs/audit/buttons.md). Applies the confirmed emphasis pattern against
 * `Color/gray` — no instance in this family was deep-audited. See
 * packages/ui/src/components/button/README.md.
 */
export const GreyscaleButton = forwardRef<HTMLButtonElement, GreyscaleButtonProps>(
  ({ size = "xs", type = "primary", state = "default", className, disabled, ...props }, ref) => {
    const hover = state === "hover";
    const isDisabled = disabled || state === "disabled";

    const style = buildButtonStyle({
      size,
      radiusScale: "A",
      emphasisColor: emphasisStyle(color.gray, emphasisByType[type], hover),
      focusRing: "gray",
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

GreyscaleButton.displayName = "GreyscaleButton";
