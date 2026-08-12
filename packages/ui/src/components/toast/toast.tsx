import { type HTMLAttributes, type ReactNode, forwardRef, useEffect, useRef, useState } from "react";
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
  /** Not part of the original Figma audit — a requested addition. When `true`, a thin progress
   * bar spans the full width at the bottom, draining over `duration` ms, and `onDismissClick`
   * fires automatically when it completes — the same callback the manual dismiss button uses, so
   * a consumer handles both identically (this component never removes itself; like the manual
   * dismiss button, it only signals — the consumer owns whether/how the Toast leaves the DOM).
   * Default `false`. */
  autoDismiss?: boolean;
  /** Total time in ms before `autoDismiss` fires. Default `5000`. Ignored when `autoDismiss` is
   * `false`. */
  duration?: number;
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
      autoDismiss = false,
      duration = 5000,
      style,
      ...props
    },
    ref,
  ) => {
    // P9 repair — none of Toast's own buttons responded to a real pointer at all, the same
    // missing-interactivity defect already fixed on Alert this session.
    const [actionHover, setActionHover] = useState(false);
    const [dismissHover, setDismissHover] = useState(false);

    // Requested addition — not part of the original Figma audit. `onDismissClick` is read via a
    // ref rather than as a direct effect dependency: a consumer passing a fresh inline arrow
    // function every render would otherwise restart the timer on every render, and — for a
    // consumer with any regular re-render cadence — the timer could then never actually complete.
    const onDismissRef = useRef(onDismissClick);
    useEffect(() => {
      onDismissRef.current = onDismissClick;
    });

    // `barWidth` starts at "100%" and is flipped to "0%" shortly after mount so the CSS
    // `transition` (rather than a `@keyframes` block, keeping this component's existing
    // inline-styles-only architecture) actually animates instead of snapping straight to empty.
    // Needs the standard DOUBLE requestAnimationFrame here, not a single one: React's commit of
    // the "100%" state and a single rAF callback's "0%" update both land inside the same browser
    // frame, so the "100%" state never actually gets painted — the browser has no starting point
    // to interpolate from and the transition silently no-ops, jumping straight to 0%. The first
    // rAF callback runs after that frame is queued but still before its paint; deferring the
    // actual "0%" write to a SECOND rAF (queued from inside the first) guarantees "100%" was
    // painted at least once first.
    const [barWidth, setBarWidth] = useState("100%");
    const timerRef = useRef<ReturnType<typeof setTimeout>>();
    useEffect(() => {
      if (!autoDismiss) return;
      setBarWidth("100%");
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setBarWidth("0%"));
      });
      timerRef.current = setTimeout(() => onDismissRef.current?.(), duration);
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
        clearTimeout(timerRef.current);
      };
    }, [autoDismiss, duration]);

    // Spec: "manual close immediately cancels the timer and dismisses the Toast." Clearing the
    // pending setTimeout here matters even though the consumer will typically unmount the Toast
    // right away (which would clean it up anyway via the effect's own cleanup) — a consumer that
    // instead keeps it mounted after a manual dismiss (e.g. to animate an exit transition) would
    // otherwise still get a second, redundant onDismissClick call once the original timer elapsed.
    const handleDismissClick = () => {
      clearTimeout(timerRef.current);
      onDismissClick?.();
    };

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
            // P10 correction — re-checking warning (66074:28544) and info (66074:28556) against
            // default (66074:28508) found the border is NOT shared by every state as the P9 pass
            // assumed: only default's secondary/500-filled button carries it (matching Alert's
            // Dismiss button, which also has this border); warning/info's plain gray/100 button
            // has no border class at all in Figma (matching Alert's own neutral "Learn more",
            // which likewise has none). The outer+inset shadow IS shared by all three — unchanged.
            border: state === "default" ? `1px solid ${color.black[50]}` : "none",
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
          // Requested addition — needed so the auto-dismiss progress bar below can be clipped to
          // the root's own rounded corners instead of squaring off its bottom edge.
          position: "relative",
          overflow: "hidden",
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
          {/* P11 repair — a fresh get_design_context re-pull confirms "text" itself carries
              flex-[1_0_0] + min-w-px (node 66074:28512), which this lacked entirely. Without it,
              neither this column nor the action button grow/shrink, so the button sat wherever
              its own content happened to end — visibly ~75px left of where the confirmed layout
              places it (flush against the row's end, pushed there by this column growing to fill
              the remaining space). */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem" /* gap-[spacing/4] — §9 */,
              flex: "1 0 0",
              minWidth: 1,
            }}
          >
            <div style={{ fontSize: 15, lineHeight: "24px", fontWeight: 600, color: color.gray[950] }}>
              {titleContent}
            </div>
            {desc && (
              <div style={{ fontSize: 13, lineHeight: "20px", fontWeight: 400, color: color.gray[600] }}>
                {descriptionContent}
              </div>
            )}
          </div>

          {/* P11 repair — confirmed wrapping "actions" container (node 66074:28517/28529/etc.),
              previously missing: gap-[spacing/8] (only matters once >1 action button exists) and
              shrink-0, which stops the action button itself from being compressed by a long
              title/description now that the text column above legitimately grows to fill space. */}
          {actionButton && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
              {action}
            </div>
          )}
        </div>

        {/* Inline rounded-square dismiss button — confirmed NOT absolutely positioned and NOT
            circular, unlike alert's corner icon_button (§9, §10: radius/custom/sm, 8px). */}
        {rightIcon && (
          <button
            type="button"
            onClick={handleDismissClick}
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

        {/* Requested addition, not part of the original Figma audit — a full-width progress bar
            draining over `duration` ms, tinted with the same per-severity color as the leading
            icon. */}
        {autoDismiss && (
          <div
            aria-hidden
            data-testid="toast-progress-track"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 3,
              backgroundColor: color.gray[100],
            }}
          >
            <div
              style={{
                height: "100%",
                width: barWidth,
                backgroundColor: iconColorByState[state],
                transition: `width ${duration}ms linear`,
              }}
            />
          </div>
        )}
      </div>
    );
  },
);

Toast.displayName = "Toast";
