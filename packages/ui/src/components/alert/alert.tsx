import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { color, elevation, radius } from "@shikho/tokens";
import { InfoCircleIcon, CloseIcon } from "@shikho/icons";
import { ButtonDanger } from "../button/button_danger";
import { ButtonSuccess } from "../button/button_success";

// docs/audit/alerts.md §2 — alert: exactly one property, `state`, functioning as a severity/
// theme axis (not an interaction state, §4/§10). Casing preserved exactly: `Default` is
// capitalized while the other four are lowercase — a confirmed inconsistency within this one
// property's value set.
export type AlertState = "Default" | "danger" | "success" | "warning" | "info";

const shadowToCss = (layers: readonly { x: number; y: number; blur: number; spread: number; color: string }[]) =>
  layers.map((l) => `${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${l.color}`).join(", ");

const rootShadow = shadowToCss(elevation.e5); // confirmed exact, root — §11
const cornerButtonShadow = shadowToCss(elevation.e3); // confirmed exact, icon_button — §11
const iconShadow = shadowToCss(elevation.e2); // confirmed exact, both icon sizes — §11
// docs/audit/alerts.md §14 — confirmed on the plain neutral button (Default/warning/info's first
// action): an outer single-layer drop shadow (elevation/e2's smaller layer) PLUS the confirmed
// system-wide "special_drop" 2-layer inset — the same construction already used by
// Chip/Tags/DatePicker/Modal/Pagination/SidebarItem/TopNavItem/TableCell/Tooltip for this effect.
const neutralButtonShadow = `${shadowToCss([elevation.e2[1]])}, inset 0px 1px 3px -2px ${color.white[50]}, inset 0px -1px 3px -2px rgba(0,0,0,0.07)`;

// docs/audit/alerts.md §14 — confirmed via a fresh get_design_context on all 5 severities: the
// border color, plus (§14) `Default`'s border is `outline/gray-100` (#f4f4f6), NOT gray-200 as
// previously derived when only `danger` had been sampled.
const borderColorByState: Record<AlertState, string> = {
  danger: `${color.danger[500]}3d`, // outline/danger_alpha = #f03d3d3d
  success: `${color.success[500]}3d`, // outline/success_alpha = #35c2203d
  warning: "#fcbf043d", // outline/warning_alpha — confirmed exact, no @shikho/tokens equivalent
  info: "#118be83d", // outline/info_alpha — confirmed exact, no @shikho/tokens equivalent
  Default: color.gray[100], // outline/gray-100 — confirmed §14, corrects the prior gray[200] guess
};

// docs/audit/alerts.md §14 — confirmed via downloading the real SVG behind all 5 severities: the
// left icon is the SAME info-circle glyph in every state (matching the literal, previously
// unexplained "icon / info" layer name — it turns out not to be a mislabeling artifact, the icon
// generally IS an info-circle regardless of severity), tinted with that severity's own 500 color.
// P2: the glyph itself now lives in `@shikho/icons` as `InfoCircleIcon` — Toast used a
// byte-identical copy, so it is a genuine shared glyph rather than two look-alikes.

const iconColorByState: Record<AlertState, string> = {
  Default: color.primary[500], // confirmed #5468FF — Default's icon is primary-tinted, not neutral
  danger: color.danger[500],
  success: color.success[500],
  warning: color.warning[500],
  info: color.info[500],
};

// docs/audit/alerts.md §14 — confirmed via downloading the real SVG behind 2 severities: the
// corner close button's icon is the SAME "X" glyph in every state, fixed `text/gray-700` fill
// regardless of severity (not tinted). P2: shared as `@shikho/icons`' `CloseIcon`.

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  state?: AlertState;
  /** The one confirmed boolean property, default `true` (§11). */
  leftIcon?: boolean;
  /** Overrides the confirmed default info-circle icon (§14). Rarely needed — the default already
   * reproduces Figma's real glyph, tinted for `state`. */
  icon?: ReactNode;
  titleContent?: ReactNode;
  descriptionContent?: ReactNode;
  /** Content for the primary action button. `danger`/`success` compose the real `ButtonDanger`/
   * `ButtonSuccess` components (confirmed nested dependencies, §11/§14); `Default`/`warning`/
   * `info` render a plain neutral gray button — confirmed NOT color-tinted for those 3 states,
   * unlike `danger`/`success` (§14). */
  primaryActionContent?: ReactNode;
  onPrimaryActionClick?: () => void;
  /** Content for the second action button — confirmed identical construction across all 5
   * severities (`secondary/500` fill, white text, §11/§14). */
  dismissContent?: ReactNode;
  onDismissClick?: () => void;
  /** Overrides the confirmed default "X" icon for the corner close button (§14). */
  closeIcon?: ReactNode;
  onCloseClick?: () => void;
  /** Accessible name for the icon-only corner button — a functional requirement, not decorative
   * copy, since an icon-only button has no accessible name otherwise. Defaults to "Close" rather
   * than "Dismiss" so it doesn't collide with the visible second action button's own label —
   * the audit could not confirm whether the two controls are redundant (§11, §13). */
  closeButtonLabel?: string;
}

/**
 * `alert` (docs/audit/alerts.md, ground-truth re-audited across all 5 severities, §14). Composes
 * the real `ButtonDanger`/`ButtonSuccess` components for the confirmed nested action button on
 * `danger`/`success` (literal instance paths `button_danger/md/secondary/default` and
 * `button_success/md/secondary/default`) — `Default`/`warning`/`info` render a plain neutral
 * button instead, confirmed NOT to compose a severity-specific Button family member. Renders the
 * confirmed default info-circle severity icon and "X" close icon by default (both downloaded as
 * real SVG source and confirmed identical in shape across every severity, differing only in the
 * severity icon's tint color) — overridable via `icon`/`closeIcon` but no longer required just to
 * see a complete alert. Unlike every other component in this library, `alert` has **no boolean
 * for title/description/actions** — they render unconditionally (§11) — so this component's
 * structural surface intentionally has just one boolean (`leftIcon`), matching that confirmed
 * rigidity rather than inventing toggles Figma doesn't expose.
 *
 * See packages/ui/src/components/alert/README.md for exactly what's confirmed vs. derived, and
 * why the second action button and the corner close button are implemented inline rather than
 * composed from another `ui` component.
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      state = "danger",
      leftIcon = true,
      icon,
      titleContent,
      descriptionContent,
      primaryActionContent,
      onPrimaryActionClick,
      dismissContent,
      onDismissClick,
      closeIcon,
      onCloseClick,
      closeButtonLabel = "Close",
      style,
      ...props
    },
    ref,
  ) => {
    const primaryButton =
      state === "danger" ? (
        <ButtonDanger size="md" type="Secondary" state="default" onClick={onPrimaryActionClick}>
          {primaryActionContent}
        </ButtonDanger>
      ) : state === "success" ? (
        <ButtonSuccess size="md" type="Secondary" state="default" onClick={onPrimaryActionClick}>
          {primaryActionContent}
        </ButtonSuccess>
      ) : (
        // docs/audit/alerts.md §14 — confirmed: Default/warning/info's first action button is a
        // plain neutral gray/100 fill + gray-700 text button, NOT drawn from a severity-tinted
        // Button family member (unlike danger/success).
        <button
          type="button"
          onClick={onPrimaryActionClick}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 40,
            padding: "0.5rem 0.75rem",
            gap: "0.25rem",
            borderRadius: radius.md,
            border: "none",
            backgroundColor: color.gray[100],
            boxShadow: neutralButtonShadow,
            color: color.gray[700],
            fontSize: 13,
            lineHeight: "20px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {primaryActionContent}
        </button>
      );

    return (
      <div
        ref={ref}
        data-state={state}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "flex-start", // items-start, confirmed — top-aligned, unlike most components
          width: 424, // w-[424px] Fixed — §11
          gap: "1rem", // gap-[spacing/16, 16px] — §11
          padding: "1.5rem", // p-[spacing/24, 24px] uniform — §11
          backgroundColor: color.white[950], // Color/smoke_base — §11
          border: `1px solid ${borderColorByState[state]}`,
          borderRadius: radius["2xl"], // radius/border_radius_xl (20) — §11, radius.ts
          boxShadow: rootShadow,
          ...style,
        }}
        {...props}
      >
        {leftIcon && (
          <span style={{ width: 24, height: 24, flexShrink: 0, boxShadow: iconShadow }}>
            {icon ?? <InfoCircleIcon style={{ color: iconColorByState[state] }} />}
          </span>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            flex: "1 0 0",
            gap: "1rem", // gap-[spacing/16, 16px] — §11
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" /* gap-[spacing/8] */ }}>
            <div style={{ fontSize: 15, lineHeight: "24px", fontWeight: 600, color: color.gray[950] }}>
              {titleContent}
            </div>
            <div style={{ fontSize: 13, lineHeight: "20px", fontWeight: 400, color: color.gray[700] }}>
              {descriptionContent}
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" /* gap-[spacing/8] */ }}>
            {primaryButton}
            {/* Second action button — confirmed structurally identical across all 5 severities,
                but not confirmed to be drawn from a named component set (§11), so it is
                implemented inline with its own exactly confirmed fill/text. */}
            <button
              type="button"
              onClick={onDismissClick}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.5rem 0.75rem", // py-[spacing/8] px-[spacing/12] — §11
                gap: "0.25rem", // gap-[spacing/4] — §11
                borderRadius: radius.md, // radius/custom/md (10) — §11
                // P1 repair: confirmed 1px `outline/black-50` border. The button's outer
                // drop-shadow / inset effect remains unresolved and is deliberately untouched.
                border: `1px solid ${color.black[50]}`,
                backgroundColor: color.secondary[500], // confirmed — §11
                color: color.white[950], // text/white-950 — §11
                fontSize: 13,
                lineHeight: "20px",
                fontWeight: 600, // web/Body/13 Semibold — §11
                cursor: "pointer",
              }}
            >
              {dismissContent}
            </button>
          </div>
        </div>

        {/* Absolutely-positioned corner icon_button — confirmed outside the main flex flow,
            §11. Not confirmed to map to any specific icon_button type/size, so implemented with
            its own confirmed geometry rather than composed from the IconButton component. */}
        <button
          type="button"
          onClick={onCloseClick}
          aria-label={closeButtonLabel}
          style={{
            position: "absolute",
            top: 11,
            right: 11,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            padding: "0.5rem", // p-[spacing/8] — §11
            gap: "0.375rem", // gap-[spacing/6] — §11
            border: "none",
            borderRadius: radius.full,
            backgroundColor: color.gray[100],
            boxShadow: cornerButtonShadow,
            cursor: "pointer",
          }}
        >
          <span style={{ width: 18, height: 18, boxShadow: iconShadow }}>{closeIcon ?? <CloseIcon size={18} style={{ color: color.gray[700] }} />}</span>
        </button>
      </div>
    );
  },
);

Alert.displayName = "Alert";
