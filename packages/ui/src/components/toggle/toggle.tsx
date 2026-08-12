import { type CSSProperties, type InputHTMLAttributes, forwardRef, useImperativeHandle, useRef, useState } from "react";
import { color, elevation, radius } from "@shikho/tokens";
import { CheckIcon } from "@shikho/icons";

// docs/audit/toggle.md §4, §14 — toggle: size (lg=40×24, md=40×24 — confirmed SAME bounding box
// as lg, not a typo, reproduced faithfully — sm=32×20). No `shape`/`type` property (always a
// pill-shaped switch). §14 additionally confirms the INTERNAL track/knob are drawn at different
// sizes for `md` vs `lg` despite their identical outer hit-box — see trackSizePx/knobSizePx.
export type ToggleSize = "lg" | "md" | "sm";

// docs/audit/toggle.md §2 — Figma's own `state` property is a genuine 5-value variant axis
// (literal casing/values preserved verbatim, including the mixed-case `switch_ON_disabled`):
// switch_OFF, switch_ON, switch_ON_focused, switch_OFF_disabled, switch_ON_disabled. Confirmed
// asymmetric: only switch_ON gets a _focused variant (no switch_OFF_focused), and there's no
// hover state at all. Previously there was no way to force any of this for a static preview —
// switch_ON_focused specifically only ever appeared while a real cursor/keyboard was actively
// focusing the element (the same gap already fixed on radio.tsx's `state` prop).
export type ToggleState =
  | "switch_OFF"
  | "switch_ON"
  | "switch_ON_focused"
  | "switch_OFF_disabled"
  | "switch_ON_disabled";

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
  /** Forces a specific Figma-confirmed visual state (used by Storybook/playground controls to
   * preview `switch_ON_focused` without a live cursor/keyboard). Left unset, the real
   * checked/disabled state plus actual keyboard focus drive it — see `radio.tsx` for the
   * identical fix and its rationale. */
  state?: ToggleState;
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
  ({ size = "md", checked, defaultChecked, disabled, state, className, style, onFocus, onBlur, onChange, ...props }, ref) => {
    const internalRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLInputElement);

    const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked ?? false);
    const [focused, setFocused] = useState(false);
    const isControlled = checked !== undefined;
    const resolvedChecked = isControlled ? !!checked : uncontrolledChecked;

    // An explicit `state` always overrides the real interaction-derived values below — see
    // radio.tsx for the identical pattern.
    const effective = state
      ? {
          checked: state === "switch_ON" || state === "switch_ON_focused" || state === "switch_ON_disabled",
          disabled: state === "switch_OFF_disabled" || state === "switch_ON_disabled",
          focused: state === "switch_ON_focused",
        }
      : { checked: resolvedChecked, disabled: !!disabled, focused };
    const resolvedState: ToggleState =
      state ??
      (effective.disabled
        ? effective.checked
          ? "switch_ON_disabled"
          : "switch_OFF_disabled"
        : effective.checked
          ? effective.focused
            ? "switch_ON_focused"
            : "switch_ON"
          : "switch_OFF");

    const box = boxSizePx[size];
    const track = trackSizePx[size];
    const knob = knobSizePx[size];
    const visual = resolveVisual(effective.checked, effective.disabled);

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
      boxShadow: effective.checked && effective.focused ? focusRing : undefined,
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: effective.checked ? "flex-end" : "flex-start",
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
          // When `state` is forced, the native input's checked/disabled must follow it too —
          // otherwise the visual track/knob shows one thing while the real, accessible/testable
          // element (what screen readers and .toBeChecked() actually see) shows another.
          {...(state ? { checked: effective.checked } : isControlled ? { checked: resolvedChecked } : { defaultChecked })}
          disabled={effective.disabled}
          data-size={size}
          data-state={resolvedState}
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
              /* P2: this glyph WAS already the real export — it is now the single shared
                 source in `@shikho/icons`, which Checkbox also consumes. */
              <CheckIcon style={{ width: "60%", height: "60%", color: visual.checkColor }} />
            )}
          </span>
        </span>
      </span>
    );
  },
);

Toggle.displayName = "Toggle";
