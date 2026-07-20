import { type HTMLAttributes, forwardRef } from "react";
import { labelHintTextColor, typography } from "./shared";

// docs/audit/input.md §2 — input_label: size sm|md (only these two; no lg/xl support exists for
// labels/hints even though `field` itself goes up to xl — a confirmed coverage gap, §4).
export type InputLabelSize = "sm" | "md";

export interface InputLabelProps extends HTMLAttributes<HTMLLabelElement> {
  size?: InputLabelSize;
}

/**
 * `input_label` (docs/audit/input.md). Text color (Text/Gray 700) and typography (web/Body/13
 * Medium, 13px/20px) are confirmed from the nested-label rendering in the input_field/active
 * deep audit (§8); horizontal-only padding (spacing/2) is confirmed there too. No confirmed
 * visual difference between `sm` and `md` was captured — both render identically pending a
 * further audit.
 */
export const InputLabel = forwardRef<HTMLLabelElement, InputLabelProps>(
  ({ size = "md", style, ...props }, ref) => (
    <label
      ref={ref}
      data-size={size}
      style={{
        ...typography,
        color: labelHintTextColor,
        padding: "0 0.125rem", // px-[spacing/2, 2px], horizontal only — §8
        display: "block",
        ...style,
      }}
      {...props}
    />
  ),
);

InputLabel.displayName = "InputLabel";
