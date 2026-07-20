import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { labelHintTextColor, typography } from "./shared";

// docs/audit/input.md §2 — input_hint: size sm|md.
export type InputHintSize = "sm" | "md";

export interface InputHintProps extends HTMLAttributes<HTMLDivElement> {
  size?: InputHintSize;
  /** Confirmed component property, default true (§8). */
  hintText?: boolean;
  /**
   * Confirmed component property, default true (§8). Note: the audit found this prop's icon
   * layer is literally named "right_icon" in Figma despite controlling the row's *leading*
   * icon (§10, a confirmed naming inconsistency) — preserved here as a documented fact, not
   * corrected, since the audit instructs findings be reported, not silently fixed.
   */
  leftIcon?: boolean;
  /** Confirmed component property, default true (§8) — overridden to false in the one deep-audited instance. */
  supportText?: boolean;
  icon?: ReactNode;
  hintTextContent?: ReactNode;
  supportTextContent?: ReactNode;
}

/**
 * `input_hint` (docs/audit/input.md §8). Row layout (flex items-center, gap spacing/4,
 * horizontal-only spacing/2 padding) and text color (Text/Gray 700) are confirmed from the
 * nested rendering inside `input_field`/active. `supportText`'s own distinct color was never
 * independently confirmed (it was overridden to false in the only audited instance) — this
 * reuses the hint's own confirmed text color rather than inventing a separate one.
 */
export const InputHint = forwardRef<HTMLDivElement, InputHintProps>(
  (
    {
      size = "md",
      hintText = true,
      leftIcon = true,
      supportText = true,
      icon,
      hintTextContent,
      supportTextContent,
      style,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      data-size={size}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.25rem", // gap-[spacing/4, 4px] — §8
        padding: "0 0.125rem", // px-[spacing/2, 2px], horizontal only — §8
        color: labelHintTextColor,
        ...typography,
        ...style,
      }}
      {...props}
    >
      {leftIcon && icon}
      {hintText && <span>{hintTextContent}</span>}
      {supportText && <span>{supportTextContent}</span>}
    </div>
  ),
);

InputHint.displayName = "InputHint";
