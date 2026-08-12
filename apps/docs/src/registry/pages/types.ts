import type { ReactNode } from "react";

/**
 * Rich, component-specific documentation content — kept separate from `ComponentDocsMeta`
 * (defined in `@shikho/ui`, discovered from each component family's `docs.meta.ts` under
 * `packages/ui/src/components`).
 *
 * A component only needs a `docs.meta.ts` to appear in the sidebar, gallery, routes, and search.
 * A `ComponentPageConfig` is optional — supplying one upgrades that component's detail page from
 * the safe fallback to full documentation (variants, props, an interactive playground, known
 * gaps). See `apps/docs/src/registry/pages/index.ts` for how these are discovered.
 */

export interface PropRow {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
}

export interface ControlOption {
  label: string;
  value: string;
}

export interface Control {
  /** Prop this control drives; also used as the key in the playground's value map. */
  prop: string;
  label: string;
  /** Either a fixed list, or a function of the OTHER controls' current values — for controls
   * whose valid options depend on another control (e.g. Button's Type options depend on which
   * Family is selected, since the 8 families don't share a type vocabulary). Receives the full
   * current values map, including this control's own (possibly now-invalid) value. */
  options: ControlOption[] | ((values: Record<string, string>) => ControlOption[]);
  defaultValue: string;
}

export interface VariantAxis {
  /** Figma property name, preserved verbatim (e.g. `size`, `type`, `state`). */
  name: string;
  /** Confirmed values only — never inferred or extended. */
  values: string[];
  note?: string;
}

export interface VariantShowcase {
  title: string;
  description?: string;
  /** `stack` lays children out vertically — used by full-width components like List. */
  layout?: "row" | "stack";
  render: () => ReactNode;
}

/** Resolves a control's options against the current values map, whether it's a fixed list or a
 * function of the other controls (e.g. Button's Type list depends on the selected Family). Every
 * consumer of `Control.options` (ComponentDetailPage, PlaygroundPage) must go through this
 * rather than reading `.options` directly, since it may be a function, not an array. */
export function resolveControlOptions(
  control: Control,
  values: Record<string, string>,
): ControlOption[] {
  return typeof control.options === "function" ? control.options(values) : control.options;
}

export interface ComponentPageConfig {
  /** Fuller prose than the meta's short `description` — shown as the page's lede when present. */
  longDescription?: string;
  variants: VariantAxis[];
  /** Confirmed interaction/severity states, or an empty array when the set exposes none. */
  states: string[];
  /** Known gaps / unresolved audit information, surfaced verbatim on the page. */
  gaps: string[];
  usageExample: string;
  props: PropRow[];
  /** Compact preview for the gallery card. */
  preview: () => ReactNode;
  /** Interactive preview with controls, shown at the top of the component page. */
  playground?: {
    controls: Control[];
    render: (values: Record<string, string>) => ReactNode;
  };
  /** Static showcases of confirmed variants/states. */
  showcases: VariantShowcase[];
}
