import { Checkbox, CheckboxLabel, type CheckboxShape, type CheckboxSize } from "@shikho/ui";
import type { ComponentPageConfig } from "./types";

export const pageConfig: ComponentPageConfig = {
  longDescription:
    "A real <input type=\"checkbox\"> is kept for semantics/keyboard/AX, but is now visually hidden — a deep re-audit (docs/audit/checkboxes.md §14) found the browser's own native checked/indeterminate indicator could not reproduce Figma's confirmed checkmark glyph, tint colors, or dash artwork, so a custom-rendered visual box now drives the actual appearance. `checked`'s exact fill/checkmark colors were re-confirmed by downloading and decomposing the real SVG asset behind `checked_focused` (node 66077:30012): primary/500 fill (#5468FF), white checkmark, and a 3px primary/500-at-24%-alpha focus ring — exactly matching what the implementation already used. The audit's single conflated `state` enum is decomposed into separate `checked`, `indeterminate`, `disabled`, `hover`, and `focus` handling.",
  variants: [
    { name: "size", values: ["md", "sm"], note: "md is 24×24 (18×18 visible box), sm is 20×20 (16×16 visible box) — the visible box is confirmed smaller than the component's own footprint." },
    { name: "shape", values: ["sphere", "square"], note: "A genuine confirmed binary shape choice; Radio has no equivalent property." },
  ],
  states: ["unchecked", "hover", "unchecked_focused", "checked", "checked_focused", "indeterminate", "indeterminate_disabled", "disabled"],
  gaps: [
    "hover for checked/indeterminate has no confirmed visual — both render identically to their non-hover look.",
    "CheckboxLabel composes a real nested Checkbox plus a label (Regular 400 weight) and optional caption — confirmed across all 4 size × direction variants.",
    "No literal `checked_disabled`/`indeterminate` + `disabled` combination beyond `indeterminate_disabled` exists in Figma — plain `disabled` is necessarily unchecked and reuses `indeterminate_disabled`'s solid-gray recipe.",
  ],
  usageExample: `import { Checkbox } from "@shikho/ui";

export function TermsCheckbox() {
  const [checked, setChecked] = useState(false);

  return (
    <label>
      <Checkbox
        size="sm"
        shape="square"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
      I accept the terms
    </label>
  );
}`,
  props: [
    { name: "size", type: "md | sm", defaultValue: "sm", description: "Confirmed size steps — 24×24 and 20×20." },
    { name: "shape", type: "sphere | square", defaultValue: "square", description: "Square applies the confirmed 6px radius; sphere is fully round." },
    { name: "checked", type: "boolean", description: "Native controlled checked state." },
    { name: "defaultChecked", type: "boolean", description: "Native uncontrolled initial state." },
    { name: "indeterminate", type: "boolean", defaultValue: "false", description: "Applied via the native `indeterminate` DOM property, which HTML defines only for checkboxes." },
    { name: "disabled", type: "boolean", description: "Native disabled attribute." },
    { name: "…", type: "InputHTMLAttributes<HTMLInputElement>", description: "All other native input props are forwarded." },
  ],
  preview: () => (
    <>
      <Checkbox size="md" shape="square" defaultChecked aria-label="Checked" />
      <Checkbox size="md" shape="square" aria-label="Unchecked" />
      <Checkbox size="md" shape="square" indeterminate aria-label="Indeterminate" />
      <Checkbox size="md" shape="sphere" aria-label="Sphere" />
    </>
  ),
  playground: {
    controls: [
      {
        prop: "size",
        label: "Size",
        defaultValue: "md",
        options: [
          { label: "md", value: "md" },
          { label: "sm", value: "sm" },
        ],
      },
      {
        prop: "shape",
        label: "Shape",
        defaultValue: "square",
        options: [
          { label: "square", value: "square" },
          { label: "sphere", value: "sphere" },
        ],
      },
      {
        prop: "checked",
        label: "Checked",
        defaultValue: "true",
        options: [
          { label: "checked", value: "true" },
          { label: "unchecked", value: "false" },
          { label: "indeterminate", value: "indeterminate" },
        ],
      },
      {
        prop: "disabled",
        label: "Disabled",
        defaultValue: "false",
        options: [
          { label: "enabled", value: "false" },
          { label: "disabled", value: "true" },
        ],
      },
    ],
    render: (v) => (
      <Checkbox
        size={v.size as CheckboxSize}
        shape={v.shape as CheckboxShape}
        checked={v.checked === "true"}
        indeterminate={v.checked === "indeterminate"}
        disabled={v.disabled === "true"}
        readOnly
        aria-label="Checkbox preview"
      />
    ),
  },
  showcases: [
    {
      title: "Checked, unchecked and indeterminate",
      render: () => (
        <>
          <Checkbox size="md" aria-label="Unchecked" />
          <Checkbox size="md" defaultChecked aria-label="Checked" />
          <Checkbox size="md" indeterminate aria-label="Indeterminate" />
        </>
      ),
    },
    {
      title: "Sizes and shapes",
      description: "Every confirmed size × shape combination.",
      render: () => (
        <>
          <Checkbox size="md" shape="square" aria-label="md square" />
          <Checkbox size="sm" shape="square" aria-label="sm square" />
          <Checkbox size="md" shape="sphere" aria-label="md sphere" />
          <Checkbox size="sm" shape="sphere" aria-label="sm sphere" />
        </>
      ),
    },
    {
      title: "Disabled",
      description: "Plain disabled is necessarily unchecked; indeterminate_disabled is the only other confirmed disabled combination.",
      render: () => (
        <>
          <Checkbox size="md" disabled aria-label="Disabled unchecked" />
          <Checkbox size="md" disabled indeterminate aria-label="Disabled indeterminate" />
        </>
      ),
    },
    {
      title: "All 8 confirmed states",
      description:
        "unchecked/checked/indeterminate/disabled/indeterminate_disabled are shown via props; hover and unchecked_focused/checked_focused respond to a real pointer/keyboard focus — hover or Tab into the unlabeled ones to see them. checked_focused's exact primary/500 fill + white checkmark + primary-alpha ring was re-confirmed by decomposing the real SVG asset (node 66077:30012).",
      layout: "stack",
      render: () => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
          <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <Checkbox aria-label="unchecked" />
            <span style={{ fontSize: 11, color: "#8c929c" }}>unchecked</span>
          </span>
          <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <Checkbox aria-label="hover me" />
            <span style={{ fontSize: 11, color: "#8c929c" }}>hover</span>
          </span>
          <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <Checkbox aria-label="tab to me (unchecked_focused)" />
            <span style={{ fontSize: 11, color: "#8c929c" }}>unchecked_focused</span>
          </span>
          <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <Checkbox defaultChecked aria-label="checked" />
            <span style={{ fontSize: 11, color: "#8c929c" }}>checked</span>
          </span>
          <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <Checkbox defaultChecked aria-label="tab to me (checked_focused)" />
            <span style={{ fontSize: 11, color: "#8c929c" }}>checked_focused</span>
          </span>
          <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <Checkbox indeterminate aria-label="indeterminate" />
            <span style={{ fontSize: 11, color: "#8c929c" }}>indeterminate</span>
          </span>
          <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <Checkbox indeterminate disabled aria-label="indeterminate_disabled" />
            <span style={{ fontSize: 11, color: "#8c929c" }}>indeterminate_disabled</span>
          </span>
          <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <Checkbox disabled aria-label="disabled" />
            <span style={{ fontSize: 11, color: "#8c929c" }}>disabled</span>
          </span>
        </div>
      ),
    },
    {
      title: "CheckboxLabel — size × direction",
      description:
        "Composes a real nested Checkbox plus a label/caption text column, confirmed across all 4 size × direction variants. md's label is Regular/400 at body_1; sm collapses label and caption to the same Medium/500 caption_2 typography.",
      layout: "stack",
      render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <CheckboxLabel
            size="md"
            direction="left"
            labelContent="Remember this device"
            captionContent="Skip 2FA on this browser for 30 days."
            checkboxProps={{ defaultChecked: true }}
          />
          <CheckboxLabel
            size="sm"
            direction="left"
            labelContent="Marketing emails"
            captionContent="Occasional product updates only."
          />
          <CheckboxLabel
            size="md"
            direction="right"
            labelContent="Right-aligned (direction=right)"
            captionContent="The checkbox renders after the text column."
          />
        </div>
      ),
    },
  ],
};
