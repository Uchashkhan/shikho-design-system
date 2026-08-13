import { type HTMLAttributes, type ReactNode, forwardRef, useState } from "react";
import { color, elevation, radius } from "@shikho/tokens";
import { InfoCircleIcon, CloseIcon } from "@shikho/icons";

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
const neutralButtonHoverBg = color.gray[200];
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

// Requested override — not part of the original Figma audit. Figma's own confirmed root fill is
// a flat white/smoke_base regardless of severity (§11); this replaces that with each severity's
// own "50" step so the whole card reads as themed, not just the icon/border. `Default` keeps its
// confirmed white fill — not named in the request. `info` wasn't explicitly named either; extended
// by the same X/50 pattern as danger/success/warning for consistency with the stated "Alert state
// controls the semantic surface" rule, not a literal instruction.
const fillByState: Record<AlertState, string> = {
  Default: color.white[950], // unchanged, confirmed — §11
  danger: color.danger[50],
  success: color.success[50],
  warning: color.warning[50],
  info: color.info[50], // extended by analogy — not explicitly named in the request
};

// Requested follow-up — not part of the original Figma audit. §15's neutral gray/100 fill on
// "Learn more" and the corner close button (both confirmed exact, §11/§14) reads fine against
// `Default`'s white surface, but loses contrast against the now severity-tinted surfaces above —
// gray/100 sits too close to e.g. danger/50's own pale pink. Fixed by making both buttons solid
// white with the SAME border color already used on the alert's own outer border
// (`borderColorByState`) for every state except `Default`, which keeps its original gray/100 fill
// and no border unchanged (explicitly confirmed to still look right as-is).
const neutralButtonBgByState: Record<AlertState, string> = {
  Default: color.gray[100],
  danger: color.white[950],
  success: color.white[950],
  warning: color.white[950],
  info: color.white[950],
};
const neutralButtonBorderByState: Record<AlertState, string> = {
  Default: "none",
  danger: `1px solid ${borderColorByState.danger}`,
  success: `1px solid ${borderColorByState.success}`,
  warning: `1px solid ${borderColorByState.warning}`,
  info: `1px solid ${borderColorByState.info}`,
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

// Requested override — not part of the original Figma audit. Figma's own confirmed construction
// composes the real ButtonDanger/ButtonSuccess for danger/success' FIRST action button (tinted
// text on a neutral gray/100 fill) and leaves the SECOND action button ("Dismiss") a flat
// secondary/500 pink regardless of severity (§11/§14) — the opposite of what's requested here.
// Per direct request: the first action button ("Learn more") now stays neutral/gray at every
// severity (see `primaryButton` below — no more ButtonDanger/ButtonSuccess composition), and the
// SECOND button ("Dismiss", "the primary semantic action") inherits the state color instead.
// `Default` -> primary/500 (explicitly named — "instead of the current pink/accent action
// treatment"); danger/success/warning explicitly named; `info` extended by analogy (info/500,
// matching its own already-confirmed icon tint) since the request's mapping list didn't cover it.
const dismissColorByState: Record<AlertState, string> = {
  Default: color.primary[500],
  danger: color.danger[500],
  success: color.success[500],
  warning: color.warning[500],
  info: color.info[500],
};
const dismissHoverColorByState: Record<AlertState, string> = {
  Default: color.primary[600],
  danger: color.danger[600],
  success: color.success[600],
  warning: color.warning[600],
  info: color.info[600],
};
// Explicitly requested: warning/500 is a bright yellow that fails contrast with white text, so
// warning's Dismiss text is warning/950 specifically — every other state keeps white text.
const dismissTextColorByState: Record<AlertState, string> = {
  Default: color.white[950],
  danger: color.white[950],
  success: color.white[950],
  warning: color.warning[950],
  info: color.white[950],
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
  /** Content for the primary action button ("Learn more" in the confirmed examples). Requested:
   * stays plain neutral gray at every severity — no longer composes `ButtonDanger`/`ButtonSuccess`
   * for `danger`/`success` the way Figma's own confirmed instances do (§11/§14); see `alert.tsx`'s
   * own module comment on `dismissColorByState` for why. */
  primaryActionContent?: ReactNode;
  onPrimaryActionClick?: () => void;
  /** Not part of the original Figma audit — a requested addition. Figma's own sampled instances
   * always show both action buttons (no boolean toggle exists for either in the confirmed
   * design), so this defaults to `true` to keep that appearance unchanged; consumers who need
   * zero or one action button now have an explicit way to ask for it instead of passing empty
   * content into an always-rendered button. */
  primaryAction?: boolean;
  /** Content for the second action button ("the primary semantic action" per direct request).
   * Figma's own confirmed construction is a flat `secondary/500` fill identical across all 5
   * severities (§11/§14); requested override: now inherits `state`'s own color instead — see
   * `dismissColorByState`. */
  dismissContent?: ReactNode;
  onDismissClick?: () => void;
  /** Not part of the original Figma audit — a requested addition. See `primaryAction`. */
  dismissAction?: boolean;
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
 * `alert` (docs/audit/alerts.md, ground-truth re-audited across all 5 severities, §14; color
 * mapping overridden per direct request, §15). Renders the confirmed default info-circle severity
 * icon and "X" close icon by default (both downloaded as real SVG source and confirmed identical
 * in shape across every severity, differing only in the severity icon's tint color) — overridable
 * via `icon`/`closeIcon` but no longer required just to see a complete alert. Unlike every other
 * component in this library, `alert` has **no boolean for title/description/actions** — they
 * render unconditionally (§11) — so this component's structural surface intentionally has just
 * one boolean (`leftIcon`), matching that confirmed rigidity rather than inventing toggles Figma
 * doesn't expose.
 *
 * Requested color override (§15, superseding §11/§14 for this one axis): Figma's own confirmed
 * construction composes `ButtonDanger`/`ButtonSuccess` for the FIRST action button on danger/
 * success and leaves the SECOND ("Dismiss") a flat pink regardless of severity. This now does the
 * opposite — "Learn more" (first button) stays neutral gray at every severity; "Dismiss" (second
 * button) inherits `state`'s own color, and the root surface fill is severity-tinted too (was a
 * flat white). See the module-level color table comments for the exact reasoning per table.
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
      primaryAction = true,
      dismissContent,
      onDismissClick,
      dismissAction = true,
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

    // Requested override (§15): "Learn more" stays plain neutral gray at EVERY severity now — no
    // more composing ButtonDanger/ButtonSuccess for danger/success (Figma's own confirmed
    // construction, §11/§14). Single unconditional neutral button, matching what Default/warning/
    // info already rendered.
    const primaryButton = (
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
          border: neutralButtonBorderByState[state],
          backgroundColor: primaryHover ? neutralButtonHoverBg : neutralButtonBgByState[state],
          boxShadow: neutralButtonShadow,
          color: color.gray[700],
          fontSize: 13,
          lineHeight: "20px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {/* Figma's "text_wrap" nests the label in its own px-[spacing/4,4px] padding on every
            confirmed action button. */}
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
          backgroundColor: fillByState[state], // requested severity-tinted surface — §15
          border: `1px solid ${borderColorByState[state]}`,
          borderRadius: radius["2xl"], // radius/border_radius_xl (20) — §11, radius.ts
          boxShadow: rootShadow,
          ...style,
        }}
        {...props}
      >
        {leftIcon && (
          // Requested: "make the icon a little bit bigger" — confirmed container was 24px
          // (§11) with the glyph itself rendering at its own native 18px default, unfilled.
          // Bumped both: container 24->28, glyph 18->22 (an explicit size prop, was unset).
          <span
            style={{
              width: 28,
              height: 28,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              filter: iconShadowFilter,
            }}
          >
            {icon ?? <InfoCircleIcon size={22} style={{ color: iconColorByState[state] }} />}
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

          {/* items-center, confirmed §11 — was previously left as the default `stretch`, which
              incidentally made the composed ButtonDanger/ButtonSuccess reach the confirmed 40px
              height only because the Dismiss button's own explicit height stretched it; fixed
              properly by giving the composed buttons their own explicit height below. */}
          {(primaryAction || dismissAction) && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" /* gap-[spacing/8] */ }}>
              {primaryAction && primaryButton}
              {/* Second action button — confirmed structurally identical across all 5 severities,
                  but not confirmed to be drawn from a named component set (§11), so it is
                  implemented inline with its own exactly confirmed fill/text. */}
              {dismissAction && (
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
                    // Requested override — was a flat secondary/500 pink regardless of severity
                    // (confirmed, §11); now inherits `state`'s own color — see
                    // `dismissColorByState`'s own module comment for the full reasoning.
                    backgroundColor: dismissHover ? dismissHoverColorByState[state] : dismissColorByState[state],
                    color: dismissTextColorByState[state],
                    fontSize: 13,
                    lineHeight: "20px",
                    fontWeight: 600, // web/Body/13 Semibold — §11
                    cursor: "pointer",
                  }}
                >
                  {/* Same confirmed text_wrap 4px padding as the primary neutral button above. */}
                  <span style={{ padding: "0 0.25rem" }}>{dismissContent}</span>
                </button>
              )}
            </div>
          )}
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
            border: neutralButtonBorderByState[state],
            borderRadius: radius.full,
            backgroundColor: cornerHover ? cornerButtonHoverBg : neutralButtonBgByState[state],
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
