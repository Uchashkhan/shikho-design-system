// docs/audit/pagination-deep-audit.md §2 — the confirmed page-number windowing algorithm, read
// directly off the `first`/`center`/`last` variants: always show page 1 and the last page, a
// 5-wide window of neighbors around the current page, and an ellipsis wherever a gap exceeds 1.

export type PageItem = number | "ellipsis";

const SIBLINGS = 2; // confirmed window radius — center shows current ±2 (a 5-wide run)

export function getPageWindow(current: number, total: number): PageItem[] {
  if (total <= 0) return [];
  const windowSize = SIBLINGS * 2 + 1; // 5, matching every confirmed instance

  if (total <= windowSize + 2) {
    // Small enough that the confirmed ellipsis-collapsing never triggers — show every page.
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  // Confirmed: page=first (current=1 of 10) -> 1 2 3 4 5 ... 10
  if (current <= SIBLINGS + 2) {
    const window = Array.from({ length: windowSize }, (_, i) => i + 1);
    return [...window, "ellipsis", total];
  }

  // Confirmed: page=last (current=10 of 10) -> 1 ... 6 7 8 9 10
  if (current >= total - SIBLINGS - 1) {
    const window = Array.from({ length: windowSize }, (_, i) => total - windowSize + 1 + i);
    return [1, "ellipsis", ...window];
  }

  // Confirmed: page=center (current=5 of 10) -> 1 ... 3 4 5 6 7 ... 10
  const window = Array.from({ length: windowSize }, (_, i) => current - SIBLINGS + i);
  return [1, "ellipsis", ...window, "ellipsis", total];
}
