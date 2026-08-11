import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from "react";
import { color } from "@shikho/tokens";
import { rampEmphasisStyle, type ButtonPhase, type ButtonSizeScaleA, type Emphasis } from "./shared";
import { ButtonShell } from "./button_shell";

// docs/audit/buttons.md §2 — button_success: size xs/sm/md/lg/xl, type Outline/Secondary/Text/
// primary (mixed casing, preserved exactly as audited), state default/disabled/focus/hover
// (lowercase, per that family).
export type ButtonSuccessSize = ButtonSizeScaleA;
export type ButtonSuccessType = "Outline" | "Secondary" | "Text" | "primary";
export type ButtonSuccessState = "default" | "disabled" | "focus" | "hover";

export interface ButtonSuccessProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "color"> {
  size?: ButtonSuccessSize;
  type?: ButtonSuccessType;
  state?: ButtonSuccessState;
  leftIcon?: boolean;
  rightIcon?: boolean;
  text?: boolean;
  selectLeftIcon?: ReactNode | null;
  selectRightIcon?: ReactNode | null;
}

const emphasisByType: Record<ButtonSuccessType, Emphasis> = {
  primary: "solid",
  Secondary: "soft",
  Outline: "outline",
  Text: "text",
};

const phaseByState: Record<ButtonSuccessState, ButtonPhase> = {
  default: "default",
  hover: "hover",
  focus: "focus",
  disabled: "disabled",
};

// docs/audit/alerts.md §14 — a fresh get_design_context re-pull on node 66071:28159 (the nested
// `button_success/md/secondary/default` inside `alert`/state=success) confirms the exact same
// non-tinted construction already confirmed for `button_danger`'s Secondary type: flat
// `Color/gray/100` fill, `text/success-600` label — NOT the generic ramp-derived "soft" green
// tint `rampEmphasisStyle` produces for every other family. Mirrors button_danger.tsx's own
// `confirmedSecondaryDefault`/`confirmedSecondaryHover` override — do not revert without new data.
const confirmedSecondaryDefault = { background: color.gray[100], border: "1px solid transparent", textColor: color.success[600] };
const confirmedSecondaryHover = { ...confirmedSecondaryDefault, background: color.gray[200] }; // one step darker — derived, hover itself unconfirmed

/**
 * `button_success` family (docs/audit/buttons.md §14) — confirmed structurally identical to
 * `new_blue` against `Color/success`, with two confirmed family-specific exceptions: `disabled`
 * renders a flat neutral `Color/gray/100` fill (re-confirmed via a second, independent fetch),
 * not the tinted `success/100`/`success/50` a plain ramp-rank reading would predict; and
 * `type="Secondary"` at `default`/`hover` is also a flat neutral `gray/100`/`gray/200` fill with
 * `success-600` text, not the generic ramp-derived soft green tint (docs/audit/alerts.md §14).
 */
export const ButtonSuccess = forwardRef<HTMLButtonElement, ButtonSuccessProps>(
  ({ size = "xs", type = "primary", state = "default", disabled, ...props }, ref) => {
    const phase = disabled ? "disabled" : phaseByState[state];

    let resolved = rampEmphasisStyle(color.success, emphasisByType[type], phase, "success");
    if (type === "Secondary" && (phase === "default" || phase === "hover")) {
      resolved = { ...resolved, ...(phase === "hover" ? confirmedSecondaryHover : confirmedSecondaryDefault) };
    }
    if (phase === "disabled") {
      // docs/audit/buttons.md §14.2 — confirmed exception: button_success's disabled fill is a
      // flat neutral gray, not a tinted success color.
      resolved = { ...resolved, background: color.gray[100], border: "none", textColor: color.gray[400] };
    }

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

ButtonSuccess.displayName = "ButtonSuccess";
