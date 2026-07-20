import { type HTMLAttributes, forwardRef } from "react";
import { baseFieldClassName, fieldFillDefault, fieldRadiusMd, innerShadow, typography } from "./shared";

// docs/audit/input.md §2, §4 — dropdown: state naked|disabled|error|active|brand|
// active_no_focus|hover|default_dark|default (9 values — a distinct vocabulary shared with no
// other Input component); auto_layout TRUE|FALSE (§13: not confirmed whether this is a real
// component boolean property or only encoded in the variant name).
export type DropdownState =
  | "naked"
  | "disabled"
  | "error"
  | "active"
  | "brand"
  | "active_no_focus"
  | "hover"
  | "default_dark"
  | "default";

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  state?: DropdownState;
  /** Confirmed as an existing variant axis (§2); whether it is a real boolean prop or only a
   * variant-name convention was never confirmed (§13). Exposed here since the axis is real. */
  autoLayout?: boolean;
}

/**
 * `dropdown` (docs/audit/input.md). No `get_design_context` deep audit was performed on this
 * set — only its state/auto_layout variant axes and its membership in the overview-level token
 * pool are confirmed (§2, §6). This reuses `field`'s own confirmed default appearance (radius,
 * fill, inner shadow, typography) as a neutral baseline, since no independent visual data exists
 * for `dropdown` — not a claim that dropdown looks like field, just the least-invented option.
 */
export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  ({ state = "default", autoLayout = false, className, style, children, ...props }, ref) => (
    <div
      ref={ref}
      role="button"
      aria-disabled={state === "disabled" || undefined}
      data-state={state}
      data-auto-layout={autoLayout}
      className={baseFieldClassName + (className ? ` ${className}` : "")}
      style={{
        gap: "0.25rem",
        padding: "0.5rem 0.625rem",
        borderRadius: fieldRadiusMd,
        backgroundColor: fieldFillDefault,
        boxShadow: innerShadow,
        justifyContent: "space-between",
        width: autoLayout ? "auto" : "100%",
        ...typography,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  ),
);

Dropdown.displayName = "Dropdown";
