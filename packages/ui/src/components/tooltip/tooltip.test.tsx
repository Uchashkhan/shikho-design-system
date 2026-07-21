import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import * as uiRoot from "../../index";
import { Tooltip } from "./tooltip";

describe("root export", () => {
  it("exposes Tooltip from the @shikho/ui package root", () => {
    expect(uiRoot.Tooltip).toBe(Tooltip);
  });
});

describe("the one confirmed property: direction", () => {
  const directions = [
    "botom_left",
    "top_left",
    "botom_right",
    "top_right",
    "bottom_center",
    "top_center",
    "left_center",
    "right_center",
  ] as const;

  it.each(directions)("renders direction=%s without crashing", (direction) => {
    render(<Tooltip direction={direction}>Tip</Tooltip>);
    expect(screen.getByRole("tooltip")).toHaveAttribute("data-direction", direction);
  });

  it("preserves the confirmed typo verbatim rather than correcting it", () => {
    render(<Tooltip direction="botom_left">Tip</Tooltip>);
    expect(screen.getByRole("tooltip")).toHaveAttribute("data-direction", "botom_left");
  });

  it("positions above the anchor for top_center and below for bottom_center", () => {
    const { rerender } = render(<Tooltip direction="top_center">Tip</Tooltip>);
    let el = screen.getByRole("tooltip");
    expect(el.style.bottom).toContain("100%");
    expect(el.style.top).toBe("");

    rerender(<Tooltip direction="bottom_center">Tip</Tooltip>);
    el = screen.getByRole("tooltip");
    expect(el.style.top).toContain("100%");
    expect(el.style.bottom).toBe("");
  });

  it("positions to the side for left_center and right_center", () => {
    const { rerender } = render(<Tooltip direction="left_center">Tip</Tooltip>);
    let el = screen.getByRole("tooltip");
    expect(el.style.right).toContain("100%");

    rerender(<Tooltip direction="right_center">Tip</Tooltip>);
    el = screen.getByRole("tooltip");
    expect(el.style.left).toContain("100%");
  });
});

describe("confirmed dimensions and derived styling", () => {
  it("applies the confirmed 240px width as a max-width, not a forced size", () => {
    render(<Tooltip direction="top_center">Tip</Tooltip>);
    const el = screen.getByRole("tooltip");
    expect(el.style.maxWidth).toBe("240px");
    expect(el.style.width).toBe("");
    expect(el.style.height).toBe("");
  });

  it("renders content passed as children", () => {
    render(<Tooltip direction="top_center">Helpful text</Tooltip>);
    expect(screen.getByText("Helpful text")).toBeInTheDocument();
  });

  it("uses the derived white fill and dark text consistent with the rest of the system", () => {
    render(<Tooltip direction="top_center">Tip</Tooltip>);
    const el = screen.getByRole("tooltip");
    expect(el.style.backgroundColor).toBe("rgb(255, 255, 255)");
    expect(el.style.color).toBe("rgb(10, 12, 17)");
  });
});

describe("no unsupported variant is exported", () => {
  it("rejects a direction value outside the confirmed 8-value enum at the type level", () => {
    // @ts-expect-error - "center" is not a confirmed tooltip direction (only the 8 listed exist, §2)
    const invalid: import("./tooltip").TooltipDirection = "center";
    expect(invalid).toBeDefined();
  });

  it("has no size, type, or state prop — none are confirmed to exist on tooltip", () => {
    render(<Tooltip direction="top_center">Tip</Tooltip>);
    const el = screen.getByRole("tooltip");
    expect(el).not.toHaveAttribute("data-size");
    expect(el).not.toHaveAttribute("data-type");
    expect(el).not.toHaveAttribute("data-state");
  });
});
