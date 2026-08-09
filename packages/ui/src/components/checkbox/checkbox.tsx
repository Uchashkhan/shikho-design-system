import {
  type CSSProperties,
  type InputHTMLAttributes,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { color, radius } from "@shikho/tokens";
import { CheckIcon } from "@shikho/icons";

// docs/audit/checkboxes.md §2, §4, §14 — checkbox: size (md=24×24, sm=20×20), shape (sphere,
// square). The visible "base" box is confirmed smaller than the component's own bounding box —
// 16×16 centered inside the 20px sm footprint, 18×18 inside the 24px md footprint — not a box
// that fills its full footprint with a 2px border as the pre-rebuild implementation assumed.
export type CheckboxSize = "md" | "sm";
export type CheckboxShape = "sphere" | "square";

const outerSizePx: Record<CheckboxSize, number> = { md: 24, sm: 20 };
const boxSizePx: Record<CheckboxSize, number> = { md: 18, sm: 16 };

const squareRadius = radius.xs; // radius/border_radius_xs = 6, confirmed §8/§14

interface StateVisual {
  background: string;
  border: string;
  ring?: string;
}

const focusRingPrimary = `0 0 0 3px ${color.primary[500]}3d`; // outline/focus_primary — confirmed applied to checked_focused, §14
const focusRingGray = `0 0 0 3px ${color.gray[300]}`; // outline/focus_gray — confirmed applied to unchecked_focused, §14

// docs/audit/checkboxes.md §14 — confirmed per-state visual construction from 9
// get_design_context samples (unchecked/hover/checked/checked_focused/unchecked_focused/
// indeterminate/indeterminate_disabled/disabled at sm, plus unchecked at md). The pre-rebuild
// implementation rendered a real <input type="checkbox"> WITHOUT appearance:none, relying on the
// browser's own native checked/indeterminate indicator — which cannot reproduce Figma's actual
// checkmark glyph, tint colors, or dash artwork, and looks different in every browser.
function resolveVisual(checked: boolean, indeterminate: boolean, disabled: boolean, hover: boolean, focused: boolean): StateVisual {
  if (disabled) {
    // docs/audit/checkboxes.md §14 — confirmed via indeterminate_disabled (solid gray/400 base,
    // no border); no literal "checked_disabled" variant exists (§2/§10), so plain `disabled`
    // (necessarily unchecked) uses the same solid-gray recipe, with or without the dash.
    return { background: color.gray[400], border: "none" };
  }
  if (indeterminate) {
    // Confirmed exactly, §14: a light primary tint base (NOT a solid dark fill, unlike every
    // other "on" state in this family) with a primary/500 dash — a genuinely distinctive choice.
    return { background: color.primary[100], border: "none" };
  }
  if (checked) {
    // The confirmed instance renders as a single flattened image asset — the containing box
    // dimensions/position are confirmed, but the internal fill/checkmark colors were not
    // decomposable from it. This uses the conventional solid-fill + white-checkmark treatment
    // (derived, not confirmed) since it's the one "on" state where the asset couldn't be read.
    return {
      background: color.primary[500],
      border: "none",
      ring: focused ? focusRingPrimary : undefined, // confirmed exactly for checked_focused, §14
    };
  }
  // unchecked
  return {
    background: color.white[950],
    border: `2px solid ${focused ? color.gray[600] : hover ? color.primary[500] : color.gray[400]}`,
    ring: focused ? focusRingGray : undefined, // confirmed exactly for unchecked_focused, §14
  };
}

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
 * `checkbox` (docs/audit/checkboxes.md, deep re-audited across 9 size/shape/state combinations,
 * §14). A real `<input type="checkbox">` is kept for semantics/keyboard/AX, but is now visually
 * hidden — its checked/indeterminate/disabled/focus state drives a custom-rendered visual box,
 * since the browser's own native indicator cannot reproduce Figma's confirmed checkmark glyph,
 * tint colors, or dash artwork (a genuine correction from the pre-rebuild native-rendering
 * approach, not a stylistic preference).
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      size = "sm",
      shape = "square",
      checked,
      defaultChecked,
      indeterminate = false,
      disabled,
      className,
      style,
      onFocus,
      onBlur,
      onMouseEnter,
      onMouseLeave,
      onChange,
      ...props
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLInputElement);

    const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked ?? false);
    const [focused, setFocused] = useState(false);
    const [hovered, setHovered] = useState(false);
    const isControlled = checked !== undefined;
    const resolvedChecked = isControlled ? !!checked : uncontrolledChecked;

    useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const outerSize = outerSizePx[size];
    const boxSize = boxSizePx[size];
    const visual = resolveVisual(resolvedChecked, indeterminate, !!disabled, hovered, focused);

    const boxStyle: CSSProperties = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: boxSize,
      height: boxSize,
      background: visual.background,
      border: visual.border,
      borderRadius: shape === "square" ? squareRadius : radius.full,
      boxShadow: visual.ring,
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };

    return (
      <span
        className={"relative inline-flex shrink-0" + (className ? ` ${className}` : "")}
        style={{ width: outerSize, height: outerSize, ...style }}
      >
        <input
          ref={internalRef}
          type="checkbox"
          checked={resolvedChecked}
          disabled={disabled}
          data-size={size}
          data-shape={shape}
          data-indeterminate={indeterminate || undefined}
          className="absolute inset-0 m-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
          style={{ width: outerSize, height: outerSize }}
          onChange={(e) => {
            if (!isControlled) setUncontrolledChecked(e.target.checked);
            onChange?.(e);
          }}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          onMouseEnter={(e) => {
            setHovered(true);
            onMouseEnter?.(e);
          }}
          onMouseLeave={(e) => {
            setHovered(false);
            onMouseLeave?.(e);
          }}
          {...props}
        />
        <span aria-hidden style={boxStyle}>
          {indeterminate && (
            <span
              style={{ width: 8, height: 2, borderRadius: 1, background: disabled ? color.gray[600] : color.primary[500] }}
            />
          )}
          {!indeterminate && resolvedChecked && !disabled && (
            /* P2: was a hand-drawn stroke approximation; now the real shared checkmark. */
            <CheckIcon size={16} style={{ width: "100%", height: "100%", color: color.white[950] }} />
          )}
        </span>
      </span>
    );
  },
);

Checkbox.displayName = "Checkbox";
