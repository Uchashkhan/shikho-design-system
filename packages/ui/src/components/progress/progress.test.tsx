import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as uiRoot from "../../index";
import { Progress } from "./progress";

describe("root export", () => {
  it("exposes Progress from the @shikho/ui package root", () => {
    expect(uiRoot.Progress).toBe(Progress);
  });
});

describe("confirmed scrubber structure (docs/audit/progress-deep-audit.md §2)", () => {
  it("renders a real, functional range input", () => {
    render(<Progress value={35} aria-label="Media progress" />);
    const input = screen.getByRole("slider") as HTMLInputElement;
    expect(input.type).toBe("range");
    expect(input.value).toBe("35");
  });

  it("clamps the value within min/max", () => {
    render(<Progress value={150} max={100} aria-label="Media progress" />);
    expect((screen.getByRole("slider") as HTMLInputElement).value).toBe("100");
  });

  it("defaults to a 0-100 range", () => {
    render(<Progress value={50} aria-label="Media progress" />);
    const input = screen.getByRole("slider") as HTMLInputElement;
    expect(input.min).toBe("0");
    expect(input.max).toBe("100");
  });

  it("respects a custom min/max range", () => {
    render(<Progress value={5} min={0} max={10} aria-label="Media progress" />);
    const input = screen.getByRole("slider") as HTMLInputElement;
    expect(input.min).toBe("0");
    expect(input.max).toBe("10");
  });
});

describe("interactivity", () => {
  it("calls onChange with the new numeric value", () => {
    const onChange = vi.fn();
    render(<Progress value={20} onChange={onChange} aria-label="Media progress" />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: "60" } });
    expect(onChange).toHaveBeenCalledWith(60);
  });
});

describe("no duplicated Load More implementation (§1)", () => {
  it("Progress has no loaded/total/onLoadMore props — that widget is LoadMorePagination, not reproduced here", () => {
    // @ts-expect-error - Progress intentionally has no Load More-shaped API; see LoadMorePagination
    const invalid: import("./progress").ProgressProps = { loaded: 1, total: 2 };
    expect(invalid).toBeDefined();
  });
});
