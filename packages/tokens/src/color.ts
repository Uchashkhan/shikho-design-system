// Confirmed exact values only — every hex below is quoted verbatim from docs/audit/colors.md,
// docs/audit/special-effects.md, docs/audit/alerts.md, or docs/audit/tags.md. Nothing here was
// inferred, interpolated, or approximated. See docs/token-normalization-decisions.md §1–3, §10.

export type ColorStep = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

export type ColorRamp = Record<ColorStep, string>;

// docs/audit/colors.md §1 — 11-step brand ramps.
export const primary: ColorRamp = {
  50: "#f7fbff",
  100: "#edf6ff",
  200: "#d5e7ff",
  300: "#bad5ff",
  400: "#85a4ff",
  500: "#5468ff",
  600: "#3b4ee3",
  700: "#303ebf",
  800: "#1e2b99",
  900: "#111973",
  950: "#0a1053",
};

// Source: `Color/Secondary` (capitalized in Figma, preserved as a naming fact, not normalized away).
export const secondary: ColorRamp = {
  50: "#fcf0fa",
  100: "#fce3f7",
  200: "#f7bbe9",
  300: "#f681d7",
  400: "#ea42b2",
  500: "#e2008d",
  600: "#cc0177",
  700: "#ac005b",
  800: "#870044",
  900: "#66002e",
  950: "#45001f",
};

// Source: `Color/Shikho AI`.
export const shikhoAi: ColorRamp = {
  50: "#f2e6fa",
  100: "#dabff2",
  200: "#c394e8",
  300: "#b771e8",
  400: "#8f32cb",
  500: "#7c15b4",
  600: "#6e129e",
  700: "#5d0f85",
  800: "#4b0c6d",
  900: "#390956",
  950: "#28063f",
};

// Source: `Color/secondary_2` — kept distinct from `secondary`; the audit never confirmed a
// relationship between the two, so they are not merged or aliased.
export const secondary2: ColorRamp = {
  50: "#fff4f0",
  100: "#ffe7dd",
  200: "#ffc0a6",
  300: "#ff9e77",
  400: "#ff6a2f",
  500: "#fa4a04",
  600: "#dc4407",
  700: "#af371a",
  800: "#812812",
  900: "#41180e",
  950: "#1a0b08",
};

// docs/audit/colors.md §2 — functional ramps.
export const info: ColorRamp = {
  50: "#f1f8fe",
  100: "#deeffd",
  200: "#bcdffa",
  300: "#92cbf7",
  400: "#59b0f3",
  500: "#118be8",
  600: "#1080d6",
  700: "#0e6fb9",
  800: "#0b5b98",
  900: "#08416d",
  950: "#001d38",
};

export const success: ColorRamp = {
  50: "#e8fbe5",
  100: "#d4f7cf",
  200: "#a9ef9f",
  300: "#7fe76f",
  400: "#50df3a",
  500: "#35c220",
  600: "#2a9919",
  700: "#217613",
  800: "#164f0d",
  900: "#0d3107",
  950: "#082005",
};

export const danger: ColorRamp = {
  50: "#feecec",
  100: "#fcd9d9",
  200: "#f9b3b3",
  300: "#f68989",
  400: "#f36363",
  500: "#f03d3d",
  600: "#e92020",
  700: "#a60d0d",
  800: "#720909",
  900: "#4a0606",
  950: "#240000",
};

export const warning: ColorRamp = {
  50: "#fff8e6",
  100: "#fef2cd",
  200: "#fee59a",
  300: "#fdd868",
  400: "#fdcb35",
  500: "#fcbf04",
  600: "#ca9802",
  700: "#977202",
  800: "#654c01",
  900: "#4a3902",
  950: "#2d2000",
};

// docs/audit/colors.md §3 — gray/dark ramps.
export const gray: ColorRamp = {
  50: "#f9f9fa",
  100: "#f4f4f6",
  200: "#ebecf0",
  300: "#dddfe4",
  400: "#c3c6cc",
  500: "#afb3bb",
  600: "#8c929c",
  700: "#5b616d",
  800: "#414651",
  900: "#222732",
  950: "#0a0c11",
};

export const vanillaGray: ColorRamp = {
  50: "#fcfbf8",
  100: "#f6f4ef",
  200: "#f2f1ea",
  300: "#e9e8dd",
  400: "#dbdcd0",
  500: "#b4b6ab",
  600: "#939587",
  700: "#5d6054",
  800: "#484b40",
  900: "#1f221b",
  950: "#10110d",
};

export const dark: ColorRamp = {
  50: "#f8f8f8",
  100: "#f4f4f4",
  200: "#eeeeee",
  300: "#e1e1e1",
  400: "#c7c7c7",
  500: "#7d7d7d",
  600: "#2d2d2d",
  700: "#212121",
  800: "#171717",
  900: "#111111",
  950: "#070707",
};

// docs/audit/colors.md §4 — black/white are opacity ramps, not hue ramps. All 12 steps (including
// the non-standard `150`) are confirmed exact 8-digit hex values.
export type OpacityStep = 50 | 100 | 150 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

export type OpacityRamp = Record<OpacityStep, string>;

export const black: OpacityRamp = {
  50: "#0000000a",
  100: "#00000012",
  150: "#0000001f",
  200: "#00000029",
  300: "#0000003d",
  400: "#00000052",
  500: "#0000007a",
  600: "#0000008f",
  700: "#000000a3",
  800: "#000000b8",
  900: "#000000e0",
  950: "#000000",
};

export const white: OpacityRamp = {
  50: "#ffffff0a",
  100: "#ffffff12",
  150: "#ffffff1f",
  200: "#ffffff29",
  300: "#ffffff3d",
  400: "#ffffff52",
  500: "#ffffff7a",
  600: "#ffffff8f",
  700: "#ffffffa3",
  800: "#ffffffb8",
  900: "#ffffffe0",
  950: "#ffffff",
};

/**
 * Colors used by the five focus-ring styles (docs/audit/special-effects.md §2).
 * Only the *color* is confirmed for these styles — ring geometry (offset/blur/spread) was never
 * retrieved in any audit, so no ring/effect token is implemented here; consumers apply their own
 * geometry until that is resolved (out of scope for this v0.1 color/radius/elevation package).
 *
 * `danger` is corrected here, per approved decision. In Figma, `focus_danger` is bound to
 * `Color/Secondary/500_alpha_24` (#e2008d3d) — the exact same value as `focus_secondary` — a
 * confirmed binding bug (docs/audit/special-effects.md §9, reproduced independently in
 * docs/audit/buttons.md and docs/audit/input.md). This package maps `focusRingColor.danger` to
 * the danger ramp's own alpha-24 value instead: `#f03d3d3d`, confirmed verbatim as
 * `outline/danger_alpha` in docs/audit/alerts.md ("≈24% alpha of danger/500"). This is a
 * code-only fix — Figma itself is untouched.
 */
export interface FocusRingColor {
  primary: string;
  secondary: string;
  success: string;
  danger: string;
  gray: string;
}

export const focusRingColor: FocusRingColor = {
  primary: "#5468ff3d", // Color/primary/500_alpha_24 — special-effects.md §2
  secondary: "#e2008d3d", // Color/Secondary/500_alpha_24 — special-effects.md §2
  success: "#35c2203d", // Color/success/500_alpha_24 — special-effects.md §2
  danger: "#f03d3d3d", // FIXED — see doc comment above. Source: alerts.md `outline/danger_alpha`.
  gray: "#dddfe4", // outline/Gray 300, intentionally opaque (no alpha) — special-effects.md §2, §10
};

export const color = {
  primary,
  secondary,
  shikhoAi,
  secondary2,
  info,
  success,
  danger,
  warning,
  gray,
  vanillaGray,
  dark,
  black,
  white,
};
