import { type ChangeEvent, type FocusEvent, type MouseEvent as ReactMouseEvent, type TextareaHTMLAttributes, forwardRef, useState } from "react";
import { fieldChromeInnerShadow, fieldChromeStyle, fieldRadiusMd, typography, type FieldChromeState } from "./shared";

// docs/audit/input.md §2, §4 — textarea: state default|default_dark|hover|filled|active|error|
// disabled — the identical 7-state vocabulary shared with input_field and digit_input.
export type TextareaState = FieldChromeState;

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  /** Forces a specific state (used by Storybook/playground controls to preview a state without
   * real interaction). Left unset, the real `<textarea>` drives it: focus → `active`, a non-empty
   * value → `filled`, pointer hover → `hover`, otherwise `default`. `error` can only be forced. */
  state?: TextareaState;
}

/**
 * `textarea` (docs/audit/input.md). No `get_design_context` deep audit exists for this set —
 * only its `state` variant axis is confirmed (§2). Rendered as a real `<textarea>` element
 * (the only reasonable HTML mapping, not a visual guess), reusing `InputField`'s own confirmed
 * per-state chrome table (`fieldChromeStyle`) since `textarea` shares its exact 7-state
 * vocabulary — a documented, derived reuse, not an independently confirmed binding.
 *
 * Previously `state` was accepted but never actually applied to any style — every state rendered
 * identically to `field`'s bare default fill/radius/shadow, regardless of what was passed. Now
 * shares the same real chrome `InputField`/`Dropdown` use, and — left unset — the same real
 * pointer/focus-driven state resolution already applied there.
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
          padding: "0.5rem 0.625rem",
          borderRadius: fieldRadiusMd,
          backgroundColor: chrome.background,
          border: chrome.border,
          boxShadow:
            [fieldChromeInnerShadow(resolvedState), chrome.boxShadow].filter(Boolean).join(", ") || "none",
          color: chrome.textColor,
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
