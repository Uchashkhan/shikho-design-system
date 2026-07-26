import { Toggle, type ToggleSize } from "@shikho/ui";
import type { ComponentPageConfig } from "./types";

export const pageConfig: ComponentPageConfig = {
  longDescription:
    "The third and final selection-control primitive. Figma spells its states `switch_ON` / `switch_OFF` — a third distinct vocabulary, differing from both Checkbox's `checked`/`unchecked` and Radio's `active`/`inactive`. It also has the most limited state coverage of the three: no hover state, and no OFF-focused variant. A real input stays for semantics, but the track and sliding knob are now custom-rendered from the confirmed Figma layer source, not left to the browser's native checkbox rendering.",
  variants: [
    {
      name: "size",
      values: ["lg", "md", "sm"],
      note: "lg and md share an identical confirmed 40×24 outer box, but the track/knob drawn inside are confirmed different sizes between the two (lg's track is nearly edge-to-edge; md's is visibly narrower). sm is 32×20 overall.",
    },
  ],
  states: ["switch_OFF", "switch_ON", "switch_ON_focused", "switch_OFF_disabled", "switch_ON_disabled"],
  gaps: [
    "The knob is confirmed to be a stadium/pill shape (its width and height differ), not a circle, inset a uniform 2px from the track's edges on every side and size.",
    "The selected (ON) knob's checkmark and disabled knob's translucent fill are all read directly off the real SVG/layer source behind each state, not derived by analogy to Checkbox/Radio.",
    "`radius/border_radius_100` is confirmed applied to the track/knob's pill radius (both use it, at their respective sizes).",
    "`Color/disabled_base_em` is confirmed to equal `Color/gray/100`, and is applied to both disabled track states.",
    "There is no hover state and no indeterminate state — both confirmed absent from toggle's enum, unlike its two siblings.",
    "`toggle_label` is now implemented — composes a real nested `Toggle` plus a label/caption text column; unlike Checkbox/Radio, Toggle's own label is confirmed Medium/500 weight at both sizes, not Regular/400 at md.",
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
