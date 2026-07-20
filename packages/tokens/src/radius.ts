// Confirmed exact values only. Two parallel raw naming systems exist in Figma —
// `radius/custom/*` and `radius/border_radius_*` — and disagree on what several of their shared
// labels ("md", "lg", "xl") mean. Per the approved rank-based decision
// (docs/token-normalization-decisions.md §6), canonical names are assigned by the *numeric value's
// ascending rank* across both raw systems combined, not inherited from either legacy label.
//
// Every value below is cited from docs/audit/*.md; see the inline source comment on each entry.

export interface RadiusScale {
  none: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  "2xl": number;
  "3xl": number;
  "4xl": number;
  "5xl": number;
  "6xl": number;
  "7xl": number;
  "8xl": number;
  "9xl": number;
  "10xl": number;
  /** One-off large radius; application (track vs. knob) unconfirmed. docs/audit/toggle.md */
  track: number;
  /** Fully circular / pill radius. */
  full: number;
}

export const radius: RadiusScale = {
  none: 0, // radius/border_radius_0 — button-group.md, list.md, links.md, modal.md, tab-navigation.md, table.md
  xs: 6, // radius/custom/xs AND radius/border_radius_xs (agree) — buttons.md, checkboxes.md, table.md
  sm: 8, // radius/custom/sm AND radius/border_radius_sm (agree) — buttons.md, date-picker.md
  md: 10, // radius/custom/md — buttons.md, input.md, alerts.md (see radiusLegacyAliases.borderRadiusSm2)
  lg: 12, // radius/custom/lg — buttons.md (see radiusLegacyAliases.borderRadiusMd)
  xl: 16, // radius/custom/xl — buttons.md, button-group.md (see radiusLegacyAliases.borderRadiusLg)
  "2xl": 20, // radius/border_radius_xl — alerts.md, modal.md, table.md
  "3xl": 24, // radius/border_radius_xxl — date-picker.md (first seen there)
  "4xl": 28, // radius/border_radius_2xl — modal.md (first seen there)
  "5xl": 32, // radius/border_radius_4xl — elevations.md (e6 demo card)
  "6xl": 40, // radius/border_radius_5xl — elevations.md (e5 demo card), alerts.md, tab-navigation.md
  "7xl": 48, // radius/border_radius_6xl — elevations.md (e4 demo card)
  "8xl": 56, // radius/border_radius_7xl — elevations.md (e3 demo card)
  "9xl": 64, // radius/border_radius_8xl — elevations.md (e2 demo card), alerts.md, tab-navigation.md
  "10xl": 72, // radius/border_radius_9xl — elevations.md (e1 demo card)
  track: 100, // radius/border_radius_100 — toggle.md (brand new token, application unconfirmed)
  full: 1000, // radius/border_radius_round — buttons.md, avatars.md, chips.md, and most other audits
};

/**
 * Deprecated legacy aliases, kept only where the audit confirmed the *exact same numeric value*
 * under a second, colliding raw Figma name. Do not use these in new code — read from `radius`
 * directly. Each documents which two raw tokens collided and why.
 */
export interface RadiusLegacyAliases {
  /**
   * @deprecated Use `radius.md` (10). Was `radius/border_radius_sm_2` in Figma — despite its
   * "sm_2" name, it is numerically identical to `radius/custom/md`, not to `radius/border_radius_sm`
   * (8). Confirmed in docs/audit/input.md §11 and docs/audit/progress.md.
   */
  borderRadiusSm2: number;
  /**
   * @deprecated Use `radius.lg` (12). Was `radius/border_radius_md` in Figma — this is NOT the
   * same value as `radius/custom/md` (10), a confirmed critical naming collision. Reproduced in
   * docs/audit/sidebar-navigation.md and docs/audit/table.md.
   */
  borderRadiusMd: number;
  /**
   * @deprecated Use `radius.xl` (16). Was `radius/border_radius_lg` in Figma — confirmed exact
   * duplicate of `radius/custom/xl`. Flagged explicitly in docs/audit/colors.md §8.
   */
  borderRadiusLg: number;
}

export const radiusLegacyAliases: RadiusLegacyAliases = {
  borderRadiusSm2: radius.md,
  borderRadiusMd: radius.lg,
  borderRadiusLg: radius.xl,
};
