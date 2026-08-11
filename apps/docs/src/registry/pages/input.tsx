import {
  DigitInput,
  Dropdown,
  Field,
  InputField,
  InputHint,
  InputLabel,
  Textarea,
  type DropdownState,
  type FieldSize,
  type FieldType,
  type InputFieldState,
  type TextareaState,
} from "@shikho/ui";
import type { ComponentPageConfig } from "./types";

const DROPDOWN_STATES: DropdownState[] = [
  "default",
  "default_dark",
  "hover",
  "brand",
  "active",
  "active_no_focus",
  "error",
  "disabled",
  "naked",
];
const TEXTAREA_STATES: TextareaState[] = ["default", "hover", "filled", "active", "error", "disabled"];

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
    "`field`'s sizes (sm/md/lg/xl) and all 3 types now each render their own confirmed geometry — previously every size/type beyond md/default silently rendered identically to md/default.",
    "The nested field inside input_field/active uses a 12px radius and full width, while the standalone field uses 10px and a fixed width — a confirmed, unexplained discrepancy. One consistent radius is used here rather than forking an undocumented second variant.",
    "`Dropdown` and `Textarea` are now independently confirmed via their own `get_design_context` pulls rather than reusing `field`'s baseline — both turned out to genuinely differ (Textarea's own radius/padding/error-text-color; Dropdown's own text color, `brand`/`active_no_focus` chrome, padding and gap). `DigitInput` was already independently confirmed.",
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
    { name: "type", type: "default | textarea | advanced_with_buttons", defaultValue: "default", description: "`Field` only — all three now render their own confirmed structure at every size (P1 repair pass)." },
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
      title: "Field — type=advanced_with_buttons",
      description:
        "Independently re-confirmed at all 4 sizes via get_design_context (node 66056:19069 and siblings): a bordered lead chip (country-code-style prefix, with a real select-chevrons glyph rendered by default), a flex-1 text column, an optional trail label, and 1-3 real NewPinkButton actions. Shown at every size to demonstrate the confirmed per-size lead/button metrics.",
      layout: "stack",
      render: () => (
        <>
          {(["sm", "md", "lg", "xl"] as FieldSize[]).map((size) => (
            <Field
              key={size}
              size={size}
              type="advanced_with_buttons"
              leadTextContent="+1"
              textContent="Input text"
              trailTextContent="Text"
              buttonLabels={["Send"]}
            />
          ))}
        </>
      ),
    },
    {
      title: "Field — advanced_with_buttons, up to 3 buttons",
      description: "buttonLabels accepts 1-3 labels, each composing a real NewPinkButton — confirmed the max Figma exposes.",
      render: () => (
        <Field
          type="advanced_with_buttons"
          leadTextContent="+1"
          textContent="Input text"
          buttonLabels={["Copy", "Send"]}
        />
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
      title: "Dropdown — all 9 confirmed states",
      description:
        "Independently confirmed via its own get_design_context pull, not derived from Field/InputField. default/hover/default_dark text is gray-950 (darker than InputField's own gray-700 default); brand has its own primary-tinted fill; active_no_focus is white + an outer shadow, not \"active minus its ring.\" Shown side by side with forced state since the difference is otherwise easy to miss — hover/focus the default one to see it respond to a real pointer too.",
      layout: "stack",
      render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {DROPDOWN_STATES.map((state) => (
            <div key={state} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 110, fontSize: 12, color: "#8c929c", flexShrink: 0 }}>{state}</span>
              <Dropdown state={state} style={{ maxWidth: 260 }}>
                Select an option
              </Dropdown>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Textarea — all 6 reachable states",
      description:
        "Independently confirmed via its own get_design_context pull — its radius (16px) and padding are its own, distinct from Field's (10px/8px), and error reddens the input text itself (danger-500), unlike InputField's error which keeps gray-700 text.",
      layout: "stack",
      render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {TEXTAREA_STATES.map((state) => (
            <div key={state} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 70, fontSize: 12, color: "#8c929c", flexShrink: 0 }}>{state}</span>
              <Textarea
                state={state}
                aria-label={`Message (${state})`}
                defaultValue={state === "filled" || state === "active" || state === "error" ? "Write something…" : undefined}
                placeholder="Write something…"
                rows={2}
                style={{ width: 260 }}
              />
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "DigitInput — real, focusable cells",
      description: "Each cell is a genuine <input> — click one and type a digit.",
      layout: "stack",
      render: () => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {[0, 1, 2, 3].map((i) => (
            <DigitInput key={i} aria-label={`Digit ${i + 1}`} />
          ))}
        </div>
      ),
    },
  ],
};
