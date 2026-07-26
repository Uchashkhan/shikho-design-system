import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { color } from "@shikho/tokens";
import { Radio, type RadioProps } from "./radio";

// docs/audit/radio-buttons.md §15 — radio_label: size (sm, md), direction (left, right).
// Confirmed via get_design_context on all 4 variants (sm/left, md/left, sm/right, md/right) to
// compose a real nested `Radio` instance plus a label/caption text column, structurally identical
// to the confirmed `checkbox_label` composition.
export type RadioLabelSize = "sm" | "md";
export type RadioLabelDirection = "left" | "right";

export interface RadioLabelProps extends Omit<HTMLAttributes<HTMLLabelElement>, "children"> {
  size?: RadioLabelSize;
  direction?: RadioLabelDirection;
  /** Confirmed component property, default true (§15). */
  label?: boolean;
  /** Confirmed component property, default true (§15). */
  caption?: boolean;
  labelContent?: ReactNode;
  captionContent?: ReactNode;
  radioProps?: Omit<RadioProps, "size">;
}

// docs/audit/radio-buttons.md §15 — the label's own typography is confirmed size-dependent: at
// `md` the label uses Regular/400 weight at body_1 (13/20); at `sm` BOTH the label and caption
// collapse to the same Medium/500 weight, caption_2 (12/16) typography, differing only by color.
const labelTypographyBySize: Record<RadioLabelSize, { fontWeight: number; fontSize: number; lineHeight: string }> = {
  md: { fontWeight: 400, fontSize: 13, lineHeight: "20px" },
  sm: { fontWeight: 500, fontSize: 12, lineHeight: "16px" },
};

/**
 * `radio_label` (docs/audit/radio-buttons.md §15, ground-truth re-audited across all 4 size ×
 * direction variants). Composes the real `Radio` component plus a label/caption text column —
 * confirmed real (label `Text/gray-950`; caption `Text/gray-700` at `caption_2`/Medium 500
 * weight; label typography itself depends on `size`, §15), matching the same nested-component
 * pattern confirmed for `checkbox_label`.
 */
export const RadioLabel = forwardRef<HTMLLabelElement, RadioLabelProps>(
  (
    {
      size = "md",
      direction = "left",
      label = true,
      caption = true,
      labelContent,
      captionContent,
      radioProps,
      style,
      ...props
    },
    ref,
  ) => {
    const labelTypography = labelTypographyBySize[size];
    const radioEl = <Radio size={size} {...radioProps} />;
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
            {radioEl}
            {textEl}
          </>
        ) : (
          <>
            {textEl}
            {radioEl}
          </>
        )}
      </label>
    );
  },
);

RadioLabel.displayName = "RadioLabel";
