import { Chip, type ChipSize, type ChipState, type ChipType } from "@shikho/ui";
import type { ComponentPageConfig } from "./types";

export const pageConfig: ComponentPageConfig = {
  longDescription:
    "Deep-audited at md/selected/focus, giving exact fill, text colour, radius and — unusually — an unambiguous focus mechanism. Chip encodes selection in its `type` property rather than a state, a different philosophy from Checkbox's explicit `checked`/`unchecked` state.",
  variants: [
    { name: "size", values: ["lg", "md", "sm"], note: "Only md's 32px height is exactly confirmed; lg and sm are approximate overview-level observations." },
    {
      name: "type",
      values: ["unselected", "selected", "selected_neutral", "Green", "Red"],
      note: "Casing preserved verbatim — the lowercase trio and the capitalised Green/Red is a confirmed inconsistency within one property.",
    },
    { name: "state", values: ["disabled", "focus", "hover", "drag", "default"], note: "`drag` is a state name seen nowhere else in the audit series." },
  ],
  states: ["default", "hover", "focus", "drag", "disabled"],
  gaps: [
    "Green and Red only ever appear with `state=default` — no disabled, focus, hover or drag variant exists for either. A confirmed coverage gap.",
    "Only `type=selected` has an exactly confirmed fill and text colour. `unselected` and `selected_neutral` use gray tokens present in Chip's own export; Green and Red follow the audit's own \"plausible but unconfirmed\" mapping to the success and danger ramps.",
    "The deep audit found no dedicated selection-indicator (checkmark) or dismiss-control layer — only generic icon slots. Neither is invented here.",
    "How `drag`, `hover` and `disabled` actually render was never inspected; all three fall back to the confirmed per-type resting appearance.",
    "Whether a checkmark asset is swapped into one of the generic icon slots for selected chips is explicitly unconfirmed, so the slots stay empty unless a consumer supplies one.",
  ],
  usageExample: `import { Chip } from "@shikho/ui";

export function TopicFilter({ topics, selected, onToggle }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {topics.map((topic) => (
        <Chip
          key={topic}
          size="md"
          type={selected.includes(topic) ? "selected" : "unselected"}
          textContent={topic}
          onClick={() => onToggle(topic)}
        />
      ))}
    </div>
  );
}`,
  props: [
    { name: "size", type: "lg | md | sm", defaultValue: "md", description: "Only md's height is exactly confirmed." },
    { name: "type", type: "unselected | selected | selected_neutral | Green | Red", defaultValue: "selected", description: "Colour treatment; also where Chip encodes selection." },
    { name: "state", type: "disabled | focus | hover | drag | default", defaultValue: "default", description: "`focus` renders the confirmed 3px primary ring; `disabled` sets the native attribute." },
    { name: "leftIcon / rightIcon / text", type: "boolean", defaultValue: "true", description: "The three confirmed slot booleans." },
    { name: "selectLeftIcon / selectRightIcon", type: "ReactNode | null", defaultValue: "null", description: "Confirmed instance-swap slots." },
    { name: "textContent", type: "ReactNode", description: "Label content. No default is supplied." },
    { name: "…", type: "ButtonHTMLAttributes<HTMLButtonElement>", description: "Rendered as a real `<button>`; other native props are forwarded." },
  ],
  preview: () => (
    <>
      <Chip size="md" type="selected" textContent="Selected" />
      <Chip size="md" type="unselected" textContent="Unselected" />
      <Chip size="md" type="Green" textContent="Green" />
      <Chip size="md" type="Red" textContent="Red" />
    </>
  ),
  playground: {
    controls: [
      {
        prop: "size",
        label: "Size",
        defaultValue: "md",
        options: ["lg", "md", "sm"].map((v) => ({ label: v, value: v })),
      },
      {
        prop: "type",
        label: "Type",
        defaultValue: "selected",
        options: ["unselected", "selected", "selected_neutral", "Green", "Red"].map((v) => ({
          label: v,
          value: v,
        })),
      },
      {
        prop: "state",
        label: "State",
        defaultValue: "default",
        options: ["default", "hover", "focus", "drag", "disabled"].map((v) => ({
          label: v,
          value: v,
        })),
      },
    ],
    render: (v) => (
      <Chip
        size={v.size as ChipSize}
        type={v.type as ChipType}
        state={v.state as ChipState}
        textContent="Chip"
      />
    ),
  },
  showcases: [
    {
      title: "The interactive selection trio",
      description: "unselected, selected and selected_neutral support all five states.",
      render: () => (
        <>
          <Chip type="unselected" textContent="unselected" />
          <Chip type="selected" textContent="selected" />
          <Chip type="selected_neutral" textContent="selected_neutral" />
        </>
      ),
    },
    {
      title: "Green and Red — a confirmed coverage gap",
      description: "These two types only ever exist at state=default.",
      render: () => (
        <>
          <Chip type="Green" textContent="Green" />
          <Chip type="Red" textContent="Red" />
        </>
      ),
    },
    {
      title: "Sizes",
      render: () => (
        <>
          <Chip size="lg" textContent="lg" />
          <Chip size="md" textContent="md" />
          <Chip size="sm" textContent="sm" />
        </>
      ),
    },
    {
      title: "States",
      description: "focus is the one state with a fully confirmed, unambiguous mechanism.",
      render: () => (
        <>
          {(["default", "hover", "focus", "drag", "disabled"] as ChipState[]).map((state) => (
            <Chip key={state} state={state} textContent={state} />
          ))}
        </>
      ),
    },
  ],
};
