import { color, elevation, radius } from "@shikho/tokens";

/**
 * The docs site's own visual theme is derived from `@shikho/tokens` rather than hardcoded, so
 * the site itself stays honest to the system it documents. These become CSS custom properties
 * on `:root` (applied in `main.tsx`) and are consumed by `styles.css`.
 *
 * Note this is the *site chrome* theme (nav, sidebar, cards, type). It is deliberately separate
 * from the components being documented — those bring their own styling from `@shikho/ui` and
 * are never restyled here.
 */
const shadow = (layers: readonly { x: number; y: number; blur: number; spread: number; color: string }[]) =>
  layers.map((l) => `${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${l.color}`).join(", ");

export function buildThemeVars(): Record<string, string> {
  return {
    // Surfaces
    "--sk-bg": color.gray[50],
    "--sk-surface": color.white[950],
    "--sk-surface-muted": color.gray[100],

    // Text
    "--sk-text": color.gray[950],
    "--sk-text-muted": color.gray[600],
    "--sk-text-subtle": color.gray[500],

    // Lines
    "--sk-border": color.gray[200],
    "--sk-border-strong": color.gray[300],

    // Brand
    "--sk-brand": color.primary[500],
    "--sk-brand-hover": color.primary[600],
    "--sk-brand-soft": color.primary[50],
    "--sk-brand-border": color.primary[200],
    "--sk-focus-ring": `${color.primary[500]}3d`,

    // Status accents (used by the "status" pills on component cards)
    "--sk-accent-success": color.success[600],
    "--sk-accent-success-soft": color.success[50],
    "--sk-accent-warning": color.warning[600],
    "--sk-accent-warning-soft": color.warning[50],

    // Radii
    "--sk-radius-sm": `${radius.sm}px`,
    "--sk-radius-md": `${radius.md}px`,
    "--sk-radius-lg": `${radius.lg}px`,
    "--sk-radius-xl": `${radius.xl}px`,
    "--sk-radius-2xl": `${radius["2xl"]}px`,
    "--sk-radius-full": `${radius.full}px`,

    // Elevation
    "--sk-shadow-sm": shadow(elevation.e1),
    "--sk-shadow-md": shadow(elevation.e2),
    "--sk-shadow-lg": shadow(elevation.e3),
  };
}

export function applyTheme(target: HTMLElement = document.documentElement): void {
  const vars = buildThemeVars();
  for (const [key, value] of Object.entries(vars)) {
    target.style.setProperty(key, value);
  }
}
