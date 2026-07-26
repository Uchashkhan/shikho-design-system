import { Checkbox, type CheckboxShape, type CheckboxSize } from "@shikho/ui";
import type { ComponentPageConfig } from "./types";

export const pageConfig: ComponentPageConfig = {
  longDescription:
    "A real <input type=\"checkbox\"> is kept for semantics/keyboard/AX, but is now visually hidden — a deep re-audit (docs/audit/checkboxes.md §14) found the browser's own native checked/indeterminate indicator could not reproduce Figma's confirmed checkmark glyph, tint colors, or dash artwork, so a custom-rendered visual box now drives the actual appearance. The audit's single conflated `state` enum is decomposed into separate `checked`, `indeterminate`, `disabled`, `hover`, and `focus` handling.",
  variants: [
    { name: "size", values: ["md", "sm"], note: "md is 24×24 (18×18 visible box), sm is 20×20 (16×16 visible box) — the visible box is confirmed smaller than the component's own footprint." },
    { name: "shape", values: ["sphere", "square"], note: "A genuine confirmed binary shape choice; Radio has no equivalent property." },
  ],
  states: ["unchecked", "checked", "indeterminate", "hover", "focused", "disabled"],
  gaps: [
    "checked's exact fill/checkmark colors were not decomposable from Figma's flattened image asset — the conventional solid primary/500 fill + white checkmark is used as the most likely candidate, explicitly derived rather than confirmed.",
    "hover for checked/indeterminate has no confirmed visual — both render identically to their non-hover look.",
    "checkbox_label is now implemented (previously out of scope) — confirmed to compose a real nested Checkbox plus a label (Regular 400 weight) and optional caption.",
    "Radio's own visual still derives from Checkbox's pre-rebuild values and was not re-confirmed as part of this pass.",
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
      render: () => (
        <>
          <Checkbox size="md" disabled aria-label="Disabled unchecked" />
          <Checkbox size="md" disabled defaultChecked aria-label="Disabled checked" />
          <Checkbox size="md" disabled indeterminate aria-label="Disabled indeterminate" />
        </>
      ),
    },
  ],
};
