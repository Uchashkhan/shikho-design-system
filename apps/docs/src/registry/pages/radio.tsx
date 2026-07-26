import { Radio, type RadioSize } from "@shikho/ui";
import type { ComponentPageConfig } from "./types";

export const pageConfig: ComponentPageConfig = {
  longDescription:
    "A real `<input type=\"radio\">` is kept for semantics/keyboard/AX and grouping by `name` still gives true mutually-exclusive behaviour, but its visual is now custom-rendered from a deep Figma re-audit (docs/audit/radio-buttons.md §14) rather than left to the browser's native indicator. Figma names this control's selection concept `active`/`inactive` — the clearest cross-component naming divergence in the audit series, since Checkbox calls the same idea `checked`/`unchecked`.",
  variants: [
    { name: "size", values: ["md", "sm"], note: "24×24 and 20×20 — identical dimensions to Checkbox at both steps." },
  ],
  states: ["inactive", "active", "indeterminate", "hover", "focused", "disabled"],
  gaps: [
    "Every sampled `radio` Figma instance renders as a single flattened image asset, so exact fill/border colors are reused from Checkbox's own independently-confirmed values rather than independently decomposed for Radio — justified by the audit's own finding that the two families share a token-for-token identical colour export and identical dimensions (§9, §14).",
    "No radius token was found bound anywhere in this component's subtree — a confirmed gap in the Figma data. `radius.full` is used, since a radio button is unambiguously circular regardless of the mechanism.",
    "Figma exposes an `indeterminate` state, which the audit itself flags as conventionally unusual for a single-choice control. HTML has no native indeterminate property for radios, so it drives a custom-rendered tint fill + center dot rather than a native property.",
    "`radio_label` is now implemented (§14) — composes a real nested `Radio` plus a label/caption text column, structurally identical to `checkbox_label`.",
  ],
  usageExample: `import { Radio } from "@shikho/ui";

export function PlanPicker() {
  return (
    <fieldset>
      <label><Radio name="plan" value="monthly" defaultChecked /> Monthly</label>
      <label><Radio name="plan" value="yearly" /> Yearly</label>
    </fieldset>
  );
}`,
  props: [
    { name: "size", type: "md | sm", defaultValue: "sm", description: "Confirmed size steps — 24×24 and 20×20." },
    { name: "checked", type: "boolean", description: "Native controlled state. Figma calls this `active`; the native prop name is kept." },
    { name: "defaultChecked", type: "boolean", description: "Native uncontrolled initial state." },
    { name: "indeterminate", type: "boolean", defaultValue: "false", description: "Exposed as a data attribute only — radios have no native indeterminate property and no visual was confirmed." },
    { name: "name", type: "string", description: "Native grouping — radios sharing a name are mutually exclusive." },
    { name: "disabled", type: "boolean", description: "Native disabled attribute." },
    { name: "…", type: "InputHTMLAttributes<HTMLInputElement>", description: "All other native input props are forwarded." },
  ],
  preview: () => (
    <>
      <Radio size="md" name="preview" defaultChecked aria-label="Selected" />
      <Radio size="md" name="preview" aria-label="Unselected" />
      <Radio size="sm" name="preview-sm" aria-label="Small" />
      <Radio size="md" disabled aria-label="Disabled" />
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
        prop: "checked",
        label: "Selected",
        defaultValue: "true",
        options: [
          { label: "active", value: "true" },
          { label: "inactive", value: "false" },
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
      <Radio
        size={v.size as RadioSize}
        checked={v.checked === "true"}
        disabled={v.disabled === "true"}
        readOnly
        aria-label="Radio preview"
      />
    ),
  },
  showcases: [
    {
      title: "A real mutually-exclusive group",
      description: "Radios sharing a `name` behave natively — selecting one deselects the others.",
      render: () => (
        <>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Radio name="showcase-group" defaultChecked aria-label="Option A" /> Option A
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Radio name="showcase-group" aria-label="Option B" /> Option B
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Radio name="showcase-group" aria-label="Option C" /> Option C
          </label>
        </>
      ),
    },
    {
      title: "Sizes",
      render: () => (
        <>
          <Radio size="md" aria-label="md" />
          <Radio size="sm" aria-label="sm" />
        </>
      ),
    },
    {
      title: "Disabled",
      render: () => (
        <>
          <Radio disabled aria-label="Disabled inactive" />
          <Radio disabled defaultChecked aria-label="Disabled active" />
        </>
      ),
    },
  ],
};
