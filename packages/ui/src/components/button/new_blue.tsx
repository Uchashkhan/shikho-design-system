import { type ButtonHTMLAttributes, forwardRef } from "react";
import { color } from "@shikho/tokens";
import {
  buildButtonStyle,
  buttonBaseClassName,
  emphasisStyle,
  type ButtonSizeScaleB,
} from "./shared";

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
}

const emphasisByType: Record<NewBlueType, "solid" | "soft" | "outline" | "text"> = {
  Primary: "solid", // confirmed: new_blue/xs/Primary/Default -> Color/primary/500 fill (§8)
  Secondary: "soft",
  Outline: "outline",
  Text: "text",
};

/**
 * `new_blue` button family (docs/audit/buttons.md). Only `size=xs, type=Primary, state=Default`
 * has a fully confirmed styling binding; other combinations derive from the same confirmed
 * `Color/primary` ramp — see packages/ui/src/components/button/README.md.
 */
export const NewBlueButton = forwardRef<HTMLButtonElement, NewBlueButtonProps>(
  ({ size = "xs", type = "Primary", state = "Default", className, disabled, ...props }, ref) => {
    const hover = state === "Hover";
    const isDisabled = disabled || state === "Disabled";

    const style = buildButtonStyle({
      size,
      radiusScale: "B",
      emphasisColor: emphasisStyle(color.primary, emphasisByType[type], hover),
      focusRing: "primary",
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

NewBlueButton.displayName = "NewBlueButton";
