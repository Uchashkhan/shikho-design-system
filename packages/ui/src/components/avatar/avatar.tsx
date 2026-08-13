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
  /** Requested addition, not part of the original Figma audit — see the `badge` prop's own doc
   * comment (renamed from `ring`, replacing the removed `verification` feature). 3px confirmed
   * at `xl` (node 66200:18587's avatar ring example); scaled to the other 4 sizes by the same
   * box-ratio approach used for `status`/`statusBorder` above (3 / 64 = 0.046875 of the avatar
   * box), since no other size has a confirmed sample. */
  badgeWidth: number;
}

export const AVATAR_SIZE_METRICS: Record<AvatarSize, AvatarSizeMetrics> = {
  // `status`/`statusBorder`: re-confirmed against a fresh reference example (node 66200:18587,
  // an xl/64px avatar with an "online-badge" instance — real vector data, not a guess: SVG
  // `circle cx=8 cy=8 r=6.75 stroke-width=2.5` in a 16x16 slot). That gives, at xl: total 16px,
  // 2.5px stroke, an 11px inner fill — badge = exactly 1/4 of the avatar box, stroke = exactly
  // 0.15625 of the badge. Both ratios applied uniformly to derive the other 4 sizes (xs/sm/md/lg
  // unchanged from the original §8 confirmed 6/8/10/12 for `status` — only `xl` corrects from a
  // previously-measured 14 to the newly-confirmed 16; `statusBorder` recalculated at every size
  // from the confirmed 2.5-of-16 ratio, replacing the old flat 2px/3px two-step guess). This ALSO
  // restores `box-sizing: border-box` for `status` (see its own render comment below) — the
  // earlier "make it proportional" content-box fix corrected the SYMPTOM using invented numbers;
  // this fixes it with the actual confirmed ratio instead, which turns out to be border-box after
  // all, just with a much bigger fill/total ratio (68.75%) than the original guess had.
  //
  // `verification` (formerly a requested top-right badge with its own white ring) was removed
  // entirely per direct follow-up request, superseded by `badge` (formerly `ring`) below — the
  // whole-avatar border. `badgeWidth` reuses `status`'s own box-ratio derivation, §15/§16.
  xs: { box: 24, fontSize: 11, lineHeight: "16px", status: 6, statusBorder: 0.9375, badgeWidth: 1.125 },
  sm: { box: 32, fontSize: 12, lineHeight: "16px", status: 8, statusBorder: 1.25, badgeWidth: 1.5 },
  md: { box: 40, fontSize: 13, lineHeight: "20px", status: 10, statusBorder: 1.5625, badgeWidth: 1.875 },
  lg: { box: 48, fontSize: 13, lineHeight: "20px", status: 12, statusBorder: 1.875, badgeWidth: 2.25 },
  xl: { box: 64, fontSize: 22, lineHeight: "32px", status: 16, statusBorder: 2.5, badgeWidth: 3 },
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
  /** Not part of the original Figma audit — a requested addition (renamed from `ring`, docs/
   * audit/avatars.md §17 — the top-right `verification` badge it replaced was removed entirely
   * per the same request). Draws a solid ring around the whole avatar (e.g. to mark "currently
   * active"/"currently viewing"), reusing the confirmed 3px stroke width from a reference
   * example (node 66200:18587, an xl avatar with a purple `#8f45f5` ring), scaled per size the
   * same way `statusBorder` was (§15). No confirmed reusable "ring"/"badge" property exists on
   * the actual `avatar` component set — that example was a one-off demo instance with a
   * hardcoded border, not a documented variant — so this is a genuine addition, not a Figma
   * value applied as-is. Default `false`. */
  badge?: boolean;
  /** `badge`'s color — no default; required when `badge` is true (the reference's purple was
   * that one example's own choice, not a confirmed universal color). */
  badgeColor?: string;
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
      badge = false,
      badgeColor,
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
        data-badge={badge || undefined}
        style={{
          position: "relative",
          display: "inline-block",
          // Explicit content-box (see `status`'s own comment on this same caveat) — without it,
          // a global `box-sizing: border-box` reset (present in the docs app, and in most real
          // consumer apps via e.g. Tailwind's preflight) would make `badge`'s border eat into the
          // declared `box` size, shrinking the avatar image itself rather than adding a ring
          // around it.
          boxSizing: "content-box",
          width: box,
          height: box,
          flexShrink: 0,
          borderRadius: radius.full,
          // Confirmed: the gradient lives on the root for text/icon; image has no fallback fill.
          background:
            type === "text" ? TEXT_GRADIENT : type === "icon" ? ICON_GRADIENT : undefined,
          border: badge ? `${metrics.badgeWidth}px solid ${badgeColor}` : undefined,
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
              // Explicit `box-sizing: border-box` — restored after a fresh confirmed reference
              // (node 66200:18587's "online-badge": SVG `circle r=6.75 stroke-width=2.5` in a
              // 16x16 slot) showed this actually IS the real model: `status` is the TOTAL
              // diameter, and the ring is drawn INSIDE it, not added around it. The previous
              // "make it proportional" fix (content-box) corrected the visible symptom using an
              // invented ratio; this uses the real one (fill/total = 68.75% at every size, per
              // `AVATAR_SIZE_METRICS`'s own comment) instead, which happens to also be
              // border-box, just with much larger total sizes / much thinner borders than the
              // original 2px/3px guess that caused the disproportion in the first place.
              boxSizing: "border-box",
              width: metrics.status,
              height: metrics.status,
              borderRadius: radius.full,
              backgroundColor: statusFill,
              border: `${metrics.statusBorder}px solid ${statusBorderColor}`,
            }}
          />
        )}
      </div>
    );
  },
);

Avatar.displayName = "Avatar";
