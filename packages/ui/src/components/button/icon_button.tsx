import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from "react";
import { iconButtonStyle, type ButtonPhase, type ButtonSizeScaleA, type IconButtonType as IconButtonTypeValue } from "./shared";
import { ButtonShell } from "./button_shell";

// docs/audit/buttons.md §2, §14.2 — icon_button: size xs/sm/md/lg/xl, type neutral/primary/
// primary_light/quaternary/secondary/tertiary/tertiary_light (7 values, the largest type
// vocabulary of the 8 families), state default/disabled/focus/hover.
export type IconButtonSize = ButtonSizeScaleA;
export type IconButtonType = IconButtonTypeValue;
export type IconButtonState = "default" | "disabled" | "focus" | "hover";

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "color"> {
  size?: IconButtonSize;
  type?: IconButtonType;
  state?: IconButtonState;
  /**
   * The icon to render. Required because `icon_button` is icon-only and @shikho/icons has no
   * glyphs implemented yet (docs/npm-design-system-implementation-plan.md §2.3) — this mirrors
   * the instance-swap `ReactNode`-slot pattern the audit found used system-wide for icon slots.
   */
  icon: ReactNode;
  "aria-label": string;
}

const phaseByState: Record<IconButtonState, ButtonPhase> = {
  default: "default",
  hover: "hover",
  focus: "focus",
  disabled: "disabled",
};

/**
 * `icon_button` family (docs/audit/buttons.md §14.2) — a genuinely distinct structure from the
 * other 7 families: a single fixed-square icon slot (not left/right), its own confirmed 7-type
 * color mapping. `secondary` is confirmed a neutral `Color/gray/100` fill, NOT the pink
 * `Color/secondary` brand ramp the pre-rebuild implementation guessed from the type name
 * (§14.1 point 3) — one of the clearest corrections in this rebuild. `primary_light`/
 * `tertiary_light` were not independently sampled and are derived (§14.4).
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ size = "xs", type = "primary", state = "default", icon, disabled, ...props }, ref) => {
    const phase = disabled ? "disabled" : phaseByState[state];
    const resolved = iconButtonStyle(type, phase);

    return (
      <ButtonShell
        ref={ref}
        size={size}
        resolved={resolved}
        iconOnly={icon}
        disabled={phase === "disabled"}
        dataSize={size}
        dataType={type}
        dataState={state}
        {...props}
      />
    );
  },
);

IconButton.displayName = "IconButton";
