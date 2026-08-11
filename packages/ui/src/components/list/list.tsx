import { type HTMLAttributes, type MouseEvent as ReactMouseEvent, type ReactNode, forwardRef, useState } from "react";
import { color, elevation } from "@shikho/tokens";
import { tv } from "tailwind-variants";
import { Checkbox, type CheckboxProps } from "../checkbox";
import { Tags, type TagType } from "../tags";

// docs/audit/list.md §2 — list exposes exactly two properties: size (md, lg, xl) and
// state (default, hover, active_primary_accent). No `type` property exists. This is ONE
// component set (a single list row), not a List+ListItem container/child pair.
export type ListSize = "md" | "lg" | "xl";
export type ListState = "default" | "hover" | "active_primary_accent";

/**
 * Per-state visuals, confirmed by live `get_design_context` samples of all three `md` states
 * during the v0.1.0 repair pass (docs/release-visual-verification.md — List).
 *
 * The previous implementation rendered all three states identically, using the single
 * `lg/active_primary_accent` instance the original audit sampled. Figma confirms the three
 * states differ in exactly three properties — row fill, main text colour, and which `tags`
 * type is nested — and in nothing else.
 */
interface ListStateVisual {
  /** `undefined` = no fill at all (confirmed for `default`: only the bottom divider shows). */
  rowFill: string | undefined;
  mainTextColor: string;
  /** The confirmed nested `Tags` type for this state. */
  tagType: Extract<TagType, "secondary" | "tertiary">;
}

const STATE_VISUAL: Record<ListState, ListStateVisual> = {
  // No background fill — the row reads as plain surface with only its divider.
  default: { rowFill: undefined, mainTextColor: color.gray[700], tagType: "secondary" },
  // `color/gray-100` (#f4f4f6).
  hover: { rowFill: color.gray[100], mainTextColor: color.gray[950], tagType: "tertiary" },
  // `color/gray` (#ebecf0) — the unnumbered ramp entry, matching token `gray[200]`.
  active_primary_accent: {
    rowFill: color.gray[200],
    mainTextColor: color.gray[950],
    tagType: "tertiary",
  },
};

// Confirmed identical across all three states (§7 + release verification):
const dividerColor = color.gray[100]; // outline/gray-100
const descriptionColor = color.gray[600]; // text/gray-600
const trailTextColor = color.gray[700]; // text/gray-700 — confirmed distinct from main text

const TEXT_WEIGHT = 500; // Medium — confirmed at every size for both text rows

// Confirmed: both icon slots carry `elevation/e2` as a `filter: drop-shadow()` pair, so the
// shadow follows the glyph silhouette — the same convention used library-wide.
const iconShadowFilter = `drop-shadow(0px 1px 0.5px ${elevation.e2[0].color}) drop-shadow(0px 3px 1.5px ${elevation.e2[0].color})`;

/**
 * Per-size metrics — all three rows confirmed by live `get_design_context` samples during the
 * P1 repair pass. Five properties vary by size; only the root gap (12px), the `leadItem` slot
 * (24px) and the nested Tag (always Tags' own `md`) are confirmed identical across all three.
 *
 * Note: the pre-repair implementation's constants were `lg`'s values (12px padding, 36px
 * leadItemLg, 24px icons, 4px trail padding), since the original audit sampled `lg` only.
 */
interface ListSizeMetrics {
  padding: string;
  leadItemLg: number;
  sideIcon: number;
  mainText: { fontSize: number; lineHeight: string };
  description: { fontSize: number; lineHeight: string };
  trailPadding: string;
}

const SIZE_METRICS: Record<ListSize, ListSizeMetrics> = {
  md: {
    padding: "0.5rem",
    leadItemLg: 32,
    sideIcon: 20,
    mainText: { fontSize: 13, lineHeight: "20px" },
    description: { fontSize: 12, lineHeight: "16px" },
    trailPadding: "0.125rem",
  },
  lg: {
    padding: "0.75rem",
    leadItemLg: 36,
    sideIcon: 24,
    mainText: { fontSize: 13, lineHeight: "20px" },
    description: { fontSize: 12, lineHeight: "16px" },
    trailPadding: "0.25rem",
  },
  xl: {
    padding: "1rem",
    leadItemLg: 40,
    sideIcon: 24,
    mainText: { fontSize: 18, lineHeight: "24px" },
    description: { fontSize: 13, lineHeight: "20px" },
    trailPadding: "0.25rem",
  },
};

const ROOT_GAP = "0.75rem"; // spacing/12 — confirmed identical at md, lg and xl
const LEAD_ITEM = 24; // confirmed identical at md, lg and xl

const listStyles = tv({
  slots: {
    root: "flex items-center justify-center overflow-hidden",
    leadItemImg: "shrink-0 object-cover",
    leadItemLgImg: "shrink-0 object-cover",
    leftIconSlot: "shrink-0",
    textGroup1: "flex flex-col items-center justify-center",
    textGroup2: "flex flex-col items-end justify-center text-right",
    rightIconSlot: "shrink-0",
  },
  variants: {
    size: { md: {}, lg: {}, xl: {} },
    state: { default: {}, hover: {}, active_primary_accent: {} },
  },
  defaultVariants: { size: "lg", state: "default" },
});

export interface ListProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  size?: ListSize;
  /** Forces a specific state (used by Storybook/playground controls to preview `hover` without a
   * pointer). Left unset, the real cursor drives it via onMouseEnter/onMouseLeave —
   * `active_primary_accent` can only be forced, since no confirmed interaction (e.g. checking the
   * row's checkbox) is documented to trigger it. */
  state?: ListState;
  /** Renders the nested Checkbox (§7 — the audit's own naming mismatch is preserved). */
  leadIcon?: boolean;
  /** 24×24 "token" image slot. */
  leadItem?: boolean;
  /** 32×32 "token" image slot — confirmed NOT rendered by default. */
  leadItemLg?: boolean;
  leftIcon?: boolean;
  rightIcon?: boolean;
  tag?: boolean;
  text?: boolean;
  textGroup1?: boolean;
  description1?: boolean;
  textGroup2?: boolean;
  trailText?: boolean;
  description2?: boolean;
  selectLeftIcon?: ReactNode | null;
  selectRightIcon?: ReactNode | null;
  textContent?: ReactNode;
  description1Content?: ReactNode;
  trailTextContent?: ReactNode;
  description2Content?: ReactNode;
  tagContent?: ReactNode;
  leadItemSrc?: string;
  leadItemLgSrc?: string;
  /**
   * Props forwarded to the nested `Checkbox`. `size`/`shape` are fixed to the confirmed nested
   * configuration (`sm`/`square`) and are not overridable.
   */
  checkboxProps?: Omit<CheckboxProps, "size" | "shape">;
}

/**
 * `list` (docs/audit/list.md; per-state visuals corrected against live Figma in
 * docs/release-visual-verification.md).
 *
 * Composes the real `Checkbox` and `Tags` components rather than re-implementing their styling.
 * The nested tag is a genuine `tags` instance in Figma: its `secondary` type in the `default`
 * state and its `tertiary` type in `hover`/`active_primary_accent` — both already implemented
 * exactly by `Tags`, so List no longer duplicates (and drifts from) that styling.
 */
export const List = forwardRef<HTMLDivElement, ListProps>(
  (
    {
      size = "lg",
      state,
      leadIcon = true,
      leadItem = true,
      leadItemLg = false,
      leftIcon = true,
      rightIcon = true,
      tag = true,
      text = true,
      textGroup1 = true,
      description1 = true,
      textGroup2 = true,
      trailText = true,
      description2 = true,
      selectLeftIcon = null,
      selectRightIcon = null,
      textContent,
      description1Content,
      trailTextContent,
      description2Content,
      tagContent,
      leadItemSrc,
      leadItemLgSrc,
      checkboxProps,
      className,
      style,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref,
  ) => {
    // `state` left unset (the normal case for real usage) → hover is driven by the actual
    // pointer. An explicit `state` (Storybook/playground controls) always wins. See
    // sidebar_item.tsx for the identical fix and its rationale.
    const [pointerHover, setPointerHover] = useState(false);
    const resolvedState: ListState = state ?? (pointerHover ? "hover" : "default");

    const handleMouseEnter = (event: ReactMouseEvent<HTMLDivElement>) => {
      setPointerHover(true);
      onMouseEnter?.(event);
    };
    const handleMouseLeave = (event: ReactMouseEvent<HTMLDivElement>) => {
      setPointerHover(false);
      onMouseLeave?.(event);
    };

    const styles = listStyles({ size, state: resolvedState });
    const visual = STATE_VISUAL[resolvedState];
    const metrics = SIZE_METRICS[size];
    const mainTextStyle = { ...metrics.mainText, fontWeight: TEXT_WEIGHT };
    const descriptionStyle = { ...metrics.description, fontWeight: TEXT_WEIGHT };

    return (
      <div
        ref={ref}
        data-size={size}
        data-state={resolvedState}
        className={styles.root({ className })}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          gap: ROOT_GAP,
          padding: metrics.padding,
          backgroundColor: visual.rowFill,
          borderBottom: `1px solid ${dividerColor}`,
          borderRadius: 0, // confirmed absence of any corner radius — §7
          ...style,
        }}
        {...props}
      >
        {leadIcon && <Checkbox size="sm" shape="square" {...checkboxProps} />}
        {leadItemLg && leadItemLgSrc && (
          <img
            src={leadItemLgSrc}
            alt=""
            className={styles.leadItemLgImg()}
            width={metrics.leadItemLg}
            height={metrics.leadItemLg}
          />
        )}
        {leadItem && leadItemSrc && (
          <img
            src={leadItemSrc}
            alt=""
            className={styles.leadItemImg()}
            width={LEAD_ITEM}
            height={LEAD_ITEM}
          />
        )}
        {leftIcon && (
          <span
            className={styles.leftIconSlot()}
            style={{ width: metrics.sideIcon, height: metrics.sideIcon, filter: iconShadowFilter }}
          >
            {selectLeftIcon}
          </span>
        )}
        {textGroup1 && (
          <span className={styles.textGroup1()} style={{ flex: "1 0 0", minWidth: 1, gap: 0 }}>
            {text && (
              <span style={{ color: visual.mainTextColor, ...mainTextStyle }}>{textContent}</span>
            )}
            {description1 && (
              <span style={{ color: descriptionColor, ...descriptionStyle }}>
                {description1Content}
              </span>
            )}
          </span>
        )}
        {tag && (
          <Tags size="md" type={visual.tagType} leftIcon={false} rightIcon={false}>
            {tagContent}
          </Tags>
        )}
        {textGroup2 && (
          <span
            className={styles.textGroup2()}
            style={{ gap: 0, paddingRight: metrics.trailPadding }}
          >
            {trailText && (
              <span style={{ color: trailTextColor, ...mainTextStyle }}>{trailTextContent}</span>
            )}
            {description2 && (
              <span style={{ color: descriptionColor, ...descriptionStyle }}>
                {description2Content}
              </span>
            )}
          </span>
        )}
        {rightIcon && (
          <span
            className={styles.rightIconSlot()}
            style={{ width: metrics.sideIcon, height: metrics.sideIcon, filter: iconShadowFilter }}
          >
            {selectRightIcon}
          </span>
        )}
      </div>
    );
  },
);

List.displayName = "List";
