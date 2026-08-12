// Shared internals for the 8 audited button component sets.
//
// Rebuilt per the deep re-audit in docs/audit/buttons.md §14 — the first pass on this family to
// call `get_design_context` rather than relying on `get_metadata`/`get_variable_defs` alone. Every
// value below is either a literal cited to §14.2/§14.3, or an explicitly flagged extrapolation
// documented in README.md and §14.4. Do NOT reintroduce the pre-rebuild "soft"/"outline"/"text"
// step guesses (ramp[100]/[50]/[300]/[600]/[700] combinations invented without a rendered
// instance) — see §14.1 for exactly which prior mappings were wrong and why.

import { color, elevation, focusRingColor, radius, type ColorRamp } from "@shikho/tokens";

export type ButtonSizeScaleA = "xs" | "sm" | "md" | "lg" | "xl";
export type ButtonSizeScaleB = "xs" | "sm" | "md" | "lg" | "xxl";
export type ButtonSize = ButtonSizeScaleA | ButtonSizeScaleB;

// docs/audit/buttons.md §14.2 — confirmed directly via get_design_context at all 5 steps on
// `new_blue`, and cross-checked identically on `button_danger`/`ai_rounded` at xs/lg/xxl.
// `xl` (scale A's top step) and `xxl` (scale B's top step) are pixel-identical in every respect,
// including radius — scale B's xxl does NOT use `radius["2xl"]` (20px) as the pre-rebuild
// implementation assumed; the rendered instance uses the SAME `radius.lg` (12px) as `lg`.
interface SizeMetrics {
  height: number;
  padding: string;
  rootGap: number;
  labelGap: number; // text_wrap's own horizontal padding — an additive second gap, confirmed §14.1 point 9
  iconSize: number;
  radius: number;
  fontSize: number;
  lineHeight: string;
}

const SIZE_METRICS: Record<ButtonSize, SizeMetrics> = {
  xs: { height: 24, padding: "0.25rem 0.375rem", rootGap: 0, labelGap: 4, iconSize: 14, radius: radius.xs, fontSize: 11, lineHeight: "16px" },
  sm: { height: 32, padding: "0.5rem", rootGap: 2, labelGap: 4, iconSize: 16, radius: radius.sm, fontSize: 12, lineHeight: "16px" },
  md: { height: 40, padding: "0.5rem 0.75rem", rootGap: 4, labelGap: 4, iconSize: 18, radius: radius.md, fontSize: 13, lineHeight: "20px" },
  lg: { height: 48, padding: "0.75rem 1rem", rootGap: 4, labelGap: 4, iconSize: 20, radius: radius.lg, fontSize: 13, lineHeight: "20px" },
  xl: { height: 56, padding: "1rem", rootGap: 6, labelGap: 6, iconSize: 24, radius: radius.lg, fontSize: 18, lineHeight: "24px" },
  xxl: { height: 56, padding: "1rem", rootGap: 6, labelGap: 6, iconSize: 24, radius: radius.lg, fontSize: 18, lineHeight: "24px" },
};

export function sizeMetrics(size: ButtonSize): SizeMetrics {
  return SIZE_METRICS[size];
}

// docs/audit/buttons.md §14.1 point 10 — icon_button nests a smaller icon inside a larger fixed
// square button; its icon size is independently confirmed at every step (node 66050:8198's `icon`
// child instance width/height, sampled at xs/sm/md/lg/xl), NOT the same `iconSize` the 7 labeled
// families share at the same `size` step (e.g. `md` is 22px here vs. 18px for labeled families).
const ICON_BUTTON_ICON_SIZE: Record<ButtonSizeScaleA, number> = {
  xs: 16,
  sm: 18,
  md: 22,
  lg: 24,
  xl: 28,
};

export function iconButtonIconSize(size: ButtonSizeScaleA): number {
  return ICON_BUTTON_ICON_SIZE[size];
}

// docs/audit/buttons.md §14.2 — the confirmed icon-slot drop-shadow filter, identical to the
// pattern already used system-wide (Sidebar/Switcher/Top Navigation/Table).
export const iconShadowFilter =
  `drop-shadow(0px 1px 0.5px ${elevation.e2[1].color}) drop-shadow(0px 3px 1.5px ${elevation.e2[0].color})`;

function shadowLayers(layers: readonly { x: number; y: number; blur: number; spread: number; color: string }[]): string {
  return layers.map((l) => `${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${l.color}`).join(", ");
}

// docs/audit/buttons.md §14.2 — the two confirmed outer-shadow depths. `Primary`-type buttons use
// the full 2-layer e2; `Secondary`/`Outline`-type and every `Disabled` button use only e1 (a
// single layer) — a real, confirmed downgrade, not a simplification.
const OUTER_SHADOW_FULL = shadowLayers(elevation.e2);
const OUTER_SHADOW_PARTIAL = shadowLayers(elevation.e1);

// docs/audit/buttons.md §7, §14.2 — primary_button_effect / secondary_button_effect's inner-shadow
// portion (the outer-shadow portion is OUTER_SHADOW_FULL/PARTIAL above; Figma renders the two
// portions as separate layers — an outer box-shadow on the root and an inset box-shadow on a
// second, absolutely-positioned overlay div — which is why this file exposes them separately
// rather than as one combined shadow string).
const PRIMARY_INSET = `inset 0px 0px 8px -2px ${color.white[500]}, inset 0px 3px 4px -3px ${color.white[600]}`;
const SECONDARY_INSET = `inset 0px 1px 3px -2px ${color.white[50]}, inset 0px -1px 3px -2px ${color.black[100]}`;

export type ButtonPhase = "default" | "hover" | "focus" | "disabled";

/** docs/audit/buttons.md §6 — confirmed color + geometry (0-blur, 3px-spread ring) per name. */
export const focusRingBoxShadow = {
  primary: `0 0 0 3px ${focusRingColor.primary}`,
  secondary: `0 0 0 3px ${focusRingColor.secondary}`,
  // Corrected per the approved focus.danger fix (docs/token-normalization-decisions.md §10) —
  // Figma's own `outline/focus_danger` still points at the secondary alpha color; this does not.
  danger: `0 0 0 3px ${focusRingColor.danger}`,
  success: `0 0 0 3px ${focusRingColor.success}`,
  gray: `0 0 0 3px ${focusRingColor.gray}`,
  transparent: `0 0 0 3px ${color.black[200]}`, // outline/focus_transparent = Color/black/200
} as const;

export type FocusRingName = keyof typeof focusRingBoxShadow;

export type Emphasis = "solid" | "soft" | "outline" | "text";

/** What `ButtonShell` actually needs to paint one button instance. */
export interface ResolvedButtonStyle {
  background: string;
  border: string;
  textColor: string;
  /** Outer box-shadow: a focus ring, a button-effect depth layer, or both/neither. */
  boxShadow?: string;
  /** Inset overlay shadow — rendered on a second `inset-0` div, per the confirmed 2-div structure. */
  insetShadow?: string;
}

/**
 * docs/audit/buttons.md §14.2 — the confirmed `Primary`/`Secondary`/`Outline`/`Text` construction,
 * shared by every ramp-based family (`new_blue`, `new_pink`, `button_danger`, `button_success`,
 * `Greyscale`'s non-`primary` types). Confirmed state deltas (§14.2):
 * - `hover`: solid jumps the fill from ramp[500] to ramp[700] (NOT ramp[600] — the pre-rebuild
 *   implementation's guess); soft/outline jump fill 200->300 and border alpha 12%->20% together.
 * - `focus`: the button-effect (both shadow layers) is replaced entirely by a ring; solid also
 *   drops its border, soft/outline/text keep whatever border they already have.
 * - `disabled`: always the ramp's own 100/50 step fill, 300 step text, partial (e1) outer shadow,
 *   and the *secondary* inset — regardless of the type's own default effect.
 */
export function rampEmphasisStyle(ramp: ColorRamp, emphasis: Emphasis, phase: ButtonPhase, focusRing: FocusRingName): ResolvedButtonStyle {
  if (phase === "disabled") {
    // docs/audit/buttons.md §14.2 — confirmed uniform disabled recipe: solid's fill/border
    // sampled directly (ramp[100] fill, no border); outline's fill/border sampled directly
    // (ramp[50] fill, ramp[200] border). soft was not independently sampled and reuses outline's
    // recipe, since both are already visually the lighter of the two default treatments (§14.4).
    if (emphasis === "text") return { background: "transparent", border: "none", textColor: ramp[300] };
    return {
      background: emphasis === "solid" ? ramp[100] : ramp[50],
      border: emphasis === "solid" ? "none" : `1px solid ${ramp[200]}`,
      textColor: ramp[300],
      boxShadow: OUTER_SHADOW_PARTIAL,
      insetShadow: SECONDARY_INSET,
    };
  }

  if (phase === "focus") {
    const base = rampEmphasisStyle(ramp, emphasis, "default", focusRing);
    return {
      ...base,
      border: emphasis === "solid" ? "none" : base.border,
      boxShadow: focusRingBoxShadow[focusRing],
      insetShadow: undefined,
    };
  }

  const hover = phase === "hover";
  switch (emphasis) {
    case "solid":
      return {
        background: hover ? ramp[700] : ramp[500],
        border: `1px solid ${color.black[100]}`,
        textColor: color.white[950],
        boxShadow: OUTER_SHADOW_FULL,
        insetShadow: PRIMARY_INSET,
      };
    case "soft":
      return {
        background: hover ? ramp[300] : ramp[200],
        border: `1px solid ${ramp[500]}${hover ? "33" : "1f"}`, // confirmed 20%/12% alpha, §14.2
        textColor: ramp[600],
        boxShadow: OUTER_SHADOW_PARTIAL,
        insetShadow: SECONDARY_INSET,
      };
    case "text":
      return {
        background: color.white[950],
        border: "none",
        textColor: ramp[600],
      };
    case "outline":
    default:
      // `default` guards against an `emphasis` value outside the `Emphasis` union reaching here
      // at runtime (e.g. a consumer passing an unvalidated string through a type-widening cast) —
      // falling through to `outline`'s recipe rather than returning `undefined`. An unrecognized
      // `type` should render as an unstyled-but-functional button, never throw and take down
      // whatever tree this button is mounted in (`ButtonShell` does `"filter" in resolved`
      // unconditionally, which throws a TypeError on `undefined`).
      return {
        background: color.white[950],
        border: `1px solid ${ramp[500]}`,
        textColor: ramp[600],
        boxShadow: OUTER_SHADOW_PARTIAL,
        insetShadow: SECONDARY_INSET,
      };
  }
}

// docs/audit/buttons.md §14.1 point 4, §14.2 — Greyscale's `primary` type is confirmed to be
// `color.black[900]` (rgba(0,0,0,0.88)), not `color.gray[500]` as the pre-rebuild implementation
// assumed — visually identical in kind to `icon_button`'s `neutral` type and Switcher's
// `active_neutral`. Its Secondary/Outline/Text types were not independently re-sampled in this
// pass and still derive from the gray ramp via `rampEmphasisStyle`, flagged in README.md.
export function greyscalePrimaryStyle(phase: ButtonPhase): ResolvedButtonStyle {
  if (phase === "disabled") {
    return { background: color.gray[100], border: "none", textColor: color.gray[300], boxShadow: OUTER_SHADOW_PARTIAL, insetShadow: SECONDARY_INSET };
  }
  if (phase === "focus") {
    return { background: color.black[950], border: "none", textColor: color.white[950], boxShadow: focusRingBoxShadow.gray };
  }
  const hover = phase === "hover";
  // docs/audit/buttons.md §14.2 — default is confirmed black[900] (88% alpha); hover intensifying
  // to fully-opaque black[950] was not independently sampled and follows the "one step more
  // intense" pattern already confirmed on the ramp-based families (§14.4).
  return {
    background: hover ? color.black[950] : color.black[900],
    border: `1px solid ${color.black[100]}`,
    textColor: color.white[950],
    boxShadow: OUTER_SHADOW_FULL,
    insetShadow: PRIMARY_INSET,
  };
}

// docs/audit/buttons.md §14.3 — confirmed real gradients (not solid ramp fills) for all 4 types in
// both `ai_rounded`/`ai_regular`. Colors/angles read directly from the rendered instance's
// computed `backgroundImage`; `Gradient/G2`-`G5` still resolve to an empty string via
// `get_variable_defs`, exactly as every prior audit found — these literals exist because no
// gradient token category is implemented in @shikho/tokens, per the same "hardcode only when
// confirmed and no token exists" rule applied everywhere else in this codebase.
export type AiGradientType = "Primary" | "blue gradient" | "Green" | "Purple";

// A CSS `url()` value can't contain a literal space or `(`/`)` and parse in every environment —
// real browsers tolerate it, but jsdom's `cssstyle` parser (used by this package's own tests)
// silently drops the entire declaration if it sees one unescaped. `encodeURIComponent` alone
// isn't enough since it deliberately leaves `(`/`)` unescaped (they're "unreserved" per RFC 3986)
// — those are escaped separately here.
function svgDataUri(svg: string): string {
  const encoded = encodeURIComponent(svg).replace(/\(/g, "%28").replace(/\)/g, "%29");
  return `url("data:image/svg+xml,${encoded}")`;
}

// docs/audit/buttons.md §14.3/§15 — Purple's confirmed gradient (`Gradient/G4`) is a 6-stop
// RADIAL gradient with a genuine affine (rotated/skewed/off-center) transform that plain CSS
// `radial-gradient()` cannot express — Figma itself renders it as an inline SVG. Reproduced here
// as that literal SVG rather than the earlier circular-gradient approximation. Sampling the raw
// `gradientTransform` matrix at two different rendered sizes (`ai_rounded xxl`, viewBox 167×56,
// node 66050:9322; `ai_regular md`, viewBox 122×40, node 64699:8498) showed the matrix's x-column
// coefficients (`a`, `c`, `e`) scale exactly linearly with the instance's pixel WIDTH and its
// y-column coefficients (`b`, `d`) scale exactly linearly with its pixel HEIGHT — i.e. the
// transform is really defined as a fixed fraction of the element's own bounding box. Dividing the
// sampled matrices by their respective W/H gives one size-independent matrix (below) that,
// combined with `gradientUnits="objectBoundingBox"`, reproduces the confirmed shape at any button
// size or content width — SVG's objectBoundingBox space IS that same per-axis W/H normalization.
const PURPLE_GRADIENT_TRANSFORM = "matrix(0.1125 -0.111225 0.11104 0.09033 1.04396 0)";

function purpleGradientSvg(stops: ReadonlyArray<readonly [offset: number, color: string]>): string {
  const stopEls = stops.map(([offset, c]) => `<stop offset="${offset}" stop-color="${c}"/>`).join("");
  return svgDataUri(
    `<svg viewBox="0 0 1 1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">` +
      `<rect x="0" y="0" width="1" height="1" fill="url(#g)"/>` +
      `<defs><radialGradient id="g" gradientUnits="objectBoundingBox" cx="0" cy="0" r="10" gradientTransform="${PURPLE_GRADIENT_TRANSFORM}">${stopEls}</radialGradient></defs>` +
      `</svg>`,
  );
}

// The 6 confirmed color stops (§14.3), unchanged from the prior approximation — only the shape
// (circular -> the real affine ellipse) was wrong, not the colors.
const PURPLE_STOPS: ReadonlyArray<readonly [number, string]> = [
  [0, "rgb(167,136,253)"],
  [0.25, "rgb(135,104,220)"],
  [0.5, "rgb(102,72,186)"],
  [0.75, "rgb(70,40,153)"],
  [0.875, "rgb(54,24,136)"],
  [1, "rgb(37,8,120)"],
];

const GRADIENTS: Record<AiGradientType, string> = {
  Primary: "linear-gradient(67.34deg, rgb(255, 55, 223) 0.54%, rgb(110, 0, 255) 99.41%)", // Gradient/G2
  "blue gradient": "linear-gradient(42.88deg, rgb(74, 37, 225) 0.88%, rgb(123, 90, 255) 91.67%)", // Gradient/G3
  Green: "linear-gradient(223.88deg, rgb(189, 219, 121) 3.93%, rgb(48, 138, 79) 96.62%)", // Gradient/G5
  Purple: purpleGradientSvg(PURPLE_STOPS),
};

export interface ResolvedAiButtonStyle extends ResolvedButtonStyle {
  filter?: string;
}

// Confirmed directly via get_design_context on the `ai_rounded`/`ai_regular` component sets
// (node 66050:9281 / 66050:9682, every `Disabled` variant at `md` sampled) — disabled is NOT the
// uniform neutral-gray recipe previously guessed (§14.4). Two genuinely different treatments:
// `Primary` disabled is a flat, muted recolor — solid `secondary/100` fill, `secondary/200` text,
// no border, single-layer (e1) shadow, the secondary inset — matching the confirmed non-gradient
// families' disabled recipe (§14.2). The other 3 types (`Green`, `blue gradient`, `Purple`)
// instead keep their OWN gradient but visually washed toward white, white text, a light `black/50`
// border, and the FULL e2 shadow + primary inset — "washed out", not "flattened". Figma renders
// this as the base gradient plus a uniform 72%-opacity white overlay layer; that composites to
// exactly `base * 0.28 + white * 0.72` at every stop, so rather than emitting a 2-layer CSS
// `background` value (which real browsers render correctly, but jsdom's `cssstyle` parser cannot
// parse as a `background` shorthand, silently dropping the whole declaration in tests) this
// precomputes that composite into GRADIENTS' own confirmed stops as ordinary single-layer
// gradients. (Figma's own `Purple`/`Disabled` swatch literally reuses `blue gradient`'s exact RGB
// stops at every size sampled — a copy-paste artifact in the file, not a real Purple sample — so
// this washes Purple's own confirmed default gradient instead of reproducing that anomaly.)
// Same `base * 0.28 + white * 0.72` composite as Green/blue-gradient's washed stops above, applied
// to Purple's own real affine SVG shape (`purpleGradientSvg`) instead of a circular approximation.
const PURPLE_DISABLED_STOPS: ReadonlyArray<readonly [number, string]> = [
  [0, "rgb(230,222,254)"],
  [0.25, "rgb(221,213,245)"],
  [0.5, "rgb(212,204,236)"],
  [0.75, "rgb(203,195,226)"],
  [0.875, "rgb(199,190,222)"],
  [1, "rgb(194,186,217)"],
];

const DISABLED_GRADIENTS: Record<Exclude<AiGradientType, "Primary">, string> = {
  "blue gradient": "linear-gradient(42.88deg, rgb(204, 194, 247) 0.88%, rgb(218, 209, 255) 91.67%)",
  Green: "linear-gradient(223.88deg, rgb(237, 245, 217) 3.93%, rgb(197, 222, 206) 96.62%)",
  Purple: purpleGradientSvg(PURPLE_DISABLED_STOPS),
};

/**
 * docs/audit/buttons.md §14.2/§14.3 — gradient fill, `primary_button_effect`-equivalent shadow
 * treatment (all 4 ai_* types render the full effect in every sampled default instance), pill vs.
 * scale radius handled separately by each family file (§14.2's confirmed height/2 pill rule).
 * hover/focus were not independently sampled for the gradient types (§14.4) — this applies the
 * closest confirmed analogue (brightness shift on hover, ring-only on focus) rather than
 * inventing a new, unconfirmed gradient variant. `disabled` WAS independently sampled — see
 * `DISABLED_WASH_OVERLAY` above.
 */
export function aiGradientStyle(type: AiGradientType, phase: ButtonPhase): ResolvedAiButtonStyle {
  if (phase === "disabled") {
    if (type === "Primary") {
      return {
        background: color.secondary[100],
        border: "none",
        textColor: color.secondary[200],
        boxShadow: OUTER_SHADOW_PARTIAL,
        insetShadow: SECONDARY_INSET,
      };
    }
    return {
      background: DISABLED_GRADIENTS[type],
      border: `1px solid ${color.black[50]}`,
      textColor: color.white[950],
      boxShadow: OUTER_SHADOW_FULL,
      insetShadow: PRIMARY_INSET,
    };
  }
  if (phase === "focus") {
    return { background: GRADIENTS[type], border: "none", textColor: color.white[950], boxShadow: focusRingBoxShadow.primary };
  }
  return {
    background: GRADIENTS[type],
    border: `1px solid ${color.black[100]}`,
    textColor: color.white[950],
    boxShadow: OUTER_SHADOW_FULL,
    insetShadow: PRIMARY_INSET,
    filter: phase === "hover" ? "brightness(0.88)" : undefined, // derived — hover was not sampled for gradients, §14.4
  };
}

// docs/audit/buttons.md §14.2 — icon_button's own confirmed 7-type mapping. `secondary` is a
// neutral gray/100 fill, NOT the pink `color.secondary` brand ramp — the pre-rebuild
// implementation's name-matching guess was wrong (§14.1 point 3). `primary_light`/`tertiary_light`
// were not independently sampled (§14.4) and are derived as a lighter tint of their sibling.
export type IconButtonType =
  | "neutral"
  | "primary"
  | "primary_light"
  | "quaternary"
  | "secondary"
  | "tertiary"
  | "tertiary_light";

export function iconButtonStyle(type: IconButtonType, phase: ButtonPhase): ResolvedButtonStyle {
  if (phase === "disabled") {
    if (type === "quaternary") return { background: "transparent", border: "none", textColor: color.gray[300] };
    return { background: color.gray[100], border: "none", textColor: color.gray[300], boxShadow: OUTER_SHADOW_PARTIAL, insetShadow: SECONDARY_INSET };
  }

  const ring: FocusRingName =
    type === "primary" || type === "primary_light" ? "primary" : type === "secondary" ? "secondary" : "gray";

  if (phase === "focus") {
    const base = iconButtonStyle(type, "default");
    return { ...base, boxShadow: focusRingBoxShadow[ring], insetShadow: undefined };
  }

  const hover = phase === "hover";
  switch (type) {
    case "primary":
      return { background: hover ? color.primary[700] : color.primary[500], border: `1px solid ${color.black[100]}`, textColor: color.white[950], boxShadow: OUTER_SHADOW_FULL, insetShadow: PRIMARY_INSET };
    case "neutral":
      return { background: hover ? color.black[900] : color.black[950], border: `1px solid ${color.black[100]}`, textColor: color.white[950], boxShadow: OUTER_SHADOW_FULL, insetShadow: PRIMARY_INSET };
    case "secondary":
      return { background: hover ? color.gray[200] : color.gray[100], border: "none", textColor: color.gray[700], boxShadow: OUTER_SHADOW_PARTIAL, insetShadow: SECONDARY_INSET };
    case "tertiary":
      return { background: color.white[950], border: `1px solid ${color.black[50]}`, textColor: color.gray[700], boxShadow: OUTER_SHADOW_PARTIAL, insetShadow: SECONDARY_INSET };
    case "quaternary":
      return { background: "transparent", border: "none", textColor: color.gray[600] };
    // Derived, not independently confirmed — §14.4.
    case "primary_light":
      return { background: hover ? `${color.primary[500]}33` : `${color.primary[500]}1f`, border: "none", textColor: color.primary[600] };
    case "tertiary_light":
      return { background: hover ? color.gray[50] : "transparent", border: "none", textColor: color.gray[600] };
    default:
      // Same reasoning as `rampEmphasisStyle`'s `default` — an unrecognized `type` at runtime
      // must still return a valid style, not `undefined` (which crashes `ButtonShell`'s
      // unconditional `"filter" in resolved`). Falls back to `tertiary`'s own recipe above.
      return { background: color.white[950], border: `1px solid ${color.black[50]}`, textColor: color.gray[700], boxShadow: OUTER_SHADOW_PARTIAL, insetShadow: SECONDARY_INSET };
  }
}

export const buttonBaseClassName =
  "inline-flex items-center justify-center whitespace-nowrap cursor-pointer select-none " +
  "transition-colors outline-none disabled:cursor-not-allowed";
