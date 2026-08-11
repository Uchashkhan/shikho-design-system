import { type FocusEvent, type HTMLAttributes, type MouseEvent as ReactMouseEvent, forwardRef, useState } from "react";
import { color, radius } from "@shikho/tokens";

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

interface DropdownChrome {
  background: string;
  border: string;
  boxShadow?: string;
  textColor: string;
}

const ring = `0 0 0 3px ${color.secondary[500]}3d`; // Color/Secondary/500_alpha_24
const outerShadow = "0px 1px 1px -0.5px rgba(0,0,0,0.04), 0px 3px 3px -1.5px rgba(0,0,0,0.04)"; // elevation/e2

// docs/audit/input.md §15 — a live get_design_context pull on the full component set (66056:19209)
// resolved every one of the 9 states in a single fetch. Dropdown genuinely diverges from
// InputField's shared chrome in ways the original derived guess got wrong: default/hover/
// default_dark text is gray-950 (not gray-700 — InputField's default text is lighter); brand has
// its own primary-tinted fill+text, not a fallback to plain default gray; active_no_focus is a
// confirmed distinct look (white fill + outer elevation shadow, no border, no ring) — not "active
// minus its ring" as previously assumed.
function dropdownChromeStyle(state: DropdownState): DropdownChrome {
  switch (state) {
    case "default":
      return { background: color.gray[100], border: "none", textColor: color.gray[950] }; // smoke_med
    case "default_dark":
    case "hover":
      return { background: color.gray[200], border: "none", textColor: color.gray[950] }; // smoke_high
    case "brand":
      return { background: `${color.primary[500]}1f`, border: "none", textColor: color.primary[600] }; // primary_base_em_alpha
    case "active":
      return { background: color.white[950], border: `1px solid ${color.secondary[300]}`, boxShadow: ring, textColor: color.gray[950] };
    case "active_no_focus":
      return { background: color.white[950], border: "none", boxShadow: outerShadow, textColor: color.gray[950] };
    case "error":
      return { background: color.white[950], border: `1px solid ${color.danger[300]}`, boxShadow: ring, textColor: color.gray[700] };
    case "disabled":
      return { background: color.gray[100], border: "none", textColor: color.gray[400] }; // disabled_base_em
    case "naked":
      return { background: "transparent", border: "none", boxShadow: outerShadow, textColor: color.gray[700] };
  }
}

const innerShadow = "inset 0px 1px 3px 0px rgba(255,255,255,0.04), inset 0px -1px 3px -2px rgba(0,0,0,0.04)";
// Confirmed present on default/default_dark/hover/brand/disabled; confirmed absent on
// naked/error/active/active_no_focus (those four get either no shadow at all, or only their own
// outer/ring shadow instead).
const HAS_INNER_SHADOW = new Set<DropdownState>(["default", "default_dark", "hover", "brand", "disabled"]);

/**
 * `dropdown` (docs/audit/input.md §14/§15). Every one of its 9 confirmed states now renders its
 * own confirmed chrome — see `dropdownChromeStyle` above for what changed vs. the original
 * "closest confirmed analogue" derivation.
 */
export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  ({ state, autoLayout = false, className, style, children, onMouseEnter, onMouseLeave, onFocus, onBlur, ...props }, ref) => {
    const [pointerHover, setPointerHover] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const resolvedState: DropdownState = state ?? (isFocused ? "active" : pointerHover ? "hover" : "default");
    const isDisabled = resolvedState === "disabled";
    const isNaked = resolvedState === "naked";
    const chrome = dropdownChromeStyle(resolvedState);

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
          gap: "0.375rem", // confirmed spacing/6 (6px), not the previous 4px
          padding: isNaked ? "0.75rem 0" : "0.75rem", // confirmed spacing/12 uniform, not the previous 8px/10px
          borderRadius: radius.lg,
          backgroundColor: chrome.background,
          border: chrome.border,
          boxShadow:
            [HAS_INNER_SHADOW.has(resolvedState) ? innerShadow : undefined, chrome.boxShadow]
              .filter(Boolean)
              .join(", ") || "none",
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
