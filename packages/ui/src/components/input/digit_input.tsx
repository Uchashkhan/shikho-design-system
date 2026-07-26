import { type InputHTMLAttributes, forwardRef } from "react";
import { color, radius } from "@shikho/tokens";
import { innerShadow } from "./shared";

// docs/audit/input.md §2, §4, §14 — digit_input: state default|default_dark|hover|filled|active|
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

// docs/audit/input.md §14 — a single-instance MCP fetch on the digit_input component set
// resolved every state's confirmed fill/text/border/ring in one pass (unlike the other Input
// components, which required one fetch per state). Confirmed: digit_input uses a completely
// different typography scale (heading_1, 22px/32px SemiBold) from the rest of the Input family
// (body_1, 13px/20px Medium) — a single large digit per cell, not shared body text.
const FILL: Record<DigitInputState, string> = {
  default: color.gray[100], // Color/smoke_med
  default_dark: color.gray[200], // Color/smoke_high
  hover: color.gray[200], // Color/smoke_high
  filled: color.gray[100], // Color/smoke_med
  active: color.white[950], // Color/smoke_base
  error: color.white[950], // Color/smoke_base
  disabled: color.gray[100], // Color/disabled_base_em (== gray/100)
};

const TEXT: Record<DigitInputState, string> = {
  default: color.gray[400],
  default_dark: color.gray[400],
  hover: color.gray[400],
  filled: color.gray[700],
  active: color.gray[950],
  error: color.danger[500],
  disabled: color.gray[400],
};

const BORDER: Record<DigitInputState, string> = {
  default: "none",
  default_dark: "none",
  hover: "none",
  filled: "none",
  active: `1px solid ${color.secondary[300]}`,
  error: `1px solid ${color.danger[300]}`,
  disabled: "none",
};

// Confirmed: active/error share the exact same ring color, differing only in border (§14, same
// binding-reuse pattern documented elsewhere as the focus.danger issue).
const RING = `0 0 0 3px ${color.secondary[500]}3d`;

// Confirmed placeholder content: a dash for default/default_dark/hover, "0" for the rest.
const PLACEHOLDER: Record<DigitInputState, string> = {
  default: "-",
  default_dark: "-",
  hover: "-",
  filled: "0",
  active: "0",
  error: "0",
  disabled: "0",
};

/**
 * `digit_input` (docs/audit/input.md §14). Confirmed a genuinely distinct visual identity from
 * the rest of the Input family: 56px-wide cells, `heading_1` typography (22px/32px SemiBold —
 * not `body_1`), and the same active/error ring-sharing pattern already confirmed on
 * `input_field`/`dropdown`. The pre-rebuild implementation rendered this at `body_1` size with
 * `field`'s own default-only chrome, regardless of `state`.
 */
export const DigitInput = forwardRef<HTMLInputElement, DigitInputProps>(
  ({ state = "default", disabled, maxLength = 1, className, style, placeholder, ...props }, ref) => {
    const isDisabled = disabled || state === "disabled";
    const hasRing = state === "active" || state === "error";

    return (
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        maxLength={maxLength}
        data-state={state}
        disabled={isDisabled}
        placeholder={placeholder ?? PLACEHOLDER[state]}
        className={
          "outline-none text-center transition-colors disabled:cursor-not-allowed" +
          (className ? ` ${className}` : "")
        }
        style={{
          width: 56,
          height: 56,
          padding: 0,
          borderRadius: radius.md,
          backgroundColor: FILL[state],
          border: BORDER[state],
          boxShadow: [hasRing ? undefined : innerShadow, hasRing ? RING : undefined].filter(Boolean).join(", ") || "none",
          color: TEXT[state],
          fontSize: 22,
          lineHeight: "32px",
          fontWeight: 600,
          ...style,
        }}
        {...props}
      />
    );
  },
);

DigitInput.displayName = "DigitInput";
