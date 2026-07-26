import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from "react";
import { color } from "@shikho/tokens";
import { rampEmphasisStyle, type ButtonPhase, type ButtonSizeScaleA, type Emphasis } from "./shared";
import { ButtonShell } from "./button_shell";

// docs/audit/buttons.md §2 — button_danger: size xs/sm/md/lg/xl, type Secondary/Text/primary/
// tertiary (no "Outline" in this family, unlike button_success/Greyscale — §4), state
// default/disabled/focus/hover (lowercase).
export type ButtonDangerSize = ButtonSizeScaleA;
export type ButtonDangerType = "Secondary" | "Text" | "primary" | "tertiary";
export type ButtonDangerState = "default" | "disabled" | "focus" | "hover";

export interface ButtonDangerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "color"> {
  size?: ButtonDangerSize;
  type?: ButtonDangerType;
  state?: ButtonDangerState;
  leftIcon?: boolean;
  rightIcon?: boolean;
  text?: boolean;
  selectLeftIcon?: ReactNode | null;
  selectRightIcon?: ReactNode | null;
}

// docs/audit/buttons.md §2, §14.4 — `tertiary` has no direct counterpart in any other family;
// it's implemented using the confirmed `outline`-shape construction (transparent fill, solid
// ramp-colored border) as the closest structural analogue — derived, not independently sampled.
const emphasisByType: Record<ButtonDangerType, Emphasis> = {
  primary: "solid",
  Secondary: "soft",
  tertiary: "outline",
  Text: "text",
};

const phaseByState: Record<ButtonDangerState, ButtonPhase> = {
  default: "default",
  hover: "hover",
  focus: "focus",
  disabled: "disabled",
};

// docs/audit/alerts.md §11 — the deep audit of `alert`/state=danger found its nested action
// button's literal instance path is `button_danger/md/secondary/default`, giving this family's
// only exactly confirmed non-`new_blue`-derived styling: fill `Color/gray/100`, label color
// `text/danger-600`. This overrides the generic `rampEmphasisStyle` soft treatment for
// `type="Secondary"` at `state="default"`/`"hover"` specifically — do not revert without new data.
const confirmedSecondaryDefault = { background: color.gray[100], border: "1px solid transparent", textColor: color.danger[600] };
const confirmedSecondaryHover = { ...confirmedSecondaryDefault, background: color.gray[200] }; // one step darker — derived, hover itself unconfirmed

/**
 * `button_danger` family (docs/audit/buttons.md §14). This is the family whose focus ring the
 * audit confirms is buggy in Figma — `outline/focus_danger` is bound to the Secondary brand
 * color, not a danger color (§13). This component uses the *corrected* `focusRingColor.danger`
 * from @shikho/tokens (docs/token-normalization-decisions.md §10), not Figma's own binding.
 */
export const ButtonDanger = forwardRef<HTMLButtonElement, ButtonDangerProps>(
  ({ size = "md", type = "Secondary", state = "default", disabled, style, ...props }, ref) => {
    const phase = disabled ? "disabled" : phaseByState[state];

    let resolved = rampEmphasisStyle(color.danger, emphasisByType[type], phase, "danger");
    if (type === "Secondary" && (phase === "default" || phase === "hover")) {
      resolved = { ...resolved, ...(phase === "hover" ? confirmedSecondaryHover : confirmedSecondaryDefault) };
    }

    return (
      <ButtonShell
        ref={ref}
        size={size}
        resolved={resolved}
        disabled={phase === "disabled"}
        // Merged, not replaced — lets a composing component (e.g. Toast, docs/audit/toasts.md
        // §11: the same nested button_danger renders with a different confirmed fill there)
        // override one property without discarding every other confirmed style.
        style={style}
        dataSize={size}
        dataType={type}
        dataState={state}
        {...props}
      />
    );
  },
);

ButtonDanger.displayName = "ButtonDanger";
