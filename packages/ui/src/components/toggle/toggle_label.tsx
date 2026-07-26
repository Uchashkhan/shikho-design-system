import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { color } from "@shikho/tokens";
import { Toggle, type ToggleProps } from "./toggle";

// docs/audit/toggle.md §14 — toggle_label: size (sm, md — note `toggle` itself has a third `lg`
// size, but `toggle_label` is only confirmed at sm/md), direction (left, right). Confirmed via
// get_design_context on all 4 variants to compose a real nested `Toggle` instance plus a
// label/caption text column, matching the `checkbox_label`/`radio_label` property structure —
// though `toggle_label`'s own bounding box is confirmed larger than either sibling (§4, §11).
export type ToggleLabelSize = "sm" | "md";
export type ToggleLabelDirection = "left" | "right";

export interface ToggleLabelProps extends Omit<HTMLAttributes<HTMLLabelElement>, "children"> {
  size?: ToggleLabelSize;
  direction?: ToggleLabelDirection;
  /** Confirmed component property, default true (§14). */
  label?: boolean;
  /** Confirmed component property, default true (§14). */
  caption?: boolean;
  labelContent?: ReactNode;
  captionContent?: ReactNode;
  toggleProps?: Omit<ToggleProps, "size">;
}

// docs/audit/toggle.md §14 — UNLIKE `checkbox_label`/`radio_label` (whose `md` label drops to
// Regular/400 weight), Toggle's own label is confirmed Medium/500 weight at BOTH sizes — only the
// font size/line-height changes (body_1 13/20 at md, caption_2 12/16 at sm, matching the caption).
const labelTypographyBySize: Record<ToggleLabelSize, { fontWeight: number; fontSize: number; lineHeight: string }> = {
  md: { fontWeight: 500, fontSize: 13, lineHeight: "20px" },
  sm: { fontWeight: 500, fontSize: 12, lineHeight: "16px" },
};

/**
 * `toggle_label` (docs/audit/toggle.md §14, ground-truth re-audited across all 4 size × direction
 * variants). Composes the real `Toggle` component plus a label/caption text column — confirmed
 * real (label `Text/gray-950`; caption `Text/gray-700` at `caption_2`/Medium 500 weight; label
 * itself is Medium/500 weight at both sizes, unlike Checkbox/Radio's md label).
 */
export const ToggleLabel = forwardRef<HTMLLabelElement, ToggleLabelProps>(
  (
    {
      size = "md",
      direction = "left",
      label = true,
      caption = true,
      labelContent,
      captionContent,
      toggleProps,
      style,
      ...props
    },
    ref,
  ) => {
    const labelTypography = labelTypographyBySize[size];
    const toggleEl = <Toggle size={size} {...toggleProps} />;
    const textEl = label && (
      <span style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
        <span style={{ fontFamily: "inherit", color: color.gray[950], ...labelTypography }}>
          {labelContent}
        </span>
        {caption && (
          <span style={{ fontWeight: 500, fontSize: 12, lineHeight: "16px", color: color.gray[700] }}>
            {captionContent}
          </span>
        )}
      </span>
    );

    return (
      <label
        ref={ref}
        data-size={size}
        data-direction={direction}
        style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", cursor: "pointer", ...style }}
        {...props}
      >
        {direction === "left" ? (
          <>
            {toggleEl}
            {textEl}
          </>
        ) : (
          <>
            {textEl}
            {toggleEl}
          </>
        )}
      </label>
    );
  },
);

ToggleLabel.displayName = "ToggleLabel";
