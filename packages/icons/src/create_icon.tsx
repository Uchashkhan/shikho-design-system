import { forwardRef } from "react";
import type { IconProps } from "./types";

export interface IconDefinition {
  /** Stable kebab-case name, matching the Figma layer/glyph it was exported from. */
  name: string;
  /**
   * The glyph's ORIGINAL viewBox, preserved verbatim from the Figma export. Several glyphs are
   * not square (chevrons are 6.19 × 10.69); SVG's default `preserveAspectRatio` centres them
   * inside the rendered box without distortion, so the geometry stays exact at any size.
   */
  viewBox: string;
  /** Path data exactly as exported. Never re-drawn, re-scaled or "tidied". */
  path: string;
  /**
   * `fill` glyphs paint with `currentColor` (the common case). `stroke` glyphs are declared
   * explicitly rather than assumed — none exist yet, but the field keeps the contract honest.
   */
  paintMode?: "fill" | "stroke";
}

/**
 * Builds a tree-shakeable icon component from a confirmed Figma glyph.
 *
 * Every icon renders at `size` (default 18) painting with `currentColor`, so consumers control
 * colour through normal CSS inheritance rather than a prop. `aria-hidden` is applied by default —
 * these are decorative glyphs; a consumer that needs a semantic icon passes `role="img"` plus a
 * label and it overrides cleanly through the spread.
 */
export type IconComponent = ReturnType<typeof forwardRef<SVGSVGElement, IconProps>> & {
  /** The source definition, attached so geometry can be asserted without a DOM. */
  definition: IconDefinition;
};

export function createIcon(def: IconDefinition): IconComponent {
  const Icon = forwardRef<SVGSVGElement, IconProps>(({ size = 18, ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox={def.viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={props["aria-label"] ? undefined : true}
      data-icon={def.name}
      {...props}
    >
      <path
        d={def.path}
        {...(def.paintMode === "stroke"
          ? { stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const }
          : { fill: "currentColor", fillRule: "evenodd" as const, clipRule: "evenodd" as const })}
      />
    </svg>
  ));
  Icon.displayName = `${def.name}Icon`;
  return Object.assign(Icon, { definition: def });
}
