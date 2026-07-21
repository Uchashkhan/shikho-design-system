import { Tags, type TagSize, type TagState, type TagType } from "@shikho/ui";
import type { ComponentPageConfig } from "./types";

const TYPES: TagType[] = [
  "info",
  "warning",
  "danger",
  "Danger Filled",
  "success",
  "Success Filled",
  "tertiary",
  "secondary",
  "primary_outline",
  "primary_light",
  "primary",
];

export const pageConfig: ComponentPageConfig = {
  longDescription:
    "Chip's closest sibling — the audit explicitly compares the two. No get_design_context deep audit was run (overview-level only), but the colour data is unusually rich: the audit calls it \"the cleanest, most internally consistent alpha-naming system found in this entire audit series.\" Rendered as a static <span>, not a <button> — tags reads as a label-only element with no focus or drag state.",
  variants: [
    { name: "size", values: ["lg", "md", "sm"], note: "Confirmed bounding-box heights (32/24/20px), stated without the \"≈\" qualifier Chip's sizes carried." },
    {
      name: "type",
      values: TYPES,
      note: "\"Danger Filled\"/\"Success Filled\" are two-word, space-containing, Title Case values — the most severe single-property naming inconsistency confirmed in the entire audit series. Preserved verbatim.",
    },
    { name: "state", values: ["disabled", "hover", "default"], note: "No focus, no drag, unlike Chip — a confirmed narrower state set." },
  ],
  states: ["default", "hover", "disabled"],
  gaps: [
    "secondary and tertiary have no confirmed alpha data anywhere in this audit — they're absent from the severity table entirely. Implemented as two neutral gray tints, not an independently confirmed binding.",
    "primary_outline's border colour uses the base Color/primary/500 — a reasonable choice given no confirmed border-specific value exists for it.",
    "Radius is applied uniformly as radius.full (pill shape). The audit found three radius/custom/* tokens present and explicitly flags they may map to different types, but could not confirm which — that mapping is documented as unresolved, not invented.",
    "No icon, label-count, or dismiss-control slot — whether any of these exist as internal layers was never confirmed, since no deep audit was run.",
    "special_drop's inner shadow is confirmed present in the token pool but not confirmed applied here — not implemented.",
    "Why only danger/success get a \"Filled\" counterpart while warning/info do not is a confirmed asymmetry with no stated reason. Not resolved, not invented.",
  ],
  usageExample: `import { Tags } from "@shikho/ui";

export function StatusLabel({ status }: { status: "success" | "danger" | "warning" }) {
  return (
    <Tags size="md" type={status} state="default">
      {status}
    </Tags>
  );
}`,
  props: [
    { name: "size", type: "lg | md | sm", defaultValue: "md", description: "Confirmed bounding-box height; width is left to content." },
    { name: "type", type: "11 confirmed values", defaultValue: "info", description: "Colour treatment. Casing preserved verbatim, including the two Title Case \"Filled\" values." },
    { name: "state", type: "disabled | hover | default", defaultValue: "default", description: "disabled sets aria-disabled plus visual dimming — a <span> has no native disabled attribute." },
    { name: "children", type: "ReactNode", description: "Label content. No default is supplied." },
    { name: "…", type: "HTMLAttributes<HTMLSpanElement>", description: "Rendered as a real <span>; other native props are forwarded." },
  ],
  preview: () => (
    <>
      <Tags size="md" type="success">success</Tags>
      <Tags size="md" type="danger">danger</Tags>
      <Tags size="md" type="primary">primary</Tags>
    </>
  ),
  playground: {
    controls: [
      {
        prop: "size",
        label: "Size",
        defaultValue: "md",
        options: ["lg", "md", "sm"].map((v) => ({ label: v, value: v })),
      },
      {
        prop: "type",
        label: "Type",
        defaultValue: "info",
        options: TYPES.map((v) => ({ label: v, value: v })),
      },
      {
        prop: "state",
        label: "State",
        defaultValue: "default",
        options: ["default", "hover", "disabled"].map((v) => ({ label: v, value: v })),
      },
    ],
    render: (v) => (
      <Tags size={v.size as TagSize} type={v.type as TagType} state={v.state as TagState}>
        {v.type}
      </Tags>
    ),
  },
  showcases: [
    {
      title: "The four severities",
      description: "info, warning, danger and success, each with a confirmed alpha_12 tint and its own Text/{name} 600 label colour.",
      render: () => (
        <>
          <Tags type="info">info</Tags>
          <Tags type="warning">warning</Tags>
          <Tags type="danger">danger</Tags>
          <Tags type="success">success</Tags>
        </>
      ),
    },
    {
      title: "Filled counterparts — a confirmed asymmetry",
      description: "Only danger and success get a solid \"Filled\" pair; warning and info do not.",
      render: () => (
        <>
          <Tags type="Danger Filled">Danger Filled</Tags>
          <Tags type="Success Filled">Success Filled</Tags>
        </>
      ),
    },
    {
      title: "Primary's three-way emphasis split",
      description: "primary_outline / primary_light / primary — outlined, tinted, filled.",
      render: () => (
        <>
          <Tags type="primary_outline">primary_outline</Tags>
          <Tags type="primary_light">primary_light</Tags>
          <Tags type="primary">primary</Tags>
        </>
      ),
    },
    {
      title: "secondary / tertiary — derived neutrals",
      description: "No confirmed alpha data exists for either; implemented as two neutral gray tints.",
      render: () => (
        <>
          <Tags type="secondary">secondary</Tags>
          <Tags type="tertiary">tertiary</Tags>
        </>
      ),
    },
    {
      title: "Sizes",
      render: () => (
        <>
          <Tags size="lg" type="primary">lg</Tags>
          <Tags size="md" type="primary">md</Tags>
          <Tags size="sm" type="primary">sm</Tags>
        </>
      ),
    },
    {
      title: "States",
      description: "No focus, no drag — a confirmed narrower state set than Chip's.",
      render: () => (
        <>
          <Tags state="default" type="primary">default</Tags>
          <Tags state="hover" type="primary">hover</Tags>
          <Tags state="disabled" type="primary">disabled</Tags>
        </>
      ),
    },
  ],
};
