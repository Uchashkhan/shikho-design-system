import { type ChangeEvent, type FocusEvent, type MouseEvent as ReactMouseEvent, type TextareaHTMLAttributes, forwardRef, useState } from "react";
import { color, radius } from "@shikho/tokens";
import { fieldChromeInnerShadow, fieldChromeStyle, typography, type FieldChromeState } from "./shared";

// docs/audit/input.md §2, §4, §15 — textarea: state default|default_dark|hover|filled|active|
// error|disabled — the identical 7-state vocabulary shared with input_field and digit_input.
export type TextareaState = FieldChromeState;

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  /** Forces a specific state (used by Storybook/playground controls to preview a state without
   * real interaction). Left unset, the real `<textarea>` drives it: focus → `active`, a non-empty
   * value → `filled`, pointer hover → `hover`, otherwise `default`. `error` can only be forced. */
  state?: TextareaState;
}

/**
 * `textarea` (docs/audit/input.md §15 — a live `get_design_context` pull on the component set
 * itself, `66056:19282`, resolving what was previously an unconfirmed derived guess). Rendered as
 * a real `<textarea>` element (the only reasonable HTML mapping — Figma's own node also composes
 * a label + hint row around it, which this primitive intentionally omits, matching `Field`'s own
 * bare-vs-composed split with `InputField`).
 *
 * Two confirmed corrections vs. the prior derived guess (which had assumed `field`'s own default
 * geometry): radius is `radius/border_radius_lg` (16px), not `radius/custom/md` (10px); padding
 * is `py-12 px-16`, not `field`'s 8px/10px. And a genuine divergence from `input_field`'s shared
 * chrome: `textarea`'s `error` state colors the input text itself `danger-500` (red) — confirmed
 * different from `input_field`'s `error`, which only reddens the border/hint and keeps the input
 * text `gray-700`.
 *
 * Previously `state` was accepted but never actually applied to any style — every state rendered
 * identically to `field`'s bare default fill/radius/shadow, regardless of what was passed. Now
 * renders its own confirmed per-state chrome, and — left unset — the same real pointer/focus-
 * driven state resolution already applied to `InputField`/`Dropdown`/`DigitInput`.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { state, disabled, className, style, value, defaultValue, onChange, onFocus, onBlur, onMouseEnter, onMouseLeave, ...props },
    ref,
  ) => {
    const [pointerHover, setPointerHover] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(() => Boolean((value ?? defaultValue ?? "").toString().length > 0));

    const resolvedState: TextareaState =
      state ??
      (disabled
        ? "disabled"
        : isFocused
          ? "active"
          : hasValue
            ? "filled"
            : pointerHover
              ? "hover"
              : "default");

    const isDisabled = disabled || resolvedState === "disabled";
    const chrome = fieldChromeStyle(resolvedState);
    // Confirmed: textarea's own error state reddens the input text itself (danger-500) —
    // different from input_field/dropdown's error, which keeps gray-700 text and only reddens
    // the border/hint. Everything else (fill, border, ring) is confirmed shared.
    const textColor = resolvedState === "error" ? color.danger[500] : chrome.textColor;

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      setHasValue(event.target.value.length > 0);
      onChange?.(event);
    };
    const handleFocus = (event: FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.(event);
    };
    const handleBlur = (event: FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      onBlur?.(event);
    };
    const handleMouseEnter = (event: ReactMouseEvent<HTMLTextAreaElement>) => {
      setPointerHover(true);
      onMouseEnter?.(event);
    };
    const handleMouseLeave = (event: ReactMouseEvent<HTMLTextAreaElement>) => {
      setPointerHover(false);
      onMouseLeave?.(event);
    };

    return (
      <textarea
        ref={ref}
        data-state={resolvedState}
        disabled={isDisabled}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={
          "outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50" +
          (className ? ` ${className}` : "")
        }
        style={{
          padding: "0.75rem 1rem", // confirmed py-12/px-16, distinct from field's own padding
          borderRadius: radius.xl, // confirmed radius/border_radius_lg (16px), not field's radius/custom/md
          backgroundColor: chrome.background,
          border: chrome.border,
          boxShadow:
            [fieldChromeInnerShadow(resolvedState), chrome.boxShadow].filter(Boolean).join(", ") || "none",
          color: textColor,
          resize: "vertical",
          ...typography,
          ...style,
        }}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
