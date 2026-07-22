import { useState } from "react";
import { LoadMorePagination, Pagination } from "@shikho/ui";
import type { ComponentPageConfig } from "./types";

function InteractivePreview() {
  const [page, setPage] = useState(5);
  return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />;
}

export const pageConfig: ComponentPageConfig = {
  longDescription:
    "The original overview audit already flagged this component set as reading like a scenario/demo showcase rather than an atomic primitive — its 6 page values mix layout scenario, density, and responsive breakpoint concepts into one property. A deep re-audit confirms that assessment, and goes further: page=load_more is not pagination at all — it's a structurally unrelated progress/load-more widget sharing the same Figma frame. This is implemented as two separate components: Pagination (the real numbered navigator) and LoadMorePagination (the confirmed distinct widget), rather than forcing both into one dishonest shared prop surface.",
  variants: [
    { name: "compact", values: ["false", "true"], note: "true maps to the confirmed page=less_pages treatment — text-label Prev/Next only, no page numbers." },
    { name: "layout", values: ["horizontal", "stacked"], note: "stacked maps to the confirmed page=mobile treatment — the go-to-page control is confirmed absent in that layout." },
  ],
  states: [],
  gaps: [
    "No hover/focus/disabled state is confirmed anywhere on this component — the weakest state coverage of any component in this audit series.",
    "The confirmed orphaned \"Go to page:\" label in the less_pages variant (with no accompanying input anywhere in that variant) is treated as a leftover demo artifact and is not reproduced.",
    "The results-per-page control is implemented as a real native <select> for genuine accessibility — Figma's own export never distinguishes a real dropdown from a custom popover.",
    "load_more's progress-bar fill in the audited instance was a tiny fixed sliver, clearly just one demo snapshot value — the real component computes the fill from loaded/total props instead.",
  ],
  usageExample: `import { Pagination, LoadMorePagination } from "@shikho/ui";

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
}`,
  props: [
    { name: "currentPage / totalPages / onPageChange", type: "number / number / (page) => void", description: "Confirmed controlled page-number navigation." },
    { name: "compact", type: "boolean", defaultValue: "false", description: "Confirmed page=less_pages treatment — text-label Prev/Next only." },
    { name: "layout", type: "horizontal | stacked", defaultValue: "horizontal", description: "stacked confirms the page=mobile layout, omitting go-to-page." },
    { name: "additionaInfo / goToPage / resultsCount", type: "boolean", defaultValue: "true", description: "The 3 confirmed boolean slots gating the optional right-side pieces." },
    { name: "resultsPerPage / resultsPerPageOptions / onResultsPerPageChange", type: "number / number[] / (value) => void", description: "The confirmed results-per-page control." },
    { name: "LoadMorePagination: loaded / total / itemLabel / onLoadMore", type: "number / number / string / () => void", description: "The confirmed, structurally distinct load-more/progress widget." },
  ],
  preview: () => <InteractivePreview />,
  playground: {
    controls: [
      {
        prop: "layout",
        label: "Layout",
        defaultValue: "horizontal",
        options: [
          { label: "horizontal", value: "horizontal" },
          { label: "stacked", value: "stacked" },
        ],
      },
      {
        prop: "compact",
        label: "Compact (less_pages)",
        defaultValue: "false",
        options: [
          { label: "false", value: "false" },
          { label: "true", value: "true" },
        ],
      },
    ],
    render: (v) => {
      function Demo() {
        const [page, setPage] = useState(5);
        return (
          <Pagination
            currentPage={page}
            totalPages={10}
            onPageChange={setPage}
            layout={v.layout as "horizontal" | "stacked"}
            compact={v.compact === "true"}
          />
        );
      }
      return <Demo />;
    },
  },
  showcases: [
    {
      title: "The confirmed windowing algorithm",
      description: "first (1 of 10), center (5 of 10), and last (10 of 10) — read directly off three confirmed Figma instances.",
      layout: "stack",
      render: () => {
        function Demo() {
          const [first, setFirst] = useState(1);
          const [center, setCenter] = useState(5);
          const [last, setLast] = useState(10);
          return (
            <>
              <div style={{ marginBottom: 16 }}>
                <Pagination currentPage={first} totalPages={10} onPageChange={setFirst} additionaInfo={false} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <Pagination currentPage={center} totalPages={10} onPageChange={setCenter} additionaInfo={false} />
              </div>
              <Pagination currentPage={last} totalPages={10} onPageChange={setLast} additionaInfo={false} />
            </>
          );
        }
        return <Demo />;
      },
    },
    {
      title: "Compact (less_pages) and stacked (mobile)",
      layout: "stack",
      render: () => {
        function Demo() {
          const [compactPage, setCompactPage] = useState(2);
          const [stackedPage, setStackedPage] = useState(1);
          return (
            <>
              <div style={{ marginBottom: 16 }}>
                <Pagination currentPage={compactPage} totalPages={10} onPageChange={setCompactPage} compact />
              </div>
              <div style={{ width: 344 }}>
                <Pagination currentPage={stackedPage} totalPages={10} onPageChange={setStackedPage} layout="stacked" />
              </div>
            </>
          );
        }
        return <Demo />;
      },
    },
    {
      title: "LoadMorePagination — a confirmed distinct widget",
      description: "Not a Pagination variant — a progress bar, a mixed-color counter, and a single button.",
      render: () => {
        function Demo() {
          const [loaded, setLoaded] = useState(35);
          return (
            <LoadMorePagination
              loaded={loaded}
              total={2979}
              itemLabel="games"
              onLoadMore={() => setLoaded((n) => Math.min(2979, n + 35))}
            />
          );
        }
        return <Demo />;
      },
    },
  ],
};
