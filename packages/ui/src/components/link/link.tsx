import {
  type AnchorHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type Ref,
  forwardRef,
  useState,
} from "react";
import { color, elevation } from "@shikho/tokens";

// docs/audit/links-deep-audit.md §1 — link: size (xl, lg, md, sm, xs), type (quaternary,
// primary), state (disabled, hover, default). No `focus` state exists (§5) — confirmed absent,
// unlike every other interactive component in this library.
export type LinkSize = "xl" | "lg" | "md" | "sm" | "xs";
export type LinkType = "quaternary" | "primary";
export type LinkState = "disabled" | "hover" | "default";

// docs/audit/links-deep-audit.md §3 — confirmed per-size gap, icon size, and typography. lg and
// md resolve to numerically identical typography (13px/20px/600), reconfirming typography.md's
// own documented Title/13-vs-Body/13 duplication — they differ only in icon size.
interface SizeConfig {
  gap: number;
  iconSize: number;
  fontSize: number;
  lineHeight: string;
}

const SIZE_CONFIG: Record<LinkSize, SizeConfig> = {
  xl: { gap: 8, iconSize: 24, fontSize: 18, lineHeight: "24px" },
  lg: { gap: 6, iconSize: 20, fontSize: 13, lineHeight: "20px" },
  md: { gap: 6, iconSize: 18, fontSize: 13, lineHeight: "20px" },
  sm: { gap: 6, iconSize: 16, fontSize: 12, lineHeight: "16px" },
  xs: { gap: 4, iconSize: 14, fontSize: 11, lineHeight: "16px" },
};

// docs/audit/links-deep-audit.md §4 — confirmed type x state color/weight matrix. Both types
// share the exact same disabled color; only default/hover differ by type.
const FONT_WEIGHT: Record<LinkType, number> = { primary: 600, quaternary: 500 };

const TEXT_COLOR: Record<LinkType, Record<LinkState, string>> = {
  primary: {
    default: color.primary[500],
    hover: color.primary[600],
    disabled: color.gray[400],
  },
  quaternary: {
    default: color.gray[700],
    hover: color.gray[950],
    disabled: color.gray[400],
  },
};

// docs/audit/links-deep-audit.md §2 — confirmed genuinely applied to both icon slots (not
// incidental spillover, resolving links.md §8/§13's uncertainty). Note: this is a CSS `filter:
// drop-shadow()` pair, not a `box-shadow` — Figma renders icon-only vector layers with a filter
// so the shadow follows the glyph's silhouette rather than its bounding box. The confirmed exact
// values (y=1/blur=0.5 and y=3/blur=1.5) are exactly half of elevation.e2's box-shadow blur
// values — the same halving Figma applies everywhere it exports an icon shadow as a filter
// rather than a box-shadow (also seen identically on DatePicker's nav-arrow icons).
const iconShadowFilter = `drop-shadow(0px 1px 0.5px ${elevation.e2[0].color}) drop-shadow(0px 3px 1.5px ${elevation.e2[0].color})`;

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "color"> {
  size?: LinkSize;
  type?: LinkType;
  /** Forces a specific state (used by Storybook/playground controls to preview `hover`/`disabled`
   * without a pointer). Left unset, the real cursor drives `hover` via onMouseEnter/onMouseLeave. */
  state?: LinkState;
  /** The 3 confirmed boolean slots (§2), all default `true`. */
  leftIcon?: boolean;
  rightIcon?: boolean;
  text?: boolean;
  /** Not part of the original Figma audit — a requested addition; default `false` matches the
   * confirmed original behavior (`text-decoration: none` in every sampled state). When `true`,
   * the underline is applied consistently across default/hover — there's no confirmed Figma
   * source for a state-specific underline treatment, and Link already has no distinct `focus`
   * treatment at all (see the confirmed-absent note above), so this doesn't attempt to invent
   * one either. */
  underline?: boolean;
  /** Confirmed instance-swap slots (§2) — replace the default icon rendering entirely. */
  selectLeftIcon?: ReactNode | null;
  selectRightIcon?: ReactNode | null;
  children?: ReactNode;
}

function IconSlot({ size, children }: { size: number; children?: ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        width: size,
        height: size,
        flexShrink: 0,
        filter: iconShadowFilter,
      }}
    >
      {children}
    </span>
  );
}

/**
 * `link` (docs/audit/links-deep-audit.md, deep-audited across all 3 states, both types, and all
 * 5 sizes). Renders a real `<a>` when `href` is supplied — a functional necessity for a
 * navigation component, since Figma's own export never distinguishes an anchor from any other
 * container (consistent with every prior audit in this series). `state=disabled` is expressed
 * via `aria-disabled` + `pointer-events: none`, since `<a>` has no native `disabled` attribute.
 *
 * **Confirmed absent: a `focus` state** — unlike every other interactive component audited so
 * far, `link` has no distinct focus treatment and no focus-ring token anywhere in its export.
 * This relies on the browser's native `:focus-visible` outline rather than inventing one.
 *
 * `state` left unset lets the real cursor drive `hover` via onMouseEnter/onMouseLeave — the same
 * fix already applied to `SidebarItem`/`SwitcherItem`/`TabNavItem`. An explicit `state` (Storybook/
 * playground controls, or `"disabled"`) always overrides the pointer.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      size = "md",
      type = "primary",
      state,
      underline = false,
      leftIcon = true,
      rightIcon = true,
      text = true,
      selectLeftIcon = null,
      selectRightIcon = null,
      children,
      style,
      onClick,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref,
  ) => {
    const { gap, iconSize, fontSize, lineHeight } = SIZE_CONFIG[size];

    // `state` left unset (the normal case for real usage) → hover is driven by the actual
    // pointer. An explicit `state` (Storybook/playground controls, or "disabled") always wins.
    // See sidebar_item.tsx for the identical fix and its rationale.
    const [pointerHover, setPointerHover] = useState(false);
    const resolvedState: LinkState = state ?? (pointerHover ? "hover" : "default");
    const isDisabled = resolvedState === "disabled";

    const handleMouseEnter = (event: MouseEvent<HTMLAnchorElement>) => {
      setPointerHover(true);
      onMouseEnter?.(event);
    };
    const handleMouseLeave = (event: MouseEvent<HTMLAnchorElement>) => {
      setPointerHover(false);
      onMouseLeave?.(event);
    };

    const computedStyle: CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap,
      padding: 0,
      fontSize,
      lineHeight,
      fontWeight: FONT_WEIGHT[type],
      color: TEXT_COLOR[type][resolvedState],
      textDecoration: underline ? "underline" : "none",
      cursor: isDisabled ? "not-allowed" : "pointer",
      pointerEvents: isDisabled ? "none" : "auto",
      whiteSpace: "nowrap",
      ...style,
    };

    const content = (
      <>
        {leftIcon && <IconSlot size={iconSize}>{selectLeftIcon}</IconSlot>}
        {text && <span>{children ?? "Link"}</span>}
        {rightIcon && <IconSlot size={iconSize}>{selectRightIcon}</IconSlot>}
      </>
    );

    const sharedProps = {
      "data-size": size,
      "data-type": type,
      "data-state": resolvedState,
      "data-underline": underline || undefined,
      "aria-disabled": isDisabled || undefined,
      style: computedStyle,
      onClick: isDisabled ? undefined : onClick,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    } as const;

    // A plain <a> with no href has no implicit accessible "link" role, isn't keyboard reachable,
    // and — critically for this docs site, where every gallery card is itself a navigation
    // anchor — would produce invalid <a>-in-<a> nesting wherever this component's own preview is
    // shown. When no href is supplied (e.g. onClick-only navigation), this renders a <span
    // role="link"> instead of a real anchor; href usage still gets a genuine native <a>.
    if (props.href) {
      return (
        <a ref={ref} {...sharedProps} {...props}>
          {content}
        </a>
      );
    }

    return (
      <span
        ref={ref as unknown as Ref<HTMLSpanElement>}
        role="link"
        tabIndex={0}
        {...sharedProps}
        {...(props as HTMLAttributes<HTMLSpanElement>)}
      >
        {content}
      </span>
    );
  },
);

Link.displayName = "Link";
