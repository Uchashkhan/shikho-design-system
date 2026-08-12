import {
  type ChangeEvent,
  type FocusEvent,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type Ref,
  forwardRef,
  useState,
} from "react";
import { color, radius } from "@shikho/tokens";
import { SelectChevronsIcon, type IconSize } from "@shikho/icons";
import { GreyscaleButton } from "../button/greyscale";
import { NewBlueButton } from "../button/new_blue";
import { NewPinkButton } from "../button/new_pink";
import type { ButtonSizeScaleB } from "../button/shared";
import {
  FIELD_SIZE_METRICS,
  TEXTAREA_METRICS,
  fieldChromeInnerShadow,
  fieldChromeStyle,
  fieldSupportTextColor,
  fieldTextColorDefault,
  iconShadowFilter,
  innerShadow,
  type FieldChromeState,
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
  /** Not part of the original Figma audit — a requested addition. `type="advanced_with_buttons"`
   * only. Figma's own confirmed composition always uses `NewPinkButton` (`"secondary"`, the
   * default here) — `"primary"`/`"dark"` swap in `NewBlueButton`/`GreyscaleButton` instead,
   * reusing their own confirmed color resolvers rather than inventing new colors. */
  buttonColor?: "primary" | "secondary" | "dark";
  /** Overrides the confirmed default input-text color (docs/audit/input.md §14) — used by
   * `InputField`/`Dropdown` to apply their own confirmed per-state text color. */
  textColor?: string;
  /** `type="advanced_with_buttons"` only — forces a specific state, the same `state?` pattern
   * `InputField`/`Textarea`/`Dropdown` already expose. Left unset, real interaction drives it:
   * focus → `active`, a non-empty value → `filled`, pointer hover → `hover`, otherwise `default`;
   * `disabled` always wins. `default`/`textarea` are unaffected — those stay externally controlled
   * by `InputField`/`Textarea`, unchanged.
   *
   * Not part of the original Figma audit — no state-driven Figma component wraps
   * `type="advanced_with_buttons"` (confirmed absent: neither `field` itself nor any sibling
   * composed component crosses this type with a `state` axis). Requested directly, reusing the
   * exact same already-confirmed `fieldChromeStyle` chrome that `input_field`/`textarea`/
   * `dropdown`/`digit_input` all already share — the same "least invented extension" pattern used
   * elsewhere in this file, not new colors. The shortcut buttons also pick up `disabled` from this
   * (real native `disabled`, via each button's own already-confirmed disabled treatment) rather
   * than only graying the surrounding chrome while leaving them clickable. */
  state?: FieldChromeState;
}

const IconSlot = ({ size, children }: { size: number; children?: ReactNode }) => (
  <span
    style={{
      width: size,
      height: size,
      flexShrink: 0,
      filter: iconShadowFilter,
      // Re-audit: this span had no centering at all, so a child SVG rendered as an inline
      // block sitting on its own text baseline — visibly offset toward the top of the slot,
      // not the true middle. Figma's own icon slots center the glyph via a symmetric inset
      // (confirmed elsewhere, e.g. `dropdown`'s right_icon: 20px slot, glyph inset 12.5% on
      // all 4 sides), and `ButtonShell`'s own icon slot already applies this same flex fix —
      // this brings `Field`'s icon slots (every `IconSlot` usage) in line with that.
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
    aria-hidden={!children}
  >
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
  /** Re-audit (node 66056:19069 and siblings) — `leadChevron`'s glyph is a genuinely SECOND,
   * independently-sized `left_icon` instance in the lead chip, distinct from `leadIconSize`
   * above. Was previously hardcoded to a single `size={24}` for all 4 field sizes (only correct
   * at `xl`); confirmed to actually scale 24/20/18/16 across xl/lg/md/sm, same as every other
   * per-size metric in this table. */
  leadChevronSize: IconSize;
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
    leadChevronSize: 16,
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
    leadChevronSize: 18,
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
    leadChevronSize: 20,
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
    leadChevronSize: 24,
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
      buttonColor = "secondary",
      textColor,
      state,
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

    // `type="advanced_with_buttons"` only (see the `state` prop doc above) — real interaction-
    // driven state resolution, matching `InputField`/`Textarea`. Hooks are called unconditionally
    // (Rules of Hooks — this component has early returns per `type` below), but only read/wired
    // into that branch's own JSX; `default`/`textarea` are untouched.
    const [advPointerHover, setAdvPointerHover] = useState(false);
    const [advIsFocused, setAdvIsFocused] = useState(false);
    const [advHasValue, setAdvHasValue] = useState(() => Boolean((value ?? textContent ?? "").length > 0));
    const resolvedAdvancedState: FieldChromeState =
      state ??
      (disabled
        ? "disabled"
        : advIsFocused
          ? "active"
          : advHasValue
            ? "filled"
            : advPointerHover
              ? "hover"
              : "default");
    const handleAdvFocus = (event: FocusEvent<HTMLInputElement>) => {
      setAdvIsFocused(true);
      onFocus?.(event);
    };
    const handleAdvBlur = (event: FocusEvent<HTMLInputElement>) => {
      setAdvIsFocused(false);
      onBlur?.(event);
    };
    const handleAdvChange = (event: ChangeEvent<HTMLInputElement>) => {
      setAdvHasValue(event.target.value.length > 0);
      onChange?.(event);
    };
    const handleAdvMouseEnter = (event: ReactMouseEvent<HTMLDivElement>) => {
      setAdvPointerHover(true);
      props.onMouseEnter?.(event);
    };
    const handleAdvMouseLeave = (event: ReactMouseEvent<HTMLDivElement>) => {
      setAdvPointerHover(false);
      props.onMouseLeave?.(event);
    };

    if (type === "textarea") {
      // docs/audit/input.md §14 — confirmed distinct structure: a single text row (no left/right
      // icon groups, no support/trail text), an optional avatar image, and a bottom-right resizer
      // glyph.
      //
      // P1 repair pass: every size was independently re-sampled via get_design_context. The
      // previous code hard-coded md's `0.5rem 0.75rem` padding, md's `radius.md`, an 8px gap and a
      // 24px image for all four sizes. Figma varies padding, radius, gap, image size and resizer
      // size per size — only md matched. TEXTAREA_METRICS now lives in shared.ts, shared with the
      // standalone Textarea primitive (§16) — see its own comment there for why.
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
      //
      // Re-audit (see `state` prop doc): this branch used to always render the same static
      // gray-100/innerShadow chrome regardless of interaction — no state prop, no hover/focus/
      // error/disabled visual at all, unlike `default`/`textarea` (both real state-driven via
      // `InputField`/`Textarea`). Now resolves the same `fieldChromeStyle` chrome `input_field`/
      // `textarea`/`dropdown`/`digit_input` already share.
      const adv = ADVANCED_METRICS[size];
      const advChrome = fieldChromeStyle(resolvedAdvancedState);
      const isAdvDisabled = Boolean(disabled) || resolvedAdvancedState === "disabled";
      return (
        <div
          ref={ref}
          data-size={size}
          data-type={type}
          data-state={resolvedAdvancedState}
          className={className}
          style={{
            display: "flex",
            alignItems: "center",
            height: metrics.height,
            minHeight: metrics.height,
            paddingRight: "0.25rem", // pr-[spacing/4] — confirmed identical at all four sizes
            borderRadius: metrics.radius,
            backgroundColor: advChrome.background,
            border: advChrome.border,
            boxShadow:
              [fieldChromeInnerShadow(resolvedAdvancedState), advChrome.boxShadow]
                .filter(Boolean)
                .join(", ") || "none",
            position: "relative",
            overflow: "hidden",
            fontSize: metrics.fontSize,
            lineHeight: metrics.lineHeight,
            fontWeight: 500,
            ...style,
          }}
          {...props}
          onMouseEnter={handleAdvMouseEnter}
          onMouseLeave={handleAdvMouseLeave}
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
                color: advChrome.textColor,
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {selectLeftIcon && <IconSlot size={adv.leadIconSize}>{selectLeftIcon}</IconSlot>}
              {leadTextContent}
              {leadChevron && (
                <IconSlot size={adv.leadChevronSize}>
                  {selectLeadChevron ?? (
                    <SelectChevronsIcon size={adv.leadChevronSize} style={{ color: color.gray[700] }} />
                  )}
                </IconSlot>
              )}
            </span>
          )}
          <input
            ref={inputRef as Ref<HTMLInputElement>}
            data-testid="field-text"
            {...inputCommonProps}
            onFocus={handleAdvFocus}
            onBlur={handleAdvBlur}
            onChange={handleAdvChange}
            style={{
              flex: "1 0 0",
              minWidth: 1,
              padding: `0 ${adv.textPaddingX}px`,
              color: advChrome.textColor,
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
            {buttonLabels.map((label, i) =>
              buttonColor === "primary" ? (
                <NewBlueButton key={i} size={adv.buttonSize} type="Primary" disabled={isAdvDisabled}>
                  {label}
                </NewBlueButton>
              ) : buttonColor === "dark" ? (
                // ADVANCED_METRICS.buttonSize only ever takes the values xs/sm/md/lg (never
                // xxl) — a subset shared by both ButtonSizeScaleA and ButtonSizeScaleB, but
                // GreyscaleButton (Scale A) doesn't type-include Scale B's "xxl" possibility.
                <GreyscaleButton
                  key={i}
                  size={adv.buttonSize as "xs" | "sm" | "md" | "lg"}
                  type="primary"
                  disabled={isAdvDisabled}
                >
                  {label}
                </GreyscaleButton>
              ) : (
                <NewPinkButton key={i} size={adv.buttonSize} type="Primary" disabled={isAdvDisabled}>
                  {label}
                </NewPinkButton>
              ),
            )}
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
