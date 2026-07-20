import { type ButtonHTMLAttributes, type CSSProperties, forwardRef } from "react";
import { color } from "@shikho/tokens";
import {
  buildButtonStyle,
  buttonBaseClassName,
  emphasisStyle,
  type ButtonSizeScaleA,
} from "./shared";

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
}

const emphasisByType: Record<ButtonDangerType, "solid" | "soft" | "outline" | "text"> = {
  primary: "solid",
  Secondary: "soft", // overridden below with confirmed exact values — kept here only as a fallback shape
  tertiary: "outline",
  Text: "text",
};

// docs/audit/alerts.md §11 — the deep audit of `alert`/state=danger found its nested action
// button's literal instance path is `button_danger/md/secondary/default`, giving this family's
// first-ever exactly confirmed Secondary-type styling: fill `Color/gray/100`, label color
// `text/danger-600`. This corrects the earlier derived "soft danger-tinted" placeholder — do not
// revert to `emphasisStyle(color.danger, "soft", hover)` for this one type without new data.
const confirmedSecondaryStyle: CSSProperties = {
  backgroundColor: color.gray[100],
  color: color.danger[600],
  border: "1px solid transparent",
};
const confirmedSecondaryHoverStyle: CSSProperties = {
  ...confirmedSecondaryStyle,
  backgroundColor: color.gray[200], // one step darker — derived, hover itself was not in the confirmed instance
};

/**
 * `button_danger` family (docs/audit/buttons.md). This is the family whose focus ring the audit
 * confirms is buggy in Figma — `outline/focus_danger` is bound to the Secondary brand color, not
 * a danger color (§13). This component uses the *corrected* `focusRingColor.danger` from
 * @shikho/tokens (docs/token-normalization-decisions.md §10) — the fix approved for code, not
 * for Figma.
 *
 * `type="Secondary"` uses an exactly confirmed fill/text combination sourced from
 * `docs/audit/alerts.md` §11 (see `confirmedSecondaryStyle` above) rather than the generic
 * derived "soft" emphasis every other family's Secondary-equivalent type still uses.
 */
export const ButtonDanger = forwardRef<HTMLButtonElement, ButtonDangerProps>(
  (
    { size = "md", type = "Secondary", state = "default", className, style, disabled, ...props },
    ref,
  ) => {
    const hover = state === "hover";
    const isDisabled = disabled || state === "disabled";

    const computedStyle = buildButtonStyle({
      size,
      radiusScale: "A",
      emphasisColor:
        type === "Secondary"
          ? hover
            ? confirmedSecondaryHoverStyle
            : confirmedSecondaryStyle
          : emphasisStyle(color.danger, emphasisByType[type], hover),
      focusRing: "danger",
      isFocusVariant: state === "focus",
    });

    return (
      <button
        ref={ref}
        type="button"
        className={buttonBaseClassName + (className ? ` ${className}` : "")}
        // Merged, not replaced — lets a composing component (e.g. Toast, docs/audit/toasts.md
        // §11: the same nested button_danger renders with a different confirmed fill there)
        // override one property without discarding every other confirmed style.
        style={{ ...computedStyle, ...style }}
        disabled={isDisabled}
        data-size={size}
        data-type={type}
        data-state={state}
        {...props}
      />
    );
  },
);

ButtonDanger.displayName = "ButtonDanger";
