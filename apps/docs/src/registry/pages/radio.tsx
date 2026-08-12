import { Radio, RadioLabel, type RadioSize } from "@shikho/ui";
import type { ComponentPageConfig } from "./types";

export const pageConfig: ComponentPageConfig = {
  longDescription:
    "A real `<input type=\"radio\">` is kept for semantics/keyboard/AX and grouping by `name` still gives true mutually-exclusive behaviour, but its visual is custom-rendered from a ground-truth re-audit (docs/audit/radio-buttons.md §15) that reads every fill/border/mark color directly off the real SVG source behind all 7 confirmed Figma states — not derived by analogy to Checkbox, despite the two sharing identical dimensions. Figma names this control's selection concept `active`/`inactive` — the clearest cross-component naming divergence in the audit series, since Checkbox calls the same idea `checked`/`unchecked`.",
  variants: [
    { name: "size", values: ["md", "sm"], note: "24×24 and 20×20 — identical dimensions to Checkbox at both steps, but with independently confirmed colors (§15)." },
  ],
  states: ["inactive", "hover", "inactive_focused", "active", "active_focused", "indeterminate", "disabled"],
  gaps: [
    "No radius token was found bound anywhere in this component's subtree — a confirmed gap in the Figma data. `radius.full` is used, since a radio button is unambiguously circular regardless of the mechanism.",
    "Figma exposes an `indeterminate` state, which the audit itself flags as conventionally unusual for a single-choice control. HTML has no native indeterminate property for radios, so it drives a custom-rendered tint fill + center dash mark rather than a native property.",
    "`RadioLabel` composes a real nested `Radio` plus a label/caption text column, structurally identical to `checkbox_label` — confirmed across all 4 size × direction variants (§15).",
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
      description: "Figma confirms exactly ONE disabled visual — the gray dash mark shows regardless of checked state.",
      render: () => (
        <>
          <Radio disabled aria-label="Disabled inactive" />
          <Radio disabled defaultChecked aria-label="Disabled active" />
        </>
      ),
    },
    {
      title: "All 7 confirmed states",
      description:
        "inactive/active/indeterminate/disabled are shown via props; hover and inactive_focused/active_focused respond to a real pointer/keyboard focus — hover or Tab into the unlabeled ones to see them.",
      layout: "stack",
      render: () => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
          <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <Radio aria-label="inactive" />
            <span style={{ fontSize: 11, color: "#8c929c" }}>inactive</span>
          </span>
          <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <Radio aria-label="hover me" />
            <span style={{ fontSize: 11, color: "#8c929c" }}>hover</span>
          </span>
          <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <Radio aria-label="tab to me (inactive_focused)" />
            <span style={{ fontSize: 11, color: "#8c929c" }}>inactive_focused</span>
          </span>
          <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <Radio defaultChecked aria-label="active" />
            <span style={{ fontSize: 11, color: "#8c929c" }}>active</span>
          </span>
          <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <Radio defaultChecked aria-label="tab to me (active_focused)" />
            <span style={{ fontSize: 11, color: "#8c929c" }}>active_focused</span>
          </span>
          <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <Radio indeterminate aria-label="indeterminate" />
            <span style={{ fontSize: 11, color: "#8c929c" }}>indeterminate</span>
          </span>
          <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <Radio disabled aria-label="disabled" />
            <span style={{ fontSize: 11, color: "#8c929c" }}>disabled</span>
          </span>
        </div>
      ),
    },
    {
      title: "RadioLabel — size × direction",
      description:
        "Composes a real nested Radio plus a label/caption text column, confirmed across all 4 size × direction variants (§15). md's label is Regular/400 at body_1; sm collapses label and caption to the same Medium/500 caption_2 typography.",
      layout: "stack",
      render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <RadioLabel
            size="md"
            direction="left"
            labelContent="Email notifications"
            captionContent="Get notified when someone replies."
            radioProps={{ name: "radio-label-demo-1", defaultChecked: true }}
          />
          <RadioLabel
            size="sm"
            direction="left"
            labelContent="SMS notifications"
            captionContent="Standard messaging rates apply."
            radioProps={{ name: "radio-label-demo-2" }}
          />
          <RadioLabel
            size="md"
            direction="right"
            labelContent="Right-aligned (direction=right)"
            captionContent="The radio renders after the text column."
            radioProps={{ name: "radio-label-demo-3" }}
          />
        </div>
      ),
    },
  ],
};
