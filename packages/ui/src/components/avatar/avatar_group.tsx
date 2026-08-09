import { Children, type HTMLAttributes, type ReactNode, forwardRef, isValidElement } from "react";
import { color, radius } from "@shikho/tokens";
import { AVATAR_SIZE_METRICS, type AvatarSize } from "./avatar";

export type AvatarGroupSize = AvatarSize;

/**
 * Per-size overlap, confirmed by `get_metadata` on all five `avatar_group` variants: each variant
 * lays out 7 `avatar` instances at a fixed step, so the overlap is the avatar box minus that step.
 *
 *   xs — 24px avatars stepped 16px -> 8px overlap   (total width 120)
 *   sm — 32px avatars stepped 24px -> 8px overlap   (total width 176)
 *   md — 40px avatars stepped 28px -> 12px overlap  (total width 208)
 *   lg — 48px avatars stepped 32px -> 16px overlap  (total width 240)
 *   xl — 64px avatars stepped 44px -> 20px overlap  (total width 328)
 *
 * The `md` overlap is independently corroborated by `get_design_context`, which renders it as an
 * explicit `mr-[-12px]` on every child except the last.
 */
const OVERLAP: Record<AvatarGroupSize, number> = { xs: 8, sm: 8, md: 12, lg: 16, xl: 20 };

/**
 * Confirmed 1px ring drawn around every avatar in a group (it does not exist on a standalone
 * Avatar) — `neutral_transparent_white/white-88`, matching token `white[900]` (#ffffffe0 ≈ 88%).
 */
const RING_COLOR = color.white[900];

// Confirmed on the trailing overflow counter: `color/gray-100` fill with an `outline/gray-100`
// border and `text/gray-950` label — deliberately NOT one of Avatar's three types, so it is drawn
// here rather than forced through `Avatar`.
const OVERFLOW_FILL = color.gray[100];
const OVERFLOW_BORDER = color.gray[100];
const OVERFLOW_TEXT = color.gray[950];

export interface AvatarGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Drives both the nested avatars' size and the confirmed per-size overlap. */
  size?: AvatarGroupSize;
  /**
   * `Avatar` elements. Each is wrapped with the group's confirmed white ring and negative-margin
   * overlap; the group does not re-implement any avatar styling itself.
   */
  children?: ReactNode;
  /**
   * Renders the confirmed trailing "+N" counter. Omitted when undefined — Figma's own demo shows
   * it as the last slot, but it is content, not a fixed part of the structure.
   */
  overflowCount?: number;
}

/**
 * `avatar_group` (docs/audit/avatars.md §1; structure confirmed during the P1 repair pass).
 *
 * Composes the real `Avatar` component — the group contributes only three things Figma confirms
 * at the group level: a per-size negative-margin overlap, a 1px white ring on each avatar, and an
 * optional trailing overflow counter. Avatar sizing itself comes from `AVATAR_SIZE_METRICS`, so
 * the two components cannot drift apart.
 */
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ size = "md", children, overflowCount, style, ...props }, ref) => {
    const box = AVATAR_SIZE_METRICS[size].box;
    const overlap = OVERLAP[size];
    const items = Children.toArray(children).filter(isValidElement);
    const hasOverflow = typeof overflowCount === "number";

    return (
      <div
        ref={ref}
        data-size={size}
        style={{ display: "inline-flex", alignItems: "center", ...style }}
        {...props}
      >
        {items.map((child, index) => {
          const isLast = index === items.length - 1 && !hasOverflow;
          return (
            <span
              key={index}
              data-avatar-group-item=""
              style={{
                display: "inline-flex",
                flexShrink: 0,
                borderRadius: radius.full,
                border: `1px solid ${RING_COLOR}`,
                marginRight: isLast ? 0 : -overlap,
              }}
            >
              {child}
            </span>
          );
        })}

        {hasOverflow && (
          <span
            data-testid="avatar-group-overflow"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxSizing: "border-box",
              width: box,
              height: box,
              borderRadius: radius.full,
              backgroundColor: OVERFLOW_FILL,
              border: `1px solid ${OVERFLOW_BORDER}`,
              color: OVERFLOW_TEXT,
              fontSize: AVATAR_SIZE_METRICS[size].fontSize,
              lineHeight: AVATAR_SIZE_METRICS[size].lineHeight,
              fontWeight: 600,
            }}
          >
            +{overflowCount}
          </span>
        )}
      </div>
    );
  },
);

AvatarGroup.displayName = "AvatarGroup";
