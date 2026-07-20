import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import {
  baseFieldClassName,
  fieldFillDefault,
  fieldIconSize,
  fieldRadiusMd,
  fieldSupportTextColor,
  fieldTextColorDefault,
  innerShadow,
  typography,
} from "./shared";

// docs/audit/input.md §2 — field: size xl|lg|md|sm, type default|textarea|advanced_with_buttons.
export type FieldSize = "xl" | "lg" | "md" | "sm";
export type FieldType = "default" | "textarea" | "advanced_with_buttons";

export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  size?: FieldSize;
  type?: FieldType;
  // The 9 confirmed boolean properties (§9), with their confirmed defaults.
  image?: boolean;
  leftGroup?: boolean;
  leftLead?: boolean;
  rightGroup?: boolean;
  rightIcon?: boolean;
  supportText?: boolean;
  text?: boolean;
  textGroup?: boolean;
  trailText?: boolean;
  // The confirmed instance-swap properties (§9) — React.ReactNode | null, default null.
  selectLeftIcon?: ReactNode | null;
  selectRightIcon?: ReactNode | null;
  textContent?: ReactNode;
  supportTextContent?: ReactNode;
  trailTextContent?: ReactNode;
  imageSrc?: string;
}

/**
 * `field` (docs/audit/input.md §9, deep-audited at `size=md, type=default`). Every layout number
 * below (padding, gaps, radius, fill, inner shadow, icon size, typography) is that exact
 * confirmed instance. `size` values other than `md`, and `type` values other than `default`,
 * have zero confirmed structural data (§9 "not confirmed" / §13) — they are accepted as props for
 * API completeness but currently render identically to `md`/`default` rather than a fabricated
 * scale, per the audit's own instruction not to guess missing values.
 */
export const Field = forwardRef<HTMLDivElement, FieldProps>(
  (
    {
      size = "md",
      type = "default",
      image = false,
      leftGroup = true,
      leftLead = true,
      rightGroup = true,
      rightIcon = true,
      supportText = true,
      text = true,
      textGroup = true,
      trailText = true,
      selectLeftIcon = null,
      selectRightIcon = null,
      textContent,
      supportTextContent,
      trailTextContent,
      imageSrc,
      className,
      style,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      data-size={size}
      data-type={type}
      className={baseFieldClassName + (className ? ` ${className}` : "")}
      style={{
        gap: "0.25rem", // gap-[spacing/4, 4px] — §9
        padding: "0.5rem 0.625rem", // py-[spacing/8,8px] px-[spacing/10,10px] — §9
        borderRadius: fieldRadiusMd,
        backgroundColor: fieldFillDefault,
        boxShadow: innerShadow,
        ...style,
      }}
      {...props}
    >
      {image && imageSrc && (
        <img
          src={imageSrc}
          alt=""
          style={{ width: 24, height: 24, borderRadius: 1000, objectFit: "cover", flexShrink: 0 }}
        />
      )}
      {leftGroup && (
        <span style={{ display: "flex", alignItems: "center", paddingRight: "0.125rem" }}>
          {leftLead &&
            (selectLeftIcon ?? (
              <span
                style={{ width: fieldIconSize, height: fieldIconSize, flexShrink: 0 }}
                aria-hidden
              />
            ))}
        </span>
      )}
      {textGroup && (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            flex: "1 0 0",
            minWidth: 1,
            gap: "0.25rem", // gap-[spacing/4, 4px] — §9
            padding: "0 0.125rem", // px-[spacing/2, 2px] — §9
            ...typography,
          }}
        >
          {text && <span style={{ color: fieldTextColorDefault }}>{textContent}</span>}
          {supportText && <span style={{ color: fieldSupportTextColor }}>{supportTextContent}</span>}
        </span>
      )}
      {rightGroup && (
        <span style={{ display: "flex", alignItems: "center", gap: "0.375rem" /* gap-[spacing/6] */ }}>
          {trailText && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingRight: "0.125rem",
                color: fieldSupportTextColor,
                ...typography,
              }}
            >
              {trailTextContent}
            </span>
          )}
          {rightIcon &&
            (selectRightIcon ?? (
              <span
                style={{ width: fieldIconSize, height: fieldIconSize, flexShrink: 0 }}
                aria-hidden
              />
            ))}
        </span>
      )}
    </div>
  ),
);

Field.displayName = "Field";
