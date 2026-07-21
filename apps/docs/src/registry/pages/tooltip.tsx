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

/** Tooltip must be rendered inside a `position: relative` anchor — see the component's own docs. */
function Anchor({ children }: { children: React.ReactNode }) {
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
      {children}
    </div>
  );
}

export const pageConfig: ComponentPageConfig = {
  longDescription:
    "The sparsest audit in the entire library: overview-level only, no get_design_context deep audit, and no sibling audit to cross-reference an applied visual from (unlike Radio, which could borrow Checkbox's styling via List). Only the direction enum and its two bounding-box widths are ground truth — fill, text colour, radius and shadow are all documented derived choices, reusing the same \"white card\" surface pattern already established for Alert, Toast and Field.",
  variants: [
    {
      name: "direction",
      values: DIRECTIONS,
      note: "The only confirmed property. botom_left/botom_right preserve a confirmed spelling typo (missing the second \"t\" in \"bottom\") sitting right next to the correctly-spelled bottom_center — kept verbatim, not corrected.",
    },
  ],
  states: [],
  gaps: [
    "No size, type, or state property exists at all — direction is the only confirmed property on this component set.",
    "Fill (white) and text colour (gray-950) are not confirmed applied to tooltip — no deep audit exists, and no sibling audit nests a tooltip instance. Reused from the \"white card\" pattern elsewhere in the system, not a confirmed binding.",
    "Radius uses radius/custom/sm since it's the only radius token present in the export, but the audit could not confirm whether it's genuinely applied here or simply unbound in this subtree.",
    "Shadow uses elevation.e3 — resolved in this exact audit context, but application to the tooltip itself is not confirmed, the same caveat every effect token in this export carries.",
    "Whether an arrow/pointer, title, description, button, icon or any other internal layer exists was never confirmed. None of these are implemented — Tooltip renders only a plain content bubble.",
    "No anchor/trigger/portal positioning mechanism was confirmed. direction is implemented as standard CSS absolute positioning relative to a position: relative parent, not a floating-UI-style engine.",
    "No show/hide/trigger behavior is implemented — visibility, hover/focus triggering and delay logic are left to the consumer.",
  ],
  usageExample: `import { Tooltip } from "@shikho/ui";

function Example() {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      Hover me
      <Tooltip direction="top_center">Helpful text</Tooltip>
    </div>
  );
}`,
  props: [
    { name: "direction", type: "8 confirmed values", description: "The only confirmed property. Positions the bubble relative to a position: relative anchor." },
    { name: "children", type: "ReactNode", description: "Plain content bubble — no title/description slot split exists." },
    { name: "…", type: "HTMLAttributes<HTMLDivElement>", description: "Rendered as a real <div role=\"tooltip\">; other native props are forwarded." },
  ],
  preview: () => (
    <Anchor>
      <Tooltip direction="top_center">Helpful text</Tooltip>
    </Anchor>
  ),
  playground: {
    controls: [
      {
        prop: "direction",
        label: "Direction",
        defaultValue: "top_center",
        options: DIRECTIONS.map((v) => ({ label: v, value: v })),
      },
    ],
    render: (v) => (
      <Anchor>
        <Tooltip direction={v.direction as TooltipDirection}>Helpful text</Tooltip>
      </Anchor>
    ),
  },
  showcases: [
    {
      title: "All eight directions",
      description: "The six vertically-oriented placements are 240×152; left_center/right_center are 240×144.",
      layout: "stack",
      render: () => (
        <>
          {DIRECTIONS.map((direction) => (
            <div key={direction} style={{ marginBottom: 48 }}>
              <Anchor>
                <Tooltip direction={direction}>{direction}</Tooltip>
              </Anchor>
            </div>
          ))}
        </>
      ),
    },
    {
      title: "The confirmed spelling typo",
      description: "botom_left / botom_right sit right next to the correctly-spelled bottom_center — preserved verbatim, not corrected.",
      render: () => (
        <>
          <Anchor>
            <Tooltip direction="botom_left">botom_left</Tooltip>
          </Anchor>
          <Anchor>
            <Tooltip direction="bottom_center">bottom_center</Tooltip>
          </Anchor>
        </>
      ),
    },
  ],
};
