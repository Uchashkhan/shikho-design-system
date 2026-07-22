import { useState } from "react";
import { Progress } from "@shikho/ui";
import type { ComponentPageConfig } from "./types";

function InteractivePreview() {
  const [value, setValue] = useState(35);
  return (
    <div style={{ width: 176 }}>
      <Progress value={value} onChange={setValue} aria-label="Media progress" />
    </div>
  );
}

export const pageConfig: ComponentPageConfig = {
  longDescription:
    "The original overview audit was the least developed in the entire series: an unrenamed Figma default property (Property 1), only 2 values, and a flagged dimensional match between the Load More value and pagination's own load_more variant. A deep re-audit confirms Load More is a byte-identical duplicate of the already-shipped LoadMorePagination — same layer structure, same copy, same styling — and is not re-implemented here. Media is the only genuinely new content: a confirmed scrubber/seek-bar with a track, a fill, and a draggable circular handle.",
  variants: [],
  states: [],
  gaps: [
    "Property 1=Load More is confirmed to be the exact same component as LoadMorePagination (pagination family) — not reproduced here. Use LoadMorePagination directly for that widget.",
    "The handle's exact fill color isn't independently confirmed beyond the screenshot (a lighter-blue circle) — color.primary[300] is used as the closest confirmed ramp member, not an exact confirmed hex.",
    "No interaction data exists in a static Figma export — this is implemented as a real, functional, draggable slider (a native input type=\"range\", styled to match) rather than a static, inert bar.",
  ],
  usageExample: `import { Progress } from "@shikho/ui";

function MediaScrubber() {
  const [position, setPosition] = useState(35);
  return (
    <Progress
      value={position}
      min={0}
      max={100}
      onChange={setPosition}
      aria-label="Playback position"
    />
  );
}`,
  props: [
    { name: "value", type: "number", description: "Current position, clamped to [min, max]." },
    { name: "min / max", type: "number", defaultValue: "0 / 100", description: "The confirmed track's full range." },
    { name: "onChange", type: "(value: number) => void", description: "Fires as the handle is dragged." },
    { name: "…", type: "InputHTMLAttributes<HTMLInputElement>", description: "Rendered as a real range input under the hood; other native props are forwarded." },
  ],
  preview: () => <InteractivePreview />,
  playground: {
    controls: [
      {
        prop: "value",
        label: "Value",
        defaultValue: "35",
        options: ["0", "25", "35", "50", "75", "100"].map((v) => ({ label: v, value: v })),
      },
    ],
    render: (v) => (
      <div style={{ width: 176 }}>
        <Progress value={Number(v.value)} aria-label="Media progress" />
      </div>
    ),
  },
  showcases: [
    {
      title: "Confirmed scrubber structure",
      description: "Track (radius.md, gray-200), fill (radius.full, primary-500), and handle at the fill's leading edge.",
      render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 176 }}>
          <Progress value={0} aria-label="Empty" />
          <Progress value={35} aria-label="Partial" />
          <Progress value={100} aria-label="Full" />
        </div>
      ),
    },
    {
      title: "A real, draggable slider",
      description: "No interaction data exists in a static Figma export — implemented as a functional control, not a static bar.",
      render: () => <InteractivePreview />,
    },
  ],
};
