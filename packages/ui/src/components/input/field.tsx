import {
  type ChangeEvent,
  type FocusEvent,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type Ref,
  forwardRef,
} from "react";
import { color, radius } from "@shikho/tokens";
import { SelectChevronsIcon } from "@shikho/icons";
import { NewPinkButton } from "../button/new_pink";
import type { ButtonSizeScaleB } from "../button/shared";
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

export interface FieldProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onFocus" | "onBlur" | "onChange"> {
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
  /** The field's actual editable content. Uncontrolled by default (behaves as the input's
   * `defaultValue`) so every existing consumer that was already passing static display text keeps
   * working, but the field is now a genuine editable `<input>`/`<textarea>` — not decorative
   * static text. Pass `value` + `onChange` instead for controlled usage. */
  textContent?: string;
  /** Controlled value — takes precedence over `textContent` when supplied. */
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onInputMouseEnter?: (event: ReactMouseEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onInputMouseLeave?: (event: ReactMouseEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  name?: string;
  id?: string;
  readOnly?: boolean;
  disabled?: boolean;
  /** Ref to the real underlying `<input>`/`<textarea>` element — distinct from the component's own
   * `ref`, which points at the outer wrapper (unchanged, for backward compatibility). */
  inputRef?: Ref<HTMLInputElement | HTMLTextAreaElement>;
  supportTextContent?: ReactNode;
  trailTextContent?: ReactNode;
  imageSrc?: string;
  /** `type="advanced_with_buttons"` only (docs/audit/input.md §14) — confirmed lead chip slot (e.g. a country-code prefix). */
  leadTextContent?: ReactNode;
  /** `type="advanced_with_buttons"` only — a fresh get_design_context re-pull (node 66056:19069)
   * confirmed a THIRD boolean-gated glyph inside the lead chip, distinct from `leftLead`: a
   * stacked up/down chevron pair marking the chip as a select/dropdown control (e.g. a
   * country-code picker), rendered after the lead text. Renders the confirmed default
   * `SelectChevronsIcon` unless overridden. Default `true`, matching Figma's confirmed default. */
  leadChevron?: boolean;
  /** Overrides the confirmed default chevron glyph in the lead chip. */
  selectLeadChevron?: ReactNode;
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
/**
 * `type="advanced_with_buttons"` per-size metrics. Every row confirmed by an independent
 * `get_design_context` sample (sm/md/lg/xl) during the P1 repair pass — nothing extrapolated.
 *
 * `height`, `radius`, `iconSize` and typography already come from `FIELD_SIZE_METRICS` and were
 * re-verified to match; only the values below are specific to this type.
 *
 * Confirmed identical at all four sizes (kept out of the table): root `pr-4`, lead border
 * `outline/gray-100`, lead fill `smoke_base`, trail gap `spacing/8`, shortcut-button gap
 * `spacing/4`, button fill `secondary/500`.
 */
interface AdvancedMetrics {
  leadGap: number;
  leadPadding: string;
  leadRadiusLeft: number;
  leadRadiusRight: number;
  /** The lead group's own leading icon — a different scale from the field's `iconSize`. */
  leadIconSize: number;
  textPaddingX: number;
  trailPaddingRight: number;
  /** The confirmed `new_pink` size: always one step below the field's own size. */
  buttonSize: ButtonSizeScaleB;
}

const ADVANCED_METRICS: Record<FieldSize, AdvancedMetrics> = {
  sm: {
    leadGap: 4,
    leadPadding: "0 0.5rem",
    leadRadiusLeft: 8,
    leadRadiusRight: 8,
    leadIconSize: 16,
    textPaddingX: 8,
    trailPaddingRight: 4,
    buttonSize: "xs",
  },
  md: {
    leadGap: 6,
    leadPadding: "0.5rem 0.75rem",
    leadRadiusLeft: 10,
    leadRadiusRight: 10,
    leadIconSize: 20,
    textPaddingX: 8,
    trailPaddingRight: 4,
    buttonSize: "sm",
  },
  lg: {
    leadGap: 8,
    leadPadding: "0.75rem",
    leadRadiusLeft: 12,
    leadRadiusRight: 12,
    leadIconSize: 22,
    textPaddingX: 12,
    trailPaddingRight: 8,
    buttonSize: "md",
  },
  xl: {
    leadGap: 8,
    leadPadding: "1rem",
    // The only genuinely asymmetric row: left `custom/xl` (16) vs right `border_radius_md` (12).
    leadRadiusLeft: 16,
    leadRadiusRight: 12,
    leadIconSize: 28,
    textPaddingX: 16,
    trailPaddingRight: 12,
    buttonSize: "lg",
  },
};

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
      value,
      onChange,
      onFocus,
      onBlur,
      onInputMouseEnter,
      onInputMouseLeave,
      placeholder,
      name,
      id,
      readOnly,
      disabled,
      inputRef,
      supportTextContent,
      trailTextContent,
      imageSrc,
      leadTextContent,
      leadChevron = true,
      selectLeadChevron,
      buttonLabels = ["Button"],
      textColor,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const metrics = FIELD_SIZE_METRICS[size];
    const inputCommonProps = {
      value,
      defaultValue: value === undefined ? textContent : undefined,
      onChange,
      onFocus,
      onBlur,
      onMouseEnter: onInputMouseEnter,
      onMouseLeave: onInputMouseLeave,
      placeholder,
      name,
      id,
      readOnly,
      disabled,
    };

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
          {textGroup && text && (
            <textarea
              ref={inputRef as Ref<HTMLTextAreaElement>}
              {...inputCommonProps}
              style={{
                color: fieldTextColorDefault,
                flex: "1 0 0",
                font: "inherit",
                padding: 0,
                border: "none",
                outline: "none",
                resize: "none",
                background: "transparent",
              }}
            />
          )}
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
      // docs/audit/input.md §14 + P1 repair pass — ALL FOUR sizes independently sampled via
      // get_design_context. Structure: a bordered `lead` chip with its own white fill, inset
      // shadow and asymmetric corner radii; a flex-1 text column; an optional `trail` group
      // (label + icon); and 1-3 real pink shortcut buttons.
      //
      // Confirmed composition: the shortcut button is a genuine `new_pink` Primary instance one
      // size BELOW the field — field sm -> button xs, md -> sm, lg -> md, xl -> lg. Every metric
      // matches (height, padding, radius, typography), so `NewPinkButton` is reused rather than a
      // new variant being invented.
      const adv = ADVANCED_METRICS[size];
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
            minHeight: metrics.height,
            paddingRight: "0.25rem", // pr-[spacing/4] — confirmed identical at all four sizes
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
              data-testid="field-lead"
              style={{
                display: "flex",
                alignItems: "center",
                gap: adv.leadGap,
                height: metrics.height,
                padding: adv.leadPadding,
                // Confirmed asymmetric only at xl (left 16 / right 12); symmetric below that.
                borderRadius: `${adv.leadRadiusLeft}px ${adv.leadRadiusRight}px ${adv.leadRadiusRight}px ${adv.leadRadiusLeft}px`,
                border: `1px solid ${color.gray[100]}`,
                backgroundColor: color.white[950],
                boxShadow: "inset 0 1px 3px 0 rgba(255,255,255,0.04), inset 0 -1px 3px 0 rgba(0,0,0,0.04)",
                color: fieldTextColorDefault,
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {selectLeftIcon && <IconSlot size={adv.leadIconSize}>{selectLeftIcon}</IconSlot>}
              {leadTextContent}
              {leadChevron && (
                <IconSlot size={24}>
                  {selectLeadChevron ?? <SelectChevronsIcon style={{ color: color.gray[700] }} />}
                </IconSlot>
              )}
            </span>
          )}
          <input
            ref={inputRef as Ref<HTMLInputElement>}
            data-testid="field-text"
            {...inputCommonProps}
            style={{
              flex: "1 0 0",
              minWidth: 1,
              padding: `0 ${adv.textPaddingX}px`,
              color: fieldTextColorDefault,
              font: "inherit",
              border: "none",
              outline: "none",
              background: "transparent",
            }}
          />
          {trailText && (
            <span
              data-testid="field-trail"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem", // spacing/8 — confirmed identical at all four sizes
                paddingRight: adv.trailPaddingRight,
              }}
            >
              <span style={{ color: fieldSupportTextColor }}>{trailTextContent}</span>
              {rightIcon && <IconSlot size={metrics.iconSize}>{selectRightIcon}</IconSlot>}
            </span>
          )}
          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            {buttonLabels.map((label, i) => (
              <NewPinkButton key={i} size={adv.buttonSize} type="Primary">
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
            {text && (
              <input
                ref={inputRef as Ref<HTMLInputElement>}
                {...inputCommonProps}
                style={{
                  flex: "1 0 0",
                  minWidth: 1,
                  color: textColor ?? fieldTextColorDefault,
                  font: "inherit",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  padding: 0,
                }}
              />
            )}
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
