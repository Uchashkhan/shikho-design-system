import {
  DigitField,
  DigitInput,
  Dropdown,
  Field,
  InputField,
  InputHint,
  InputLabel,
  Textarea,
  type FieldSize,
  type FieldType,
  type InputFieldState,
} from "@shikho/ui";
import type { ComponentPageConfig } from "./types";

export const pageConfig: ComponentPageConfig = {
  longDescription:
    "Unlike Buttons, the Input family splits sizing/style (`field`) and interaction state (`input_field`, `textarea`, `digit_input`, `dropdown`) across separate component sets. Two nodes were deep-audited, so `Field` and `InputField` carry real confirmed layout, padding, booleans and instance-swap slots.",
  variants: [
    {
      name: "size",
      values: ["xl", "lg", "md", "sm"],
      note: "`field` only. `input_label` / `input_hint` support just sm and md — a confirmed coverage gap, with no label or hint styling for lg or xl.",
    },
    {
      name: "type",
      values: ["default", "textarea", "advanced_with_buttons"],
      note: "`field` only — no other set in the family exposes a type property.",
    },
    {
      name: "state",
      values: ["default", "default_dark", "hover", "filled", "active", "error", "disabled"],
      note: "Shared identically by input_field, textarea and digit_input. `dropdown` uses a different 9-value vocabulary with no `filled`.",
    },
  ],
  states: ["default", "default_dark", "hover", "filled", "active", "error", "disabled"],
  gaps: [
    "There is no literal `focus` state anywhere in the Input family — `active` is the closest analogue, and it is the only state with a confirmed distinct visual.",
    "Only `error` exists as a validation state; no `success` or `warning` state was found anywhere.",
    "`field`'s sizes beyond `md` and types beyond `default` have no confirmed structural data, so they currently render identically to md/default rather than a fabricated scale.",
    "The nested field inside input_field/active uses a 12px radius and full width, while the standalone field uses 10px and a fixed width — a confirmed, unexplained discrepancy. One consistent radius is used here rather than forking an undocumented second variant.",
    "`Dropdown`, `Textarea` and `DigitInput` were never deep-audited; they reuse `field`'s confirmed baseline styling.",
    "`digit_field` is a bare Figma instance with no captured properties at all, and its relationship to `digit_input` is explicitly uninvestigated — so no multi-cell OTP layout is invented for it.",
  ],
  usageExample: `import { InputField } from "@shikho/ui";

export function EmailField() {
  return (
    <InputField
      state="active"
      labelContent="Email address"
      fieldProps={{ textContent: "you@shikho.com" }}
      hintProps={{ hintTextContent: "We'll never share this." }}
    />
  );
}`,
  props: [
    { name: "size", type: "xl | lg | md | sm", defaultValue: "md", description: "`Field` only. Only `md` has confirmed layout data." },
    { name: "type", type: "default | textarea | advanced_with_buttons", defaultValue: "default", description: "`Field` only. Only `default` has confirmed structure." },
    { name: "state", type: "default | default_dark | hover | filled | active | error | disabled", defaultValue: "default", description: "Interaction state. Only `active` has a confirmed distinct visual." },
    { name: "label / hint", type: "boolean", defaultValue: "true", description: "`InputField` only — confirmed component booleans controlling the label and hint rows." },
    { name: "leftGroup, leftLead, rightGroup, rightIcon, supportText, text, textGroup, trailText", type: "boolean", defaultValue: "true", description: "`Field`'s eight confirmed slot booleans." },
    { name: "image", type: "boolean", defaultValue: "false", description: "`Field`'s ninth boolean — the only one confirmed to default off." },
    { name: "selectLeftIcon / selectRightIcon", type: "ReactNode | null", defaultValue: "null", description: "Confirmed instance-swap slots — the first found anywhere in the audit series." },
  ],
  preview: () => (
    <div style={{ width: "100%", maxWidth: 320 }}>
      <InputField
        state="active"
        labelContent="Label"
        fieldProps={{ textContent: "Input text", supportTextContent: "(12)", trailTextContent: "Text" }}
        hintProps={{ hintTextContent: "Hint" }}
      />
    </div>
  ),
  playground: {
    controls: [
      {
        prop: "state",
        label: "State",
        defaultValue: "active",
        options: ["default", "default_dark", "hover", "filled", "active", "error", "disabled"].map(
          (v) => ({ label: v, value: v }),
        ),
      },
      {
        prop: "label",
        label: "Label",
        defaultValue: "true",
        options: [
          { label: "shown", value: "true" },
          { label: "hidden", value: "false" },
        ],
      },
      {
        prop: "hint",
        label: "Hint",
        defaultValue: "true",
        options: [
          { label: "shown", value: "true" },
          { label: "hidden", value: "false" },
        ],
      },
    ],
    render: (v) => (
      <div style={{ width: "100%", maxWidth: 340 }}>
        <InputField
          state={v.state as InputFieldState}
          label={v.label === "true"}
          hint={v.hint === "true"}
          labelContent="Label"
          fieldProps={{ textContent: "Input text" }}
          hintProps={{ hintTextContent: "Hint" }}
        />
      </div>
    ),
  },
  showcases: [
    {
      title: "Field — the deep-audited instance",
      description: "size=md, type=default: 10px radius, smoke_med fill, confirmed inner shadow.",
      layout: "stack",
      render: () => (
        <Field
          size={"md" as FieldSize}
          type={"default" as FieldType}
          textContent="Input text"
          supportTextContent="(12)"
          trailTextContent="Text"
        />
      ),
    },
    {
      title: "Field — boolean slots",
      description: "The nine confirmed booleans, toggled to show each slot's contribution.",
      layout: "stack",
      render: () => (
        <>
          <Field textContent="All slots on" supportTextContent="(12)" trailTextContent="Text" />
          <Field textContent="No left icon" leftLead={false} supportText={false} trailText={false} />
          <Field textContent="Text only" rightIcon={false} trailText={false} supportText={false} />
        </>
      ),
    },
    {
      title: "Label and hint",
      description: "Separate component sets — both support only sm and md.",
      layout: "stack",
      render: () => (
        <>
          <InputLabel size="md">Label</InputLabel>
          <InputHint size="md" hintTextContent="Hint" supportTextContent="(Support text)" />
          <InputHint size="md" hintTextContent="Hint only" supportText={false} leftIcon={false} />
        </>
      ),
    },
    {
      title: "Dropdown, Textarea, DigitInput and DigitField",
      description:
        "None of these were deep-audited — they reuse Field's confirmed baseline styling.",
      layout: "stack",
      render: () => (
        <>
          <Dropdown state="default">Select an option</Dropdown>
          <Textarea state="default" aria-label="Message" placeholder="Write something…" rows={3} />
          <DigitField>
            {[0, 1, 2, 3].map((i) => (
              <DigitInput key={i} aria-label={`Digit ${i + 1}`} />
            ))}
          </DigitField>
        </>
      ),
    },
  ],
};
