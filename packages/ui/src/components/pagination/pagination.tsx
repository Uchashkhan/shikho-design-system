import { type HTMLAttributes, type ReactNode, forwardRef, useState } from "react";
import { color, elevation, radius } from "@shikho/tokens";
import { ChevronLeftIcon, ChevronRightIcon } from "@shikho/icons";
import { getPageWindow } from "./pagination-utils";

// docs/audit/pagination-deep-audit.md §1 — `pagination`'s single `page` property actually
// bundles three structurally distinct widgets. `Pagination` implements the confirmed real
// numbered navigator (first/center/last/mobile/less_pages); the confirmed, unrelated
// load-more/progress widget is exported separately as `LoadMorePagination` (see below) rather
// than forced into this component's prop surface, the same non-orthogonal design the original
// audit flagged as this component set's weakest architecture.

const restingInsetShadow = `inset 0px 1px 3px -2px ${color.white[50]}, inset 0px -1px 3px -2px rgba(0,0,0,0.07)`;
const primaryInsetShadow = `inset 0px 3px 4px -3px ${color.white[600]}, inset 0px 0px 8px -2px ${color.white[500]}`;
const iconShadowFilter = `drop-shadow(0px 1px 0.5px ${elevation.e2[0].color}) drop-shadow(0px 3px 1.5px ${elevation.e2[0].color})`;

/**
 * Kept LOCAL by design (P2 classification, category 4). This is pagination's results-per-page
 * dropdown caret. No exact Figma vector was downloaded for it in this pass, so promoting it to
 * `@shikho/icons` would mean shipping a hand-drawn path as if it were a confirmed shared glyph.
 * It stays inline, and is recorded as the remaining approximation debt.
 */
function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 16 16" width={16} height={16} fill="none" aria-hidden>
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconButton({ onClick, disabled, label, children }: { onClick?: () => void; disabled?: boolean; label: string; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        // P1 repair: confirmed `p-8`, not the previous 6px.
        padding: "0.5rem",
        border: "none",
        borderRadius: radius.sm,
        backgroundColor: color.gray[100],
        boxShadow: `0px 1px 1px -0.5px rgba(0,0,0,0.04), ${restingInsetShadow}`,
        color: color.gray[700],
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <span style={{ width: 18, height: 18, filter: iconShadowFilter }}>{children}</span>
    </button>
  );
}

export interface PaginationProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Confirmed `page=less_pages` treatment — text-label Prev/Next only, no page-number run. */
  compact?: boolean;
  /** Confirmed `page=mobile` treatment — pages row and results-per-page stacked vertically,
   * with the go-to-page control omitted (confirmed absent in that variant). */
  layout?: "horizontal" | "stacked";
  /** Confirmed boolean, default `true` — wraps both optional right-side pieces. */
  additionaInfo?: boolean;
  /** Confirmed boolean, default `true`. Confirmed absent when `layout="stacked"`. */
  goToPage?: boolean;
  onGoToPage?: (page: number) => void;
  /** Confirmed boolean, default `true`. */
  resultsCount?: boolean;
  resultsPerPage?: number;
  resultsPerPageOptions?: number[];
  onResultsPerPageChange?: (value: number) => void;
}

/**
 * `pagination` (docs/audit/pagination-deep-audit.md, deep-audited across all 6 `page`
 * variants). Implements the confirmed numbered navigator: prev/next icon buttons, a windowed
 * run of page-number buttons with the confirmed ellipsis-collapsing algorithm, an optional
 * go-to-page input, and an optional results-per-page control. `compact` and `layout` map onto
 * the confirmed `less_pages` and `mobile` variants respectively. See the deep audit for why
 * `load_more` is a separate component (`LoadMorePagination`), not a variant of this one.
 */
export const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      compact = false,
      layout = "horizontal",
      additionaInfo = true,
      goToPage = true,
      onGoToPage,
      resultsCount = true,
      resultsPerPage = 10,
      resultsPerPageOptions = [10, 25, 50, 100],
      onResultsPerPageChange,
      style,
      ...props
    },
    ref,
  ) => {
    const [goToValue, setGoToValue] = useState("");
    const isStacked = layout === "stacked";
    // Confirmed absent on the stacked (mobile) layout (§2).
    const showGoToPage = additionaInfo && goToPage && !isStacked;
    const showResultsCount = additionaInfo && resultsCount;

    const handleGoTo = () => {
      const page = Number(goToValue);
      if (Number.isInteger(page) && page >= 1 && page <= totalPages) {
        onGoToPage?.(page);
        onPageChange(page);
      }
      setGoToValue("");
    };

    if (compact) {
      return (
        <div ref={ref} style={{ display: "flex", alignItems: "center", gap: "1rem", ...style }} {...props}>
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              height: 32,
              padding: "0.5rem",
              border: "none",
              borderRadius: radius.sm,
              backgroundColor: color.gray[100],
              boxShadow: `0px 1px 1px -0.5px rgba(0,0,0,0.04), ${restingInsetShadow}`,
              color: color.gray[700],
              fontSize: 12,
              lineHeight: "16px",
              fontWeight: 600,
              cursor: currentPage <= 1 ? "not-allowed" : "pointer",
              opacity: currentPage <= 1 ? 0.5 : 1,
            }}
          >
            <span style={{ width: 16, height: 16, filter: iconShadowFilter }}>
              <ChevronLeftIcon />
            </span>
            Prev
          </button>
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              height: 32,
              padding: "0.5rem",
              border: "none",
              borderRadius: radius.sm,
              backgroundColor: color.gray[100],
              boxShadow: `0px 1px 1px -0.5px rgba(0,0,0,0.04), ${restingInsetShadow}`,
              color: color.gray[700],
              fontSize: 12,
              lineHeight: "16px",
              fontWeight: 600,
              cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
              opacity: currentPage >= totalPages ? 0.5 : 1,
            }}
          >
            Next
            <span style={{ width: 16, height: 16, filter: iconShadowFilter }}>
              <ChevronRightIcon />
            </span>
          </button>
        </div>
      );
    }

    const pageWindow = getPageWindow(currentPage, totalPages);

    const pagesRow = (
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <IconButton onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1} label="Previous page">
          <ChevronLeftIcon />
        </IconButton>
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          {pageWindow.map((item, index) =>
            item === "ellipsis" ? (
              <span
                key={`ellipsis-${index}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  fontSize: 12,
                  lineHeight: "16px",
                  fontWeight: 600,
                  color: color.gray[700],
                }}
              >
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                aria-current={item === currentPage ? "page" : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  border: item === currentPage ? "1px solid rgba(0,0,0,0.12)" : "none",
                  borderRadius: radius.sm,
                  backgroundColor: item === currentPage ? color.primary[500] : "transparent",
                  boxShadow:
                    item === currentPage
                      ? `0px 1px 1px -0.5px rgba(0,0,0,0.04), 0px 3px 3px -1.5px rgba(0,0,0,0.04), ${primaryInsetShadow}`
                      : "none",
                  color: item === currentPage ? color.white[950] : color.gray[700],
                  fontSize: 12,
                  lineHeight: "16px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {item}
              </button>
            ),
          )}
        </div>
        <IconButton onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} label="Next page">
          <ChevronRightIcon />
        </IconButton>
      </div>
    );

    const rightSide = (showGoToPage || showResultsCount) && (
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", justifyContent: isStacked ? "center" : "flex-end", flex: isStacked ? undefined : "1 0 0" }}>
        {showGoToPage && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: 13, lineHeight: "20px", fontWeight: 500, color: color.gray[600] }}>
              Go to page:
            </span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Number"
              value={goToValue}
              onChange={(event) => setGoToValue(event.target.value.replace(/\D/g, ""))}
              onKeyDown={(event) => event.key === "Enter" && handleGoTo()}
              style={{
                width: 64,
                padding: "0.5rem",
                border: "none",
                borderRadius: radius.sm,
                backgroundColor: color.gray[100],
                boxShadow: "inset 0px 1px 3px 0px rgba(0,0,0,0.04)",
                fontSize: 12,
                lineHeight: "16px",
                fontWeight: 500,
                color: color.gray[950],
              }}
            />
            <button
              type="button"
              onClick={handleGoTo}
              style={{
                height: 32,
                padding: "0.5rem",
                border: "none",
                borderRadius: radius.sm,
                backgroundColor: color.gray[100],
                boxShadow: `0px 1px 1px -0.5px rgba(0,0,0,0.04), ${restingInsetShadow}`,
                color: color.gray[700],
                fontSize: 12,
                lineHeight: "16px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Go
            </button>
          </div>
        )}

        {showResultsCount && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {!isStacked && <span aria-hidden style={{ width: 1, height: 24, backgroundColor: color.gray[200] }} />}
            <span style={{ fontSize: 13, lineHeight: "20px", fontWeight: 500, color: color.gray[600] }}>
              Results per page:
            </span>
            <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
              <select
                value={resultsPerPage}
                onChange={(event) => onResultsPerPageChange?.(Number(event.target.value))}
                aria-label="Results per page"
                style={{
                  appearance: "none",
                  padding: "0.5rem 1.5rem 0.5rem 0.5rem",
                  border: "none",
                  borderRadius: radius.sm,
                  backgroundColor: color.gray[100],
                  boxShadow: "inset 0px 1px 3px 0px rgba(0,0,0,0.04)",
                  fontSize: 12,
                  lineHeight: "16px",
                  fontWeight: 500,
                  color: color.gray[950],
                }}
              >
                {resultsPerPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span style={{ position: "absolute", right: 8, width: 16, height: 16, filter: iconShadowFilter, pointerEvents: "none" }}>
                <ChevronDownIcon />
              </span>
            </div>
          </div>
        )}
      </div>
    );

    return (
      <div
        ref={ref}
        style={{
          display: "flex",
          flexDirection: isStacked ? "column" : "row",
          alignItems: "center",
          gap: isStacked ? "1.5rem" : "1rem",
          ...style,
        }}
        {...props}
      >
        {pagesRow}
        {rightSide}
      </div>
    );
  },
);

Pagination.displayName = "Pagination";

export interface LoadMorePaginationProps extends HTMLAttributes<HTMLDivElement> {
  loaded: number;
  total: number;
  itemLabel?: string;
  onLoadMore?: () => void;
  loadMoreLabel?: string;
}

/**
 * `pagination` / `page=load_more` (docs/audit/pagination-deep-audit.md §1, §4) — confirmed to be
 * a structurally distinct widget bundled into the same Figma component set as the numbered
 * `Pagination`, not a variant of it: a progress bar, a "Displaying X of Y" counter, and a single
 * "Load more" button. Exported separately rather than forced into `Pagination`'s prop surface.
 */
export const LoadMorePagination = forwardRef<HTMLDivElement, LoadMorePaginationProps>(
  ({ loaded, total, itemLabel = "items", onLoadMore, loadMoreLabel = "Load more", style, ...props }, ref) => {
    const ratio = total > 0 ? Math.min(1, loaded / total) : 0;

    return (
      <div
        ref={ref}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.75rem",
          width: 176,
          ...style,
        }}
        {...props}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.375rem", width: "100%" }}>
          <div
            role="progressbar"
            aria-valuenow={loaded}
            aria-valuemin={0}
            aria-valuemax={total}
            style={{
              width: "100%",
              height: 6,
              borderRadius: radius.full,
              backgroundColor: "rgba(0,0,0,0.12)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: 6,
                width: `${ratio * 100}%`,
                borderRadius: radius.full,
                backgroundColor: color.primary[300],
              }}
            />
          </div>
          <div style={{ display: "flex", gap: "0.375rem", fontSize: 12, lineHeight: "16px", fontWeight: 600 }}>
            <span style={{ color: color.gray[950] }}>Displaying {loaded}</span>
            <span style={{ color: color.gray[600] }}>of</span>
            <span style={{ color: color.primary[500] }}>
              {total} {itemLabel}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onLoadMore}
          disabled={loaded >= total}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 40,
            padding: "0.5rem 0.75rem",
            border: "none",
            borderRadius: radius.md,
            backgroundColor: color.gray[100],
            boxShadow: `0px 1px 1px -0.5px rgba(0,0,0,0.04), ${restingInsetShadow}`,
            color: color.gray[700],
            fontSize: 13,
            lineHeight: "20px",
            fontWeight: 600,
            cursor: loaded >= total ? "not-allowed" : "pointer",
            opacity: loaded >= total ? 0.5 : 1,
          }}
        >
          {loadMoreLabel}
        </button>
      </div>
    );
  },
);

LoadMorePagination.displayName = "LoadMorePagination";
