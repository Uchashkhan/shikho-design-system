import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { LoadMorePagination, Pagination } from "./pagination";

function Interactive({ initial = 1, total = 10, ...rest }: { initial?: number; total?: number; compact?: boolean; layout?: "horizontal" | "stacked" }) {
  const [page, setPage] = useState(initial);
  return <Pagination currentPage={page} totalPages={total} onPageChange={setPage} {...rest} />;
}

const meta: Meta<typeof Pagination> = {
  title: "Pagination/pagination",
  component: Pagination,
  args: { currentPage: 1, totalPages: 10 },
};

export default meta;

type Story = StoryObj<typeof Pagination>;

export const Playground: Story = {
  render: (args) => <Interactive {...args} initial={args.currentPage} total={args.totalPages} />,
};

/** Confirmed windowing: page=first (docs/audit/pagination-deep-audit.md §2) — 1 2 3 4 5 … 10. */
export const First: Story = {
  render: () => <Interactive initial={1} total={10} />,
};

/** Confirmed windowing: page=center — 1 … 3 4 5 6 7 … 10. */
export const Center: Story = {
  render: () => <Interactive initial={5} total={10} />,
};

/** Confirmed windowing: page=last — 1 … 6 7 8 9 10. */
export const Last: Story = {
  render: () => <Interactive initial={10} total={10} />,
};

/** Confirmed page=less_pages treatment — text-label Prev/Next only, no page numbers. */
export const Compact: Story = {
  render: () => <Interactive initial={2} total={10} compact />,
};

/** Confirmed page=mobile treatment — stacked layout, go-to-page omitted. */
export const Stacked: Story = {
  render: () => (
    <div style={{ width: 344 }}>
      <Interactive initial={1} total={10} layout="stacked" />
    </div>
  ),
};

export const WithoutAdditionalInfo: Story = {
  render: () => <Interactive initial={1} total={10} />,
  args: { additionaInfo: false },
};

/**
 * `page=load_more` — confirmed to be a structurally distinct widget (progress bar + counter +
 * button), not a variant of the numbered pagination. Exported as `LoadMorePagination`.
 */
export const LoadMore: StoryObj<typeof LoadMorePagination> = {
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
};
