import { type TextareaHTMLAttributes, forwardRef } from "react";
import { fieldFillDefault, fieldRadiusMd, innerShadow, typography } from "./shared";

// docs/audit/input.md §2, §4 — textarea: state default|default_dark|hover|filled|active|error|
// disabled — the identical 7-state vocabulary shared with input_field and digit_input.
export type TextareaState =
  | "default"
  | "default_dark"
  | "hover"
  | "filled"
  | "active"
  | "error"
  | "disabled";

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  state?: TextareaState;
}

/**
 * `textarea` (docs/audit/input.md). No `get_design_context` deep audit exists for this set —
 * only its `state` variant axis is confirmed (§2). Rendered as a real `<textarea>` element
 * (the only reasonable HTML mapping, not a visual guess) using `field`'s confirmed default
 * baseline styling (radius, fill, inner shadow, typography), since `textarea` shares the exact
 * same 7-state vocabulary as `input_field`/`digit_input` — a documented, derived reuse, not an
 * independently confirmed binding.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ state = "default", disabled, className, style, ...props }, ref) => (
    <textarea
      ref={ref}
      data-state={state}
      disabled={disabled || state === "disabled"}
      className={
        "outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50" +
        (className ? ` ${className}` : "")
      }
      style={{
        padding: "0.5rem 0.625rem",
        borderRadius: fieldRadiusMd,
        backgroundColor: fieldFillDefault,
        boxShadow: innerShadow,
        border: "none",
        resize: "vertical",
        ...typography,
        ...style,
      }}
      {...props}
    />
  ),
);

Textarea.displayName = "Textarea";
