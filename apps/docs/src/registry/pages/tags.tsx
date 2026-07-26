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
    "Chip's closest sibling — the audit explicitly compares the two. The original audit never called get_design_context (overview-level only); a deep re-audit (docs/audit/tags.md §13, 16 get_design_context calls) later corrected several guesses, most notably that Tags is NOT a full pill like Chip — it uses a small rounded-rectangle radius scale (6/8/10px). Rendered as a static <span>, not a <button> — tags reads as a label-only element with no focus or drag state.",
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
    "hover for info/warning/success/primary_light is derived from the confirmed alpha_12 -> alpha_20 system rather than independently sampled per type.",
    "hover for the 3 solid-fill types (primary, Danger Filled, Success Filled) has no confirmed visual anywhere in the audit — renders identically to default.",
    "Icon size at the sm step (12px) is derived by rank from the confirmed 14px@md/16px@lg progression, not independently sampled.",
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
      title: "secondary / tertiary",
      description: "tertiary is confirmed as a white fill with a black/50 border — the neutral analogue of primary_outline, not just \"secondary but lighter\" as originally guessed.",
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
