import { DatePicker, type DatePickerSize, type DatePickerType } from "@shikho/ui";
import type { ComponentPageConfig } from "./types";

const TYPES: DatePickerType[] = ["single", "range"];
const SIZES: DatePickerSize[] = ["md", "lg"];

export const pageConfig: ComponentPageConfig = {
  longDescription:
    "The original overview-level audit deliberately never ran get_design_context, so an earlier version of this component was a placeholder shell. A deep structural re-audit (docs/audit/date-picker-deep-audit.md) has since confirmed the real internal hierarchy — a presets sidebar, one or two calendar panels, and a footer — across all four type/size variants, including a genuine \"row-segmented pill\" range-highlight algorithm and a confirmed reuse of the Input family's own Field component for the footer date display.",
  variants: [
    { name: "type", values: TYPES, note: "single renders exactly one calendar panel; range renders two, separated by a divider, each with its own nav controls." },
    { name: "size", values: SIZES, note: "Confirmed per-size composition: 200px/48px cells at lg vs. 160px/40px cells at md." },
  ],
  states: [],
  gaps: [
    "Hover styling on day cells and preset items is not confirmed by any instance — it reuses the Color/gray/100 resting fill already confirmed on this component's own nav buttons.",
    "Disabled dates have no confirmed visual anywhere in the audit — isDateDisabled is purely functional, using the same opacity: 0.5 convention as every other disabled control in this library.",
    "Preset date-range arithmetic (e.g. \"Last 7 days\") is the ordinary interpretation of each label — a visual audit cannot confirm date math by definition.",
    "The shell no longer hardcodes the static frame's literal 408px/352px height — it hugs its content so a 6-week month isn't clipped, a deliberate improvement over reproducing a demo-specific pixel height.",
    "A genuine one-off confirmed via a second get_design_context call: type=single, size=md hides the footer date field and stretches Cancel/Set Date full-width; every other combination shows the field(s) with right-aligned buttons.",
    "Month/year jump picker, time selection, and mobile-specific layout are all confirmed absent — none is implemented.",
  ],
  usageExample: `import { DatePicker, type DateRangeValue } from "@shikho/ui";

function ReportDateRange() {
  const [applied, setApplied] = useState<DateRangeValue | null>(null);

  return (
    <DatePicker
      type="range"
      size="lg"
      onApply={(value) => setApplied(value)}
      onCancel={() => {/* close without applying */}}
    />
  );
}`,
  props: [
    { name: "type", type: "single | range", defaultValue: "single", description: "single renders one calendar panel; range renders two." },
    { name: "size", type: "lg | md", defaultValue: "md", description: "Confirmed per-size sidebar width and calendar cell size." },
    { name: "value / defaultValue / onChange", type: "DateRangeValue / (value) => void", description: "Controlled/uncontrolled selection, fires live as dates are picked." },
    { name: "onApply / onCancel", type: "(value) => void / () => void", description: "Fire on Set Date / Cancel respectively." },
    { name: "month / defaultMonth / onMonthChange", type: "Date", description: "The anchor (left) panel's visible month. The range type's right panel always shows anchor + 1 month." },
    { name: "presets", type: "DatePickerPreset[] | false", defaultValue: "DATE_PICKER_PRESETS", description: "The 7 confirmed presets. Pass false to hide the sidebar." },
    { name: "isDateDisabled", type: "(date: Date) => boolean", description: "Functional only — no confirmed disabled visual exists." },
    { name: "showFooterInputs", type: "boolean", description: "Overrides the confirmed single+md default of hiding the footer date field(s)." },
  ],
  preview: () => (
    <DatePicker
      type="single"
      size="md"
      defaultMonth={new Date(2024, 10, 1)}
      defaultValue={{ start: new Date(2024, 10, 17), end: new Date(2024, 10, 17) }}
      presets={false}
    />
  ),
  playground: {
    controls: [
      {
        prop: "type",
        label: "Type",
        defaultValue: "single",
        options: TYPES.map((v) => ({ label: v, value: v })),
      },
      {
        prop: "size",
        label: "Size",
        defaultValue: "md",
        options: SIZES.map((v) => ({ label: v, value: v })),
      },
    ],
    render: (v) => (
      <DatePicker
        type={v.type as DatePickerType}
        size={v.size as DatePickerSize}
        defaultMonth={new Date(2024, 10, 1)}
      />
    ),
  },
  showcases: [
    {
      title: "Single vs. range layout",
      description: "single renders one calendar panel; range renders two, side by side, sharing one presets sidebar.",
      layout: "stack",
      render: () => (
        <>
          <div style={{ marginBottom: 16 }}>
            <DatePicker type="single" size="md" defaultMonth={new Date(2024, 10, 1)} />
          </div>
          <DatePicker type="range" size="md" defaultMonth={new Date(2024, 10, 1)} />
        </>
      ),
    },
    {
      title: "Confirmed row-segmented range highlight",
      description: "A pre-selected range shows the audit's own confirmed pill styling: rounded absolute start/end, rounded row-start/row-end mid-range cells, flat cells in between.",
      render: () => (
        <DatePicker
          type="range"
          size="lg"
          presets={false}
          defaultMonth={new Date(2024, 10, 1)}
          defaultValue={{ start: new Date(2024, 10, 7), end: new Date(2024, 11, 12) }}
        />
      ),
    },
    {
      title: "The confirmed single+md footer difference",
      description: "Only this exact combination hides the footer date field and stretches Cancel/Set Date to fill the width.",
      layout: "stack",
      render: () => (
        <>
          <div style={{ marginBottom: 16 }}>
            <DatePicker type="single" size="md" presets={false} defaultMonth={new Date(2024, 10, 1)} />
          </div>
          <DatePicker type="single" size="lg" presets={false} defaultMonth={new Date(2024, 10, 1)} />
        </>
      ),
    },
  ],
};
