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
import type { ComponentPageConfig } from "./types";

const dot = (
  <span
    style={{ display: "block", width: 8, height: 8, borderRadius: 9999, background: "currentColor" }}
  />
);

// docs/audit/buttons.md §2 — the 8 confirmed families, each its own export with its own
// confirmed size scale, type vocabulary, and state casing (never merged into one shared API).
// The single cross-family playground below lets every one of them be previewed from one set of
// controls, resolving each family's own confirmed values rather than inventing a shared one.
type ButtonFamily =
  | "new_blue"
  | "new_pink"
  | "ai_rounded"
  | "ai_regular"
  | "button_success"
  | "button_danger"
  | "greyscale"
  | "icon_button";

const FAMILIES: ButtonFamily[] = [
  "new_blue",
  "new_pink",
  "ai_rounded",
  "ai_regular",
  "button_success",
  "button_danger",
  "greyscale",
  "icon_button",
];

// Two competing size scales (§14) — xs/sm/md/lg shared by both, only the top step differs
// (xl vs xxl). Families on scale A never accept "xxl"; families on scale B never accept "xl".
const SCALE_A_FAMILIES: ButtonFamily[] = ["button_success", "button_danger", "greyscale", "icon_button"];
const SIZE_OPTIONS = ["xs", "sm", "md", "lg", "xl", "xxl"];

/** Maps the playground's single xl/xxl step onto whichever top step the selected family actually has. */
function resolveSize(family: ButtonFamily, size: string): string {
  const isScaleA = SCALE_A_FAMILIES.includes(family);
  if (size === "xl" && !isScaleA) return "xxl";
  if (size === "xxl" && isScaleA) return "xl";
  return size;
}

// Four families use Capitalized state values, four use lowercase (§2, a confirmed
// inconsistency) — one canonical Capitalized control, cased per family at render time.
const CAPITALIZED_STATE_FAMILIES: ButtonFamily[] = ["new_blue", "new_pink", "ai_rounded", "ai_regular"];
const STATE_OPTIONS = ["Default", "Hover", "Focus", "Disabled"];

function resolveState(family: ButtonFamily, state: string): string {
  return CAPITALIZED_STATE_FAMILIES.includes(family) ? state : state.toLowerCase();
}

// The union of every family's own confirmed type values, casing preserved verbatim (including
// ai_regular's confirmed lowercase "purple" vs ai_rounded's "Purple" — a real inconsistency, not
// normalized away). Each family only recognizes its own subset (§2); anything else falls back to
// that family's own confirmed default type rather than rendering nothing.
const TYPE_OPTIONS = [
  "Outline",
  "Primary",
  "Secondary",
  "Text",
  "primary",
  "secondary",
  "tertiary",
  "Green",
  "Purple",
  "purple",
  "blue gradient",
  "neutral",
  "primary_light",
  "quaternary",
  "tertiary_light",
];

const FAMILY_TYPES: Record<ButtonFamily, { valid: string[]; default: string }> = {
  new_blue: { valid: ["Outline", "Primary", "Secondary", "Text"], default: "Primary" },
  new_pink: { valid: ["Outline", "Primary", "Secondary", "Text"], default: "Primary" },
  ai_rounded: { valid: ["Green", "Primary", "Purple", "blue gradient"], default: "Primary" },
  ai_regular: { valid: ["Green", "Primary", "blue gradient", "purple"], default: "Primary" },
  button_success: { valid: ["Outline", "Secondary", "Text", "primary"], default: "primary" },
  button_danger: { valid: ["Secondary", "Text", "primary", "tertiary"], default: "Secondary" },
  greyscale: { valid: ["Outline", "Secondary", "Text", "primary"], default: "primary" },
  icon_button: {
    valid: ["neutral", "primary", "primary_light", "quaternary", "secondary", "tertiary", "tertiary_light"],
    default: "primary",
  },
};

function resolveType(family: ButtonFamily, type: string): string {
  const cfg = FAMILY_TYPES[family];
  return cfg.valid.includes(type) ? type : cfg.default;
}

function FamilyPreview({ family, size, type, state }: { family: ButtonFamily; size: string; type: string; state: string }) {
  const resolvedSize = resolveSize(family, size);
  const resolvedType = resolveType(family, type);
  const resolvedState = resolveState(family, state);

  switch (family) {
    case "new_blue":
      return (
        <NewBlueButton size={resolvedSize as NewBlueSize} type={resolvedType as NewBlueType} state={resolvedState as NewBlueState}>
          Button
        </NewBlueButton>
      );
    case "new_pink":
      return (
        <NewPinkButton size={resolvedSize as any} type={resolvedType as any} state={resolvedState as any}>
          Button
        </NewPinkButton>
      );
    case "ai_rounded":
      return (
        <AiRoundedButton size={resolvedSize as any} type={resolvedType as any} state={resolvedState as any}>
          Button
        </AiRoundedButton>
      );
    case "ai_regular":
      return (
        <AiRegularButton size={resolvedSize as any} type={resolvedType as any} state={resolvedState as any}>
          Button
        </AiRegularButton>
      );
    case "button_success":
      return (
        <ButtonSuccess size={resolvedSize as any} type={resolvedType as any} state={resolvedState as any}>
          Button
        </ButtonSuccess>
      );
    case "button_danger":
      return (
        <ButtonDanger size={resolvedSize as any} type={resolvedType as any} state={resolvedState as any}>
          Button
        </ButtonDanger>
      );
    case "greyscale":
      return (
        <GreyscaleButton size={resolvedSize as any} type={resolvedType as any} state={resolvedState as any}>
          Button
        </GreyscaleButton>
      );
    case "icon_button":
      // IconButton is icon-only (§ props table) — no text children, requires icon + aria-label.
      return (
        <IconButton
          size={resolvedSize as any}
          type={resolvedType as any}
          state={resolvedState as any}
          icon={dot}
          aria-label="Icon button preview"
        />
      );
  }
}

export const pageConfig: ComponentPageConfig = {
  longDescription:
    "The audit found eight sibling button component sets that do not share a common type or state vocabulary — and even disagree on the name of their largest size step. They are published as eight separate components rather than merged into one API, so those confirmed differences are preserved rather than erased. A deep re-audit (docs/audit/buttons.md §14) later found the original implementation had captured every family's variant vocabulary but never rendered a single instance — borders, shadows, gradients, and several color mappings were invented rather than confirmed. This has been rebuilt from ~35 get_design_context calls across all 8 families; see the audit's §14.1 for exactly what was wrong.",
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
    "icon_button's `primary_light`/`tertiary_light` types were not independently sampled — derived as a lighter tint of their non-`_light` sibling, following the `_light`-suffix pattern confirmed elsewhere in this system.",
    "ai_rounded/ai_regular's gradient hover/focus/disabled states were not independently sampled — hover applies a brightness() filter and disabled/focus reuse the universal confirmed recipes as the closest analogue.",
    "button_danger's `tertiary` type has no counterpart in any other family and is implemented via the confirmed Outline-shape construction as the closest structural analogue.",
    "Most families' own Secondary/Outline/Text hover-focus-disabled deltas were not independently re-sampled per family — new_blue's confirmed transition rules are applied uniformly, except button_success's confirmed disabled-fill exception (flat neutral gray, not a tinted success color).",
  ],
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
        prop: "family",
        label: "Family",
        defaultValue: "new_blue",
        options: FAMILIES.map((v) => ({ label: v, value: v })),
      },
      {
        prop: "size",
        label: "Size",
        defaultValue: "md",
        options: SIZE_OPTIONS.map((v) => ({ label: v, value: v })),
      },
      {
        prop: "type",
        label: "Type",
        defaultValue: "Primary",
        options: TYPE_OPTIONS.map((v) => ({ label: v, value: v })),
      },
      {
        prop: "state",
        label: "State",
        defaultValue: "Default",
        options: STATE_OPTIONS.map((v) => ({ label: v, value: v })),
      },
    ],
    render: (v) => (
      <FamilyPreview family={v.family as ButtonFamily} size={v.size} type={v.type} state={v.state} />
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
      title: "ai_rounded — confirmed real gradients, not solid fills",
      description:
        "Every type renders a real CSS gradient with exact confirmed stop colors/angles (docs/audit/buttons.md §14.3) — the original implementation rendered these as solid ramp fills.",
      render: () => (
        <>
          <AiRoundedButton size="md" type="Primary">Primary</AiRoundedButton>
          <AiRoundedButton size="md" type="blue gradient">blue gradient</AiRoundedButton>
          <AiRoundedButton size="md" type="Green">Green</AiRoundedButton>
          <AiRoundedButton size="md" type="Purple">Purple</AiRoundedButton>
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
