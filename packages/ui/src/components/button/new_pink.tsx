import { type ButtonHTMLAttributes, forwardRef } from "react";
import { color } from "@shikho/tokens";
import {
  buildButtonStyle,
  buttonBaseClassName,
  emphasisStyle,
  type ButtonSizeScaleB,
} from "./shared";

// docs/audit/buttons.md §2 — new_pink: size xs/sm/md/lg/xxl, type Outline/Primary/Secondary/Text,
// state Default/Disabled/Focus/Hover. Same property vocabulary as new_blue, different base color.
export type NewPinkSize = ButtonSizeScaleB;
export type NewPinkType = "Outline" | "Primary" | "Secondary" | "Text";
export type NewPinkState = "Default" | "Disabled" | "Focus" | "Hover";

export interface NewPinkButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "color"> {
  size?: NewPinkSize;
  type?: NewPinkType;
  state?: NewPinkState;
}

const emphasisByType: Record<NewPinkType, "solid" | "soft" | "outline" | "text"> = {
  Primary: "solid",
  Secondary: "soft",
  Outline: "outline",
  Text: "text",
};

/**
 * `new_pink` button family (docs/audit/buttons.md). No instance in this family was deep-audited;
 * it reuses `new_blue`'s confirmed emphasis pattern against `Color/Secondary` (the pink brand
 * ramp — docs/audit/colors.md), which is the ramp its own family name refers to. See
 * packages/ui/src/components/button/README.md.
 */
export const NewPinkButton = forwardRef<HTMLButtonElement, NewPinkButtonProps>(
  ({ size = "xs", type = "Primary", state = "Default", className, disabled, ...props }, ref) => {
    const hover = state === "Hover";
    const isDisabled = disabled || state === "Disabled";

    const style = buildButtonStyle({
      size,
      radiusScale: "B",
      emphasisColor: emphasisStyle(color.secondary, emphasisByType[type], hover),
      focusRing: "secondary",
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

NewPinkButton.displayName = "NewPinkButton";
