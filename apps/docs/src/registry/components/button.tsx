import {
  AiRegularButton,
  AiRoundedButton,
  ButtonDanger,
  ButtonSuccess,
  GreyscaleButton,
  IconButton,
  NewBlueButton,
  NewPinkButton,
  type NewBlueSize,
  type NewBlueState,
  type NewBlueType,
} from "@shikho/ui";
import type { ComponentEntry } from "../types";

const dot = (
  <span
    style={{ display: "block", width: 8, height: 8, borderRadius: 9999, background: "currentColor" }}
  />
);

export const buttonEntry: ComponentEntry = {
  slug: "button",
  name: "Button",
  figmaName: "new_blue, new_pink, ai_rounded, ai_regular, button_success, button_danger, Greyscale, icon_button",
  category: "Actions",
  confidence: "partially-derived",
  summary: "Eight separate button families, each with its own confirmed size/type/state vocabulary.",
  description:
    "The audit found eight sibling button component sets that do not share a common type or state vocabulary — and even disagree on the name of their largest size step. They are published as eight separate components rather than merged into one API, so those confirmed differences are preserved rather than erased.",
  auditFile: "docs/audit/buttons.md",
  exports: [
    "NewBlueButton",
    "NewPinkButton",
    "AiRoundedButton",
    "AiRegularButton",
    "ButtonSuccess",
    "ButtonDanger",
    "GreyscaleButton",
    "IconButton",
  ],
  variants: [
    {
      name: "size",
      values: ["xs", "sm", "md", "lg", "xl / xxl"],
      note: "Two competing scales: new_blue, new_pink, ai_rounded and ai_regular top out at `xxl`; the other four at `xl`. No set uses both.",
    },
    {
      name: "type",
      values: ["Outline", "Primary", "Secondary", "Text", "primary", "tertiary", "Green", "Purple", "blue gradient", "neutral", "primary_light", "quaternary", "tertiary_light"],
      note: "Union across all eight families — each family exposes only its own subset. Casing is preserved verbatim, including the confirmed mixed casing inside a single property.",
    },
    {
      name: "state",
      values: ["Default / default", "Disabled / disabled", "Focus / focus", "Hover / hover"],
      note: "Four families use capitalised state values, four use lowercase — a confirmed inconsistency, preserved.",
    },
  ],
  states: ["default", "hover", "focus", "disabled"],
  gaps: [
    "Only one instance in the whole family was deep-audited (new_blue at xs/Primary/Default) — plus button_danger at md/Secondary/default, discovered later via the Alert audit. Every other family's per-type colour treatment is derived from its own colour ramp, not independently confirmed.",
    "Padding, gap, auto-layout direction and the icon-slot mechanism were never retrieved for any of the eight sets, so a minimal placeholder padding scale is used.",
    "`ai_rounded` / `ai_regular`'s \"blue gradient\" type has no resolved value anywhere — Gradient/G1–G6 never resolve — so it falls back to a solid primary fill rather than an approximated gradient.",
    "`primary_button_effect` / `secondary_button_effect` (the audited 4-layer button shadows) are not applied: they are not yet implemented in @shikho/tokens.",
  ],
  importExample: `import { NewBlueButton, ButtonDanger, IconButton } from "@shikho/ui";`,
  usageExample: `import { NewBlueButton } from "@shikho/ui";

export function SaveAction() {
  return (
    <NewBlueButton size="md" type="Primary" onClick={handleSave}>
      Save changes
    </NewBlueButton>
  );
}`,
  props: [
    { name: "size", type: "xs | sm | md | lg | xxl", defaultValue: "xs", description: "Size step. Families on scale A use `xl` in place of `xxl`." },
    { name: "type", type: "Outline | Primary | Secondary | Text", defaultValue: "Primary", description: "Emphasis/colour treatment. The value set differs per family." },
    { name: "state", type: "Default | Disabled | Focus | Hover", defaultValue: "Default", description: "Renders the corresponding variant. `Disabled` also sets the native disabled attribute." },
    { name: "icon", type: "ReactNode", description: "IconButton only — required, since that family is icon-only and @shikho/icons has no glyphs yet." },
    { name: "aria-label", type: "string", description: "IconButton only — required, as an icon-only button has no accessible name otherwise." },
    { name: "…", type: "ButtonHTMLAttributes<HTMLButtonElement>", description: "All other native button props are forwarded, except `type` and `color` which are reserved." },
  ],
  preview: () => (
    <>
      <NewBlueButton size="md" type="Primary">Primary</NewBlueButton>
      <NewBlueButton size="md" type="Secondary">Secondary</NewBlueButton>
      <NewBlueButton size="md" type="Outline">Outline</NewBlueButton>
    </>
  ),
  playground: {
    controls: [
      {
        prop: "size",
        label: "Size",
        defaultValue: "md",
        options: ["xs", "sm", "md", "lg", "xxl"].map((v) => ({ label: v, value: v })),
      },
      {
        prop: "type",
        label: "Type",
        defaultValue: "Primary",
        options: ["Outline", "Primary", "Secondary", "Text"].map((v) => ({ label: v, value: v })),
      },
      {
        prop: "state",
        label: "State",
        defaultValue: "Default",
        options: ["Default", "Hover", "Focus", "Disabled"].map((v) => ({ label: v, value: v })),
      },
    ],
    render: (v) => (
      <NewBlueButton
        size={v.size as NewBlueSize}
        type={v.type as NewBlueType}
        state={v.state as NewBlueState}
      >
        Button
      </NewBlueButton>
    ),
  },
  showcases: [
    {
      title: "All eight families",
      description: "Each is a separate export with its own confirmed variant vocabulary.",
      render: () => (
        <>
          <NewBlueButton size="md" type="Primary">new_blue</NewBlueButton>
          <NewPinkButton size="md" type="Primary">new_pink</NewPinkButton>
          <AiRoundedButton size="md" type="Primary">ai_rounded</AiRoundedButton>
          <AiRegularButton size="md" type="Primary">ai_regular</AiRegularButton>
          <ButtonSuccess size="md" type="primary">button_success</ButtonSuccess>
          <ButtonDanger size="md" type="Secondary">button_danger</ButtonDanger>
          <GreyscaleButton size="md" type="primary">Greyscale</GreyscaleButton>
          <IconButton size="md" type="primary" icon={dot} aria-label="Icon button" />
        </>
      ),
    },
    {
      title: "Size scale",
      description: "new_blue's confirmed scale — xs, sm, md, lg, xxl.",
      render: () => (
        <>
          {(["xs", "sm", "md", "lg", "xxl"] as NewBlueSize[]).map((size) => (
            <NewBlueButton key={size} size={size} type="Primary">
              {size}
            </NewBlueButton>
          ))}
        </>
      ),
    },
    {
      title: "States",
      description: "The four confirmed states. Focus renders the confirmed 3px-spread ring.",
      render: () => (
        <>
          {(["Default", "Hover", "Focus", "Disabled"] as NewBlueState[]).map((state) => (
            <NewBlueButton key={state} size="md" type="Primary" state={state}>
              {state}
            </NewBlueButton>
          ))}
        </>
      ),
    },
    {
      title: "button_danger — the confirmed Secondary binding",
      description:
        "Fill Color/gray/100 with a text/danger-600 label, confirmed via the Alert audit's nested instance path.",
      render: () => (
        <>
          <ButtonDanger size="md" type="Secondary">Learn more</ButtonDanger>
          <ButtonDanger size="md" type="primary">primary</ButtonDanger>
          <ButtonDanger size="md" type="tertiary">tertiary</ButtonDanger>
          <ButtonDanger size="md" type="Text">Text</ButtonDanger>
        </>
      ),
    },
  ],
};
