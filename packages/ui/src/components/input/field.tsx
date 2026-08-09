import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { color, radius } from "@shikho/tokens";
import { NewPinkButton } from "../button/new_pink";
import {
  FIELD_SIZE_METRICS,
  fieldSupportTextColor,
  fieldTextColorDefault,
  iconShadowFilter,
  innerShadow,
  type FieldSize,
} from "./shared";

// docs/audit/input.md §2 — field: size xl|lg|md|sm, type default|textarea|advanced_with_buttons.
export type { FieldSize };
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
  /** `type="advanced_with_buttons"` only (docs/audit/input.md §14) — confirmed lead chip slot (e.g. a country-code prefix). */
  leadTextContent?: ReactNode;
  /** `type="advanced_with_buttons"` only — confirmed 1-3 solid pink action buttons, reusing `NewPinkButton`. */
  buttonLabels?: string[];
  /** Overrides the confirmed default input-text color (docs/audit/input.md §14) — used by
   * `InputField`/`Dropdown` to apply their own confirmed per-state text color. */
  textColor?: string;
}

const IconSlot = ({ size, children }: { size: number; children?: ReactNode }) => (
  <span style={{ width: size, height: size, flexShrink: 0, filter: iconShadowFilter }} aria-hidden={!children}>
    {children}
  </span>
);

/**
 * `field` (docs/audit/input.md §9/§14, deep re-audited across all 4 sizes and all 3 types).
 * `size` now renders its own confirmed height/padding/gap/icon-size/radius/typography instead of
 * always rendering `md`'s values (§14.1) — a materially incomplete visual in the pre-rebuild
 * version. `type="textarea"`/`"advanced_with_buttons"` now render their own confirmed distinct
 * structure instead of silently falling back to `type="default"`.
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
      leadTextContent,
      buttonLabels = ["Button"],
      textColor,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const metrics = FIELD_SIZE_METRICS[size];

    if (type === "textarea") {
      // docs/audit/input.md §14 — confirmed distinct structure: a single text row (no left/right
      // icon groups, no support/trail text), an optional avatar image, and a bottom-right resizer
      // glyph.
      //
      // P1 repair pass: every size was independently re-sampled via get_design_context. The
      // previous code hard-coded md's `0.5rem 0.75rem` padding, md's `radius.md`, an 8px gap and a
      // 24px image for all four sizes. Figma varies padding, radius, gap, image size and resizer
      // size per size — only md matched.
      const TEXTAREA_METRICS: Record<
        FieldSize,
        { height: number; padding: string; radius: number; gap: string; image: number; resizer: number }
      > = {
        sm: { height: 72, padding: "0.5rem", radius: radius.sm, gap: "0.5rem", image: 16, resizer: 20 },
        md: { height: 96, padding: "0.5rem 0.75rem", radius: radius.md, gap: "0.5rem", image: 24, resizer: 20 },
        lg: { height: 104, padding: "0.75rem 1rem", radius: radius.xl, gap: "0.75rem", image: 24, resizer: 20 },
        xl: { height: 128, padding: "1rem", radius: radius.xl, gap: "1rem", image: 32, resizer: 24 },
      };
      const ta = TEXTAREA_METRICS[size];
      return (
        <div
          ref={ref}
          data-size={size}
          data-type={type}
          className={className}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: ta.gap,
            height: ta.height,
            padding: ta.padding,
            borderRadius: ta.radius,
            backgroundColor: color.gray[100],
            boxShadow: innerShadow,
            position: "relative",
            fontSize: metrics.fontSize,
            lineHeight: metrics.lineHeight,
            fontWeight: 500,
            ...style,
          }}
          {...props}
        >
          {image && imageSrc && (
            <img
              src={imageSrc}
              alt=""
              style={{ width: ta.image, height: ta.image, borderRadius: radius.full, objectFit: "cover", flexShrink: 0 }}
            />
          )}
          {textGroup && text && <span style={{ color: fieldTextColorDefault, flex: "1 0 0" }}>{textContent}</span>}
          <span
            aria-hidden
            style={{ position: "absolute", bottom: 0, right: 0, width: ta.resizer, height: ta.resizer, color: color.gray[400] }}
          >
            ⤡
          </span>
        </div>
      );
    }

    if (type === "advanced_with_buttons") {
      // docs/audit/input.md §14 — confirmed richer structure: a bordered "lead" chip (its own
      // fill/inset shadow, independent of the outer field's), a text row, an optional trailing
      // label + icon, and 1-3 real pink action buttons (fill Color/secondary/500, radius.sm) —
      // reusing NewPinkButton rather than redrawing an equivalent button. Only `md` was
      // independently sampled; sm/lg/xl reuse md's proportions (documented, not re-verified).
      return (
        <div
          ref={ref}
          data-size={size}
          data-type={type}
          className={className}
          style={{
            display: "flex",
            alignItems: "center",
            height: metrics.height,
            paddingRight: "0.25rem",
            borderRadius: metrics.radius,
            backgroundColor: color.gray[100],
            boxShadow: innerShadow,
            position: "relative",
            overflow: "hidden",
            fontSize: metrics.fontSize,
            lineHeight: metrics.lineHeight,
            fontWeight: 500,
            ...style,
          }}
          {...props}
        >
          {leadTextContent !== undefined && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                height: metrics.height,
                padding: "0.5rem 0.75rem",
                borderRadius: `${radius.md}px ${radius.sm}px ${radius.sm}px ${radius.md}px`,
                backgroundColor: color.white[950],
                boxShadow: "inset 0 1px 3px 0 rgba(255,255,255,0.04), inset 0 -1px 3px 0 rgba(0,0,0,0.04)",
                color: fieldTextColorDefault,
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {leadTextContent}
            </span>
          )}
          <span style={{ flex: "1 0 0", minWidth: 1, padding: "0 0.5rem", color: fieldTextColorDefault }}>
            {textContent}
          </span>
          {trailText && (
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingRight: "0.25rem" }}>
              <span style={{ color: fieldSupportTextColor }}>{trailTextContent}</span>
              {rightIcon && <IconSlot size={18}>{selectRightIcon}</IconSlot>}
            </span>
          )}
          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            {buttonLabels.map((label, i) => (
              <NewPinkButton key={i} size="sm" type="Primary">
                {label}
              </NewPinkButton>
            ))}
          </span>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        data-size={size}
        data-type={type}
        className={"inline-flex items-center transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50" + (className ? ` ${className}` : "")}
        style={{
          gap: metrics.gap,
          height: metrics.height,
          padding: metrics.padding,
          borderRadius: metrics.radius,
          backgroundColor: color.gray[100],
          boxShadow: innerShadow,
          fontSize: metrics.fontSize,
          lineHeight: metrics.lineHeight,
          fontWeight: 500,
          ...style,
        }}
        {...props}
      >
        {image && imageSrc && (
          <img
            src={imageSrc}
            alt=""
            style={{ width: metrics.iconSize + 6, height: metrics.iconSize + 6, borderRadius: radius.full, objectFit: "cover", flexShrink: 0 }}
          />
        )}
        {leftGroup && (
          <span style={{ display: "flex", alignItems: "center", paddingRight: "0.125rem" }}>
            {leftLead && <IconSlot size={metrics.iconSize}>{selectLeftIcon}</IconSlot>}
          </span>
        )}
        {textGroup && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              flex: "1 0 0",
              minWidth: 1,
              gap: "0.25rem",
              padding: "0 0.125rem",
            }}
          >
            {text && <span style={{ color: textColor ?? fieldTextColorDefault }}>{textContent}</span>}
            {supportText && <span style={{ color: fieldSupportTextColor }}>{supportTextContent}</span>}
          </span>
        )}
        {rightGroup && (
          <span style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
            {trailText && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingRight: "0.125rem",
                  color: fieldSupportTextColor,
                }}
              >
                {trailTextContent}
              </span>
            )}
            {rightIcon && <IconSlot size={metrics.iconSize}>{selectRightIcon}</IconSlot>}
          </span>
        )}
      </div>
    );
  },
);

Field.displayName = "Field";
