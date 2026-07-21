import { Checkbox, type CheckboxShape, type CheckboxSize } from "@shikho/ui";
import type { ComponentPageConfig } from "./types";

export const pageConfig: ComponentPageConfig = {
  longDescription:
    "Renders a real `<input type=\"checkbox\">`. The audit's single conflated `state` enum is decomposed into separate `checked`, `indeterminate` and `disabled` props, with hover and focus handled by real CSS rather than a manually-set prop.",
  variants: [
    { name: "size", values: ["md", "sm"], note: "md is 24×24, sm is 20×20 — identical dimensions to Radio." },
    { name: "shape", values: ["sphere", "square"], note: "A genuine confirmed binary shape choice; Radio has no equivalent property." },
  ],
  states: ["unchecked", "checked", "indeterminate", "hover", "focused", "disabled"],
  gaps: [
    "No `get_design_context` deep audit exists for this family. The resting visual (white fill, 2px gray-400 border, 6px radius) is cross-confirmed via the nested Checkbox instance found in the List audit.",
    "There is no confirmed checkmark glyph, checked-state fill or indeterminate-dash artwork anywhere. Rather than invent the ubiquitous \"blue fill + white check\" pattern, the browser's native indicator renders on top of the confirmed resting box.",
    "Whether outline/focus_primary or outline/focus_gray applies to checked vs. unchecked focus was never confirmed — the neutral gray ring is applied uniformly.",
    "The audit confirms no `checked_hover` or `checked_disabled` variant exists, only bare `hover` / `disabled`.",
    "`checkbox_label` is a second confirmed component set, not yet implemented.",
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
