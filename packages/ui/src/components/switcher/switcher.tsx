import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { color, radius } from "@shikho/tokens";
import { SwitcherItem, type SwitcherItemSize } from "./switcher_item";

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
}

/**
 * `switcher` (docs/audit/switcher-deep-audit.md §1) — a confirmed real segmented-control
 * container composing multiple `SwitcherItem`-shaped segments, the same "compose, don't
 * duplicate" treatment already given to `ButtonGroup`. The selected option renders as
 * `type="active_primary_accent"`; every other option renders as `type="inactive"` — the
 * confirmed default/active pairing read directly off the container's own nested sample.
 */
export const Switcher = forwardRef<HTMLDivElement, SwitcherProps>(
  ({ size = "lg", options, value, onChange, style, ...props }, ref) => (
    <div
      ref={ref}
      data-size={size}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: CONTAINER_GAP[size], // confirmed per-size — see the note above the size maps
        padding: "0.25rem", // spacing/4 — confirmed
        backgroundColor: color.gray[100],
        border: `1px solid ${color.gray[100]}`,
        borderRadius: CONTAINER_RADIUS[size], // confirmed per-size — see the note above the size maps
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
            type={isSelected ? "active_primary_accent" : "inactive"}
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
