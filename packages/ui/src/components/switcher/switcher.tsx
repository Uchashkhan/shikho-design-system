import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { color, radius } from "@shikho/tokens";
import { SwitcherItem, type SwitcherItemSize } from "./switcher_item";

// docs/audit/switcher-deep-audit.md §1 — switcher: confirmed a real composed container (not a
// demo, unlike sidebar_nav) — bg gray-100, border gray-100, radius.lg, padding spacing/4 (4px),
// gap spacing/8. Resolves switcher.md's own flagged mystery: the container's 8px-taller bounding
// box vs. switcher_item at every size step is just this 4px top+bottom padding, not a different
// inner item scale.
export type SwitcherSize = SwitcherItemSize;

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
        gap: "0.5rem",
        padding: "0.25rem",
        backgroundColor: color.gray[100],
        border: `1px solid ${color.gray[100]}`,
        borderRadius: radius.lg,
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
