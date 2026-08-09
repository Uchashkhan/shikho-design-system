import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { color } from "@shikho/tokens";
import { Checkbox, type CheckboxProps } from "./checkbox";

// docs/audit/checkboxes.md §2, §14 — checkbox_label: size (sm, md), direction (left, right).
// Confirmed via get_design_context (§14) to compose a real nested `Checkbox` instance plus a
// label/caption text column — previously unimplemented, since the original overview-only audit
// (§1, §13) could not confirm this internal structure and explicitly scoped it out.
export type CheckboxLabelSize = "sm" | "md";
export type CheckboxLabelDirection = "left" | "right";

/**
 * Per-size label typography, both rows confirmed by live `get_design_context` during the P1
 * repair pass. The previous implementation hard-coded `md`'s 13px/20px/400 for both sizes even
 * though it accepted a `size` prop — `sm` is genuinely 12px/16px at Medium 500, matching the
 * shape `RadioLabel` and `ToggleLabel` already implement.
 *
 * The caption is confirmed IDENTICAL at both sizes (12px/16px Medium 500), so it stays a shared
 * constant rather than an invented per-size row.
 */
const LABEL_TYPOGRAPHY: Record<
  CheckboxLabelSize,
  { fontSize: number; lineHeight: string; fontWeight: number }
> = {
  sm: { fontSize: 12, lineHeight: "16px", fontWeight: 500 },
  md: { fontSize: 13, lineHeight: "20px", fontWeight: 400 },
};

const CAPTION_TYPOGRAPHY = { fontSize: 12, lineHeight: "16px", fontWeight: 500 } as const;

export interface CheckboxLabelProps extends Omit<HTMLAttributes<HTMLLabelElement>, "children"> {
  size?: CheckboxLabelSize;
  direction?: CheckboxLabelDirection;
  /** Confirmed component property, default true (§14). */
  label?: boolean;
  /** Confirmed component property, default true (§14). */
  caption?: boolean;
  labelContent?: ReactNode;
  captionContent?: ReactNode;
  checkboxProps?: Omit<CheckboxProps, "size">;
}

/**
 * `checkbox_label` (docs/audit/checkboxes.md §14, deep-audited at `size=md, direction=left`).
 * Composes the real `Checkbox` component plus a label/caption text column — confirmed real
 * (label text `Text/gray-950` at `body_1`/Regular 400 weight; caption `Text/gray-700` at
 * `caption_2`/Medium 500 weight), matching the same nested-component pattern already confirmed
 * for `list`'s own `leadIcon` Checkbox composition (docs/audit/list.md §7).
 */
export const CheckboxLabel = forwardRef<HTMLLabelElement, CheckboxLabelProps>(
  (
    {
      size = "md",
      direction = "left",
      label = true,
      caption = true,
      labelContent,
      captionContent,
      checkboxProps,
      style,
      ...props
    },
    ref,
  ) => {
    const checkboxEl = <Checkbox size={size} {...checkboxProps} />;
    const labelTypography = LABEL_TYPOGRAPHY[size];
    const textEl = label && (
      <span style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
        <span style={{ fontFamily: "inherit", ...labelTypography, color: color.gray[950] }}>
          {labelContent}
        </span>
        {caption && (
          <span style={{ ...CAPTION_TYPOGRAPHY, color: color.gray[700] }}>{captionContent}</span>
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
            {checkboxEl}
            {textEl}
          </>
        ) : (
          <>
            {textEl}
            {checkboxEl}
          </>
        )}
      </label>
    );
  },
);

CheckboxLabel.displayName = "CheckboxLabel";
