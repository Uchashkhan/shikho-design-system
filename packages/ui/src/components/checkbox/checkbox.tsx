import {
  type InputHTMLAttributes,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { color, radius } from "@shikho/tokens";
import { tv } from "tailwind-variants";

// docs/audit/checkboxes.md §2, §4 — checkbox: size (md=24×24, sm=20×20), shape (sphere, square).
export type CheckboxSize = "md" | "sm";
export type CheckboxShape = "sphere" | "square";

const sizePx: Record<CheckboxSize, number> = { md: 24, sm: 20 };

// Confirmed visual values — none from checkboxes.md's own overview audit directly (no
// get_design_context was run on this family, §6 header), but cross-confirmed via
// docs/audit/list.md §7: the nested Checkbox instance found there
// (`checkbox/theme_light/sm/square/unchecked/default`) has a "base" layer with white fill,
// a 2px `Text/gray-400` border, and `radius/border_radius_xs` (6px) — the exact same radius
// token checkboxes.md §8 confirms `checkbox` itself uses ("the ONLY small radius token").
// list.md §12 explicitly calls this "very likely the same underlying component."
const uncheckedFill = color.white[950]; // Color/White 100 / Color/white/950 = #ffffff
const uncheckedBorder = color.gray[400]; // Text/gray-400
const squareRadius = radius.xs; // radius/border_radius_xs = 6

// docs/audit/checkboxes.md §8 — outline/focus_gray = Effect(DROP_SHADOW, outline/Gray 300, 0,0,0,3).
// §8/§13 flag that BOTH outline/focus_primary and outline/focus_gray are "strong candidates" for
// the checked_focused/unchecked_focused rings, but which applies to which is explicitly
// unconfirmed. This implementation applies the gray ring (the neutral candidate) to every
// keyboard-focus state uniformly, rather than presuming an unconfirmed primary/gray assignment.
const focusRingColor = color.gray[300]; // outline/Gray 300

// Structural/interaction classes only — the confirmed pixel/color values (size, border, radius,
// focus-ring color) come from @shikho/tokens via inline style below, since no Tailwind theme is
// wired to those tokens yet (packages/ui/src/styles.css has no @theme values, same as Button/
// Input). `size`/`shape` are still modeled as tailwind-variants axes so the variant surface is
// explicit and consistent with the confirmed component API, not just documented in types.
const checkboxStyles = tv({
  base:
    "cursor-pointer transition-colors outline-none " +
    "disabled:cursor-not-allowed disabled:opacity-50 " +
    "focus-visible:shadow-[var(--checkbox-focus-ring)]",
  variants: {
    size: { md: "", sm: "" },
    shape: { square: "", sphere: "" },
  },
  defaultVariants: { size: "sm", shape: "square" },
});

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "checked"> {
  size?: CheckboxSize;
  shape?: CheckboxShape;
  /** Checked/unchecked state (docs/audit/checkboxes.md §5: represented via `state`, not a
   * separate boolean property in Figma — decomposed here per this task's requirement to
   * separate checked/unchecked from interaction and disabled concerns). */
  checked?: boolean;
  defaultChecked?: boolean;
  /** Maps to the confirmed `indeterminate`/`indeterminate_disabled` state values (§2). Applied
   * via the native `indeterminate` DOM property, since HTML has no matching attribute. */
  indeterminate?: boolean;
}

/**
 * `checkbox` (docs/audit/checkboxes.md). Renders a real `<input type="checkbox">` — native
 * semantics are used deliberately (checked/unchecked/indeterminate/disabled all reflect true
 * DOM/AX state) rather than a fully custom `appearance-none` widget, because the audit has **no
 * confirmed checkmark glyph, checked-state fill, or indeterminate-dash artwork anywhere** (no
 * `get_design_context` deep audit exists for this family). The one confirmed visual — the
 * resting/unchecked box (white fill, 2px `Text/gray-400` border, `radius/border_radius_xs`,
 * §8, cross-confirmed via `docs/audit/list.md` §7) — is applied directly. The checked/
 * indeterminate indicator itself is left to the browser's native rendering rather than invented.
 * See `packages/ui/src/components/checkbox/README.md` for the full confirmed-vs-unresolved
 * breakdown.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      size = "sm",
      shape = "square",
      indeterminate = false,
      disabled,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLInputElement);

    useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const boxSize = sizePx[size];

    return (
      <input
        ref={internalRef}
        type="checkbox"
        disabled={disabled}
        data-size={size}
        data-shape={shape}
        data-indeterminate={indeterminate || undefined}
        className={checkboxStyles({ size, shape, className })}
        style={{
          width: boxSize,
          height: boxSize,
          margin: 0,
          backgroundColor: uncheckedFill,
          border: `2px solid ${uncheckedBorder}`,
          borderRadius: shape === "square" ? squareRadius : radius.full,
          ["--checkbox-focus-ring" as string]: `0 0 0 3px ${focusRingColor}`,
          ...style,
        }}
        {...props}
      />
    );
  },
);

Checkbox.displayName = "Checkbox";
