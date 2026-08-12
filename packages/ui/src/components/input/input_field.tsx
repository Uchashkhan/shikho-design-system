import { type ChangeEvent, type FocusEvent, type MouseEvent as ReactMouseEvent, type ReactNode, forwardRef, useState } from "react";
import { Field, type FieldProps, type FieldSize } from "./field";
import { InputHint, type InputHintProps } from "./input_hint";
import { InputLabel } from "./input_label";
import { fieldChromeInnerShadow, fieldChromeStyle, type FieldChromeState } from "./shared";

// docs/audit/input.md §2, §4 — input_field: state default|default_dark|hover|filled|active|
// error|disabled (7 values; no literal "focus" state anywhere in the Input family, unlike
// Buttons — the closest analog is "active").
export type InputFieldState = FieldChromeState;

export interface InputFieldProps {
  /** Forces a specific state (used by Storybook/playground controls to preview a state without
   * real interaction). Left unset, the real `<input>` drives it: focus → `active`, a non-empty
   * value → `filled`, pointer hover → `hover`, otherwise `default`. `error` can only be forced —
   * there's no way to auto-derive a validation error from DOM interaction alone. */
  state?: InputFieldState;
  /** Not part of `input_field`'s own confirmed variant set — Figma's `input_field` component set
   * (node 66056:19180) crosses `state` alone, with no `size` axis at all, unlike `field` (node
   * 66056:19051), which has an independently confirmed xl/lg/md/sm axis. `fieldChromeStyle`'s
   * state colors/border/ring are pure color values with no size dependency, so this composes
   * `field`'s own already-confirmed per-size geometry underneath `input_field`'s confirmed
   * per-state chrome — the "least invented" extension, not a guessed new combination. Default
   * `"md"` keeps prior behavior (previously the only size `InputField` could render) unchanged.
   * `InputLabel`/`InputHint` are separately confirmed to support only `sm`/`md` (no lg/xl exists
   * for either) — passing `"lg"`/`"xl"` here maps their own size down to the confirmed `"md"`,
   * the closest available, rather than inventing an unconfirmed lg/xl label/hint treatment. */
  size?: FieldSize;
  /** Confirmed component property, default true (§8). */
  label?: boolean;
  /** Confirmed component property, default true (§8). */
  hint?: boolean;
  labelContent?: ReactNode;
  hintProps?: Omit<InputHintProps, "size">;
  fieldProps?: Omit<FieldProps, "size" | "type">;
}

/**
 * `input_field` (docs/audit/input.md §8/§14, deep re-audited across all 7 states). Composes
 * `InputLabel` + `Field` + `InputHint`, matching the confirmed layer hierarchy (root flex-col,
 * gap spacing/4). Every state now renders its own confirmed fill/border/ring/text combination
 * (§14) instead of only `active` looking distinct and the other 6 silently falling back to
 * `Field`'s bare default appearance — the visual gap this rebuild specifically corrects.
 *
 * Confirmed per state: `default`/`filled` share one fill; `hover` darkens the fill one step AND
 * lightens the text (a genuine two-property shift); `active`/`error` both replace the confirmed
 * inner shadow with the *same* ring color (differing only in border color — pink vs. red, a
 * confirmed Figma detail, not an approximation); `disabled` recolors to a flat neutral gray with
 * gray/400 text throughout, including the hint.
 *
 * `size` composes `field`'s own independently-confirmed xl/lg/md/sm geometry underneath this
 * confirmed per-state chrome (see the prop doc above) — previously hardcoded out entirely, so
 * every `InputField` rendered at `field`'s bare default size regardless of what a consumer wanted.
 */
export const InputField = forwardRef<HTMLDivElement, InputFieldProps>(
  ({ state, size = "md", label = true, hint = true, labelContent, hintProps, fieldProps }, ref) => {
    // InputLabel/InputHint only have a confirmed sm/md size — xl/lg map down to their own "md".
    const labelHintSize = size === "sm" ? "sm" : "md";
    const [pointerHover, setPointerHover] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(() => {
      const initial = fieldProps?.value ?? fieldProps?.textContent;
      return Boolean(initial && initial.length > 0);
    });

    const isExplicitlyDisabled = Boolean(fieldProps?.disabled);
    const resolvedState: InputFieldState =
      state ??
      (isExplicitlyDisabled
        ? "disabled"
        : isFocused
          ? "active"
          : hasValue
            ? "filled"
            : pointerHover
              ? "hover"
              : "default");

    const chrome = fieldChromeStyle(resolvedState);
    const isDisabled = resolvedState === "disabled";

    const handleFocus = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsFocused(true);
      fieldProps?.onFocus?.(event);
    };
    const handleBlur = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsFocused(false);
      fieldProps?.onBlur?.(event);
    };
    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setHasValue(event.target.value.length > 0);
      fieldProps?.onChange?.(event);
    };
    const handleMouseEnter = (event: ReactMouseEvent<HTMLDivElement>) => {
      setPointerHover(true);
      fieldProps?.onMouseEnter?.(event);
    };
    const handleMouseLeave = (event: ReactMouseEvent<HTMLDivElement>) => {
      setPointerHover(false);
      fieldProps?.onMouseLeave?.(event);
    };

    return (
      <div
        ref={ref}
        data-state={resolvedState}
        style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.25rem" }}
      >
        {label && (
          <InputLabel size={labelHintSize} style={isDisabled ? { color: chrome.textColor } : undefined}>
            {labelContent}
          </InputLabel>
        )}
        <Field
          {...fieldProps}
          size={size}
          textColor={chrome.textColor}
          disabled={isDisabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            width: "100%",
            backgroundColor: chrome.background,
            border: chrome.border,
            boxShadow:
              [fieldChromeInnerShadow(resolvedState), chrome.boxShadow].filter(Boolean).join(", ") || "none",
            ...fieldProps?.style,
          }}
          aria-disabled={isDisabled || undefined}
        />
        {hint && (
          <InputHint
            size={labelHintSize}
            {...hintProps}
            style={{ color: chrome.hintColor, ...hintProps?.style }}
          />
        )}
      </div>
    );
  },
);

InputField.displayName = "InputField";
