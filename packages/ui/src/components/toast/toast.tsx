import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { color, elevation, radius } from "@shikho/tokens";
import { ButtonDanger } from "../button/button_danger";

// docs/audit/toasts.md §2 — toast: exactly one property, `state`, functioning as a severity/
// theme axis, same architecture as `alert`. Casing note: the baseline value here is lowercase
// `default`, whereas alert's equivalent baseline is capitalized `Default` — a confirmed
// cross-component casing inconsistency (§2, §11), preserved as-is.
export type ToastState = "default" | "danger" | "success" | "warning" | "info";

const shadowToCss = (layers: readonly { x: number; y: number; blur: number; spread: number; color: string }[]) =>
  layers.map((l) => `${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${l.color}`).join(", ");

const rootShadow = shadowToCss(elevation.e6); // confirmed exact, root — §9/§12 (NOT e5, unlike alert)
const iconShadow = shadowToCss(elevation.e2); // confirmed exact for the rendered icon slots — §9

// docs/audit/toasts.md §8 — same 4 severity alpha border colors as alert (confirmed identical
// values, §12), reused directly. `default`'s border again has no confirmed value (only `danger`
// was deep-audited), so it reuses the same derived neutral baseline as alert's `Default`.
const borderColorByState: Record<ToastState, string> = {
  danger: `${color.danger[500]}3d`, // outline/danger_alpha = #f03d3d3d
  success: `${color.success[500]}3d`, // outline/success_alpha = #35c2203d
  warning: "#fcbf043d", // outline/warning_alpha
  info: "#118be83d", // outline/info_alpha
  default: color.gray[200], // derived neutral baseline, not confirmed
};

// docs/audit/toasts.md §9, §11 — the nested button_danger instance here is confirmed to be the
// same underlying dependency as alert's, but renders with a DIFFERENT fill: Color/danger/
// 500_alpha_12 (#f03d3d1f) here vs. Color/gray/100 in alert — "a confirmed, deliberate-looking
// but unexplained visual divergence for nominally the same dependency" that the audit could not
// resolve further. This overrides just the background on top of ButtonDanger's Secondary
// styling (which already gives the correct text/danger-600 label color, §9), rather than
// guessing which `type` value Toast's shorter, unqualified "button_danger" instance name maps
// to.
const actionButtonFillOverride = { backgroundColor: `${color.danger[500]}1f` }; // Color/danger/500_alpha_12

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  state?: ToastState;
  /** Confirmed boolean, default `true` (§9). */
  leftIcon?: boolean;
  icon?: ReactNode;
  /** Confirmed boolean, default **`false`** — the only boolean across Alert/Toast that defaults
   * off (§9). A slot with no equivalent in `alert` (§10). */
  featureIcon?: boolean;
  featureIconContent?: ReactNode;
  titleContent?: ReactNode;
  /** Confirmed boolean, default `true` (§9). */
  desc?: boolean;
  descriptionContent?: ReactNode;
  /** Confirmed boolean, default `true` (§9). */
  actionButton?: boolean;
  actionContent?: ReactNode;
  onActionClick?: () => void;
  /** Confirmed boolean, default `true` (§9) — the inline dismiss icon button. */
  rightIcon?: boolean;
  dismissIcon?: ReactNode;
  onDismissClick?: () => void;
  /** Accessible name for the icon-only dismiss button. */
  dismissButtonLabel?: string;
}

/**
 * `toast` (docs/audit/toasts.md, deep-audited at `state=danger` and explicitly compared against
 * `alert`'s own deep audit, §10). Composes the real `ButtonDanger` component for its confirmed
 * nested action button — the same underlying dependency as `Alert`'s, "doubly confirmed across
 * both Alert and Toast" (§12) — but with a different confirmed fill (see
 * `actionButtonFillOverride` above), applied via `ButtonDanger`'s `style` prop, which now merges
 * rather than replaces (a small fix made alongside this component).
 *
 * Structurally a near-sibling of `Alert` but confirmed different in nearly every layout
 * dimension: `items-center` (not `items-start`), asymmetric padding (not uniform), `elevation/e6`
 * (not `e5`), a row-oriented `alert_cell` (not column), an inline rounded-square dismiss button
 * (not an absolutely-positioned circular one), and a `featureIcon` slot Alert doesn't have at
 * all. None of these are collapsed toward Alert's implementation — see
 * packages/ui/src/components/toast/README.md for the full comparison and what remains derived.
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
  ) => (
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
        <span style={{ width: 24, height: 24, flexShrink: 0, boxShadow: iconShadow }}>{icon}</span>
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

        {actionButton && (
          <ButtonDanger
            size="md"
            type="Secondary"
            state="default"
            onClick={onActionClick}
            style={actionButtonFillOverride}
          >
            {actionContent}
          </ButtonDanger>
        )}
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
          <span style={{ width: 18, height: 18, boxShadow: iconShadow }}>{dismissIcon}</span>
        </button>
      )}
    </div>
  ),
);

Toast.displayName = "Toast";
