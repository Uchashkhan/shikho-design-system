import { ButtonGroup, type ButtonGroupSize } from "@shikho/ui";
import type { ComponentPageConfig } from "./types";

const SIZES: ButtonGroupSize[] = ["xs", "sm", "md", "lg", "xl"];

const swatch = (
  <span style={{ display: "block", width: 14, height: 14, background: "#ffffff", borderRadius: 3, opacity: 0.8 }} />
);

export const pageConfig: ComponentPageConfig = {
  longDescription:
    "Deep-audited at size=xs, count=3 — the first Button-family audit to resolve several previously-unattributed spacing tokens from the standalone buttons audit itself. Zero gap between segments is confirmed two independent ways (arithmetic across all five sizes/counts, and directly via get_design_context), and the first/last segments get outer-corner rounding plus a full border while every segment in between is square with only a top/bottom border — the seamless joined look comes from that omission, not an overlap trick.",
  variants: [
    { name: "size", values: SIZES, note: "Confirmed — the same \"Scale A\" used by button_danger, button_success, Greyscale and icon_button. Only xs was deep-audited for padding/typography." },
    {
      name: "count",
      values: ["2", "3", "4", "5", "6"],
      note: "Confirmed supported range. Not modeled as a numeric prop — it's the length of the items array actually rendered.",
    },
  ],
  states: [],
  gaps: [
    "No type or state property exists on button_group itself — segments are confirmed nested Button-type instances, but no specific sub-family (e.g. button_danger) was confirmed as the source.",
    "Only xs's padding and typography were deep-audited. sm/md/lg/xl reuse the standalone Button family's own derived padding scale, with xs replaced by this family's newly confirmed exact value.",
    "The uniform Color/secondary/500 fill and white label colour come from the one audited instance's overrides, applied uniformly since there's no type property to vary it by — the same reasoning already used for Alert's one confirmed severity.",
    "secondary_button_effect (a 4-layer inner+drop-shadow composite) is confirmed actually applied, but not implemented — the same explicit decision already made for every standalone Button family, since @shikho/tokens has no effects category yet.",
    "Whether count=4/5/6 repeat the identical square/top-bottom-border middle-segment treatment for every additional middle segment was never inspected — only count=3 (one middle segment) was deep-audited. This implementation applies the same treatment to every non-edge segment.",
    "A confirmed 1-2px width discrepancy vs. standalone buttons of the same size step exists in the audit, but the mechanism is unconfirmed and not reproduced here — this implementation's Hug sizing derives naturally from padding and content.",
  ],
  usageExample: `import { ButtonGroup } from "@shikho/ui";

function ViewToggle() {
  return (
    <ButtonGroup
      size="md"
      items={[
        { label: "Day" },
        { label: "Week" },
        { label: "Month" },
      ]}
    />
  );
}`,
  props: [
    { name: "size", type: "xs | sm | md | lg | xl", defaultValue: "md", description: "Confirmed Scale A sizing. Only xs's padding/typography are deep-audited." },
    { name: "items", type: "{ label: ReactNode; leftIcon?: ReactNode; rightIcon?: ReactNode }[]", description: "One entry per segment. Confirmed supported range is 2-6." },
  ],
  preview: () => (
    <ButtonGroup
      size="md"
      items={[{ label: "One" }, { label: "Two" }, { label: "Three" }]}
    />
  ),
  playground: {
    controls: [
      {
        prop: "size",
        label: "Size",
        defaultValue: "md",
        options: SIZES.map((v) => ({ label: v, value: v })),
      },
      {
        prop: "count",
        label: "Segment count",
        defaultValue: "3",
        options: ["2", "3", "4", "5", "6"].map((v) => ({ label: v, value: v })),
      },
    ],
    render: (v) => (
      <ButtonGroup
        size={v.size as ButtonGroupSize}
        items={Array.from({ length: Number(v.count) }, (_, i) => ({ label: `${i + 1}` }))}
      />
    ),
  },
  showcases: [
    {
      title: "All five confirmed sizes",
      layout: "stack",
      render: () => (
        <>
          {SIZES.map((size) => (
            <div key={size} style={{ marginBottom: 12 }}>
              <ButtonGroup
                size={size}
                items={[{ label: "One" }, { label: "Two" }, { label: "Three" }]}
              />
            </div>
          ))}
        </>
      ),
    },
    {
      title: "The confirmed 2-6 segment range",
      description: "No count=1, no count=7+ variant exists in the audited component set.",
      layout: "stack",
      render: () => (
        <>
          {[2, 3, 4, 5, 6].map((count) => (
            <div key={count} style={{ marginBottom: 12 }}>
              <ButtonGroup items={Array.from({ length: count }, (_, i) => ({ label: `${i + 1}` }))} />
            </div>
          ))}
        </>
      ),
    },
    {
      title: "Icon slots",
      description: "Confirmed 14×14, sharing the same elevation.e2 icon shadow used across the rest of the library.",
      render: () => (
        <ButtonGroup
          items={[
            { label: "Left", leftIcon: swatch },
            { label: "Both", leftIcon: swatch, rightIcon: swatch },
            { label: "Right", rightIcon: swatch },
          ]}
        />
      ),
    },
    {
      title: "First / middle / last corner and border treatment",
      description: "Outer segments get one rounded corner and a full border; every middle segment is square with only a top/bottom border.",
      render: () => (
        <ButtonGroup
          items={[{ label: "First" }, { label: "Middle" }, { label: "Middle" }, { label: "Last" }]}
        />
      ),
    },
  ],
};
