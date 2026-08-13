import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { color, elevation, radius } from "@shikho/tokens";

// docs/audit/avatars.md §2 — avatar: size (xl, lg, md, sm, xs), type (icon, text, image).
export type AvatarSize = "xl" | "lg" | "md" | "sm" | "xs";
export type AvatarType = "icon" | "text" | "image";

/**
 * Per-size metrics, every value confirmed by a live `get_design_context` sample of each of the
 * five `type=text` variants during the v0.1.0 release verification pass
 * (docs/release-visual-verification.md — Avatar).
 *
 * The previous implementation applied ONE status size (10px), ONE status border (3px), ONE
 * verification size (12px) and a derived 3-value font scale across all five sizes. Figma defines
 * all four independently per size — this table replaces that extrapolation.
 */
interface AvatarSizeMetrics {
  box: number;
  fontSize: number;
  lineHeight: string;
  status: number;
  statusBorder: number;
  verification: number;
}

export const AVATAR_SIZE_METRICS: Record<AvatarSize, AvatarSizeMetrics> = {
  // `verification` below is a requested +2px bump at every size (was 8/10/12/14/18, confirmed
  // exact against Figma, docs/audit/avatars.md §8) — a deliberate code-only override, not a
  // Figma correction. See the `verification` render below for the new white ring, also requested
  // (Figma's own confirmed `verification_tick` carries no border at all).
  xs: { box: 24, fontSize: 11, lineHeight: "16px", status: 6, statusBorder: 2, verification: 10 },
  sm: { box: 32, fontSize: 12, lineHeight: "16px", status: 8, statusBorder: 2, verification: 12 },
  md: { box: 40, fontSize: 13, lineHeight: "20px", status: 10, statusBorder: 3, verification: 14 },
  lg: { box: 48, fontSize: 13, lineHeight: "20px", status: 12, statusBorder: 3, verification: 16 },
  xl: { box: 64, fontSize: 22, lineHeight: "32px", status: 14, statusBorder: 3, verification: 20 },
};

/**
 * Confirmed background fills. `type=text` and `type=icon` are NOT neutral gray — each carries a
 * top-to-bottom brand gradient, confirmed identical across all five sizes:
 *   text  — `color/primary_med_em` (#85a4ff) -> `color/primary_base` (#5468ff)
 *   icon  — `color/secondary_med_em` (#ea42b2) -> `color/secondary_base` (#e2008d)
 * The prior implementation rendered both as a flat `gray[200]` fill with `gray[700]` text, which
 * was the single largest visual defect found in the verification pass.
 */
const TEXT_GRADIENT = `linear-gradient(180deg, ${color.primary[400]}, ${color.primary[500]})`;
const ICON_GRADIENT = `linear-gradient(180deg, ${color.secondary[400]}, ${color.secondary[500]})`;

// Confirmed `color/white/900` (rgba(255,255,255,0.88)) — matches token `white[900]` (#ffffffe0).
const initialsColor = color.white[900];

// docs/audit/avatars.md §8 — status is filled `surface/success_med_em` (matches success[400]
// exactly) with a `neutral_transparent_white/white-72` border (matches white[800]).
const statusFill = color.success[400];
// Requested: opaque white, not the confirmed-exact translucent `white[800]` (72% alpha) above —
// a deliberate code-only override. At 72% alpha the ring lets the avatar's own fill/image show
// through, reading as a slightly greenish/washed ring rather than a clean white one.
const statusBorderColor = color.white[950];
// Requested: the verification badge gets a solid white ring too — not part of the original
// Figma audit at all (§8's confirmed `verification_tick` carries no border/outline whatsoever).
const verificationBorderColor = color.white[950];

// Confirmed on `type=icon`: the glyph carries `elevation/e2` expressed as a CSS `filter:
// drop-shadow()` pair (so the shadow follows the glyph silhouette, not its bounding box) — the
// same convention used for every icon slot in this library.
const iconShadowFilter = `drop-shadow(0px 1px 0.5px ${elevation.e2[0].color}) drop-shadow(0px 3px 1.5px ${elevation.e2[0].color})`;

export interface AvatarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  size?: AvatarSize;
  type?: AvatarType;
  /** `type="image"` only — the confirmed plain `<img>` fill (§8). */
  src?: string;
  alt?: string;
  /**
   * `type="text"` initials, or the `type="icon"` glyph. For `type="icon"` Figma draws a real
   * smiley vector; `@shikho/icons` has no glyphs yet, so the glyph itself stays a consumer-supplied
   * slot — but the container geometry, gradient and drop-shadow around it are now confirmed-exact.
   */
  children?: ReactNode;
  /** Confirmed boolean, default `false` (§8). */
  status?: boolean;
  /** Confirmed boolean, default `false` (§8). */
  verification?: boolean;
  verificationContent?: ReactNode;
}

/**
 * `avatar` (docs/audit/avatars.md; corrected against live Figma in
 * docs/release-visual-verification.md). Root is `relative` with absolutely-positioned children —
 * confirmed: avatar does not use auto-layout, unlike Button/Input.
 *
 * `avatar_group` is implemented separately (see ./avatar_group.tsx) and composes this component.
 * `avatar_face` is NOT a component: Figma's own description for that set reads "You can export
 * these and use them as fills in the Avatar component" — it is a library of 12 illustration
 * assets, consumed via `<Avatar type="image" src={...} />`.
 */
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      size = "md",
      type = "image",
      src,
      alt = "",
      children,
      status = false,
      verification = false,
      verificationContent,
      style,
      ...props
    },
    ref,
  ) => {
    const metrics = AVATAR_SIZE_METRICS[size];
    const { box } = metrics;

    return (
      <div
        ref={ref}
        data-size={size}
        data-type={type}
        style={{
          position: "relative",
          display: "inline-block",
          width: box,
          height: box,
          flexShrink: 0,
          borderRadius: radius.full,
          // Confirmed: the gradient lives on the root for text/icon; image has no fallback fill.
          background:
            type === "text" ? TEXT_GRADIENT : type === "icon" ? ICON_GRADIENT : undefined,
          ...style,
        }}
        {...props}
      >
        {type === "image" && (
          <img
            src={src}
            alt={alt}
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              objectFit: "cover", // confirmed — §8
              borderRadius: radius.full, // confirmed — applied directly on the <img>, §8
            }}
          />
        )}

        {type === "text" && (
          <span
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              textAlign: "center",
              color: initialsColor,
              fontSize: metrics.fontSize,
              lineHeight: metrics.lineHeight,
              fontWeight: 600, // confirmed SemiBold at every size
            }}
          >
            {children}
          </span>
        )}

        {type === "icon" && (
          <span
            style={{
              position: "absolute",
              // Confirmed `inset-1/4` — a proportional 25% inset on every side, so the glyph
              // container is exactly half the avatar box at any size.
              left: "25%",
              top: "25%",
              width: box / 2,
              height: box / 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              filter: iconShadowFilter,
            }}
          >
            {children}
          </span>
        )}

        {status && (
          <span
            data-testid="avatar-status"
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              boxSizing: "border-box",
              width: metrics.status,
              height: metrics.status,
              borderRadius: radius.full,
              backgroundColor: statusFill,
              border: `${metrics.statusBorder}px solid ${statusBorderColor}`,
            }}
          />
        )}

        {verification && (
          <span
            data-testid="avatar-verification"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              boxSizing: "border-box",
              width: metrics.verification,
              height: metrics.verification,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: radius.full,
              // Requested addition — see verificationBorderColor's own comment above. Reuses
              // status's own per-size border-width scale (2px xs/sm, 3px md/lg/xl) so the two
              // corner indicators feel consistent with each other.
              border: `${metrics.statusBorder}px solid ${verificationBorderColor}`,
            }}
          >
            {verificationContent}
          </span>
        )}
      </div>
    );
  },
);

Avatar.displayName = "Avatar";
