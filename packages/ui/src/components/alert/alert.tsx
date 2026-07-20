import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { color, elevation, radius } from "@shikho/tokens";
import { ButtonDanger } from "../button/button_danger";

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

// docs/audit/alerts.md §9 — outline/{severity}_alpha, all ≈24% alpha of the severity's own 500
// step: outline/danger_alpha and outline/success_alpha are numerically identical to
// @shikho/tokens' focusRingColor.danger/success, reused directly. outline/warning_alpha and
// outline/info_alpha have no equivalent in @shikho/tokens yet, so their exact confirmed hex is
// used as a literal, cited constant here rather than added to the tokens package (out of scope —
// the alpha-convention consolidation is an explicitly deferred decision, docs/token-
// normalization-decisions.md §10).
const borderColorByState: Record<AlertState, string> = {
  danger: `${color.danger[500]}3d`, // outline/danger_alpha = #f03d3d3d
  success: `${color.success[500]}3d`, // outline/success_alpha = #35c2203d
  warning: "#fcbf043d", // outline/warning_alpha — confirmed exact, no @shikho/tokens equivalent
  info: "#118be83d", // outline/info_alpha — confirmed exact, no @shikho/tokens equivalent
  // "Default" has no confirmed border color anywhere in the audit (§11: only `danger` was deep-
  // audited) — this is a derived neutral baseline, not a fabricated severity color.
  Default: color.gray[200],
};

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  state?: AlertState;
  /** The one confirmed boolean property, default `true` (§11). */
  leftIcon?: boolean;
  icon?: ReactNode;
  titleContent?: ReactNode;
  descriptionContent?: ReactNode;
  /** Content for the confirmed nested `button_danger/md/secondary/default` action button (§11). */
  primaryActionContent?: ReactNode;
  onPrimaryActionClick?: () => void;
  /** Content for the second, structurally-confirmed-but-not-path-named action button (§11). */
  dismissContent?: ReactNode;
  onDismissClick?: () => void;
  /** Icon content for the absolutely-positioned corner `icon_button` (§11). */
  closeIcon?: ReactNode;
  onCloseClick?: () => void;
  /** Accessible name for the icon-only corner button — a functional requirement, not decorative
   * copy, since an icon-only button has no accessible name otherwise. Defaults to "Close" rather
   * than "Dismiss" so it doesn't collide with the visible second action button's own label —
   * the audit could not confirm whether the two controls are redundant (§11, §13). */
  closeButtonLabel?: string;
}

/**
 * `alert` (docs/audit/alerts.md, deep-audited at `state=danger`). Composes the real
 * `ButtonDanger` component for its confirmed nested action button (literal instance path
 * `button_danger/md/secondary/default`, §11 — "the clearest cross-component confirmation in
 * this entire audit series"). Unlike every other component in this library, `alert` has **no
 * boolean for title/description/actions** — they render unconditionally (§11) — so this
 * component's structural surface intentionally has just one boolean (`leftIcon`), matching that
 * confirmed rigidity rather than inventing toggles Figma doesn't expose.
 *
 * Only `state="danger"` has confirmed layout/color data. See
 * packages/ui/src/components/alert/README.md for exactly what's confirmed vs. derived for the
 * other four severities, and why the second action button and the corner close button are
 * implemented inline rather than composed from another `ui` component.
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
  ) => (
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
        <span style={{ width: 24, height: 24, flexShrink: 0, boxShadow: iconShadow }}>{icon}</span>
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
          <ButtonDanger size="md" type="Secondary" state="default" onClick={onPrimaryActionClick}>
            {primaryActionContent}
          </ButtonDanger>
          {/* Second action button — confirmed structurally, but NOT confirmed to be drawn from
              button_danger or any other named component set (§11: "not confirmed"), so it is
              implemented inline with its own exactly confirmed fill/text rather than assumed
              into a Button composition. */}
          <button
            type="button"
            onClick={onDismissClick}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.5rem 0.75rem", // py-[spacing/8] px-[spacing/12] — §11
              gap: "0.25rem", // gap-[spacing/4] — §11
              borderRadius: radius.md, // radius/custom/md (10) — §11
              border: "none",
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
          backgroundColor: "transparent",
          boxShadow: cornerButtonShadow,
          cursor: "pointer",
        }}
      >
        <span style={{ width: 18, height: 18, boxShadow: iconShadow }}>{closeIcon}</span>
      </button>
    </div>
  ),
);

Alert.displayName = "Alert";
