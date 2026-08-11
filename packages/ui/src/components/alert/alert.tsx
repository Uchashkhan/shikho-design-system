import { type HTMLAttributes, type ReactNode, forwardRef, useState } from "react";
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
// P7 repair — this was wired as a CSS `box-shadow` on the icon's transparent span, which paints
// a rectangular shadow around the box itself rather than following the glyph's silhouette. Every
// other component in the library applies this exact e2 pair as `filter: drop-shadow(...)`
// instead (see list.tsx's `iconShadowFilter`) — the mismatch made both icons, especially the
// corner close "X", look smudged/heavier than the confirmed glyph.
const iconShadowFilter = `drop-shadow(0px 1px 0.5px ${elevation.e2[1].color}) drop-shadow(0px 3px 1.5px ${elevation.e2[0].color})`;
// docs/audit/alerts.md §14 — confirmed on the plain neutral button (Default/warning/info's first
// action): an outer single-layer drop shadow (elevation/e2's smaller layer) PLUS the confirmed
// system-wide "special_drop" 2-layer inset — the same construction already used by
// Chip/Tags/DatePicker/Modal/Pagination/SidebarItem/TopNavItem/TableCell/Tooltip for this effect.
const neutralButtonShadow = `${shadowToCss([elevation.e2[1]])}, inset 0px 1px 3px -2px ${color.white[50]}, inset 0px -1px 3px -2px rgba(0,0,0,0.07)`;

// P3: none of the alert's own buttons (the plain neutral primary action, "Dismiss", and the
// corner close icon_button) responded to a real pointer at all — every fill was a static inline
// style, the same "no hover" defect already fixed across every other component this session.
// `ButtonDanger`/`ButtonSuccess` already support a real `hover` phase (§11/§14); the hand-rolled
// buttons get one-step-darker hover fills, matching the same darkening convention already
// confirmed for the Secondary button family (button_danger.tsx's `confirmedSecondaryHover`).
const neutralButtonHoverBg = color.gray[200];
const dismissButtonHoverBg = color.secondary[600];
const cornerButtonHoverBg = color.gray[200];

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
    // P3 — real pointer-driven hover for the alert's own buttons (§ above). Left as separate
    // flags per control since each is independently hoverable, matching the same
    // pointer/focus-driven-state pattern used library-wide (see sidebar_item.tsx).
    const [primaryHover, setPrimaryHover] = useState(false);
    const [dismissHover, setDismissHover] = useState(false);
    const [cornerHover, setCornerHover] = useState(false);

    const primaryButton =
      state === "danger" ? (
        // P6 repair — a fresh get_design_context re-pull on node 66071:28147 confirmed the
        // nested instance has only a `text_wrap` label, no icon slots at all. ButtonDanger
        // defaults leftIcon/rightIcon to true, so without this it rendered two empty 18px icon
        // slots, inflating the button ~54px wider than the neutral buttons on the other
        // severities — the inconsistency was real, not just a color mismatch.
        <ButtonDanger
          size="md"
          type="Secondary"
          state={primaryHover ? "hover" : "default"}
          leftIcon={false}
          rightIcon={false}
          onClick={onPrimaryActionClick}
          onMouseEnter={() => setPrimaryHover(true)}
          onMouseLeave={() => setPrimaryHover(false)}
        >
          {primaryActionContent}
        </ButtonDanger>
      ) : state === "success" ? (
        <ButtonSuccess
          size="md"
          type="Secondary"
          state={primaryHover ? "hover" : "default"}
          leftIcon={false}
          rightIcon={false}
          onClick={onPrimaryActionClick}
          onMouseEnter={() => setPrimaryHover(true)}
          onMouseLeave={() => setPrimaryHover(false)}
        >
          {primaryActionContent}
        </ButtonSuccess>
      ) : (
        // docs/audit/alerts.md §14 — confirmed: Default/warning/info's first action button is a
        // plain neutral gray/100 fill + gray-700 text button, NOT drawn from a severity-tinted
        // Button family member (unlike danger/success).
        <button
          type="button"
          onClick={onPrimaryActionClick}
          onMouseEnter={() => setPrimaryHover(true)}
          onMouseLeave={() => setPrimaryHover(false)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 40,
            padding: "0.5rem 0.75rem",
            gap: "0.25rem",
            borderRadius: radius.md,
            border: "none",
            backgroundColor: primaryHover ? neutralButtonHoverBg : color.gray[100],
            boxShadow: neutralButtonShadow,
            color: color.gray[700],
            fontSize: 13,
            lineHeight: "20px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {/* Figma's "text_wrap" nests the label in its own px-[spacing/4,4px] padding on every
              confirmed action button (this one and the composed ButtonDanger/ButtonSuccess
              alike) — previously only applied here via the outer button's own padding, which
              left this button narrower than the composed ones for the same label. */}
          <span style={{ padding: "0 0.25rem" }}>{primaryActionContent}</span>
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
              onMouseEnter={() => setDismissHover(true)}
              onMouseLeave={() => setDismissHover(false)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center", // confirmed — re-pulled get_design_context, node 66071:28148
                height: 40, // confirmed h-[40px] — same fixed height as the primary action button,
                // previously missing here (the two buttons rendered at different heights)
                padding: "0.5rem 0.75rem", // py-[spacing/8] px-[spacing/12] — §11
                gap: "0.25rem", // gap-[spacing/4] — §11
                borderRadius: radius.md, // radius/custom/md (10) — §11
                border: `1px solid ${color.black[50]}`, // outline/black-50 — §11 (P1 repair)
                // Re-pulled get_design_context confirms the same outer 1px drop-shadow + inset
                // highlight/shadow pair already applied to the primary neutral button — previously
                // missing here entirely.
                boxShadow: neutralButtonShadow,
                backgroundColor: dismissHover ? dismissButtonHoverBg : color.secondary[500], // confirmed — §11
                color: color.white[950], // text/white-950 — §11
                fontSize: 13,
                lineHeight: "20px",
                fontWeight: 600, // web/Body/13 Semibold — §11
                cursor: "pointer",
              }}
            >
              {/* Same confirmed text_wrap 4px padding as the primary neutral button above. */}
              <span style={{ padding: "0 0.25rem" }}>{dismissContent}</span>
            </button>
          </div>
        </div>

        {/* Absolutely-positioned corner icon_button — confirmed outside the main flex flow,
            §11. Not confirmed to map to any specific icon_button type/size, so implemented with
            its own confirmed geometry rather than composed from the IconButton component. */}
        <button
          type="button"
          onClick={onCloseClick}
          onMouseEnter={() => setCornerHover(true)}
          onMouseLeave={() => setCornerHover(false)}
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
            backgroundColor: cornerHover ? cornerButtonHoverBg : color.gray[100],
            boxShadow: cornerButtonShadow,
            cursor: "pointer",
          }}
        >
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
            {/* docs/audit/alerts.md — a fresh get_design_context re-pull on node 66071:28137
                confirms the glyph ("vector") sits inset 20.83% inside this 18px box — i.e. it
                renders at its native 10.5×10.5 size (CloseIcon's own confirmed viewBox), not
                stretched to fill all 18px. Forcing size={18} rendered the X ~70% larger/bolder
                than the confirmed glyph. */}
            {/* `size` only accepts the fixed IconSize steps (14/16/18/...); the confirmed 10.5px
                render size is achieved via an explicit CSS width/height override instead, which
                takes precedence over the SVG's own size-driven width/height attributes. */}
            {closeIcon ?? <CloseIcon style={{ width: 10.5, height: 10.5, color: color.gray[700] }} />}
          </span>
        </button>
      </div>
    );
  },
);

Alert.displayName = "Alert";
