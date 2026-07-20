import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { DigitInput } from "./digit_input";

export interface DigitFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children?: ReactNode;
}

/**
 * `digit_field` (docs/audit/input.md §1, §13) — confirmed to exist only as a **single bare
 * instance**, not a variant set: no properties, states, or internal structure were captured,
 * and the audit explicitly flags the relationship between `digit_field` and `digit_input` as
 * "not investigated." This implementation does not invent a multi-cell OTP layout or any other
 * structure for it. It renders `children` if supplied, or a single `DigitInput` as the most
 * minimal possible placeholder — a container, not a designed composition — pending a further
 * Figma audit (`get_design_context`) to confirm its real structure.
 */
export const DigitField = forwardRef<HTMLDivElement, DigitFieldProps>(
  ({ children, style, ...props }, ref) => (
    <div
      ref={ref}
      style={{ display: "flex", gap: "0.5rem", ...style }}
      {...props}
    >
      {children ?? <DigitInput />}
    </div>
  ),
);

DigitField.displayName = "DigitField";
