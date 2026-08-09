import {
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
  useEffect,
  useMemo,
  useState,
} from "react";
import { color, elevation, radius } from "@shikho/tokens";
import { Field } from "../input";
import { GreyscaleButton, NewBlueButton } from "../button";
import {
  WEEKDAY_LABELS,
  addMonths,
  formatFooterDate,
  formatMonthLabel,
  getMonthGrid,
  isBefore,
  isSameDay,
  isWithin,
  startOfDay,
  startOfMonth,
  type CalendarCell,
} from "./date-utils";

// docs/audit/date-picker-deep-audit.md §1-§3 — date_picker: type (range, single) × size (lg,
// md), confirmed via get_design_context. No `state` property exists at the component-set level.
export type DatePickerType = "range" | "single";
export type DatePickerSize = "lg" | "md";

export interface DateRangeValue {
  start: Date | null;
  end: Date | null;
}

export interface DatePickerPreset {
  label: string;
  getValue: () => DateRangeValue;
}

// docs/audit/date-picker-deep-audit.md §4 — the 7 confirmed preset labels, in confirmed order.
// The date arithmetic behind each is NOT Figma-confirmed (a visual audit cannot confirm date
// math) — this is the ordinary, unambiguous interpretation of each label, documented as derived.
function daysAgo(n: number): Date {
  const d = startOfDay(new Date());
  d.setDate(d.getDate() - n);
  return d;
}
function monthsAgo(n: number): Date {
  return addMonths(startOfDay(new Date()), -n);
}

export const DATE_PICKER_PRESETS: DatePickerPreset[] = [
  { label: "Today", getValue: () => ({ start: startOfDay(new Date()), end: startOfDay(new Date()) }) },
  { label: "Last 7 days", getValue: () => ({ start: daysAgo(6), end: startOfDay(new Date()) }) },
  { label: "Last 14 days", getValue: () => ({ start: daysAgo(13), end: startOfDay(new Date()) }) },
  { label: "Last 30 days", getValue: () => ({ start: daysAgo(29), end: startOfDay(new Date()) }) },
  { label: "Last 3 months", getValue: () => ({ start: monthsAgo(3), end: startOfDay(new Date()) }) },
  { label: "Last 12 months", getValue: () => ({ start: monthsAgo(12), end: startOfDay(new Date()) }) },
  // "All time" has no natural start date — interpreted as "clear the filter", a derived reading
  // of an inherently ambiguous label, not a Figma-confirmed value.
  { label: "All time", getValue: () => ({ start: null, end: null }) },
];

// docs/audit/date-picker-deep-audit.md §3 — confirmed per-size composition.
const SIDEBAR_WIDTH: Record<DatePickerSize, number> = { lg: 200, md: 160 };
const CELL_SIZE: Record<DatePickerSize, number> = { lg: 48, md: 40 };

// docs/audit/date-picker-deep-audit.md §1 — shell shadow/radius/fill, confirmed on all 4 instances.
const shellShadow = elevation.e4
  .map((l) => `${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${l.color}`)
  .join(", ");
// The two-layer inset overlay confirmed on the nav buttons, row-segment/mid-range day cells, and
// preset items (§5, §8) — the inner-shadow half of the confirmed secondary_button_effect.
const restingInsetShadow = `inset 0px 1px 3px -2px ${color.white[50]}, inset 0px -1px 3px -2px rgba(0,0,0,0.07)`;
// The full overlay confirmed on range-start/range-end/single-selected day cells and the Set Date
// CTA (§8) — the inner-shadow half of the confirmed primary_button_effect.
const selectedInsetShadow = `inset 0px 3px 4px -3px ${color.white[600]}, inset 0px 0px 8px -2px ${color.white[500]}`;

interface DayRole {
  isSelectedSingle: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
  isRowStart: boolean;
  isRowEnd: boolean;
}

function getDayRole(
  cell: CalendarCell,
  type: DatePickerType,
  value: DateRangeValue,
  columnIndex: number,
): DayRole {
  const { start, end } = value;
  const isSelectedSingle = type === "single" && isSameDay(cell.date, start);
  const isRangeStart = type === "range" && !!start && isSameDay(cell.date, start);
  const isRangeEnd = type === "range" && !!end && isSameDay(cell.date, end);
  const isInRange = type === "range" && !!start && !!end && isWithin(cell.date, start, end);
  return {
    isSelectedSingle,
    isRangeStart,
    isRangeEnd,
    isInRange,
    isRowStart: columnIndex === 0,
    isRowEnd: columnIndex === 6,
  };
}

/** docs/audit/date-picker-deep-audit.md §8 — the confirmed row-segmented range pill styling. */
function dayCellStyle(role: DayRole, inCurrentMonth: boolean, disabled: boolean) {
  const isEdgeSelection = role.isRangeStart || role.isRangeEnd || role.isSelectedSingle;
  const isMidRangeCell = role.isInRange && !isEdgeSelection;

  // Left corners round when this cell is the range's absolute start, a single selection, or a
  // mid-range cell that happens to sit at the start of its calendar row (§8's "row-segment
  // start" finding). Right corners follow the mirror rule for range end / row end.
  const roundLeft = role.isRangeStart || role.isSelectedSingle || (isMidRangeCell && role.isRowStart);
  const roundRight = role.isRangeEnd || role.isSelectedSingle || (isMidRangeCell && role.isRowEnd);
  const cornerRadius = (rounded: boolean) => (rounded ? radius.md : role.isInRange ? 0 : radius.md);

  return {
    borderTopLeftRadius: cornerRadius(roundLeft),
    borderBottomLeftRadius: cornerRadius(roundLeft),
    borderTopRightRadius: cornerRadius(roundRight),
    borderBottomRightRadius: cornerRadius(roundRight),
    backgroundColor: isEdgeSelection
      ? color.primary[500]
      : role.isInRange
        ? `${color.primary[500]}1f`
        : "transparent",
    color: !inCurrentMonth
      ? color.gray[400]
      : isEdgeSelection
        ? color.white[950]
        : role.isInRange
          ? color.primary[600]
          : color.gray[700],
    border: isEdgeSelection ? "1px solid rgba(0,0,0,0.12)" : "none",
    boxShadow: isEdgeSelection ? selectedInsetShadow : role.isInRange ? restingInsetShadow : "none",
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? "not-allowed" : inCurrentMonth ? "pointer" : "default",
    pointerEvents: disabled || !inCurrentMonth ? ("none" as const) : ("auto" as const),
  };
}

interface CalendarPanelProps {
  month: Date;
  size: DatePickerSize;
  type: DatePickerType;
  value: DateRangeValue;
  isDateDisabled?: (date: Date) => boolean;
  onSelectDate: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 18 18" width={18} height={18} fill="none" aria-hidden>
      <path d="M11 3.5 5.5 9l5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 18 18" width={18} height={18} fill="none" aria-hidden>
      <path d="m7 3.5 5.5 5.5L7 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NavButton({ onClick, label, children }: { onClick: () => void; label: string; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // P1 repair: confirmed 42px wide (18px icon + 12px padding each side), not 40.
        width: 42,
        height: 40,
        padding: "0.5rem 0.75rem", // px-12 py-8 — confirmed §5
        borderRadius: radius.md,
        border: "none",
        backgroundColor: color.gray[100],
        boxShadow: "0px 1px 1px -0.5px rgba(0,0,0,0.04)",
        color: color.gray[700],
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function CalendarPanel({
  month,
  size,
  type,
  value,
  isDateDisabled,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: CalendarPanelProps) {
  const weeks = useMemo(() => getMonthGrid(month), [month]);
  const cellSize = CELL_SIZE[size];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem", // spacing/16 — §5
        paddingBottom: "1rem",
        flex: "1 0 0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", width: "100%" }}>
        <NavButton onClick={onPrevMonth} label="Previous month">
          <ChevronLeftIcon />
        </NavButton>
        <p style={{ fontSize: 18, lineHeight: "24px", fontWeight: 600, color: color.gray[950], margin: 0 }}>
          {formatMonthLabel(month)}
        </p>
        <NavButton onClick={onNextMonth} label="Next month">
          <ChevronRightIcon />
        </NavButton>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "0 1rem", width: "100%" }}>
        <div
          role="row"
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: cellSize * 7,
            padding: "0.5rem 0",
            fontSize: 11,
            lineHeight: "16px",
            fontWeight: 500,
            color: color.gray[400],
            textTransform: "uppercase",
          }}
        >
          {WEEKDAY_LABELS.map((label) => (
            <span key={label} style={{ width: cellSize, textAlign: "center" }}>
              {label}
            </span>
          ))}
        </div>

        <div role="grid" aria-label={formatMonthLabel(month)} style={{ width: "100%" }}>
          {weeks.map((week, weekIndex) => (
            <div role="row" key={weekIndex} style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              {week.map((cell, columnIndex) => {
                const role = getDayRole(cell, type, value, columnIndex);
                const disabled = isDateDisabled?.(cell.date) ?? false;
                const styleResult = dayCellStyle(role, cell.inCurrentMonth, disabled);
                const isToday = isSameDay(cell.date, startOfDay(new Date()));

                return (
                  <button
                    key={cell.date.toISOString()}
                    type="button"
                    role="gridcell"
                    aria-selected={role.isSelectedSingle || role.isRangeStart || role.isRangeEnd}
                    aria-disabled={disabled || !cell.inCurrentMonth || undefined}
                    aria-current={isToday ? "date" : undefined}
                    disabled={disabled}
                    tabIndex={cell.inCurrentMonth ? 0 : -1}
                    onClick={() => cell.inCurrentMonth && !disabled && onSelectDate(cell.date)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: cellSize,
                      height: 40,
                      padding: "0.5rem 0.75rem",
                      border: styleResult.border,
                      borderTopLeftRadius: styleResult.borderTopLeftRadius,
                      borderBottomLeftRadius: styleResult.borderBottomLeftRadius,
                      borderTopRightRadius: styleResult.borderTopRightRadius,
                      borderBottomRightRadius: styleResult.borderBottomRightRadius,
                      backgroundColor: styleResult.backgroundColor,
                      boxShadow: styleResult.boxShadow,
                      color: styleResult.color,
                      opacity: styleResult.opacity,
                      cursor: styleResult.cursor,
                      pointerEvents: styleResult.pointerEvents,
                      fontSize: 13,
                      lineHeight: "20px",
                      fontWeight: 600,
                    }}
                  >
                    <span style={{ padding: "0 0.25rem" }}>{cell.date.getDate()}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export interface DatePickerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange" | "defaultValue"> {
  type?: DatePickerType;
  size?: DatePickerSize;
  /** Controlled selection value. Omit for uncontrolled usage via `defaultValue`. */
  value?: DateRangeValue;
  defaultValue?: DateRangeValue;
  /** Fires live as the user picks dates, before Set Date is clicked. */
  onChange?: (value: DateRangeValue) => void;
  /** Fires when Set Date is clicked — the confirmed "apply" action (§10). */
  onApply?: (value: DateRangeValue) => void;
  /** Fires when Cancel is clicked — the current draft is discarded (§10, requirement: "cancel
   * without applying changes"). */
  onCancel?: () => void;
  /** Anchor month for the left (or only) calendar panel. The right panel (range only) always
   * shows anchor + 1 month — a derived, standard dual-calendar convention (docs/audit/date-
   * picker-deep-audit.md §12), since exact independent-panel behavior was never confirmed. */
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  /** The 7 confirmed presets (§4). Pass `false` to hide the sidebar entirely. */
  presets?: DatePickerPreset[] | false;
  onPresetSelect?: (preset: DatePickerPreset) => void;
  /** Not a confirmed visual (§12) — purely functional: disabled dates are inert and dimmed using
   * the same opacity convention already used by every other disabled control in this library. */
  isDateDisabled?: (date: Date) => boolean;
  /** Overrides the confirmed type=single/size=md default of hiding footer date inputs (§10). */
  showFooterInputs?: boolean;
}

/**
 * `date_picker` (docs/audit/date-picker-deep-audit.md). Renders the confirmed presets sidebar,
 * one calendar panel (`type=single`) or two side-by-side panels (`type=range`), and a footer with
 * date-display fields (reusing the real `Field` component) plus Cancel/Set Date actions (reusing
 * `GreyscaleButton`/`NewBlueButton`). See the deep audit for the full confirmed-vs-derived
 * breakdown and why day cells/nav arrows are implemented inline rather than composed from a
 * Button family member (no confirmed nesting relationship, §7).
 */
export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      type = "single",
      size = "md",
      value,
      defaultValue,
      onChange,
      onApply,
      onCancel,
      month,
      defaultMonth,
      onMonthChange,
      presets = DATE_PICKER_PRESETS,
      onPresetSelect,
      isDateDisabled,
      showFooterInputs,
      style,
      ...props
    },
    ref,
  ) => {
    const isValueControlled = value !== undefined;
    const isMonthControlled = month !== undefined;

    const [committedValue, setCommittedValue] = useState<DateRangeValue>(
      value ?? defaultValue ?? { start: null, end: null },
    );
    const [draftValue, setDraftValue] = useState<DateRangeValue>(committedValue);
    const [internalMonth, setInternalMonth] = useState<Date>(
      startOfMonth(month ?? defaultMonth ?? draftValue.start ?? new Date()),
    );

    useEffect(() => {
      if (isValueControlled && value) {
        setCommittedValue(value);
        setDraftValue(value);
      }
    }, [value?.start?.getTime(), value?.end?.getTime()]);

    const anchorMonth = isMonthControlled ? startOfMonth(month as Date) : internalMonth;

    const setMonth = (next: Date) => {
      if (!isMonthControlled) setInternalMonth(next);
      onMonthChange?.(next);
    };

    const applyDraft = (next: DateRangeValue) => {
      setDraftValue(next);
      onChange?.(next);
    };

    const handleSelectDate = (date: Date) => {
      if (type === "single") {
        applyDraft({ start: date, end: date });
        return;
      }
      const { start, end } = draftValue;
      if (!start || (start && end)) {
        applyDraft({ start: date, end: null });
      } else {
        applyDraft(isBefore(date, start) ? { start: date, end: start } : { start, end: date });
      }
    };

    const handlePreset = (preset: DatePickerPreset) => {
      const next = preset.getValue();
      applyDraft(next);
      setMonth(startOfMonth(next.end ?? next.start ?? new Date()));
      onPresetSelect?.(preset);
    };

    const handleCancel = () => {
      setDraftValue(committedValue);
      onCancel?.();
    };

    const handleApply = () => {
      if (!isValueControlled) setCommittedValue(draftValue);
      onApply?.(draftValue);
    };

    // docs/audit/date-picker-deep-audit.md §10 — confirmed one-off: type=single, size=md hides
    // the footer date field(s) and stretches Cancel/Set Date to fill the width. Every other
    // combination shows the field(s) with right-aligned, natural-width CTAs.
    const showInputs = showFooterInputs ?? !(type === "single" && size === "md");

    const presetList = presets === false ? null : presets;
    const sidebarWidth = SIDEBAR_WIDTH[size];

    return (
      <div
        ref={ref}
        data-type={type}
        data-size={size}
        style={{
          display: "inline-flex",
          flexDirection: "column",
          backgroundColor: color.white[950],
          border: `1px solid ${color.gray[100]}`,
          borderRadius: radius["3xl"],
          boxShadow: shellShadow,
          overflow: "hidden",
          ...style,
        }}
        {...props}
      >
        <div style={{ display: "flex", alignItems: "stretch" }}>
          {presetList && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 0,
                width: sidebarWidth,
                flexShrink: 0,
                paddingTop: "0.5rem",
                borderRight: `1px solid ${color.gray[100]}`,
                borderTopLeftRadius: radius.lg,
                overflowY: "auto",
              }}
            >
              {presetList.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handlePreset(preset)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: 40,
                    width: "100%",
                    flexShrink: 0,
                    padding: "0.5rem 1rem",
                    border: "none",
                    background: "transparent",
                    borderRadius: radius.md,
                    fontSize: 13,
                    lineHeight: "20px",
                    fontWeight: 500,
                    color: color.gray[700],
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}

          <div style={{ display: "flex", flex: "1 0 0" }}>
            <CalendarPanel
              month={anchorMonth}
              size={size}
              type={type}
              value={draftValue}
              isDateDisabled={isDateDisabled}
              onSelectDate={handleSelectDate}
              onPrevMonth={() => setMonth(addMonths(anchorMonth, -1))}
              onNextMonth={() => setMonth(addMonths(anchorMonth, 1))}
            />

            {type === "range" && (
              <>
                <div
                  aria-hidden
                  style={{ width: 1, alignSelf: "stretch", backgroundColor: color.gray[100], margin: "0 0.5rem" }}
                />
                <CalendarPanel
                  month={addMonths(anchorMonth, 1)}
                  size={size}
                  type={type}
                  value={draftValue}
                  isDateDisabled={isDateDisabled}
                  onSelectDate={handleSelectDate}
                  onPrevMonth={() => setMonth(addMonths(anchorMonth, -1))}
                  onNextMonth={() => setMonth(addMonths(anchorMonth, 1))}
                />
              </>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            padding: "1rem",
            borderTop: `1px solid ${color.gray[100]}`,
          }}
        >
          {showInputs ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", height: 40 }}>
              <Field
                size="md"
                leftGroup={false}
                rightGroup={false}
                textContent={draftValue.start ? formatFooterDate(draftValue.start) : "DD / MM / YYYY"}
                style={{ width: 120 }}
              />
              {type === "range" && (
                <>
                  <span
                    style={{
                      fontSize: 11,
                      lineHeight: "16px",
                      fontWeight: 500,
                      color: color.gray[400],
                      textTransform: "uppercase",
                    }}
                  >
                    TO
                  </span>
                  <Field
                    size="md"
                    leftGroup={false}
                    rightGroup={false}
                    textContent={draftValue.end ? formatFooterDate(draftValue.end) : "DD / MM / YYYY"}
                    style={{ width: 120 }}
                  />
                </>
              )}
            </div>
          ) : (
            <div />
          )}

          <div style={{ display: "flex", gap: "0.75rem", flex: showInputs ? "0 0 auto" : "1 0 0" }}>
            <GreyscaleButton
              type="Secondary"
              onClick={handleCancel}
              style={{
                flex: showInputs ? "0 0 auto" : "1 0 0",
                padding: "0.5rem 0.75rem",
                borderRadius: radius.md,
                boxShadow: "0px 1px 1px -0.5px rgba(0,0,0,0.04)",
              }}
            >
              Cancel
            </GreyscaleButton>
            <NewBlueButton
              type="Primary"
              onClick={handleApply}
              style={{
                flex: showInputs ? "0 0 auto" : "1 0 0",
                padding: "0.5rem 0.75rem",
                borderRadius: radius.md,
                border: "1px solid rgba(0,0,0,0.12)",
                boxShadow: `0px 1px 1px -0.5px rgba(0,0,0,0.04), 0px 3px 3px -1.5px rgba(0,0,0,0.04), ${selectedInsetShadow}`,
              }}
            >
              Set Date
            </NewBlueButton>
          </div>
        </div>
      </div>
    );
  },
);

DatePicker.displayName = "DatePicker";
