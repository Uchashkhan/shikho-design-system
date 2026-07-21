import type { ReactNode } from "react";

/**
 * Single source of truth for component metadata. The sidebar, the component gallery, the routes,
 * and each component's own documentation page are all derived from these entries — nothing is
 * duplicated across those surfaces.
 *
 * Adding a component to the docs site means adding one file under `registry/components/` and
 * listing it in `registry/index.ts`. No route, nav item, or gallery card is registered by hand.
 */

export type ComponentCategory = "Actions" | "Forms" | "Data display" | "Feedback";

export const COMPONENT_CATEGORIES: ComponentCategory[] = [
  "Actions",
  "Forms",
  "Data display",
  "Feedback",
];

/**
 * How much of the component's visual design is backed by a confirmed Figma deep audit
 * (`get_design_context`) rather than derived. Mirrors the confirmed-vs-derived split each
 * component's own README documents — the docs site should never present derived styling as
 * though it were confirmed.
 */
export type AuditConfidence = "deep-audited" | "partially-derived";

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
  options: ControlOption[];
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

export interface ComponentEntry {
  /** URL segment: /components/:slug */
  slug: string;
  /** Display name in nav, gallery and page heading. */
  name: string;
  /** Verbatim Figma component-set name(s) this documents. */
  figmaName: string;
  category: ComponentCategory;
  confidence: AuditConfidence;
  /** One line, used on gallery cards and in the sidebar tooltip. */
  summary: string;
  /** Fuller prose for the component page header. */
  description: string;
  /** Audit file this component was built from, relative to repo root. */
  auditFile: string;
  /** Every symbol this component family exports from `@shikho/ui`. */
  exports: string[];
  variants: VariantAxis[];
  /** Confirmed interaction/severity states, or an empty array when the set exposes none. */
  states: string[];
  /** Known gaps / unresolved audit information, surfaced verbatim on the page. */
  gaps: string[];
  importExample: string;
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

export interface FoundationEntry {
  slug: string;
  name: string;
  summary: string;
  description: string;
}
