import { type InputHTMLAttributes, forwardRef } from "react";
import { color, focusRingColor, radius } from "@shikho/tokens";
import { tv } from "tailwind-variants";

// docs/audit/toggle.md §2, §4 — toggle: size (lg=40×24, md=40×24 — confirmed SAME bounding box
// as lg, not a typo, reproduced faithfully — sm=32×20). No `shape`/`type` property (always a
// pill-shaped switch).
export type ToggleSize = "lg" | "md" | "sm";

const sizePx: Record<ToggleSize, { width: number; height: number }> = {
  lg: { width: 40, height: 24 },
  md: { width: 40, height: 24 }, // confirmed identical to lg (§4) — not an error, preserved as-is
  sm: { width: 32, height: 20 },
};

// docs/audit/toggle.md §9 — Toggle's own confirmed color export notably does NOT include
// `Text/Gray 400` (unlike Checkbox's and Radio's, which both list it and share the exact same
// border color). Reusing Checkbox's gray-400 border here would therefore be a weaker derivation
// than it was for Radio. Instead this uses `Color/Gray 200` (#ebecf0), which IS present in
// Toggle's own §9 export, as the resting track fill — with no border at all, since no border
// color token appears anywhere in this component's confirmed export (unlike Checkbox/Radio,
// where a border WAS at least cross-referenced via list.md).
const restingFill = color.gray[200]; // Color/Gray 200 = #ebecf0 — confirmed present, §9
const trackRadius = radius.full; // radius/border_radius_round = 1000 — confirmed present, §8

// docs/audit/toggle.md §8 — outline/focus_primary is the ONLY focus-ring token present in this
// component's export (no outline/focus_gray, unlike Checkbox/Radio) — consistent with toggle
// having exactly one focused variant (switch_ON_focused, no OFF-focused). Unlike Checkbox/Radio,
// there is no ambiguous primary-vs-gray choice to make here: primary is the only candidate.
const focusRing = focusRingColor.primary; // outline/primary_alpha = #5468ff3d

const toggleStyles = tv({
  base:
    "cursor-pointer transition-colors outline-none " +
    "disabled:cursor-not-allowed disabled:opacity-50 " +
    "focus-visible:shadow-[var(--toggle-focus-ring)]",
  variants: {
    size: { lg: "", md: "", sm: "" },
  },
  defaultVariants: { size: "md" },
});

export interface ToggleProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "checked"> {
  size?: ToggleSize;
  /**
   * ON/OFF state. Figma's own `state` enum spells this `switch_ON`/`switch_OFF` (docs/audit/
   * toggle.md §2 — a third distinct selection-vocabulary, different from both Checkbox's
   * `checked`/`unchecked` and Radio's `active`/`inactive`, §10/§12). This component uses the
   * standard native `checked`/`defaultChecked` props instead of inventing a `switchOn` prop name,
   * for the same "use native semantics" reason applied to Checkbox and Radio.
   */
  checked?: boolean;
  defaultChecked?: boolean;
}

/**
 * `toggle` (docs/audit/toggle.md). Renders `<input type="checkbox" role="switch">` — the
 * standard native/ARIA pattern for a toggle switch (a checkbox is the correct underlying native
 * control; `role="switch"` gives it the correct accessibility semantics). No sliding knob/thumb
 * is drawn: no `get_design_context` deep audit exists for this family (§6), so there is no
 * confirmed knob color, track-vs-knob color split, or animation — the ubiquitous "colored track
 * + sliding white knob" toggle visual would be entirely invented. This renders only the
 * confirmed resting track fill and pill radius; ON/OFF is communicated by the browser's own
 * native checked-indicator rendering, same principle as `Checkbox` and `Radio`. There is also no
 * `hover` state and no `indeterminate` state here — both are confirmed absent from `toggle`'s
 * state enum, unlike its two siblings (§2, §4) — so neither is implemented.
 * See packages/ui/src/components/toggle/README.md for the full confirmed-vs-unresolved breakdown.
 */
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ size = "md", disabled, className, style, ...props }, ref) => {
    const { width, height } = sizePx[size];

    return (
      <input
        ref={ref}
        type="checkbox"
        role="switch"
        disabled={disabled}
        data-size={size}
        className={toggleStyles({ size, className })}
        style={{
          width,
          height,
          margin: 0,
          backgroundColor: restingFill,
          border: "none",
          borderRadius: trackRadius,
          ["--toggle-focus-ring" as string]: `0 0 0 3px ${focusRing}`,
          ...style,
        }}
        {...props}
      />
    );
  },
);

Toggle.displayName = "Toggle";
