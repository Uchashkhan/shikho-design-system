import { type CSSProperties, type InputHTMLAttributes, forwardRef, useImperativeHandle, useRef, useState } from "react";
import { color, elevation, radius } from "@shikho/tokens";

// docs/audit/toggle.md §4, §14 — toggle: size (lg=40×24, md=40×24 — confirmed SAME bounding box
// as lg, not a typo, reproduced faithfully — sm=32×20). No `shape`/`type` property (always a
// pill-shaped switch). §14 additionally confirms the INTERNAL track/knob are drawn at different
// sizes for `md` vs `lg` despite their identical outer hit-box — see trackSizePx/knobSizePx.
export type ToggleSize = "lg" | "md" | "sm";

const boxSizePx: Record<ToggleSize, { width: number; height: number }> = {
  lg: { width: 40, height: 24 },
  md: { width: 40, height: 24 }, // confirmed identical outer box to lg (§4) — not an error
  sm: { width: 32, height: 20 },
};

// docs/audit/toggle.md §14 — confirmed exact track dimensions per size, downloaded from the real
// SVG/layer source (not derived): lg's track is drawn almost edge-to-edge of its 40×24 box (1px
// inset), while md's track is visibly narrower (3px inset) despite sharing the exact same outer
// box as lg.
const trackSizePx: Record<ToggleSize, { width: number; height: number }> = {
  lg: { width: 38, height: 22 },
  md: { width: 34, height: 20 },
  sm: { width: 28, height: 16 },
};

// docs/audit/toggle.md §14 — confirmed exact knob dimensions per size (a stadium/pill shape, NOT
// a circle — width and height differ). The knob is always inset exactly 2px from the track's
// edges on every side (both size and slide position derive from this uniform 2px inset, so no
// knob position table is needed — see the flex+padding layout below).
const knobSizePx: Record<ToggleSize, { width: number; height: number }> = {
  lg: { width: 22, height: 18 },
  md: { width: 20, height: 16 },
  sm: { width: 16, height: 12 },
};

const KNOB_INSET = 2; // confirmed uniform 2px inset on every side, all 3 sizes (§14)

const shadowToCss = (layers: readonly { x: number; y: number; blur: number; spread: number; color: string }[]) =>
  layers.map((l) => `${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${l.color}`).join(", ");
const knobShadow = shadowToCss(elevation.e2); // confirmed exact, enabled knob only — §14

const focusRing = `0 0 0 3px ${color.primary[500]}3d`; // outline/focus_primary, confirmed §8/§14

interface TrackVisual {
  trackBackground: string;
  knobBackground: string;
  knobShadow?: string;
  showCheck: boolean;
  checkColor: string;
}

// docs/audit/toggle.md §14 — every value below is read directly off the real layer/SVG source
// behind each of the 5 confirmed Figma `toggle` states (decomposed via get_design_context, not a
// flattened image this time). `disabled` always renders the same translucent-black knob with no
// shadow, regardless of ON/OFF — the checkmark is the only thing that differs between disabled
// ON and disabled OFF. Focus never changes the track/knob fill — it only adds a ring on the
// track, applied separately by the caller, since focus is confirmed to only ever combine with
// `checked` (§2 — there is no `switch_OFF_focused` variant).
function resolveVisual(checked: boolean, disabled: boolean): TrackVisual {
  if (disabled) {
    return {
      trackBackground: color.gray[100], // Color/disabled_base_em, confirmed = gray/100 (#f4f4f6)
      knobBackground: color.black[100], // confirmed translucent black, no shadow
      showCheck: checked,
      checkColor: color.gray[100], // confirmed muted checkmark color on disabled ON
    };
  }
  if (checked) {
    return {
      trackBackground: color.primary[500],
      knobBackground: color.white[950],
      knobShadow,
      showCheck: true,
      checkColor: color.primary[500],
    };
  }
  return {
    trackBackground: color.gray[200],
    knobBackground: color.white[950],
    knobShadow,
    showCheck: false,
    checkColor: "",
  };
}

export interface ToggleProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "checked"> {
  size?: ToggleSize;
  /**
   * ON/OFF state. Figma's own `state` enum spells this `switch_ON`/`switch_OFF` (docs/audit/
   * toggle.md §2). This component uses the standard native `checked`/`defaultChecked` props
   * instead of inventing a `switchOn` prop name, for the same "use native semantics" reason
   * applied to Checkbox and Radio.
   */
  checked?: boolean;
  defaultChecked?: boolean;
}

/**
 * `toggle` (docs/audit/toggle.md, ground-truth re-audited via `get_design_context` across all 5
 * confirmed states at all 3 sizes, §14). A real `<input type="checkbox" role="switch">` is kept
 * for semantics/keyboard/AX, visually hidden — a sibling `aria-hidden` track+knob renders the
 * confirmed pill track and sliding stadium-shaped knob (with a checkmark when ON), since the
 * previous implementation rendered a bare native checkbox with no custom visual at all, which
 * browsers draw as a plain checkbox square, not a switch.
 */
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ size = "md", checked, defaultChecked, disabled, className, style, onFocus, onBlur, onChange, ...props }, ref) => {
    const internalRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLInputElement);

    const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked ?? false);
    const [focused, setFocused] = useState(false);
    const isControlled = checked !== undefined;
    const resolvedChecked = isControlled ? !!checked : uncontrolledChecked;

    const box = boxSizePx[size];
    const track = trackSizePx[size];
    const knob = knobSizePx[size];
    const visual = resolveVisual(resolvedChecked, !!disabled);

    const trackStyle: CSSProperties = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      boxSizing: "border-box",
      width: track.width,
      height: track.height,
      padding: KNOB_INSET,
      background: visual.trackBackground,
      borderRadius: radius.full,
      boxShadow: resolvedChecked && focused ? focusRing : undefined,
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: resolvedChecked ? "flex-end" : "flex-start",
    };

    const knobStyle: CSSProperties = {
      width: knob.width,
      height: knob.height,
      borderRadius: radius.full,
      background: visual.knobBackground,
      boxShadow: visual.knobShadow,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    };

    return (
      <span
        className={"relative inline-flex shrink-0" + (className ? ` ${className}` : "")}
        style={{ width: box.width, height: box.height, ...style }}
      >
        <input
          ref={internalRef}
          type="checkbox"
          role="switch"
          {...(isControlled ? { checked: resolvedChecked } : { defaultChecked })}
          disabled={disabled}
          data-size={size}
          className="absolute inset-0 m-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
          style={{ width: box.width, height: box.height }}
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
          {...props}
        />
        <span aria-hidden style={trackStyle}>
          <span style={knobStyle}>
            {visual.showCheck && (
              <svg width="60%" height="60%" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M13.6061 5.70708C13.9965 6.09751 13.9965 6.73052 13.6062 7.12099L9.95011 10.7778C9.55959 11.1683 8.92637 11.1684 8.53582 10.7778L6.707 8.949C6.31653 8.55853 6.31653 7.92547 6.707 7.535C7.09747 7.14453 7.73053 7.14454 8.121 7.535L9.243 8.657L12.192 5.70718C12.5825 5.31663 13.2156 5.31659 13.6061 5.70708Z"
                  fill={visual.checkColor}
                />
              </svg>
            )}
          </span>
        </span>
      </span>
    );
  },
);

Toggle.displayName = "Toggle";
