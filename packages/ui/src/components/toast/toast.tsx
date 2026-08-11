import { type HTMLAttributes, type ReactNode, forwardRef, useState } from "react";
import { color, elevation, radius } from "@shikho/tokens";
import { InfoCircleIcon, CloseIcon } from "@shikho/icons";
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
// P9 repair — re-checking against alerts.md's box-shadow/drop-shadow finding: this was wired as
// a CSS box-shadow on the icon's transparent span (a rectangle around the box) rather than
// filter: drop-shadow(...) (which follows the glyph's own silhouette, confirmed on every icon
// slot in this component via a fresh get_design_context pull, node 66074:28508/66074:28520).
const iconShadowFilter = `drop-shadow(0px 1px 0.5px ${elevation.e2[1].color}) drop-shadow(0px 3px 1.5px ${elevation.e2[0].color})`;
// docs/audit/toasts.md §14 — confirmed on the plain neutral action button (warning/info): an
// outer single-layer drop shadow (elevation/e2's smaller layer) PLUS the confirmed system-wide
// "special_drop" 2-layer inset — same construction reused across this whole library.
const neutralButtonShadow = `${shadowToCss([elevation.e2[1]])}, inset 0px 1px 3px -2px ${color.white[50]}, inset 0px -1px 3px -2px rgba(0,0,0,0.07)`;
const neutralButtonHoverBg = color.gray[200]; // one step darker, same convention as alert.tsx
const defaultActionHoverBg = color.secondary[600];
const dismissButtonHoverBg = color.gray[100]; // transparent -> gray-100, the neutral icon-button convention

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

const iconColorByState: Record<ToastState, string> = {
  default: color.gray[950], // confirmed #0A0C11 — differs from Alert's primary-tinted Default
  danger: color.danger[500],
  success: color.success[500],
  warning: color.warning[500],
  info: color.info[500],
};

// docs/audit/toasts.md §14 — confirmed via downloading the real SVG: the dismiss icon is the SAME
// "X" glyph as Alert's close icon (byte-identical path data), but fixed `gray-600` fill —
// confirmed different from Alert's `gray-700`.

// docs/audit/toasts.md §9, §11, §14 — the nested button_danger/button_success instances render
// with a TINTED background (their own severity's `_alpha_12`), confirmed different from Alert's
// equivalent buttons (which use a flat neutral gray/100 background with only the text tinted).
// `warning`/`info`/`default` are confirmed to render a plain, unqualified "button" instead — NOT
// drawn from a severity Button family member. `default`'s own action button is confirmed distinct
// again: `Color/secondary/500` fill + white text (matching Alert's separate "Dismiss" button
// styling), not the neutral gray/gray-700 combination warning/info use.
// P9 repair — ButtonShell only sets an explicit `height` for icon-only buttons; text buttons
// (like this one) derive their height from padding + line-height alone, which computes to 38px,
// not the confirmed h-[40px] (node 66074:28530). Alert's equivalent button only happened to
// render at 40px because it sits in a flex row with a sibling that forces align-items: stretch —
// an accidental, fragile fix, not a real one. Both now get an explicit height here.
// `background` (not `backgroundColor`) to match the shorthand ButtonShell's own rootStyle uses —
// mixing the two across a rerender previously logged a React style-conflict warning.
const dangerActionFill = { background: `${color.danger[500]}1f`, height: 40 }; // Color/danger/500_alpha_12
const successActionFill = { background: `${color.success[500]}1f`, height: 40 }; // Color/success/500_alpha_12

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
    // P9 repair — none of Toast's own buttons responded to a real pointer at all, the same
    // missing-interactivity defect already fixed on Alert this session.
    const [actionHover, setActionHover] = useState(false);
    const [dismissHover, setDismissHover] = useState(false);

    const action =
      state === "danger" ? (
        <ButtonDanger
          size="md"
          type="Secondary"
          state={actionHover ? "hover" : "default"}
          leftIcon={false}
          rightIcon={false}
          onClick={onActionClick}
          onMouseEnter={() => setActionHover(true)}
          onMouseLeave={() => setActionHover(false)}
          style={dangerActionFill}
        >
          {actionContent}
        </ButtonDanger>
      ) : state === "success" ? (
        <ButtonSuccess
          size="md"
          type="Secondary"
          state={actionHover ? "hover" : "default"}
          leftIcon={false}
          rightIcon={false}
          onClick={onActionClick}
          onMouseEnter={() => setActionHover(true)}
          onMouseLeave={() => setActionHover(false)}
          style={successActionFill}
        >
          {actionContent}
        </ButtonSuccess>
      ) : (
        <button
          type="button"
          onClick={onActionClick}
          onMouseEnter={() => setActionHover(true)}
          onMouseLeave={() => setActionHover(false)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 40,
            padding: "0.5rem 0.75rem",
            gap: "0.25rem",
            borderRadius: radius.md,
            // P9 repair — a fresh get_design_context re-pull (node 66074:28508) confirms this
            // button carries the same 1px outline/black-50 border in EVERY state (default was
            // previously missing it entirely), and the same outer+inset shadow construction
            // (previously explicitly disabled via `undefined` for state="default").
            border: `1px solid ${color.black[50]}`,
            // docs/audit/toasts.md §14 — confirmed: default's own action button uses
            // secondary/500 + white text (matching Alert's separate "Dismiss" styling), while
            // warning/info use the plain neutral gray/100 + gray-700 combination.
            backgroundColor:
              state === "default"
                ? actionHover
                  ? defaultActionHoverBg
                  : color.secondary[500]
                : actionHover
                  ? neutralButtonHoverBg
                  : color.gray[100],
            color: state === "default" ? color.white[950] : color.gray[700],
            boxShadow: neutralButtonShadow,
            fontSize: 13,
            lineHeight: "20px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {/* Figma's confirmed "text_wrap" nests the label in its own px-[spacing/4,4px]
              padding on top of the button's own 12px padding — previously missing here,
              mirroring the same gap already found and fixed on alert.tsx's neutral button. */}
          <span style={{ padding: "0 0.25rem" }}>{actionContent}</span>
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
          <span
            style={{
              width: 24,
              height: 24,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              filter: iconShadowFilter,
            }}
          >
            {icon ?? <InfoCircleIcon style={{ color: iconColorByState[state] }} />}
          </span>
        )}

        {featureIcon && (
          <span
            style={{
              width: 28,
              height: 28,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: radius.lg, // radius/custom/lg (12) — §9, a token not seen in alert
              filter: iconShadowFilter,
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
            onMouseEnter={() => setDismissHover(true)}
            onMouseLeave={() => setDismissHover(false)}
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
              backgroundColor: dismissHover ? dismissButtonHoverBg : "transparent",
              cursor: "pointer",
            }}
          >
            {/* P9 repair — a fresh get_design_context re-pull (node 66074:28519/66074:28531)
                confirms the "X" glyph is inset 20.83% inside this 18px box, i.e. it renders at
                its native 10.5×10.5 size, not stretched to fill 18px — the same fix already made
                on alert.tsx's corner close button. */}
            <span
              style={{
                width: 18,
                height: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                filter: iconShadowFilter,
              }}
            >
              {dismissIcon ?? <CloseIcon style={{ width: 10.5, height: 10.5, color: color.gray[600] }} />}
            </span>
          </button>
        )}
      </div>
    );
  },
);

Toast.displayName = "Toast";
