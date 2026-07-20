import { type ButtonHTMLAttributes, type CSSProperties, type ReactNode, forwardRef } from "react";
import { color, elevation, focusRingColor, radius } from "@shikho/tokens";
import { tv } from "tailwind-variants";

// docs/audit/chips.md §2 — chip: size (lg, md, sm), type (unselected, selected,
// selected_neutral, Green, Red — casing preserved exactly, including the confirmed mismatch
// between the lowercase trio and the capitalized Green/Red), state (disabled, focus, hover,
// drag, default).
export type ChipSize = "lg" | "md" | "sm";
export type ChipType = "unselected" | "selected" | "selected_neutral" | "Green" | "Red";
export type ChipState = "disabled" | "focus" | "hover" | "drag" | "default";

// docs/audit/chips.md §4, §9 — only `md`'s height (32px) is exactly confirmed via
// get_design_context; `lg` (≈40px) and `sm` (≈24px) are approximate overview-level bounding-box
// observations (the audit's own "≈" prefix), reproduced as-is rather than rounded or guessed
// further. Width is never fixed at any size — the root is a Hug (content-driven) container.
const heightPx: Record<ChipSize, number> = { lg: 40, md: 32, sm: 24 };

const chipRadius = radius.full; // radius/border_radius_round (1000) — the ONLY radius token, §7/§9
const iconSize = 16; // sizing/icon/16, confirmed applied §7/§9

// docs/audit/chips.md §9 — elevation/e2-matching drop-shadows confirmed on the icon slots
// (not the root chip). Converted from @shikho/tokens' elevation.e2 shadow-layer data.
const iconShadow = elevation.e2
  .map((l) => `${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${l.color}`)
  .join(", ");

interface FillTextPair {
  backgroundColor: string;
  color: string;
}

// Only `type="selected"` has an exactly confirmed fill/text pair (§9: fill Color/primary/200,
// text Text/primary-600, both bound directly to the deep-audited instance). The other four
// values have no confirmed visual at all (§8: "plausible but unconfirmed"; §12: structural/color
// differences for unselected/selected_neutral never inspected). Each derivation below is
// documented in packages/ui/src/components/chip/README.md — none is a fabricated color, only a
// choice of which already-confirmed-elsewhere token to apply to an unconfirmed slot.
const fillByType: Record<ChipType, FillTextPair> = {
  selected: { backgroundColor: color.primary[200], color: color.primary[600] }, // confirmed, §9
  unselected: { backgroundColor: color.gray[100], color: color.gray[700] }, // derived, §8 lists both in chip's own export
  selected_neutral: { backgroundColor: color.gray[200], color: color.gray[700] }, // derived, one step darker than unselected
  Green: { backgroundColor: color.success[500], color: color.white[950] }, // derived from the audit's own "plausible" mapping, §8/§11
  Red: { backgroundColor: color.danger[500], color: color.white[950] }, // derived from the audit's own "plausible" mapping, §8/§11
};

const chipStyles = tv({
  base:
    "inline-flex items-center justify-center cursor-pointer transition-colors outline-none " +
    "disabled:cursor-not-allowed disabled:opacity-50 " +
    "focus-visible:shadow-[var(--chip-focus-ring)]",
  variants: {
    size: { lg: "", md: "", sm: "" },
    type: { unselected: "", selected: "", selected_neutral: "", Green: "", Red: "" },
  },
  defaultVariants: { size: "md", type: "selected" },
});

export interface ChipProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "color"> {
  size?: ChipSize;
  type?: ChipType;
  state?: ChipState;
  /** Confirmed boolean property, default true (§9). */
  leftIcon?: boolean;
  /** Confirmed boolean property, default true (§9). */
  rightIcon?: boolean;
  /** Confirmed boolean property, default true (§9). */
  text?: boolean;
  /** Confirmed instance-swap property, `ReactNode | null`, default `null` (§9). */
  selectLeftIcon?: ReactNode | null;
  /** Confirmed instance-swap property, `ReactNode | null`, default `null` (§9). */
  selectRightIcon?: ReactNode | null;
  textContent?: ReactNode;
}

/**
 * `chip` (docs/audit/chips.md, deep-audited at `size=md type=selected state=focus`). Renders as
 * a real `<button>` — the audit found no dedicated selection-indicator or dismiss-control layer
 * (§5, §9: "the deep audit found no dedicated selection-indicator or dismiss-control layer"), so
 * none is invented here; `type` is a controlled prop the consumer sets, matching how Figma
 * itself models chip selection (§11 cross-reference: chip's selection concept lives in `type`,
 * not a native-checkbox-like `state`).
 *
 * Only `type="selected"` (fill, text color, radius, focus ring) is exactly confirmed. The other
 * 4 `type` values, and every `state` besides `focus`, have no confirmed visual — see
 * packages/ui/src/components/chip/README.md for exactly what's confirmed vs. derived, and why
 * `Green`/`Red` structurally only support `state="default"` (a confirmed coverage gap, §3).
 */
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      size = "md",
      type = "selected",
      state = "default",
      leftIcon = true,
      rightIcon = true,
      text = true,
      selectLeftIcon = null,
      selectRightIcon = null,
      textContent,
      disabled,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || state === "disabled";
    const isFocusVariant = state === "focus";
    const fillText = fillByType[type];

    const iconSlotStyle: CSSProperties = {
      width: iconSize,
      height: iconSize,
      flexShrink: 0,
      boxShadow: iconShadow,
    };

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        data-size={size}
        data-type={type}
        data-state={state}
        className={chipStyles({ size, type, className })}
        style={{
          height: heightPx[size],
          gap: "0.125rem", // gap-[spacing/2, 2px] — §9
          padding: "0.5rem", // p-[spacing/8, 8px] uniform — §9
          borderRadius: chipRadius,
          border: "none",
          ...fillText,
          ["--chip-focus-ring" as string]: `0 0 0 3px ${focusRingColor.primary}`,
          ...(isFocusVariant ? { boxShadow: `0 0 0 3px ${focusRingColor.primary}` } : {}),
          ...style,
        }}
        {...props}
      >
        {leftIcon && <span style={iconSlotStyle}>{selectLeftIcon}</span>}
        {text && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0 0.125rem", // px-[spacing/2, 2px] — §9
              gap: "0.5rem", // gap-[spacing/8, 8px] — §9
              fontSize: 12,
              lineHeight: "16px",
              fontWeight: 500, // web/Body/12 Medium — §9
            }}
          >
            {textContent}
          </span>
        )}
        {rightIcon && <span style={iconSlotStyle}>{selectRightIcon}</span>}
      </button>
    );
  },
);

Chip.displayName = "Chip";
