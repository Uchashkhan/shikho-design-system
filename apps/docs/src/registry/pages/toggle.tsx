import { Toggle, type ToggleSize } from "@shikho/ui";
import type { ComponentPageConfig } from "./types";

export const pageConfig: ComponentPageConfig = {
  longDescription:
    "The third and final selection-control primitive. Figma spells its states `switch_ON` / `switch_OFF` — a third distinct vocabulary, differing from both Checkbox's `checked`/`unchecked` and Radio's `active`/`inactive`. It also has the most limited state coverage of the three: no hover state, and no OFF-focused variant.",
  variants: [
    {
      name: "size",
      values: ["lg", "md", "sm"],
      note: "lg and md share an identical confirmed 40×24 bounding box — reproduced faithfully rather than \"fixed\" into two distinct sizes. sm is 32×20.",
    },
  ],
  states: ["switch_OFF", "switch_ON", "switch_ON_focused", "switch_OFF_disabled", "switch_ON_disabled"],
  gaps: [
    "No sliding knob or thumb is drawn. There is zero confirmed data for a knob colour, knob size, ON-state track colour or animation — so the ubiquitous \"coloured track + sliding white knob\" visual would be entirely invented. The browser's native indicator communicates ON/OFF instead.",
    "Toggle's own colour export is narrower than Checkbox's and Radio's — it does not include Text/Gray 400, the border colour those two share. The resting fill is therefore grounded in Color/Gray 200, which is present in Toggle's own export, and no border is rendered at all.",
    "`radius/border_radius_100` is a brand-new token first seen in this audit, with an explicitly unconfirmed application (knob vs. track vs. something else). It is deliberately left unused rather than guessed onto either element.",
    "`Color/disabled_base_em` is present in the token pool but its genuine application to disabled states is unconfirmed, so generic opacity dimming is used instead.",
    "There is no hover state and no indeterminate state — both confirmed absent from toggle's enum, unlike its two siblings.",
    "`toggle_label` is a second confirmed component set, not yet implemented.",
  ],
  usageExample: `import { Toggle } from "@shikho/ui";

export function NotificationSetting() {
  const [enabled, setEnabled] = useState(false);

  return (
    <label>
      <Toggle
        size="md"
        checked={enabled}
        onChange={(e) => setEnabled(e.target.checked)}
      />
      Email notifications
    </label>
  );
}`,
  props: [
    { name: "size", type: "lg | md | sm", defaultValue: "md", description: "lg and md are confirmed identical in size; sm is smaller." },
    { name: "checked", type: "boolean", description: "Native controlled state. Figma calls this `switch_ON`; the native prop name is kept." },
    { name: "defaultChecked", type: "boolean", description: "Native uncontrolled initial state." },
    { name: "disabled", type: "boolean", description: "Native disabled attribute." },
    { name: "…", type: "InputHTMLAttributes<HTMLInputElement>", description: "All other native input props are forwarded. The element carries role=\"switch\"." },
  ],
  preview: () => (
    <>
      <Toggle size="md" defaultChecked aria-label="On" />
      <Toggle size="md" aria-label="Off" />
      <Toggle size="sm" aria-label="Small" />
      <Toggle size="md" disabled aria-label="Disabled" />
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
        prop: "checked",
        label: "State",
        defaultValue: "true",
        options: [
          { label: "switch_ON", value: "true" },
          { label: "switch_OFF", value: "false" },
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
      <Toggle
        size={v.size as ToggleSize}
        checked={v.checked === "true"}
        disabled={v.disabled === "true"}
        readOnly
        aria-label="Toggle preview"
      />
    ),
  },
  showcases: [
    {
      title: "ON and OFF",
      render: () => (
        <>
          <Toggle defaultChecked aria-label="switch_ON" />
          <Toggle aria-label="switch_OFF" />
        </>
      ),
    },
    {
      title: "Sizes",
      description: "lg and md are confirmed to share the same 40×24 box.",
      render: () => (
        <>
          <Toggle size="lg" aria-label="lg" />
          <Toggle size="md" aria-label="md" />
          <Toggle size="sm" aria-label="sm" />
        </>
      ),
    },
    {
      title: "Disabled",
      description: "Both switch_ON_disabled and switch_OFF_disabled are confirmed states.",
      render: () => (
        <>
          <Toggle disabled aria-label="switch_OFF_disabled" />
          <Toggle disabled defaultChecked aria-label="switch_ON_disabled" />
        </>
      ),
    },
  ],
};
