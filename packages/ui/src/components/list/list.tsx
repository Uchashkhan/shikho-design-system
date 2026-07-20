import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { color, radius } from "@shikho/tokens";
import { tv } from "tailwind-variants";
import { Checkbox, type CheckboxProps } from "../checkbox";

// docs/audit/list.md §2 — list exposes exactly two properties: size (md, lg, xl) and
// state (default, hover, active_primary_accent). No `type` property exists. This is ONE
// component set (a single list row), not a List+ListItem container/child pair — confirmed by
// the audit's own architecture (§1, §2): no wrapping "list container" component was found.
export type ListSize = "md" | "lg" | "xl";
export type ListState = "default" | "hover" | "active_primary_accent";

// docs/audit/list.md §7 — deep-audited at size=lg, state=active_primary_accent. Only this one
// combination has confirmed layout/color data; §9 explicitly marks default/hover and md/xl as
// "out of scope, no sibling inference performed." All three states and all three sizes render
// using these same confirmed values as a shared baseline rather than an invented per-variant
// design — see packages/ui/src/components/list/README.md.
const rootFill = color.gray[200]; // "Color/Gray" (unnumbered, #ebecf0) — §7, §8 duplicate-naming note
const dividerColor = color.gray[100]; // outline/Gray 100 (#f4f4f6) — §7
const mainTextColor = color.gray[950]; // Text/Gray 950 — §7
const descriptionColor = color.gray[600]; // Text/Gray 600 — §7
const trailTextColor = color.gray[700]; // Text/Gray 700 — §7 (confirmed different from main text)
const tagTextColor = color.gray[700]; // Text/Gray 700 — §7
const tagBorderColor = color.black[50]; // outline/black-50 (#0000000a) — §7
const tagFill = color.white[950]; // Color/white/950 (#ffffff) — §7
const tagRadius = radius.sm; // radius/custom/sm (8px) — §7

const mainTextStyle = { fontSize: 13, lineHeight: "20px", fontWeight: 500 }; // body_1/para, Medium
const descriptionStyle = { fontSize: 12, lineHeight: "16px", fontWeight: 500 }; // caption_2, Medium
const tagTextStyle = { fontSize: 11, lineHeight: "16px", fontWeight: 600 }; // caption_1, SemiBold

const listStyles = tv({
  slots: {
    root: "flex items-center justify-center",
    leadItemImg: "shrink-0 object-cover",
    leadItemLgImg: "shrink-0 object-cover",
    leftIconSlot: "shrink-0",
    textGroup1: "flex flex-col items-center justify-center",
    textGroup2: "flex flex-col items-end justify-center text-right",
    tags: "flex items-center justify-center",
    tagInner: "flex items-center justify-center",
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
  state?: ListState;
  // The 12 confirmed boolean properties (§7), with their confirmed defaults inferred directly
  // from the deep-audited instance's [rendered]/[NOT rendered] annotations.
  /** Renders the nested Checkbox (§7 — see `checkboxProps` and "Composition" in the README). */
  leadIcon?: boolean;
  /** 24×24 "token" image slot. */
  leadItem?: boolean;
  /** 36×36 "token" image slot — confirmed NOT rendered by default. */
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
  // Confirmed instance-swap properties (§7) — React.ReactNode | null, default null.
  selectLeftIcon?: ReactNode | null;
  selectRightIcon?: ReactNode | null;
  // Content for the slots above — no default text is supplied, since the audit's own
  // placeholder content ("List item" reused for both trailText and description2, §7) is a
  // confirmed Figma inconsistency, not real product copy to reproduce as a default.
  textContent?: ReactNode;
  description1Content?: ReactNode;
  trailTextContent?: ReactNode;
  description2Content?: ReactNode;
  tagContent?: ReactNode;
  leadItemSrc?: string;
  leadItemLgSrc?: string;
  /**
   * Props forwarded to the nested `Checkbox` when `leadIcon` is true. `size`/`shape` are fixed
   * to the confirmed nested configuration (`sm`/`square`, §7) and are not part of this type —
   * requirement 8 ("do not duplicate Checkbox styling inside List") means List never re-derives
   * Checkbox's own visual, only composes it.
   */
  checkboxProps?: Omit<CheckboxProps, "size" | "shape">;
}

/**
 * `list` (docs/audit/list.md) — a single list-row component (confirmed: `size` × `state` only,
 * no `type` property, no wrapping container component). Composes the real `Checkbox` component
 * from `@shikho/ui`'s checkbox module via the confirmed `leadIcon` boolean — preserving the
 * audit's own naming mismatch (`leadIcon` controls a checkbox, not a generic icon, §7).
 *
 * Only `size="lg" state="active_primary_accent"` has confirmed layout/color data. The state name
 * itself is misleading — the audit confirms its only background fill is plain `Color/Gray`, not
 * a primary-tinted color (§7, "State-name/fill discrepancy, flagged") — reproduced faithfully,
 * not "fixed." `default`/`hover` and `md`/`xl` reuse this same confirmed visual as a baseline,
 * since the audit explicitly marks their structural differences out of scope (§7, §9). See
 * packages/ui/src/components/list/README.md.
 */
export const List = forwardRef<HTMLDivElement, ListProps>(
  (
    {
      size = "lg",
      state = "default",
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
      ...props
    },
    ref,
  ) => {
    const styles = listStyles({ size, state });

    return (
      <div
        ref={ref}
        data-size={size}
        data-state={state}
        className={styles.root({ className })}
        style={{
          gap: "0.75rem", // gap-[spacing/12, 12px] — §7
          padding: "0.75rem", // p-[spacing/12, 12px] uniform — §7
          backgroundColor: rootFill,
          borderBottom: `1px solid ${dividerColor}`,
          borderRadius: 0, // confirmed absence of any corner radius — §7
          ...style,
        }}
        {...props}
      >
        {leadIcon && <Checkbox size="sm" shape="square" {...checkboxProps} />}
        {leadItemLg && leadItemLgSrc && (
          <img src={leadItemLgSrc} alt="" className={styles.leadItemLgImg()} width={36} height={36} />
        )}
        {leadItem && leadItemSrc && (
          <img src={leadItemSrc} alt="" className={styles.leadItemImg()} width={24} height={24} />
        )}
        {leftIcon && (
          <span className={styles.leftIconSlot()} style={{ width: 24, height: 24 }}>
            {selectLeftIcon}
          </span>
        )}
        {textGroup1 && (
          <span className={styles.textGroup1()} style={{ flex: "1 0 0", minWidth: 1, gap: 0 }}>
            {text && <span style={{ color: mainTextColor, ...mainTextStyle }}>{textContent}</span>}
            {description1 && (
              <span style={{ color: descriptionColor, ...descriptionStyle }}>{description1Content}</span>
            )}
          </span>
        )}
        {tag && (
          <span
            className={styles.tags()}
            style={{
              height: 24,
              padding: "0.25rem 0.375rem", // py-[spacing/4] px-[spacing/6] — §7
              border: `1px solid ${tagBorderColor}`,
              backgroundColor: tagFill,
              borderRadius: tagRadius,
            }}
          >
            <span className={styles.tagInner()} style={{ padding: "0 0.25rem" /* px-[spacing/4] */ }}>
              <span style={{ color: tagTextColor, ...tagTextStyle }}>{tagContent}</span>
            </span>
          </span>
        )}
        {textGroup2 && (
          <span
            className={styles.textGroup2()}
            style={{ gap: 0, paddingRight: "0.25rem" /* pr-[spacing/4] */ }}
          >
            {trailText && (
              <span style={{ color: trailTextColor, ...mainTextStyle }}>{trailTextContent}</span>
            )}
            {description2 && (
              <span style={{ color: descriptionColor, ...descriptionStyle }}>{description2Content}</span>
            )}
          </span>
        )}
        {rightIcon && (
          <span className={styles.rightIconSlot()} style={{ width: 24, height: 24 }}>
            {selectRightIcon}
          </span>
        )}
      </div>
    );
  },
);

List.displayName = "List";
