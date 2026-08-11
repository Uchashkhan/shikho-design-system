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

/**
 * A single subject's `Main / Dark / Light` triad. Figma's own spec-sheet frame labels these
 * "Regular / Dark / Light" (a naming inconsistency vs. the audit's "Main" — flagged, not
 * corrected, same as the black/white ramp naming note above).
 */
export interface SubjectColorTriad {
  main: string;
  dark: string;
  light: string;
}

/**
 * Confirmed subject colors — docs/audit/colors.md §5/§8, superseded 2026-08-11 by a full,
 * rendered spec sheet (`get_design_context` on node `64529:21195`, same file) that resolves all
 * 32 subjects visible in the layer tree, not just the 5 that had bound Figma variables. Every
 * value below is quoted verbatim from that sheet's actual rendered fill — cross-checked against
 * the sheet's own printed hex label for each swatch (both sources agree except 4 flagged below).
 *
 * **3 swatches had a printed label that did not match their own rendered fill** — a stale
 * copy-pasted text layer left over from duplicating another subject's card, confirmed by
 * diffing the swatch's actual background color against its label text. The RENDERED FILL is
 * used here (never the label) since that's what the design source of truth actually shows:
 *   - Chemistry / light: fill `#dff6ff`, label incorrectly printed `#fdeaee` (Bengali's light)
 *   - Economics / light: fill `#e2f6fd`, label incorrectly printed `#fce5fa` (Business Studies')
 *   - Psychology / light: fill `#ffece4`, label incorrectly printed `#f7f4dc` (Sociology's)
 * (General Knowledge / regular had the same kind of label bug — printed its own light value
 * instead — but its fill, `#ff5165`, already matched the pre-existing 5-subject audit exactly,
 * so no value here changed from that one.)
 */
export const subjectColor: Record<string, SubjectColorTriad> = {
  bengali: { main: "#e74d4f", dark: "#c42325", light: "#fdeaee" },
  english: { main: "#30c4d8", dark: "#1cb0c4", light: "#e0f7fa" },
  physics: { main: "#6070e9", dark: "#4757d0", light: "#eaebfc" },
  chemistry: { main: "#39bcf7", dark: "#21a4ee", light: "#dff6ff" },
  biology: { main: "#3bc78a", dark: "#29b578", light: "#e6faef" },
  generalMath: { main: "#ff7b33", dark: "#ec6820", light: "#fff8e0" },
  higherMath: { main: "#9736e3", dark: "#8322cf", light: "#f2e5fb" },
  generalScience: { main: "#5f9573", dark: "#4b815f", light: "#e5f2ec" },
  ict: { main: "#43d1b9", dark: "#2fbda5", light: "#e1f7f4" },
  geography: { main: "#5897e9", dark: "#5b8bca", light: "#e6f2fc" },
  businessStudies: { main: "#e95ce7", dark: "#d84bd6", light: "#fce5fa" },
  finance: { main: "#ed4c67", dark: "#d93853", light: "#fce5ed" },
  economics: { main: "#3492ac", dark: "#207e98", light: "#e2f6fd" },
  history: { main: "#357969", dark: "#2a6e5b", light: "#e2f2f0" },
  accounting: { main: "#f29f38", dark: "#e39029", light: "#fef2e2" },
  statistics: { main: "#7467eb", dark: "#6053d7", light: "#eceafd" },
  islamAndNoitik: { main: "#397077", dark: "#255c63", light: "#ddf8fb" },
  marketing: { main: "#f56c9e", dark: "#e1588a", light: "#fce6ee" },
  civics: { main: "#22a6b3", dark: "#0e929f", light: "#ddf2f4" },
  logic: { main: "#ac3095", dark: "#981c81", light: "#f5e6f1" },
  businessOrgAndManagement: { main: "#3498db", dark: "#2185c8", light: "#dff2ff" },
  productionManagementAndMarketing: { main: "#407093", dark: "#2f5f82", light: "#e3f0fa" },
  businessMath: { main: "#6b51ff", dark: "#4f37d5", light: "#eae6ff" },
  agriculture: { main: "#7acb4e", dark: "#69b143", light: "#ecf9e5" },
  sociology: { main: "#bfb03f", dark: "#a5972e", light: "#f7f4dc" },
  socialWork: { main: "#cb4e8f", dark: "#b2457d", light: "#fbe8f1" },
  psychology: { main: "#bf643f", dark: "#a65231", light: "#ffece4" },
  bangladeshAndGlobalStudies: { main: "#c07129", dark: "#54210d", light: "#f7deba" },
  generalKnowledge: { main: "#ff5165", dark: "#c70017", light: "#ffe6f4" },
  spokenEnglish: { main: "#5c84d9", dark: "#234796", light: "#e2e9f8" },
  practicalAi: { main: "#e46c67", dark: "#b2433e", light: "#f8d7d5" },
  quarterFinalExam: { main: "#ff934a", dark: "#d96e25", light: "#fff4e3" },
};
