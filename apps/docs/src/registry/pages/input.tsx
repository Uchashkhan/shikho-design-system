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

const TYPES: FieldType[] = ["default", "textarea", "advanced_with_buttons"];
const BUTTON_COLORS: { label: string; value: string }[] = [
  { label: "Primary 500", value: "primary" },
  { label: "Secondary 500", value: "secondary" },
  { label: "Dark 900", value: "dark" },
];

const swatch = (
  <span style={{ display: "block", width: "100%", height: "100%", background: "#8c929c", borderRadius: 3 }} />
);

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
    "`InputField` now accepts `size` — Figma's own `input_field` component set (node 66056:19180) crosses `state` alone with no size axis, but `fieldChromeStyle`'s state colors/border/ring have no size dependency either, so this composes `field`'s own independently-confirmed xl/lg/md/sm geometry (node 66056:19051) underneath `input_field`'s confirmed per-state chrome, rather than leaving `InputField` locked to Field's bare default size. `InputLabel`/`InputHint` are separately confirmed to support only sm/md — lg/xl map down to their own confirmed md, the closest available, not an invented lg/xl label/hint treatment. `InputField` still hard-excludes `type` from its own composition, since Figma's `input_field` set has no type axis at all.",
    "buttonColor is a requested addition with no Figma source — Figma's own confirmed advanced_with_buttons composition always uses NewPinkButton (\"secondary\"). Default changed to \"primary\" (NewBlueButton, Color/primary/500) per direct follow-up request — a deliberate deviation from Figma's own default, not a re-derived one; \"secondary\"/\"dark\" remain available and reuse NewPinkButton/GreyscaleButton's own confirmed color resolvers instead of inventing new colors.",
    "`Textarea` now accepts `size` too. Its own Figma component set (node 66056:19282) has no size axis — only one instance was ever sampled — but that sample's confirmed padding/radius is a byte-for-byte match with field's own type=\"textarea\" \"lg\" row, not \"md\" as originally assumed. `size` now defaults to \"lg\" (reproducing the original sample exactly) and reuses the other 3 already-confirmed sizes from that same table (now shared between Field and Textarea as `TEXTAREA_METRICS` in shared.ts) as the least-invented extension.",
    "Requested: `active`'s border/ring is now `Color/primary/500` + `primary/200` (blue), a deliberate CODE-ONLY override — Figma's own `input_field`/`active` (node 66056:19197) still renders secondary pink, confirmed unchanged, re-verified during this pass. Applied everywhere `fieldChromeStyle` is shared (InputField, Textarea, and now advanced_with_buttons) — `Dropdown`/`DigitInput` each have their own independent, still-pink chrome function and were left untouched since only \"the input field\" was named.",
    "Requested: type=\"advanced_with_buttons\" now accepts `state` and, left unset, derives it from real focus/value/hover the same way default/textarea already do — previously it had no state prop at all and always rendered the same static chrome no matter what. No Figma component wraps this type with a state axis (confirmed absent), so this reuses the exact same already-confirmed `fieldChromeStyle` the rest of the family shares, rather than inventing new colors. Disabled now also passes through to the real NewPinkButton/NewBlueButton/GreyscaleButton shortcut buttons (native `disabled`, not just a visual dimming).",
    "Fixed: the advanced_with_buttons lead chip's chevron glyph was hardcoded to size 24 at every field size (only correct at xl — confirmed 20/18/16 at lg/md/sm, node 66056:19069 and siblings) and its wrapping slot had no flex centering at all, so it rendered as an inline block sitting on the text baseline — visibly high, and oversized below xl. Both fixed: `IconSlot` (used by every icon slot in `Field`) now centers with flex, and the chevron sizes per field size.",
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
    { name: "size", type: "xl | lg | md | sm", defaultValue: "md", description: "`Field`'s own confirmed per-size geometry (all 4 sizes independently confirmed). `InputField` now composes this too, underneath its own confirmed per-state chrome." },
    { name: "type", type: "default | textarea | advanced_with_buttons", defaultValue: "default", description: "`Field` only — all three now render their own confirmed structure at every size (P1 repair pass)." },
    { name: "state", type: "default | default_dark | hover | filled | active | error | disabled", defaultValue: "default", description: "Interaction state. `active` is now primary blue (requested override, not a Figma value — Figma itself still shows pink). `type=\"advanced_with_buttons\"` now also accepts this — previously it only read `disabled` off it and ignored the rest." },
    { name: "label / hint", type: "boolean", defaultValue: "true", description: "`InputField` only — confirmed component booleans controlling the label and hint rows." },
    { name: "leftGroup, leftLead, rightGroup, rightIcon, supportText, text, textGroup, trailText", type: "boolean", defaultValue: "true", description: "`Field`'s eight confirmed slot booleans." },
    { name: "image", type: "boolean", defaultValue: "false", description: "`Field`'s ninth boolean — the only one confirmed to default off." },
    { name: "selectLeftIcon / selectRightIcon", type: "ReactNode | null", defaultValue: "null", description: "Confirmed instance-swap slots — the first found anywhere in the audit series." },
    { name: "leadTextContent / leadChevron / buttonLabels", type: "ReactNode / boolean / string[]", description: "`Field`, type=\"advanced_with_buttons\" only — the lead dropdown chip and 0-3 action buttons." },
    { name: "buttonColor", type: "primary | secondary | dark", defaultValue: "primary", description: "Requested addition. type=\"advanced_with_buttons\" only — which family's color resolver the action buttons use. Default changed to \"primary\" (blue) per request; Figma's own confirmed default is \"secondary\" (pink)." },
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
    // LEFT DROPDOWN / RIGHT BUTTONS / BUTTON COLOR only apply to type="advanced_with_buttons" —
    // that structure (a lead chip, a trail icon, 0-3 action buttons) genuinely doesn't exist on
    // "default"/"textarea" at all, so those 3 controls hide themselves rather than offering a
    // combination Field can't actually render. LEFT ICON is likewise only meaningful for
    // "default" (textarea has no icon slots at all; advanced_with_buttons' only "left" content is
    // the dropdown lead chip itself, controlled by LEFT DROPDOWN instead).
    //
    // InputField now composes field's own confirmed xl/lg/md/sm geometry underneath its confirmed
    // per-state chrome (previously hardcoded to Field's bare default size) — see the gaps entry
    // above for why that's a safe, "least invented" composition rather than a guessed one. It
    // still hard-excludes `type` from its own props, since Figma's input_field set has no type
    // axis at all — so type="default"/"textarea" go through InputField/Textarea's own STATE prop.
    // type="advanced_with_buttons" now ALSO responds to STATE (Field's own `state` prop, see the
    // gaps entry above) — previously it only ever read `disabled` off STATE and ignored the rest.
    controls: [
      {
        prop: "size",
        label: "Size",
        defaultValue: "md",
        options: ["xl", "lg", "md", "sm"].map((v) => ({ label: v, value: v })),
      },
      {
        prop: "type",
        label: "Type",
        defaultValue: "default",
        options: TYPES.map((v) => ({ label: v, value: v })),
      },
      {
        prop: "state",
        label: "State",
        defaultValue: "active",
        options: ["default", "default_dark", "hover", "filled", "active", "error", "disabled"].map(
          (v) => ({ label: v, value: v }),
        ),
      },
      {
        prop: "leftIcon",
        label: "Left icon",
        defaultValue: "false",
        hidden: (values) => values.type !== "default",
        options: [
          { label: "true", value: "true" },
          { label: "false", value: "false" },
        ],
      },
      {
        prop: "rightIcon",
        label: "Right icon",
        defaultValue: "false",
        hidden: (values) => values.type === "textarea",
        options: [
          { label: "true", value: "true" },
          { label: "false", value: "false" },
        ],
      },
      {
        prop: "leftDropdown",
        label: "Left dropdown",
        defaultValue: "none",
        hidden: (values) => values.type !== "advanced_with_buttons",
        options: [
          { label: "none", value: "none" },
          { label: "dropdown", value: "dropdown" },
        ],
      },
      {
        prop: "rightButtons",
        label: "Right buttons",
        defaultValue: "single",
        hidden: (values) => values.type !== "advanced_with_buttons",
        options: [
          { label: "none", value: "none" },
          { label: "single", value: "single" },
          { label: "multiple", value: "multiple" },
        ],
      },
      {
        prop: "buttonColor",
        label: "Button color",
        defaultValue: "primary",
        hidden: (values) => values.type !== "advanced_with_buttons" || values.rightButtons === "none",
        options: BUTTON_COLORS,
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
    render: (v) => {
      const type = v.type as FieldType;
      const showLabel = v.label === "true";
      const showHint = v.hint === "true";

      if (type === "textarea") {
        return (
          <div style={{ width: "100%", maxWidth: 340, display: "flex", flexDirection: "column", gap: "0.25rem", alignItems: "flex-start" }}>
            {showLabel && <InputLabel>Label</InputLabel>}
            <Textarea
              size={v.size as FieldSize}
              state={v.state as TextareaState}
              placeholder="Write something…"
              rows={3}
              style={{ width: "100%" }}
            />
            {showHint && <InputHint hintTextContent="Hint" />}
          </div>
        );
      }

      if (type === "advanced_with_buttons") {
        const buttonLabels =
          v.rightButtons === "none" ? [] : v.rightButtons === "multiple" ? ["One", "Two"] : ["Button"];
        return (
          <div style={{ width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", gap: "0.25rem", alignItems: "flex-start" }}>
            {showLabel && <InputLabel>Label</InputLabel>}
            <Field
              size={v.size as FieldSize}
              type="advanced_with_buttons"
              textContent="Input text"
              leadTextContent={v.leftDropdown === "dropdown" ? "+1" : undefined}
              rightIcon={v.rightIcon === "true"}
              selectRightIcon={v.rightIcon === "true" ? swatch : null}
              trailTextContent={v.rightIcon === "true" ? "Text" : undefined}
              buttonLabels={buttonLabels}
              buttonColor={v.buttonColor as "primary" | "secondary" | "dark"}
              state={v.state as InputFieldState}
              style={{ width: "100%" }}
            />
            {showHint && <InputHint hintTextContent="Hint" />}
          </div>
        );
      }

      return (
        <div style={{ width: "100%", maxWidth: 340 }}>
          <InputField
            size={v.size as FieldSize}
            state={v.state as InputFieldState}
            label={showLabel}
            hint={showHint}
            labelContent="Label"
            fieldProps={{
              textContent: "Input text",
              leftLead: v.leftIcon === "true",
              selectLeftIcon: v.leftIcon === "true" ? swatch : null,
              rightIcon: v.rightIcon === "true",
              selectRightIcon: v.rightIcon === "true" ? swatch : null,
            }}
            hintProps={{ hintTextContent: "Hint" }}
          />
        </div>
      );
    },
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
        "Independently re-confirmed at all 4 sizes via get_design_context (node 66056:19069 and siblings): a bordered lead chip (country-code-style prefix, with a real select-chevrons glyph rendered by default), a flex-1 text column, an optional trail label, and 1-3 real shortcut-button actions (NewBlueButton/primary by default — a requested deviation from Figma's own confirmed NewPinkButton/secondary, see buttonColor below). Shown at every size to demonstrate the confirmed per-size lead/button metrics.",
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
      title: "Field — advanced_with_buttons, now state-driven",
      description:
        "Previously always rendered the same static gray-100 chrome, with no state prop at all and the shortcut buttons never actually disabling. Now shares the same fieldChromeStyle chrome as InputField/Textarea (real focus/value/hover-driven by default, or force with `state`) and passes `disabled` through to the real shortcut buttons. Shown forced per state since focus/hover are otherwise easy to miss — hover/focus the default one to see it respond to a real pointer too.",
      layout: "stack",
      render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {(["default", "hover", "active", "error", "disabled"] as InputFieldState[]).map((state) => (
            <div key={state} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 70, fontSize: 12, color: "#8c929c", flexShrink: 0 }}>{state}</span>
              <Field
                type="advanced_with_buttons"
                state={state === "default" ? undefined : state}
                leadTextContent="+1"
                textContent="Input text"
                buttonLabels={["Send"]}
                style={{ maxWidth: 320 }}
              />
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Field — advanced_with_buttons, up to 3 buttons",
      description: "buttonLabels accepts 1-3 labels, each composing a real NewBlueButton (buttonColor's default) — confirmed the max Figma exposes.",
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
      title: "Textarea — all four confirmed sizes",
      description: "size defaults to \"lg\" — the exact size of the one sample Figma's own textarea component set confirms — and reuses field's own already-confirmed xl/lg/md/sm textarea geometry for the other 3.",
      layout: "stack",
      render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {(["xl", "lg", "md", "sm"] as FieldSize[]).map((size) => (
            <div key={size} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 70, fontSize: 12, color: "#8c929c", flexShrink: 0 }}>{size}</span>
              <Textarea size={size} aria-label={`Message (${size})`} placeholder="Write something…" rows={2} style={{ width: 260 }} />
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
