# Pagination

Implements the `pagination` component set. The original overview audit (`docs/audit/pagination.md`) deliberately did not run `get_design_context`, and its own analysis already flagged this component set as "functionally reads as a scenario/demo showcase rather than an atomic primitive" — its 6 `page` values don't compose independent style choices, they represent different layout scenarios. A deep re-audit (`docs/audit/pagination-deep-audit.md`) confirms that assessment and goes further: **`page=load_more` is not pagination at all** — it's a structurally unrelated progress/load-more widget that happens to share the same Figma frame.

## Two components, not one

- **`Pagination`** — the real numbered navigator, covering the confirmed `first`/`center`/`last`/`less_pages`/`mobile` scenarios via props (`compact`, `layout`) rather than a Figma-style single enum.
- **`LoadMorePagination`** — the confirmed, unrelated `load_more` widget (progress bar + "Displaying X of Y" counter + button), exported separately rather than forced into `Pagination`'s prop surface. Forcing both into one component would reproduce the exact non-orthogonal design the original audit already flagged as this component set's weakest architecture.

## Confirmed vs. derived

**Exactly confirmed** (`docs/audit/pagination-deep-audit.md`):
- Prev/next icon buttons (32×32, `radius.sm`), a page-number run with the current page rendered as a solid `primary/500` pill (the same "primary pill" treatment confirmed on Date Picker, Modal, and Button Group), and an ellipsis wherever the confirmed windowing algorithm collapses a gap.
- **The exact page-number windowing algorithm**, read directly off three confirmed instances (`first`=1 of 10, `center`=5 of 10, `last`=10 of 10): always show page 1 and the last page, a 5-wide window of neighbors around the current page, ellipsis when a gap exceeds 1.
- A confirmed genuine (not spillover) application of `input_inner_shadow` on both the go-to-page input and the results-per-page control.
- `mobile`'s stacked layout confirmed to omit the go-to-page control entirely (only results-per-page remains, stacked below the page-number row).
- `less_pages`' simpler text-label-only Prev/Next treatment (no numbers, no inputs).
- `load_more`'s full structure: a 6px progress bar (`primary/300` fill on a `rgba(0,0,0,0.12)` track), a mixed-color "Displaying X of Y" counter line, and a single "Load more" button (`radius.md`, not `radius.sm` — confirmed different from the numbered variant's buttons).

**Derived, documented as such:**
- `less_pages`' confirmed orphaned "Go to page:" text label (with no accompanying input anywhere in that variant) is treated as a leftover/incomplete demo artifact and is **not reproduced** — rendering a label with no control would be non-functional.
- The results-per-page control is implemented as a real native `<select>` for genuine accessibility and functionality; Figma's own export never distinguishes a real dropdown from a custom popover (the same ambiguity found for every "dropdown"-named piece elsewhere in this system).
- No hover/focus/disabled states are confirmed anywhere on this component (`pagination.md` §4 — the weakest state coverage of any component in this audit series); native browser affordances are relied on beyond the confirmed resting/current visual treatment.

## Usage

```tsx
import { Pagination, LoadMorePagination } from "@shikho/ui";

function ResultsPager() {
  const [page, setPage] = useState(1);
  return <Pagination currentPage={page} totalPages={42} onPageChange={setPage} />;
}

function InfiniteResults() {
  const [loaded, setLoaded] = useState(35);
  return (
    <LoadMorePagination
      loaded={loaded}
      total={2979}
      itemLabel="games"
      onLoadMore={() => setLoaded((n) => n + 35)}
    />
  );
}
```

## Not implemented

- Any interaction state beyond the confirmed resting/current-page visual — no state coverage exists anywhere in the audit.
- `less_pages`' orphaned "Go to page:" label — a confirmed but non-functional demo artifact, not reproduced.

## Token dependencies

`@shikho/tokens`: `color.gray`, `color.primary`, `color.white`, `radius.sm`, `radius.md`, `radius.full`, and `elevation.e2` (used inside a CSS `filter: drop-shadow()` pair, the same pattern already confirmed on Link, Date Picker, and Modal's icon slots).
