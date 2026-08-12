import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { color, radius } from "@shikho/tokens";
import { SwitcherItem, type SwitcherItemSize, type SwitcherItemState, type SwitcherItemType, type SwitcherShape } from "./switcher_item";

// docs/audit/switcher-deep-audit.md §1 — switcher: confirmed a real composed container (not a
// demo, unlike sidebar_nav) — bg gray-100, border gray-100, padding spacing/4 (4px) at every
// size. Resolves switcher.md's own flagged mystery: the container's 8px-taller bounding box vs.
// switcher_item at every size step is just this 4px top+bottom padding, not a different inner
// item scale.
//
// gap and radius genuinely vary per size — re-confirmed via a live get_design_context pull on
// all 5 of the container's own size samples (66065:22644/51/58/65/72), not derived from a single
// size like the previous implementation's hardcoded 6px/radius.md. gap is deliberately
// non-monotonic (xs=6, sm=8, md=6, lg=12, xl=16px) — confirmed as-is, not smoothed into a ramp.
export type SwitcherSize = SwitcherItemSize;

const CONTAINER_GAP: Record<SwitcherSize, string> = {
  xs: "0.375rem", // spacing/6
  sm: "0.5rem", // spacing/8
  md: "0.375rem", // spacing/6 — confirmed, not a typo; see note above
  lg: "0.75rem", // spacing/12
  xl: "1rem", // spacing/16
};
const CONTAINER_RADIUS: Record<SwitcherSize, number> = {
  xs: radius.md,
  sm: radius.lg,
  md: radius.lg,
  lg: radius.xl,
  xl: radius.xl,
};

/** Not part of the original Figma audit — a requested addition. Maps the 3-value "which brand
 * treatment should the selected segment use" axis onto 3 of `SwitcherItemType`'s 5 already-
 * confirmed values, rather than inventing new colors: `accent` is the confirmed default (soft
 * primary/500 tint, `active_primary_accent`) already used by every existing Switcher instance;
 * `primary` is the solid primary/500 fill (`active_primary`); `dark` is the solid black/950 fill
 * (`active_neutral`). `active`'s neutral-white/bordered treatment has no slot in this axis — it
 * stays reachable directly via `SwitcherItem`. */
export type SwitcherSelectedColor = "primary" | "accent" | "dark";

const SELECTED_TYPE: Record<SwitcherSelectedColor, SwitcherItemType> = {
  primary: "active_primary",
  accent: "active_primary_accent",
  dark: "active_neutral",
};

export interface SwitcherOption {
  label: ReactNode;
  value: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export interface SwitcherProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  size?: SwitcherSize;
  options: SwitcherOption[];
  value?: string;
  onChange?: (value: string) => void;
  /** Not part of the original Figma audit — a requested addition. Which of the 3 confirmed
   * selected-segment treatments to use; default `"accent"` matches every prior Switcher
   * instance's unchanged behavior. */
  selectedColor?: SwitcherSelectedColor;
  /** Not part of the original Figma audit — a requested addition. `pill` gives the container and
   * every segment a true stadium radius. */
  shape?: SwitcherShape;
  /** Forces the SELECTED segment's state (e.g. to preview `hover` without a pointer, matching the
   * `state` override pattern used system-wide). Unselected segments always derive hover from the
   * real pointer, matching normal usage. */
  state?: SwitcherItemState;
}

/**
 * `switcher` (docs/audit/switcher-deep-audit.md §1) — a confirmed real segmented-control
 * container composing multiple `SwitcherItem`-shaped segments, the same "compose, don't
 * duplicate" treatment already given to `ButtonGroup`. The selected option renders as
 * `type=SELECTED_TYPE[selectedColor]` (default `active_primary_accent`, matching the confirmed
 * default/active pairing read directly off the container's own nested sample); every other
 * option renders as `type="inactive"`.
 */
export const Switcher = forwardRef<HTMLDivElement, SwitcherProps>(
  ({ size = "lg", options, value, onChange, selectedColor = "accent", shape = "default", state, style, ...props }, ref) => (
    <div
      ref={ref}
      data-size={size}
      data-shape={shape}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: CONTAINER_GAP[size], // confirmed per-size — see the note above the size maps
        padding: "0.25rem", // spacing/4 — confirmed
        backgroundColor: color.gray[100],
        border: `1px solid ${color.gray[100]}`,
        borderRadius: shape === "pill" ? radius.full : CONTAINER_RADIUS[size], // confirmed per-size — see the note above the size maps
        ...style,
      }}
      {...props}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <SwitcherItem
            key={option.value}
            size={size}
            type={isSelected ? SELECTED_TYPE[selectedColor] : "inactive"}
            shape={shape}
            state={isSelected ? state : undefined}
            leftIcon={Boolean(option.leftIcon)}
            rightIcon={Boolean(option.rightIcon)}
            selectLeftIcon={option.leftIcon}
            selectRightIcon={option.rightIcon}
            aria-pressed={isSelected}
            onClick={() => onChange?.(option.value)}
          >
            {option.label}
          </SwitcherItem>
        );
      })}
    </div>
  ),
);

Switcher.displayName = "Switcher";
