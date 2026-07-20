import { type ReactNode, forwardRef } from "react";
import { Field, type FieldProps } from "./field";
import { InputHint, type InputHintProps } from "./input_hint";
import { InputLabel } from "./input_label";
import { activeBorderColor, activeRing, fieldFillActive } from "./shared";

// docs/audit/input.md §2, §4 — input_field: state default|default_dark|hover|filled|active|
// error|disabled (7 values; no literal "focus" state anywhere in the Input family, unlike
// Buttons — the closest analog is "active").
export type InputFieldState =
  | "default"
  | "default_dark"
  | "hover"
  | "filled"
  | "active"
  | "error"
  | "disabled";

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
 * `input_field` (docs/audit/input.md §8, deep-audited at `state=active`). Composes
 * `InputLabel` + `Field` + `InputHint`, matching the confirmed layer hierarchy exactly
 * (root flex-col, gap spacing/4).
 *
 * Only `state="active"` has a confirmed distinct visual: fill `Color/smoke_base` (white),
 * border `outline/Secondary 300`, and a focus ring numerically identical to
 * `outline/focus_secondary` (§8). The other 6 states have zero confirmed visual data (§13) and
 * render using `Field`'s own confirmed default appearance instead — a neutral baseline, not a
 * fabricated per-state design. `disabled` additionally gets the native `disabled` semantics.
 *
 * The audit found the nested `field` here uses `radius/custom/lg` (12px) and `w-full`, versus
 * the standalone `field`'s `radius/custom/md` (10px) and a fixed width (§11) — a confirmed,
 * unexplained discrepancy. This implementation intentionally reuses one `Field` component with
 * its own confirmed radius consistently, rather than forking a second, undocumented variant.
 */
export const InputField = forwardRef<HTMLDivElement, InputFieldProps>(
  ({ state = "default", label = true, hint = true, labelContent, hintProps, fieldProps }, ref) => {
    const isActive = state === "active";
    const isDisabled = state === "disabled";

    return (
      <div
        ref={ref}
        data-state={state}
        style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.25rem" }}
      >
        {label && <InputLabel>{labelContent}</InputLabel>}
        <Field
          {...fieldProps}
          style={{
            width: "100%",
            ...(isActive
              ? {
                  backgroundColor: fieldFillActive,
                  border: `1px solid ${activeBorderColor}`,
                  boxShadow: activeRing,
                }
              : {}),
            ...fieldProps?.style,
          }}
          aria-disabled={isDisabled || undefined}
        />
        {hint && <InputHint {...hintProps} />}
      </div>
    );
  },
);

InputField.displayName = "InputField";
