import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as uiRoot from "../../index";
import { LoadMorePagination, Pagination } from "./pagination";
import { getPageWindow } from "./pagination-utils";

describe("root export", () => {
  it("exposes Pagination and LoadMorePagination from the @shikho/ui package root", () => {
    expect(uiRoot.Pagination).toBe(Pagination);
    expect(uiRoot.LoadMorePagination).toBe(LoadMorePagination);
  });
});

describe("confirmed page-window algorithm (docs/audit/pagination-deep-audit.md §2)", () => {
  it("matches the confirmed page=first example (current=1 of 10)", () => {
    expect(getPageWindow(1, 10)).toEqual([1, 2, 3, 4, 5, "ellipsis", 10]);
  });

  it("matches the confirmed page=center example (current=5 of 10)", () => {
    expect(getPageWindow(5, 10)).toEqual([1, "ellipsis", 3, 4, 5, 6, 7, "ellipsis", 10]);
  });

  it("matches the confirmed page=last example (current=10 of 10)", () => {
    expect(getPageWindow(10, 10)).toEqual([1, "ellipsis", 6, 7, 8, 9, 10]);
  });

  it("shows every page with no ellipsis when the total is small", () => {
    expect(getPageWindow(2, 5)).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("numbered pagination rendering", () => {
  it("renders the confirmed page-number window with the current page marked", () => {
    render(<Pagination currentPage={5} totalPages={10} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: "5" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "1" })).not.toHaveAttribute("aria-current");
    expect(screen.getAllByText("…").length).toBe(2);
  });

  it("calls onPageChange when a page number is clicked", () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByRole("button", { name: "3" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("calls onPageChange with the adjacent page via prev/next", () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Previous page" }));
    expect(onPageChange).toHaveBeenCalledWith(4);
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenCalledWith(6);
  });

  it("disables Previous on the first page and Next on the last page", () => {
    const { rerender } = render(<Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next page" })).not.toBeDisabled();

    rerender(<Pagination currentPage={10} totalPages={10} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  });
});

describe("confirmed optional right-side pieces (§2)", () => {
  it("shows go-to-page and results-per-page by default", () => {
    render(<Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />);
    expect(screen.getByText("Go to page:")).toBeInTheDocument();
    expect(screen.getByText("Results per page:")).toBeInTheDocument();
  });

  it("hides both when additionaInfo is false", () => {
    render(<Pagination currentPage={1} totalPages={10} onPageChange={() => {}} additionaInfo={false} />);
    expect(screen.queryByText("Go to page:")).not.toBeInTheDocument();
    expect(screen.queryByText("Results per page:")).not.toBeInTheDocument();
  });

  it("hides go-to-page independently via goToPage", () => {
    render(<Pagination currentPage={1} totalPages={10} onPageChange={() => {}} goToPage={false} />);
    expect(screen.queryByText("Go to page:")).not.toBeInTheDocument();
    expect(screen.getByText("Results per page:")).toBeInTheDocument();
  });

  it("navigates to the typed page via the Go button", () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />);
    fireEvent.change(screen.getByPlaceholderText("Number"), { target: { value: "7" } });
    fireEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(onPageChange).toHaveBeenCalledWith(7);
  });

  it("calls onResultsPerPageChange when the dropdown changes", () => {
    const onResultsPerPageChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={() => {}}
        onResultsPerPageChange={onResultsPerPageChange}
      />,
    );
    fireEvent.change(screen.getByLabelText("Results per page"), { target: { value: "25" } });
    expect(onResultsPerPageChange).toHaveBeenCalledWith(25);
  });
});

describe("confirmed page=less_pages treatment (compact)", () => {
  it("renders text-label Prev/Next only, no page numbers", () => {
    render(<Pagination currentPage={2} totalPages={10} onPageChange={() => {}} compact />);
    expect(screen.getByText("Prev")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "1" })).not.toBeInTheDocument();
  });

  it("still calls onPageChange with the adjacent page", () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={2} totalPages={10} onPageChange={onPageChange} compact />);
    fireEvent.click(screen.getByText("Next"));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});

describe("confirmed page=mobile treatment (stacked layout)", () => {
  it("omits go-to-page but keeps results-per-page (confirmed §2)", () => {
    render(<Pagination currentPage={1} totalPages={10} onPageChange={() => {}} layout="stacked" />);
    expect(screen.queryByText("Go to page:")).not.toBeInTheDocument();
    expect(screen.getByText("Results per page:")).toBeInTheDocument();
  });
});

describe("LoadMorePagination — confirmed distinct widget (§1, §4)", () => {
  it("renders the progress bar, counter, and Load more button", () => {
    render(<LoadMorePagination loaded={35} total={2979} itemLabel="games" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "35");
    expect(screen.getByText("Displaying 35")).toBeInTheDocument();
    expect(screen.getByText("2979 games")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Load more" })).toBeInTheDocument();
  });

  it("calls onLoadMore when clicked", () => {
    const onLoadMore = vi.fn();
    render(<LoadMorePagination loaded={10} total={100} onLoadMore={onLoadMore} />);
    fireEvent.click(screen.getByRole("button", { name: "Load more" }));
    expect(onLoadMore).toHaveBeenCalled();
  });

  it("disables the button once everything is loaded", () => {
    render(<LoadMorePagination loaded={100} total={100} />);
    expect(screen.getByRole("button", { name: "Load more" })).toBeDisabled();
  });
});

// P1 one-off repair — prev/next icon buttons are p-8, not 6px.
describe("icon-button padding (P1 repair)", () => {
  it("pads the prev/next buttons by 8px", () => {
    const { container } = render(
      <Pagination currentPage={2} totalPages={10} onPageChange={() => {}} />,
    );
    const iconButton = Array.from(container.querySelectorAll("button")).find(
      (b) => b.style.width === "32px" && b.style.height === "32px",
    );
    expect(iconButton?.style.padding).toBe("0.5rem");
  });
});
