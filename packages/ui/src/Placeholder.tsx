import clsx from "clsx";
import type { ReactNode } from "react";
import { tv } from "tailwind-variants";
import type { IconProps } from "@shikho/icons";
import type { tokens } from "@shikho/tokens";

// Scaffold-only component proving the tokens -> icons -> ui toolchain wires up.
// Real components land per docs/npm-design-system-implementation-plan.md §6.2 build order.

const placeholder = tv({
  base: "inline-flex items-center justify-center rounded border p-2 text-sm",
});

export interface PlaceholderProps {
  className?: string;
  children?: ReactNode;
  icon?: IconProps;
  tokenRef?: typeof tokens;
}

export function Placeholder({ className, children }: PlaceholderProps) {
  return <div className={clsx(placeholder(), className)}>{children}</div>;
}
