import {
  type InputHTMLAttributes,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { color, radius } from "@shikho/tokens";
import { tv } from "tailwind-variants";

// docs/audit/radio-buttons.md §2, §4 — radio: size (md=24×24, sm=20×20). No `shape`/`type`
// property exists at all — radio is always circular, unlike checkbox's sphere/square choice.
export type RadioSize = "md" | "sm";

const sizePx: Record<RadioSize, number> = { md: 24, sm: 20 };

// docs/audit/radio-buttons.md §8 confirms NO radius/border_radius_round and NO radius/custom/*
// token was found bound anywhere in this component's subtree — a confirmed gap in the audit
// data (radio's circularity may be achieved via a hardcoded, non-tokenized value in Figma), not
// a design ambiguity: "radio button" is unambiguously circular regardless of which mechanism
// Figma uses. `radius.full` is the only sensible implementation of that, using an
// already-confirmed general-purpose token rather than a new literal.
const radioRadius = radius.full;

// docs/audit/radio-buttons.md §6/§9 explicitly states this family's color/token export is
// "token-for-token identical to the Checkboxes overview's color export," and §11/§12 confirm
// radio and checkbox share identical size dimensions and draw from the same token pool. Unlike
// checkbox, no `get_design_context` deep audit exists for radio at all (§6), and no sibling
// audit (e.g. list.md) nests a `radio` instance the way it nests `checkbox` (§11: "no evidence
// ... that radio is nested inside list") — so there is no cross-reference pinning down radio's
// actual applied border/fill. This reuses checkbox's own confirmed resting values (white fill,
// 2px Text/gray-400 border) as the least-invented available baseline, documented here rather
// than presented as an independent confirmation.
const restingFill = color.white[950]; // Color/White 100 / Color/white/950 = #ffffff
const restingBorder = color.gray[400]; // Text/gray-400 (reused from Checkbox's confirmed value)

// docs/audit/radio-buttons.md §8 — outline/focus_gray = Effect(DROP_SHADOW, outline/Gray 300,
// 0,0,0,3), identical definition to checkboxes.md. §8/§13 flag that both outline/focus_primary
// and outline/focus_gray are "plausible candidates" for active_focused/inactive_focused, with
// the actual assignment unconfirmed — same situation as Checkbox, resolved the same way: apply
// the neutral gray candidate uniformly rather than presume an unconfirmed primary/gray split.
const focusRingColor = color.gray[300]; // outline/Gray 300

const radioStyles = tv({
  base:
    "cursor-pointer transition-colors outline-none " +
    "disabled:cursor-not-allowed disabled:opacity-50 " +
    "focus-visible:shadow-[var(--radio-focus-ring)]",
  variants: {
    size: { md: "", sm: "" },
  },
  defaultVariants: { size: "sm" },
});

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "checked"> {
  size?: RadioSize;
  /**
   * Selected/unselected state. Figma's own `state` enum uses `active`/`inactive` for this
   * concept (docs/audit/radio-buttons.md §2, §10 — "the clearest cross-component naming
   * divergence" vs. checkbox's `checked`/`unchecked`). This component uses the standard native
   * `checked`/`defaultChecked` props instead of inventing a parallel `active` prop name, since
   * `<input type="radio">` has a real native `checked` semantic and there's no reason to diverge
   * from what the browser and assistive tech already expect — the same principle applied to
   * Checkbox (requirement to use native semantics where possible).
   */
  checked?: boolean;
  defaultChecked?: boolean;
  /**
   * Maps to the confirmed (if conventionally unusual) `indeterminate` state value (§2, §10 —
   * flagged by the audit itself as "unusual for a mutually-exclusive radio control," not
   * explained). Unlike Checkbox, `<input type="radio">` has **no native `indeterminate` DOM
   * property** in any browser — HTML only defines that for checkboxes. There is also no
   * confirmed visual for it anywhere in this audit (no `get_design_context` was run at all, §6).
   * This prop is therefore exposed only as a `data-indeterminate` attribute for structural
   * fidelity to the confirmed Figma enum — it has no native behavior and no styling attached,
   * rather than inventing either.
   */
  indeterminate?: boolean;
}

/**
 * `radio` (docs/audit/radio-buttons.md). Renders a real `<input type="radio">` — native
 * semantics are used deliberately, same rationale as `Checkbox`: there is no confirmed
 * selected-state artwork anywhere in this audit (no `get_design_context` deep audit exists for
 * this family at all, §6), so the browser's own native selected-dot rendering is used rather
 * than invented. The one applied visual (resting border/fill) is reused from `Checkbox`'s own
 * confirmed value, not independently confirmed for `radio` — see
 * packages/ui/src/components/radio/README.md for the full confirmed-vs-derived breakdown.
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ size = "sm", indeterminate = false, disabled, className, style, ...props }, ref) => {
    const internalRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLInputElement);

    // No-op on real radio semantics (see the `indeterminate` prop doc above) — kept only so a
    // future consumer/CSS hook has a stable attribute to target once this is resolved further.
    useEffect(() => {
      if (internalRef.current) {
        internalRef.current.dataset.indeterminate = indeterminate ? "true" : undefined;
      }
    }, [indeterminate]);

    const boxSize = sizePx[size];

    return (
      <input
        ref={internalRef}
        type="radio"
        disabled={disabled}
        data-size={size}
        className={radioStyles({ size, className })}
        style={{
          width: boxSize,
          height: boxSize,
          margin: 0,
          backgroundColor: restingFill,
          border: `2px solid ${restingBorder}`,
          borderRadius: radioRadius,
          ["--radio-focus-ring" as string]: `0 0 0 3px ${focusRingColor}`,
          ...style,
        }}
        {...props}
      />
    );
  },
);

Radio.displayName = "Radio";
