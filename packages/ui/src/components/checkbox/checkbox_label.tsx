import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { color } from "@shikho/tokens";
import { Checkbox, type CheckboxProps } from "./checkbox";

// docs/audit/checkboxes.md §2, §14 — checkbox_label: size (sm, md), direction (left, right).
// Confirmed via get_design_context (§14) to compose a real nested `Checkbox` instance plus a
// label/caption text column — previously unimplemented, since the original overview-only audit
// (§1, §13) could not confirm this internal structure and explicitly scoped it out.
export type CheckboxLabelSize = "sm" | "md";
export type CheckboxLabelDirection = "left" | "right";

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
    const textEl = label && (
      <span style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
        <span style={{ fontFamily: "inherit", fontWeight: 400, fontSize: 13, lineHeight: "20px", color: color.gray[950] }}>
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
