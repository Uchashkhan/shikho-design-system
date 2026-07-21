import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { color, radius } from "@shikho/tokens";

// docs/audit/avatars.md §2 — avatar: size (xl, lg, md, sm, xs), type (icon, text, image).
export type AvatarSize = "xl" | "lg" | "md" | "sm" | "xs";
export type AvatarType = "icon" | "text" | "image";

// docs/audit/avatars.md §4 — confirmed square dimensions, all rendered as full circles.
const sizePx: Record<AvatarSize, number> = { xl: 64, lg: 48, md: 40, sm: 32, xs: 24 };

// docs/audit/avatars.md §5 — web/Body/13, 12, 11 Semibold are "plausible candidates" for the
// type=text (initials) label, but no per-size binding was confirmed (only type=image was
// deep-audited, §8/§12). Three candidate sizes are spread across five avatar sizes here as a
// derived approximation, not a confirmed mapping.
const textFontSize: Record<AvatarSize, number> = { xl: 13, lg: 13, md: 12, sm: 11, xs: 11 };

// docs/audit/avatars.md §8 — confirmed exact: status is 10px, fully circular, filled
// surface/success_med_em (matches @shikho/tokens' color.success[400] exactly), 3px border in
// neutral_transparent_white/white-72 (matches color.white[800] closely, 72.16% vs. confirmed
// ~72%). Applied uniformly across all five avatar sizes — the audit only confirmed this at
// size=md, and scaling for other sizes was never inspected.
const STATUS_SIZE = 10;
const statusFill = color.success[400];
const statusBorder = color.white[800];

// docs/audit/avatars.md §8 — verification_tick is a confirmed 12×12 container wrapping a
// checkmark/badge vector image. No @shikho/icons glyphs exist yet, so the vector itself is left
// as an empty slot for a consumer to supply, same convention as every other icon slot in this
// library (Alert.icon, Toast.icon, etc). No radius/fill was confirmed for the container itself —
// only its child "shape" carries the checkmark image — so none is applied here.
const VERIFICATION_SIZE = 12;

// docs/audit/avatars.md §8 — confirmed for type=image only: no separate background-color
// fallback fill exists on that variant (the <img> covers the whole circle). type=icon/type=text
// were never deep-audited (out of scope, §8/§12), so their background is a derived, least-
// invented neutral gray — the same "least invented" reasoning already applied to Tags'
// secondary/tertiary types — not an independently confirmed binding.
const fallbackFill = color.gray[200];
const fallbackText = color.gray[700];

export interface AvatarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  size?: AvatarSize;
  type?: AvatarType;
  /** type="image" only — the confirmed plain `<img>` fill (§8: hardcoded, not an exposed
   * replaceable slot in Figma, but a `src` prop is the only way to make this usable in code). */
  src?: string;
  alt?: string;
  /** type="icon" | type="text" content (an icon glyph or initials text). Structurally
   * unconfirmed — no deep audit exists for either type, unlike the deep-audited type="image". */
  children?: ReactNode;
  /** Confirmed boolean, default `false` (§8). */
  status?: boolean;
  /** Confirmed boolean, default `false` (§8). Renders the confirmed 12×12 verification_tick
   * container; content for the checkmark vector itself, since no glyph asset exists yet. */
  verification?: boolean;
  verificationContent?: ReactNode;
}

/**
 * `avatar` (docs/audit/avatars.md, deep-audited at `size=md, type=image`). Unlike every other
 * component audited so far, `avatar` does **not** use Figma auto-layout — root is `relative`,
 * every child is `absolute`-positioned, and no elevation/effect token is applied at all (a
 * confirmed architectural difference from Button/Input). The circular crop comes from
 * `border-radius: radius.full` applied directly to the `<img>` itself (mirrored on the root),
 * not a separate clip-path or mask layer.
 *
 * Only `type="image"` has confirmed structure; `type="icon"` and `type="text"` render on a
 * derived neutral fill since no deep audit exists for either. See
 * packages/ui/src/components/avatar/README.md for the full confirmed-vs-derived breakdown, and
 * why `avatar_face` and `avatar_group` (the set's two sibling component sets) are out of scope
 * for this implementation.
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
    const box = sizePx[size];

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
          ...style,
        }}
        {...props}
      >
        {type === "image" ? (
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
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              borderRadius: radius.full,
              backgroundColor: fallbackFill,
              color: fallbackText,
              fontSize: textFontSize[size],
              fontWeight: 600,
            }}
          >
            {children}
          </div>
        )}

        {status && (
          <span
            data-testid="avatar-status"
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              boxSizing: "border-box",
              width: STATUS_SIZE,
              height: STATUS_SIZE,
              borderRadius: radius.full,
              backgroundColor: statusFill,
              border: `3px solid ${statusBorder}`,
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
              width: VERIFICATION_SIZE,
              height: VERIFICATION_SIZE,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
