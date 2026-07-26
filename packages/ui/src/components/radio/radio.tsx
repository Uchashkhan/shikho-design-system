import {
  type CSSProperties,
  type InputHTMLAttributes,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { color, radius } from "@shikho/tokens";

// docs/audit/radio-buttons.md §4, §15 — radio: size (md=24×24, sm=20×20), inner circle 18/16.
// No `shape`/`type` property exists at all — radio is always circular.
export type RadioSize = "md" | "sm";

const outerSizePx: Record<RadioSize, number> = { md: 24, sm: 20 };
const innerSizePx: Record<RadioSize, number> = { md: 18, sm: 16 };
// docs/audit/radio-buttons.md §15 — the "active" (selected) dot is a punched-out white circle
// inside the primary-filled disc: r=3 of an 8-radius sm disc, r=4 of a 9-radius md disc,
// downloaded directly from the confirmed SVG source (not derived by analogy).
const dotSizePx: Record<RadioSize, number> = { md: 8, sm: 6 };
// docs/audit/radio-buttons.md §15 — the indeterminate/disabled "dash" mark is a fixed 8×2px
// rounded pill at BOTH confirmed sizes (not scaled with the box) — confirmed via the raw SVG.
const DASH_WIDTH = 8;
const DASH_HEIGHT = 2;

const focusRingPrimary = `0 0 0 3px ${color.primary[500]}3d`; // outline/focus_primary, confirmed §15
const focusRingGray = `0 0 0 3px ${color.gray[300]}`; // outline/focus_gray, confirmed §15

type Mark = "dot" | "dash" | null;

interface StateVisual {
  background: string;
  border: string;
  ring?: string;
  mark: Mark;
  markColor: string;
}

// docs/audit/radio-buttons.md §15 — every value below is read directly off the real SVG source
// behind each of the 7 confirmed Figma `radio` states (downloaded via the get_design_context
// asset URLs), not derived by analogy to Checkbox. `disabled` always shows the gray dash mark
// regardless of `checked`/`indeterminate`, because Figma confirms exactly ONE `disabled` variant
// (no disabled+checked / disabled+indeterminate matrix exists).
function resolveVisual(checked: boolean, indeterminate: boolean, disabled: boolean, hover: boolean, focused: boolean): StateVisual {
  if (disabled) {
    return { background: color.gray[400], border: "none", mark: "dash", markColor: color.gray[600] };
  }
  if (indeterminate) {
    return { background: color.primary[100], border: "none", mark: "dash", markColor: color.primary[500] };
  }
  if (checked) {
    return {
      background: color.primary[500],
      border: "none",
      ring: focused ? focusRingPrimary : undefined,
      mark: "dot",
      markColor: color.white[950],
    };
  }
  if (focused) {
    return {
      background: color.white[950],
      border: `2px solid ${color.gray[600]}`,
      ring: focusRingGray,
      mark: null,
      markColor: "",
    };
  }
  if (hover) {
    // docs/audit/radio-buttons.md §15 — confirmed transparent fill on hover, not white.
    return { background: "transparent", border: `2px solid ${color.primary[500]}`, mark: null, markColor: "" };
  }
  return { background: color.white[950], border: `2px solid ${color.gray[400]}`, mark: null, markColor: "" };
}

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "checked"> {
  size?: RadioSize;
  /**
   * Selected/unselected state. Figma's own `state` enum uses `active`/`inactive` for this
   * concept (docs/audit/radio-buttons.md §2, §10). This component uses the standard native
   * `checked`/`defaultChecked` props instead of inventing a parallel `active` prop name, since
   * `<input type="radio">` has a real native `checked` semantic.
   */
  checked?: boolean;
  defaultChecked?: boolean;
  /**
   * Maps to the confirmed `indeterminate` state value (§2, §10). `<input type="radio">` has no
   * native `indeterminate` DOM property in any browser, so this drives a custom-rendered visual
   * (a confirmed pill-shaped dash mark, §15) rather than a native property.
   */
  indeterminate?: boolean;
}

/**
 * `radio` (docs/audit/radio-buttons.md, ground-truth re-audited from the real SVG source behind
 * every confirmed state, §15). A real `<input type="radio">` is kept for semantics/keyboard/AX,
 * visually hidden — its checked/indeterminate/disabled/focus/hover state drives a custom-rendered
 * visual (ring, disc, dot, or dash), matching the exact geometry and colors confirmed for each of
 * the 7 Figma states, since the browser's native indicator cannot reproduce any of it.
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      size = "sm",
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

    const outerSize = outerSizePx[size];
    const innerSize = innerSizePx[size];
    const visual = resolveVisual(resolvedChecked, indeterminate, !!disabled, hovered, focused);

    const circleStyle: CSSProperties = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      boxSizing: "border-box",
      width: innerSize,
      height: innerSize,
      background: visual.background,
      border: visual.border,
      borderRadius: radius.full,
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
          type="radio"
          {...(isControlled ? { checked: resolvedChecked } : { defaultChecked })}
          disabled={disabled}
          data-size={size}
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
        <span aria-hidden style={circleStyle}>
          {visual.mark === "dot" && (
            <span
              style={{
                width: dotSizePx[size],
                height: dotSizePx[size],
                borderRadius: radius.full,
                background: visual.markColor,
              }}
            />
          )}
          {visual.mark === "dash" && (
            <span
              style={{
                width: DASH_WIDTH,
                height: DASH_HEIGHT,
                borderRadius: radius.full,
                background: visual.markColor,
              }}
            />
          )}
        </span>
      </span>
    );
  },
);

Radio.displayName = "Radio";
