import { type CSSProperties, type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { color, radius } from "@shikho/tokens";

// docs/audit/tags.md §2 — tags: size (lg, md, sm), type (11 values, casing preserved exactly
// including the confirmed space-containing Title Case "Danger Filled"/"Success Filled" — "the
// most severe single-property naming inconsistency confirmed in this entire audit series", §9),
// state (disabled, hover, default — no focus, no drag, unlike Chip).
export type TagSize = "lg" | "md" | "sm";
export type TagType =
  | "info"
  | "warning"
  | "danger"
  | "Danger Filled"
  | "success"
  | "Success Filled"
  | "tertiary"
  | "secondary"
  | "primary_outline"
  | "primary_light"
  | "primary";
export type TagState = "disabled" | "hover" | "default";

// docs/audit/tags.md §3 — confirmed bounding-box heights (no "≈" qualifier, unlike Chip's
// approximate sizes). No get_design_context deep audit exists for this family (§6), so — same
// treatment as every Hug-sized component in this library — width is left to content.
const HEIGHT: Record<TagSize, number> = { lg: 32, md: 24, sm: 20 };

const tagRadius = radius.full; // radius/border_radius_round — see README for why the other three
// confirmed radius/custom/xs|sm|md tokens are NOT mapped to specific types here.

interface FillTextBorder {
  backgroundColor: string;
  color: string;
  border: string;
}

const solid = (bg: string): FillTextBorder => ({
  backgroundColor: bg,
  color: color.white[950],
  border: "1px solid transparent",
});

const tinted = (bg: string, text: string): FillTextBorder => ({
  backgroundColor: bg,
  color: text,
  border: "1px solid transparent",
});

const outlined = (border: string, text: string): FillTextBorder => ({
  backgroundColor: "transparent",
  color: text,
  border: `1px solid ${border}`,
});

/**
 * docs/audit/tags.md §8 — "the cleanest, most internally consistent alpha-naming system found
 * in this entire audit series": every severity gets exactly `_alpha_12`/`_alpha_20`, with
 * `primary` additionally getting `_alpha_24`. All five hex values quoted below are exact
 * confirmed literals from that section, not computed.
 *
 * `info`/`warning`/`success`/`danger` (bare) use each colour's own confirmed `_alpha_12` tint —
 * the lightest confirmed step — with its confirmed `Text/{name} 600` label colour. "Danger
 * Filled"/"Success Filled" are the solid counterparts the audit explicitly names as a pair
 * (§3, §9); `warning`/`info` have no such pair — a confirmed asymmetry, not implemented here.
 *
 * `primary`, `primary_light`, `primary_outline` are read as a three-way emphasis split of the
 * one primary colour (§3: "a confirmed three-way visual-style split for the primary brand
 * colour — filled, tinted, outlined") — `primary_light` maps to the confirmed
 * `Color/primary/500_alpha_12`, `primary` to the solid 500 fill, `primary_outline` to a border
 * of the base colour. `secondary`/`tertiary` have no confirmed alpha data anywhere in this
 * audit (they're absent from §8's severity table) — they are derived neutral-gray emphasis
 * steps, not independently confirmed.
 */
const styleByType: Record<TagType, FillTextBorder> = {
  info: tinted(`${color.info[500]}1f`, color.info[600]), // Color/info/500_alpha_12, Text/Info 600
  warning: tinted(`${color.warning[500]}1f`, color.warning[600]), // Color/warning/500_alpha_12, Text/Warning 600
  danger: tinted(`${color.danger[500]}1f`, color.danger[600]), // Color/danger/500_alpha_12, Text/Danger 600
  "Danger Filled": solid(color.danger[500]), // Color/danger/500, solid
  success: tinted(`${color.success[500]}1f`, color.success[600]), // Color/success/500_alpha_12, Text/Success 600
  "Success Filled": solid(color.success[500]), // Color/success/500, solid
  primary: solid(color.primary[500]), // Color/primary/500, solid
  primary_light: tinted(`${color.primary[500]}1f`, color.primary[600]), // Color/primary/500_alpha_12, Text/Primary 600
  primary_outline: outlined(color.primary[500], color.primary[600]), // derived: base colour as border
  secondary: tinted(color.gray[100], color.gray[700]), // derived — no confirmed alpha data for "secondary" (§8 covers only 5 severities)
  tertiary: tinted(color.gray[50], color.gray[600]), // derived — lighter than "secondary", same reasoning
};

export interface TagsProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  size?: TagSize;
  type?: TagType;
  state?: TagState;
  children?: ReactNode;
}

/**
 * `tags` (docs/audit/tags.md). Rendered as a plain `<span>`, not a `<button>` — the audit's own
 * architectural comparison against `Chip` explicitly reads `tags` as "a static, label-only
 * element" (no `focus`/`drag` state exists, unlike Chip's interactive/selectable set, §10). No
 * icon/leading/trailing slot is implemented: whether any exist as internal layers was never
 * confirmed (§4, §12), since no `get_design_context` deep audit was run on this family.
 *
 * Only the five severity colours' `_alpha_12` tint and `Text/{name} 600` label colour, plus the
 * two "Filled" solid fills and the primary emphasis trio, are backed by exact confirmed hex
 * values. `secondary`/`tertiary` are derived neutral steps — see
 * packages/ui/src/components/tags/README.md for the full confirmed-vs-derived breakdown.
 */
export const Tags = forwardRef<HTMLSpanElement, TagsProps>(
  ({ size = "md", type = "info", state = "default", style, ...props }, ref) => {
    const isDisabled = state === "disabled";

    const computed: CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      height: HEIGHT[size],
      padding: "0 0.5rem", // spacing/8, horizontal only — not attributed to a specific side (§7)
      borderRadius: tagRadius,
      fontSize: 12,
      lineHeight: "16px",
      fontWeight: 600, // SemiBold — the only weight confirmed for this family, §6
      whiteSpace: "nowrap",
      cursor: isDisabled ? "not-allowed" : "default",
      opacity: isDisabled ? 0.5 : 1,
      ...styleByType[type],
      ...style,
    };

    return (
      <span
        ref={ref}
        data-size={size}
        data-type={type}
        data-state={state}
        aria-disabled={isDisabled || undefined}
        style={computed}
        {...props}
      />
    );
  },
);

Tags.displayName = "Tags";
