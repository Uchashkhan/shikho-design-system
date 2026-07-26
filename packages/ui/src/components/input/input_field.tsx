import { type ReactNode, forwardRef } from "react";
import { Field, type FieldProps } from "./field";
import { InputHint, type InputHintProps } from "./input_hint";
import { InputLabel } from "./input_label";
import { fieldChromeInnerShadow, fieldChromeStyle, type FieldChromeState } from "./shared";

// docs/audit/input.md §2, §4 — input_field: state default|default_dark|hover|filled|active|
// error|disabled (7 values; no literal "focus" state anywhere in the Input family, unlike
// Buttons — the closest analog is "active").
export type InputFieldState = FieldChromeState;

export interface InputFieldProps {
  state?: InputFieldState;
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
 */
export const InputField = forwardRef<HTMLDivElement, InputFieldProps>(
  ({ state = "default", label = true, hint = true, labelContent, hintProps, fieldProps }, ref) => {
    const chrome = fieldChromeStyle(state);
    const isDisabled = state === "disabled";

    return (
      <div
        ref={ref}
        data-state={state}
        style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.25rem" }}
      >
        {label && (
          <InputLabel style={isDisabled ? { color: chrome.textColor } : undefined}>{labelContent}</InputLabel>
        )}
        <Field
          {...fieldProps}
          textColor={chrome.textColor}
          style={{
            width: "100%",
            backgroundColor: chrome.background,
            border: chrome.border,
            boxShadow: [fieldChromeInnerShadow(state), chrome.boxShadow].filter(Boolean).join(", ") || "none",
            ...fieldProps?.style,
          }}
          aria-disabled={isDisabled || undefined}
        />
        {hint && (
          <InputHint
            {...hintProps}
            style={{ color: chrome.hintColor, ...hintProps?.style }}
          />
        )}
      </div>
    );
  },
);

InputField.displayName = "InputField";
