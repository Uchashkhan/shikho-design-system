import { type FocusEvent, type HTMLAttributes, type MouseEvent as ReactMouseEvent, forwardRef, useState } from "react";
import { radius } from "@shikho/tokens";
import { fieldChromeInnerShadow, fieldChromeStyle } from "./shared";

// docs/audit/input.md §2, §4, §14 — dropdown: state naked|disabled|error|active|brand|
// active_no_focus|hover|default_dark|default (9 values — a distinct vocabulary shared with no
// other Input component); auto_layout TRUE|FALSE (§13: not confirmed whether this is a real
// component boolean property or only encoded in the variant name; exposed since the axis itself
// is confirmed real, §2).
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
  /** Forces a specific state (used by Storybook/playground controls to preview a state without
   * real interaction). Left unset, the real trigger drives it: keyboard/pointer focus → `active`,
   * pointer hover → `hover`, otherwise `default`. The other states (`error`, `disabled`, `naked`,
   * `brand`, `active_no_focus`) can only be forced — none of them are derivable from interaction
   * alone. */
  state?: DropdownState;
  autoLayout?: boolean;
}

const CHROME_STATES = new Set(["default", "default_dark", "hover", "error", "active", "disabled"]);

/**
 * `dropdown` (docs/audit/input.md §14, deep re-audited across default/active/disabled/naked).
 * `default`/`default_dark`/`hover`/`error`/`active`/`disabled` are confirmed to share `field`'s
 * exact chrome construction (fill/border/ring/inner-shadow) — the same `fieldChromeStyle` table
 * `InputField` uses, not a re-derived approximation. `naked` is confirmed genuinely different: no
 * fill, no inner shadow, only the confirmed `elevation/e2` outer drop-shadow. `brand`/
 * `active_no_focus` were not independently sampled (§13) and reuse `active`'s confirmed chrome
 * minus the ring, as the closest confirmed analogue — documented, not verified.
 */
export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  ({ state, autoLayout = false, className, style, children, onMouseEnter, onMouseLeave, onFocus, onBlur, ...props }, ref) => {
    const [pointerHover, setPointerHover] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const resolvedState: DropdownState = state ?? (isFocused ? "active" : pointerHover ? "hover" : "default");
    const isDisabled = resolvedState === "disabled";
    const chromeState = CHROME_STATES.has(resolvedState)
      ? (resolvedState as Parameters<typeof fieldChromeStyle>[0])
      : "default";
    const chrome = fieldChromeStyle(chromeState);

    const isNaked = resolvedState === "naked";
    const dropsRing = resolvedState === "brand" || resolvedState === "active_no_focus";

    const handleMouseEnter = (event: ReactMouseEvent<HTMLDivElement>) => {
      setPointerHover(true);
      onMouseEnter?.(event);
    };
    const handleMouseLeave = (event: ReactMouseEvent<HTMLDivElement>) => {
      setPointerHover(false);
      onMouseLeave?.(event);
    };
    const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
      setIsFocused(true);
      onFocus?.(event);
    };
    const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
      setIsFocused(false);
      onBlur?.(event);
    };

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={isDisabled ? undefined : 0}
        aria-disabled={isDisabled || undefined}
        data-state={resolvedState}
        data-auto-layout={autoLayout}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={
          "inline-flex items-center transition-colors outline-none disabled:cursor-not-allowed" +
          (className ? ` ${className}` : "")
        }
        style={{
          gap: "0.25rem",
          padding: isNaked ? "0.75rem 0" : "0.5rem 0.625rem",
          borderRadius: radius.lg,
          backgroundColor: isNaked ? "transparent" : chrome.background,
          border: isNaked ? "none" : chrome.border,
          boxShadow: isNaked
            ? "0px 1px 1px -0.5px rgba(0,0,0,0.04), 0px 3px 3px -1.5px rgba(0,0,0,0.04)" // confirmed elevation/e2, §14
            : [fieldChromeInnerShadow(chromeState), dropsRing ? undefined : chrome.boxShadow].filter(Boolean).join(", ") || "none",
          color: chrome.textColor,
          justifyContent: "space-between",
          width: autoLayout ? "auto" : "100%",
          fontSize: 13,
          lineHeight: "20px",
          fontWeight: 500,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Dropdown.displayName = "Dropdown";
