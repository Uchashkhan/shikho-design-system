import { type InputHTMLAttributes, forwardRef } from "react";
import { fieldFillDefault, fieldRadiusMd, innerShadow, typography } from "./shared";

// docs/audit/input.md §2, §4 — digit_input: state default|default_dark|hover|filled|active|
// error|disabled — the identical 7-state vocabulary shared with input_field and textarea.
export type DigitInputState =
  | "default"
  | "default_dark"
  | "hover"
  | "filled"
  | "active"
  | "error"
  | "disabled";

export interface DigitInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  state?: DigitInputState;
}

/**
 * `digit_input` (docs/audit/input.md). No `get_design_context` deep audit exists for this set —
 * only its `state` variant axis is confirmed (§2). A single-character text input is the only
 * reasonable HTML mapping for the name, not a visual guess about internal structure; styling
 * reuses `field`'s confirmed default baseline, as with `textarea`, since both share the exact
 * `input_field` state vocabulary.
 */
export const DigitInput = forwardRef<HTMLInputElement, DigitInputProps>(
  ({ state = "default", disabled, maxLength = 1, className, style, ...props }, ref) => (
    <input
      ref={ref}
      type="text"
      inputMode="numeric"
      maxLength={maxLength}
      data-state={state}
      disabled={disabled || state === "disabled"}
      className={
        "outline-none text-center transition-colors disabled:cursor-not-allowed disabled:opacity-50" +
        (className ? ` ${className}` : "")
      }
      style={{
        width: "2.5rem",
        height: "2.5rem",
        padding: 0,
        borderRadius: fieldRadiusMd,
        backgroundColor: fieldFillDefault,
        boxShadow: innerShadow,
        border: "none",
        ...typography,
        ...style,
      }}
      {...props}
    />
  ),
);

DigitInput.displayName = "DigitInput";
