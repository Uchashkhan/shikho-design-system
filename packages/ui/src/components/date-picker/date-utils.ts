// Pure date-math helpers for DatePicker. None of this arithmetic is Figma-confirmed — a visual
// audit cannot confirm date logic by definition (docs/audit/date-picker-deep-audit.md §12). Every
// function here is the ordinary, unambiguous interpretation needed to make the confirmed visual
// design (docs/audit/date-picker-deep-audit.md §6-§9) actually function as a real date picker.

export const WEEKDAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isBefore(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}

export function isWithin(date: Date, start: Date, end: Date): boolean {
  const t = startOfDay(date).getTime();
  return t >= startOfDay(start).getTime() && t <= startOfDay(end).getTime();
}

export function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export function addMonths(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(1); // avoid month-length overflow (e.g. Jan 31 + 1 month)
  next.setMonth(next.getMonth() + amount);
  return next;
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

/** Confirmed display format for the month header (docs/audit/date-picker-deep-audit.md §5), e.g. "Nov 2024". */
export function formatMonthLabel(date: Date): string {
  return `${MONTH_LABELS[date.getMonth()]} ${date.getFullYear()}`;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Confirmed footer date-field format (docs/audit/date-picker-deep-audit.md §10): "DD / MM / YYYY". */
export function formatFooterDate(date: Date): string {
  return `${pad2(date.getDate())} / ${pad2(date.getMonth() + 1)} / ${date.getFullYear()}`;
}

export interface CalendarCell {
  date: Date;
  inCurrentMonth: boolean;
}

/**
 * Builds a 5-or-6-row × 7-column grid for the given month, starting on Sunday (confirmed weekday
 * order, docs/audit/date-picker-deep-audit.md §6). Leading/trailing cells from the adjacent month
 * are included (confirmed rendered, muted — §8) so every row is a full week. Row count is
 * whatever the month actually needs — the real component doesn't force a fixed 5-row grid the
 * way the static Figma frames happened to show, since some months need a 6th row (§12).
 */
export function getMonthGrid(monthDate: Date): CalendarCell[][] {
  const first = startOfMonth(monthDate);
  const firstWeekday = first.getDay(); // 0 = Sunday
  const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
  const gridStart = addDays(first, -firstWeekday);

  const weeks: CalendarCell[][] = [];
  for (let week = 0; week < totalCells / 7; week++) {
    const row: CalendarCell[] = [];
    for (let day = 0; day < 7; day++) {
      const date = addDays(gridStart, week * 7 + day);
      row.push({ date, inCurrentMonth: date.getMonth() === monthDate.getMonth() });
    }
    weeks.push(row);
  }
  return weeks;
}
