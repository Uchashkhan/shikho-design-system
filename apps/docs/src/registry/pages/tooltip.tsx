import { Tooltip, type TooltipDirection } from "@shikho/ui";
import type { ComponentPageConfig } from "./types";

const DIRECTIONS: TooltipDirection[] = [
  "top_left",
  "top_center",
  "top_right",
  "botom_left",
  "bottom_center",
  "botom_right",
  "left_center",
  "right_center",
];

const SAMPLE_DESCRIPTION = "Gas prices are currently high. It's advisable to delay the transaction for a while.";

/** Tooltip must be rendered inside a `position: relative` anchor — see the component's own docs. */
function Anchor({ direction, full = false }: { direction: TooltipDirection; full?: boolean }) {
  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        padding: "12px 20px",
        background: "var(--sk-surface-muted, #e5e7eb)",
        borderRadius: 6,
        fontSize: 13,
      }}
    >
      Anchor
      <Tooltip
        direction={direction}
        heading="Heading"
        description={full ? SAMPLE_DESCRIPTION : undefined}
        secondaryAction={full ? { label: "Learn more" } : undefined}
        primaryAction={full ? { label: "Got it" } : undefined}
      />
    </div>
  );
}

export const pageConfig: ComponentPageConfig = {
  longDescription:
    "A ground-truth re-audit (get_design_context across all 8 direction values) found the previous implementation was rendering a bare, contentless box — no heading, no description, no actions, no pointer. Tooltip is actually a rich card: a heading, a description, two CTA buttons (a gray secondary action and a primary/500-filled action), and a real rounded-tip pointer arrow, at a fixed 240px width. The tooltip's placement relative to its anchor was re-derived from the confirmed pointer direction: top_* now renders BELOW its anchor and botom_*/bottom_center renders ABOVE it — the opposite of the naive \"top means above\" convention, because the pointer must visually point toward the anchor.",
  variants: [
    {
      name: "direction",
      values: DIRECTIONS,
      note: "The only Figma variant property. botom_left/botom_right preserve a confirmed spelling typo (missing the second \"t\" in \"bottom\") sitting right next to the correctly-spelled bottom_center — kept verbatim, not corrected.",
    },
  ],
  states: [],
  gaps: [
    "The tip's fill (white), border (gray/100, omitted on the edge touching the pointer), radius (16px), and the elevation/e3-based wrapper shadow are all confirmed directly via get_design_context — no longer derived by analogy.",
    "The anchor-relative positioning (top/bottom/left/right offset from a position: relative parent) is NOT part of Figma's confirmed direction variant — only the internal tip+pointer visual is confirmed. The offset direction was derived from the confirmed pointer geometry (the pointer must point toward the anchor), not an arbitrary choice.",
    "No anchor/trigger/portal positioning mechanism was confirmed. direction is implemented as standard CSS absolute positioning relative to a position: relative parent, not a floating-UI-style engine.",
    "No show/hide/trigger behavior is implemented — visibility, hover/focus triggering and delay logic are left to the consumer.",
    "Corner pointer offset (how far the pointer sits from the tip's corner for top_left/top_right/botom_left/botom_right) is approximated with a simple centered/flush placement rather than reproducing Figma's own padded pointer asset technique exactly.",
  ],
  usageExample: `import { Tooltip } from "@shikho/ui";

function Example() {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      Hover me
      <Tooltip
        direction="bottom_center"
        heading="Heads up"
        description="Some helpful detail."
        secondaryAction={{ label: "Learn more" }}
        primaryAction={{ label: "Got it", onClick: () => {} }}
      />
    </div>
  );
}`,
  props: [
    { name: "direction", type: "8 confirmed values", description: "The only Figma variant property. Positions the bubble relative to a position: relative anchor." },
    { name: "heading", type: "ReactNode", description: "Confirmed boolean-gated content slot, SemiBold 13/20." },
    { name: "description", type: "ReactNode", description: "Confirmed boolean-gated content slot, Medium 12/16." },
    { name: "secondaryAction", type: "{ label: ReactNode; onClick?: () => void }", description: "Confirmed gray secondary CTA (Figma's button1)." },
    { name: "primaryAction", type: "{ label: ReactNode; onClick?: () => void }", description: "Confirmed primary/500-filled CTA (Figma's button2)." },
    { name: "…", type: "HTMLAttributes<HTMLDivElement>", description: "Rendered as a real <div role=\"tooltip\">; other native props are forwarded." },
  ],
  preview: () => <Anchor direction="bottom_center" full />,
  playground: {
    controls: [
      {
        prop: "direction",
        label: "Direction",
        defaultValue: "bottom_center",
        options: DIRECTIONS.map((v) => ({ label: v, value: v })),
      },
    ],
    render: (v) => <Anchor direction={v.direction as TooltipDirection} full />,
  },
  showcases: [
    {
      title: "All eight directions",
      description: "The tooltip's position relative to the anchor is derived from its confirmed pointer direction (top_* renders below the anchor, botom_*/bottom_center renders above it).",
      layout: "stack",
      render: () => (
        <>
          {DIRECTIONS.map((direction) => (
            <div key={direction} style={{ marginBottom: 48 }}>
              <Anchor direction={direction} />
            </div>
          ))}
        </>
      ),
    },
    {
      title: "Full composition",
      description: "Heading, description, and both CTA buttons together — the confirmed rich card.",
      render: () => <Anchor direction="bottom_center" full />,
    },
    {
      title: "The confirmed spelling typo",
      description: "botom_left / botom_right sit right next to the correctly-spelled bottom_center — preserved verbatim, not corrected.",
      render: () => (
        <>
          <Anchor direction="botom_left" />
          <Anchor direction="bottom_center" />
        </>
      ),
    },
  ],
};
