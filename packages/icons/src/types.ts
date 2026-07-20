import type { SVGProps } from "react";
import type { tokens } from "@shikho/tokens";

export type IconSize = 14 | 16 | 18 | 20 | 22 | 24 | 28;

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: IconSize;
}

// Referenced to keep the icons -> tokens dependency real (not just declared in package.json).
export type TokenShape = typeof tokens;
