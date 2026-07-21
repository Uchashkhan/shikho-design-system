import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker, type DateRangeValue, type DatePickerSize, type DatePickerType } from "./date_picker";

const types: DatePickerType[] = ["single", "range"];
const sizes: DatePickerSize[] = ["md", "lg"];

const meta: Meta<typeof DatePicker> = {
  title: "Date Picker/date_picker",
  component: DatePicker,
  args: { type: "single", size: "md" },
  argTypes: {
    type: { control: "select", options: types },
    size: { control: "select", options: sizes },
  },
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Playground: Story = {};

export const SingleMd: Story = {
  name: "single / md",
  args: { type: "single", size: "md" },
};

export const SingleLg: Story = {
  name: "single / lg",
  args: { type: "single", size: "lg" },
};

export const RangeMd: Story = {
  name: "range / md",
  args: { type: "range", size: "md" },
};

export const RangeLg: Story = {
  name: "range / lg",
  args: { type: "range", size: "lg" },
};

/** type="single" renders exactly one calendar panel (docs/audit/date-picker-deep-audit.md §2). */
export const OneMonthLayout: Story = {
  name: "one-month layout",
  args: { type: "single", size: "lg" },
};

/** type="range" renders two side-by-side calendar panels with an independent nav pair each. */
export const TwoMonthLayout: Story = {
  name: "two-month layout",
  args: { type: "range", size: "lg" },
};

export const Default: Story = {
  args: { type: "single", size: "md" },
};

/** A pre-selected single date (docs/audit/date-picker-deep-audit.md §8's confirmed pill treatment). */
export const SelectedDate: Story = {
  name: "selected date",
  args: {
    type: "single",
    size: "lg",
    defaultValue: { start: new Date(2024, 10, 17), end: new Date(2024, 10, 17) },
    defaultMonth: new Date(2024, 10, 1),
  },
};

/** A pre-selected range, showing the confirmed row-segmented pill styling across two panels. */
export const SelectedRange: Story = {
  name: "selected range",
  args: {
    type: "range",
    size: "lg",
    defaultValue: { start: new Date(2024, 10, 7), end: new Date(2024, 11, 12) },
    defaultMonth: new Date(2024, 10, 1),
  },
};

/**
 * Disabled dates are not a confirmed Figma visual (docs/audit/date-picker-deep-audit.md §12) —
 * shown here as a purely functional affordance (dimmed, inert), using the same opacity
 * convention already applied to every other disabled control in this library.
 */
export const DisabledDates: Story = {
  name: "disabled dates",
  args: {
    type: "single",
    size: "lg",
    defaultMonth: new Date(2024, 10, 1),
    isDateDisabled: (date: Date) => date.getDay() === 0 || date.getDay() === 6,
  },
};

/** Fully interactive: click dates to build a range, use presets, Cancel, or Set Date. */
export const InteractiveSelection: Story = {
  name: "interactive selection",
  render: (args) => {
    function Demo() {
      const [applied, setApplied] = useState<DateRangeValue | null>(null);
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
          <DatePicker
            {...args}
            onApply={(value) => setApplied(value)}
            onCancel={() => setApplied(null)}
          />
          <p style={{ fontSize: 13, color: "#5b616d" }}>
            {applied?.start
              ? `Applied: ${applied.start.toDateString()}${applied.end && applied.end !== applied.start ? ` → ${applied.end.toDateString()}` : ""}`
              : "Nothing applied yet — pick a date and click Set Date."}
          </p>
        </div>
      );
    }
    return <Demo />;
  },
  args: { type: "range", size: "lg" },
};

/** Clicking a preset (e.g. "Last 7 days") immediately fills the draft selection. */
export const PresetRangeSelection: Story = {
  name: "preset range selection",
  args: { type: "range", size: "lg" },
};
