import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, CloseIcon, InfoCircleIcon } from "@shikho/icons";
import { Alert } from "./components/alert";
import { Checkbox } from "./components/checkbox";
import { Modal } from "./components/modal";
import { Pagination } from "./components/pagination";
import { Toast } from "./components/toast";

/**
 * P2 — proves the shared glyphs actually render through @shikho/ui, and that the components
 * which previously carried hand-drawn approximations now emit the real shared geometry.
 */
describe("@shikho/icons renders through @shikho/ui", () => {
  it("each glyph renders its exact source viewBox and paints with currentColor", () => {
    const cases = [
      [ChevronLeftIcon, "chevron-left", "0 0 6.18747 10.6875"],
      [ChevronRightIcon, "chevron-right", "0 0 6.18747 10.6875"],
      [CloseIcon, "close", "0 0 10.5004 10.5002"],
      [InfoCircleIcon, "info-circle", "0 0 18 18"],
      [CheckIcon, "check", "0 0 20 16"],
    ] as const;

    for (const [Icon, name, viewBox] of cases) {
      const { container } = render(<Icon />);
      const svg = container.querySelector("svg") as SVGSVGElement;
      expect(svg.getAttribute("data-icon")).toBe(name);
      expect(svg.getAttribute("viewBox")).toBe(viewBox);
      expect(svg.querySelector("path")?.getAttribute("fill")).toBe("currentColor");
    }
  });

  it("respects the size prop", () => {
    const { container } = render(<CloseIcon size={24} />);
    const svg = container.querySelector("svg") as SVGSVGElement;
    expect(svg.getAttribute("width")).toBe("24");
    expect(svg.getAttribute("height")).toBe("24");
  });

  const consumers: Array<[string, () => HTMLElement, string]> = [
    ["Alert", () => render(<Alert titleContent="t" />).container, "info-circle"],
    ["Toast", () => render(<Toast titleContent="t" />).container, "info-circle"],
    // Modal renders through a portal by default, so it is mounted inline here to keep the
    // assertion scoped to the returned container.
    ["Modal", () => render(<Modal open title="h" usePortal={false} />).container, "close"],
    [
      "Pagination",
      () => render(<Pagination currentPage={2} totalPages={5} onPageChange={() => {}} />).container,
      "chevron-left",
    ],
    ["Checkbox", () => render(<Checkbox defaultChecked aria-label="c" />).container, "check"],
  ];

  it.each(consumers)("%s consumes the shared %s glyph", (_name, renderFn, icon) => {
    const container = renderFn();
    expect(container.querySelector(`svg[data-icon='${icon}']`)).toBeInTheDocument();
  });
});
