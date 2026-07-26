import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { color, elevation, radius } from "@shikho/tokens";
import { ButtonDanger } from "../button/button_danger";
import { ButtonSuccess } from "../button/button_success";

// docs/audit/toasts.md §2 — toast: exactly one property, `state`, functioning as a severity/
// theme axis, same architecture as `alert`. Casing note: the baseline value here is lowercase
// `default`, whereas alert's equivalent baseline is capitalized `Default` — a confirmed
// cross-component casing inconsistency (§2, §11), preserved as-is.
export type ToastState = "default" | "danger" | "success" | "warning" | "info";

const shadowToCss = (layers: readonly { x: number; y: number; blur: number; spread: number; color: string }[]) =>
  layers.map((l) => `${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${l.color}`).join(", ");

const rootShadow = shadowToCss(elevation.e6); // confirmed exact, root — §9/§12 (NOT e5, unlike alert)
const iconShadow = shadowToCss(elevation.e2); // confirmed exact for the rendered icon slots — §9
// docs/audit/toasts.md §14 — confirmed on the plain neutral action button (warning/info): an
// outer single-layer drop shadow (elevation/e2's smaller layer) PLUS the confirmed system-wide
// "special_drop" 2-layer inset — same construction reused across this whole library.
const neutralButtonShadow = `${shadowToCss([elevation.e2[1]])}, inset 0px 1px 3px -2px ${color.white[50]}, inset 0px -1px 3px -2px rgba(0,0,0,0.07)`;

// docs/audit/toasts.md §14 — confirmed via a fresh get_design_context on all 5 severities:
// `default`'s border is `outline/gray-100` (#f4f4f6), NOT gray-200 as previously derived when
// only `danger` had been sampled.
const borderColorByState: Record<ToastState, string> = {
  danger: `${color.danger[500]}3d`, // outline/danger_alpha = #f03d3d3d
  success: `${color.success[500]}3d`, // outline/success_alpha = #35c2203d
  warning: "#fcbf043d", // outline/warning_alpha
  info: "#118be83d", // outline/info_alpha
  default: color.gray[100], // outline/gray-100 — confirmed §14, corrects the prior gray[200] guess
};

// docs/audit/toasts.md §14 — confirmed via downloading the real SVG behind all 5 severities: the
// left icon is the SAME info-circle glyph as Alert's (byte-identical path data), tinted per
// state. Unlike Alert, `default`'s icon here is confirmed `gray-950` (near-black), NOT
// primary-tinted — a genuine, confirmed difference between the two sibling components' own
// "baseline" severity treatment.
const ALERT_ICON_PATH =
  "M9 0C4.03768 0 0 4.03674 0 9C0 13.9623 4.03768 18 9 18C13.9623 18 18 13.9623 18 9C18 4.03674 13.9623 0 9 0ZM10.25 5.75C10.25 6.44036 9.69034 7 8.99999 7C8.30963 7 7.74999 6.44036 7.74999 5.75C7.74999 5.05964 8.30963 4.5 8.99999 4.5C9.69034 4.5 10.25 5.05964 10.25 5.75ZM9.00001 7.99996C8.44773 7.99996 8.00001 8.44767 8.00001 8.99996V13C8.00001 13.5522 8.44773 14 9.00001 14C9.5523 14 10 13.5522 10 13V8.99996C10 8.44767 9.5523 7.99996 9.00001 7.99996Z";

const iconColorByState: Record<ToastState, string> = {
  default: color.gray[950], // confirmed #0A0C11 — differs from Alert's primary-tinted Default
  danger: color.danger[500],
  success: color.success[500],
  warning: color.warning[500],
  info: color.info[500],
};

function ToastIcon({ fill }: { fill: string }) {
  return (
    <svg viewBox="0 0 18 18" width={18} height={18} fill="none" aria-hidden>
      <path fillRule="evenodd" clipRule="evenodd" d={ALERT_ICON_PATH} fill={fill} />
    </svg>
  );
}

// docs/audit/toasts.md §14 — confirmed via downloading the real SVG: the dismiss icon is the SAME
// "X" glyph as Alert's close icon (byte-identical path data), but fixed `gray-600` fill —
// confirmed different from Alert's `gray-700`.
const DISMISS_ICON_PATH =
  "M6.31068 5.25015L10.2804 1.28044C10.5737 0.987188 10.5737 0.513188 10.2804 0.219938C9.98718 -0.0733125 9.51318 -0.0733125 9.21993 0.219938L5.25018 4.18965L1.28044 0.219938C0.987187 -0.0733125 0.513188 -0.0733125 0.219938 0.219938C-0.0733125 0.513188 -0.0733125 0.987188 0.219938 1.28044L4.18968 5.25015L0.219938 9.21998C-0.0733125 9.51315 -0.0733125 9.98715 0.219938 10.2804C0.366188 10.4267 0.558187 10.5002 0.750187 10.5002C0.942187 10.5002 1.13419 10.4267 1.28044 10.2804L5.25018 6.31073L9.21993 10.2804C9.36618 10.4267 9.55818 10.5002 9.75018 10.5002C9.94218 10.5002 10.1342 10.4267 10.2804 10.2804C10.5737 9.98715 10.5737 9.51315 10.2804 9.21998L6.31068 5.25015Z";

function DismissIcon() {
  return (
    <svg viewBox="0 0 10.5004 10.5002" width={10.5} height={10.5} fill="none" aria-hidden>
      <path fillRule="evenodd" clipRule="evenodd" d={DISMISS_ICON_PATH} fill={color.gray[600]} />
    </svg>
  );
}

// docs/audit/toasts.md §9, §11, §14 — the nested button_danger/button_success instances render
// with a TINTED background (their own severity's `_alpha_12`), confirmed different from Alert's
// equivalent buttons (which use a flat neutral gray/100 background with only the text tinted).
// `warning`/`info`/`default` are confirmed to render a plain, unqualified "button" instead — NOT
// drawn from a severity Button family member. `default`'s own action button is confirmed distinct
// again: `Color/secondary/500` fill + white text (matching Alert's separate "Dismiss" button
// styling), not the neutral gray/gray-700 combination warning/info use.
const dangerActionFill = { backgroundColor: `${color.danger[500]}1f` }; // Color/danger/500_alpha_12
const successActionFill = { backgroundColor: `${color.success[500]}1f` }; // Color/success/500_alpha_12

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  state?: ToastState;
  /** Confirmed boolean, default `true` (§9). */
  leftIcon?: boolean;
  /** Overrides the confirmed default info-circle icon (§14). Rarely needed. */
  icon?: ReactNode;
  /** Confirmed boolean, default **`false`** — the only boolean across Alert/Toast that defaults
   * off (§9). A slot with no equivalent in `alert` (§10). The audited instance's own glyph is a
   * plain filled circle with no distinguishing shape — confirmed to be generic placeholder
   * content, not a real icon worth reproducing as a default, so this slot has no default content. */
  featureIcon?: boolean;
  featureIconContent?: ReactNode;
  titleContent?: ReactNode;
  /** Confirmed boolean, default `true` (§9). */
  desc?: boolean;
  descriptionContent?: ReactNode;
  /** Confirmed boolean, default `true` (§9). `danger`/`success` compose the real `ButtonDanger`/
   * `ButtonSuccess` with a tinted background (confirmed different from Alert's neutral-bg
   * equivalent, §14); `default`/`warning`/`info` render a plain button instead. */
  actionButton?: boolean;
  actionContent?: ReactNode;
  onActionClick?: () => void;
  /** Confirmed boolean, default `true` (§9) — the inline dismiss icon button. Renders the
   * confirmed default "X" icon unless overridden (§14). */
  rightIcon?: boolean;
  dismissIcon?: ReactNode;
  onDismissClick?: () => void;
  /** Accessible name for the icon-only dismiss button. */
  dismissButtonLabel?: string;
}

/**
 * `toast` (docs/audit/toasts.md, ground-truth re-audited across all 5 severities, §14). Composes
 * the real `ButtonDanger`/`ButtonSuccess` components for `danger`/`success`'s confirmed nested
 * action button — with a tinted background fill, confirmed different from `Alert`'s neutral-bg
 * equivalent of the same dependency — while `default`/`warning`/`info` render a plain button.
 * Renders the confirmed default info-circle severity icon and "X" dismiss icon by default (both
 * downloaded as real SVG source, confirmed the SAME shapes as `Alert`'s icons, but with their own
 * distinct confirmed tint colors) — overridable via `icon`/`dismissIcon`.
 *
 * Structurally a near-sibling of `Alert` but confirmed different in nearly every layout
 * dimension: `items-center` (not `items-start`), asymmetric padding (not uniform), `elevation/e6`
 * (not `e5`), a row-oriented `alert_cell` (not column), an inline rounded-square dismiss button
 * (not an absolutely-positioned circular one), and a `featureIcon` slot Alert doesn't have at
 * all. See packages/ui/src/components/toast/README.md for the full comparison.
 */
export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      state = "danger",
      leftIcon = true,
      icon,
      featureIcon = false,
      featureIconContent,
      titleContent,
      desc = true,
      descriptionContent,
      actionButton = true,
      actionContent,
      onActionClick,
      rightIcon = true,
      dismissIcon,
      onDismissClick,
      dismissButtonLabel = "Dismiss",
      style,
      ...props
    },
    ref,
  ) => {
    const action =
      state === "danger" ? (
        <ButtonDanger size="md" type="Secondary" state="default" onClick={onActionClick} style={dangerActionFill}>
          {actionContent}
        </ButtonDanger>
      ) : state === "success" ? (
        <ButtonSuccess size="md" type="Secondary" state="default" onClick={onActionClick} style={successActionFill}>
          {actionContent}
        </ButtonSuccess>
      ) : (
        <button
          type="button"
          onClick={onActionClick}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 40,
            padding: "0.5rem 0.75rem",
            gap: "0.25rem",
            borderRadius: radius.md,
            border: "none",
            // docs/audit/toasts.md §14 — confirmed: default's own action button uses
            // secondary/500 + white text (matching Alert's separate "Dismiss" styling), while
            // warning/info use the plain neutral gray/100 + gray-700 combination.
            backgroundColor: state === "default" ? color.secondary[500] : color.gray[100],
            color: state === "default" ? color.white[950] : color.gray[700],
            boxShadow: state === "default" ? undefined : neutralButtonShadow,
            fontSize: 13,
            lineHeight: "20px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {actionContent}
        </button>
      );

    return (
      <div
        ref={ref}
        data-state={state}
        style={{
          display: "flex",
          alignItems: "center", // items-center, confirmed — differs from alert's items-start
          width: 528, // w-[528px] Fixed — §9
          gap: "1rem", // root gap not explicitly re-stated for toast; derived reuse of alert's
          // confirmed spacing/16 root gap, documented as unconfirmed for toast specifically
          paddingTop: "0.75rem", // pt-[spacing/12] — §9, first asymmetric padding in the series
          paddingBottom: "1rem", // pb-[spacing/16] — §9
          paddingLeft: "1rem", // px-[spacing/16] — §9
          paddingRight: "1rem",
          backgroundColor: color.white[950], // Color/smoke_base — §9, identical to alert
          border: `1px solid ${borderColorByState[state]}`,
          borderRadius: radius["2xl"], // radius/border_radius_xl (20) — §9, identical to alert
          boxShadow: rootShadow,
          ...style,
        }}
        {...props}
      >
        {leftIcon && (
          <span style={{ width: 24, height: 24, flexShrink: 0, boxShadow: iconShadow }}>
            {icon ?? <ToastIcon fill={iconColorByState[state]} />}
          </span>
        )}

        {featureIcon && (
          <span
            style={{
              width: 28,
              height: 28,
              flexShrink: 0,
              borderRadius: radius.lg, // radius/custom/lg (12) — §9, a token not seen in alert
              boxShadow: iconShadow,
            }}
          >
            {featureIconContent}
          </span>
        )}

        {/* alert_cell — confirmed flex-ROW here, unlike alert's flex-col (§9, §10): text and
            actions sit side-by-side, not stacked. */}
        <div style={{ display: "flex", alignItems: "center", flex: "1 0 0", gap: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" /* gap-[spacing/4] — §9 */ }}>
            <div style={{ fontSize: 15, lineHeight: "24px", fontWeight: 600, color: color.gray[950] }}>
              {titleContent}
            </div>
            {desc && (
              <div style={{ fontSize: 13, lineHeight: "20px", fontWeight: 400, color: color.gray[600] }}>
                {descriptionContent}
              </div>
            )}
          </div>

          {actionButton && action}
        </div>

        {/* Inline rounded-square dismiss button — confirmed NOT absolutely positioned and NOT
            circular, unlike alert's corner icon_button (§9, §10: radius/custom/sm, 8px). */}
        {rightIcon && (
          <button
            type="button"
            onClick={onDismissClick}
            aria-label={dismissButtonLabel}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              flexShrink: 0,
              padding: "0.5rem", // p-[spacing/8] — §9, same value as alert's corner button
              gap: "0.375rem", // gap-[spacing/6] — §9, same value as alert's corner button
              border: "none",
              borderRadius: radius.sm, // radius/custom/sm (8) — §9, confirmed different from alert's radius.full
              backgroundColor: "transparent",
              cursor: "pointer",
            }}
          >
            <span style={{ width: 18, height: 18, boxShadow: iconShadow }}>{dismissIcon ?? <DismissIcon />}</span>
          </button>
        )}
      </div>
    );
  },
);

Toast.displayName = "Toast";
