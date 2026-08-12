import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as uiRoot from "../../index";
import { Switcher } from "./switcher";

const options = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
];

describe("root export", () => {
  it("exposes Switcher from the @shikho/ui package root", () => {
    expect(uiRoot.Switcher).toBe(Switcher);
  });
});

describe("confirmed container structure (docs/audit/switcher-deep-audit.md §1)", () => {
  it("renders one segment per option", () => {
    render(<Switcher options={options} value="day" onChange={() => {}} />);
    expect(screen.getByText("Day")).toBeInTheDocument();
    expect(screen.getByText("Week")).toBeInTheDocument();
    expect(screen.getByText("Month")).toBeInTheDocument();
  });

  it("applies the confirmed container padding/radius/fill", () => {
    const { container } = render(<Switcher options={options} value="day" onChange={() => {}} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.padding).toBe("0.25rem");
    expect(root.style.backgroundColor).toBe("rgb(244, 244, 246)");
  });
});

describe("selection", () => {
  it("marks the selected option as active_primary_accent and others as inactive", () => {
    render(<Switcher options={options} value="week" onChange={() => {}} />);
    expect(screen.getByText("Week").closest("button")).toHaveAttribute("data-type", "active_primary_accent");
    expect(screen.getByText("Day").closest("button")).toHaveAttribute("data-type", "inactive");
  });

  it("marks the selected segment aria-pressed", () => {
    render(<Switcher options={options} value="day" onChange={() => {}} />);
    expect(screen.getByText("Day").closest("button")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Week").closest("button")).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onChange with the clicked option's value", () => {
    const onChange = vi.fn();
    render(<Switcher options={options} value="day" onChange={onChange} />);
    fireEvent.click(screen.getByText("Month"));
    expect(onChange).toHaveBeenCalledWith("month");
  });
});

describe("size propagation", () => {
  it("passes size down to every segment", () => {
    render(<Switcher options={options} value="day" onChange={() => {}} size="sm" />);
    expect(screen.getByText("Day").closest("button")).toHaveAttribute("data-size", "sm");
  });
});

// Container gap/radius genuinely vary per size — re-confirmed via a live get_design_context pull
// on all 5 of the container's own size samples. Previously hardcoded to a single 6px/radius.md
// (10px) pair regardless of size (a stale "P1 repair" that was itself only confirmed at one size).
describe("confirmed per-size container gap/radius", () => {
  const rows = [
    ["xs", "0.375rem", "10px"],
    ["sm", "0.5rem", "12px"],
    ["md", "0.375rem", "12px"], // gap is genuinely non-monotonic — confirmed, not a typo
    ["lg", "0.75rem", "16px"],
    ["xl", "1rem", "16px"],
  ] as const;

  it.each(rows)("size=%s → gap %s, radius %s", (size, gap, borderRadius) => {
    const { container } = render(
      <Switcher size={size} options={[{ label: "One", value: "one" }, { label: "Two", value: "two" }]} />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root.style.gap).toBe(gap);
    expect(root.style.borderRadius).toBe(borderRadius);
    expect(root.style.padding).toBe("0.25rem");
  });
});

// Requested additions, not part of the original Figma audit — selectedColor maps onto 3 of
// SwitcherItemType's 5 already-confirmed values rather than inventing new colors.
describe("selectedColor (requested addition)", () => {
  it("defaults to accent (active_primary_accent), matching prior unconfigured behavior", () => {
    render(<Switcher options={options} value="day" onChange={() => {}} />);
    expect(screen.getByText("Day").closest("button")).toHaveAttribute("data-type", "active_primary_accent");
  });

  it("primary maps to active_primary, dark maps to active_neutral", () => {
    const { rerender } = render(<Switcher options={options} value="day" onChange={() => {}} selectedColor="primary" />);
    expect(screen.getByText("Day").closest("button")).toHaveAttribute("data-type", "active_primary");
    rerender(<Switcher options={options} value="day" onChange={() => {}} selectedColor="dark" />);
    expect(screen.getByText("Day").closest("button")).toHaveAttribute("data-type", "active_neutral");
  });

  it("never changes unselected segments' type", () => {
    render(<Switcher options={options} value="day" onChange={() => {}} selectedColor="dark" />);
    expect(screen.getByText("Week").closest("button")).toHaveAttribute("data-type", "inactive");
  });
});

describe("shape (requested addition)", () => {
  it("default keeps the confirmed per-size container/item radius", () => {
    const { container } = render(<Switcher options={options} value="day" onChange={() => {}} size="lg" />);
    expect((container.firstChild as HTMLElement).style.borderRadius).toBe("16px");
    expect(screen.getByText("Day").closest("button")).toHaveAttribute("data-shape", "default");
  });

  it("pill gives the container and every segment a true stadium radius", () => {
    const { container } = render(<Switcher options={options} value="day" onChange={() => {}} shape="pill" />);
    expect((container.firstChild as HTMLElement).style.borderRadius).toBe("1000px");
    expect(screen.getByText("Day").closest("button")).toHaveAttribute("data-shape", "pill");
    expect(screen.getByText("Day").closest("button")).toHaveStyle({ borderRadius: "1000px" });
  });
});

describe("state override (requested addition)", () => {
  it("forces only the selected segment's state; unselected segments stay pointer-driven", () => {
    render(<Switcher options={options} value="day" onChange={() => {}} state="hover" />);
    expect(screen.getByText("Day").closest("button")).toHaveAttribute("data-state", "hover");
    expect(screen.getByText("Week").closest("button")).toHaveAttribute("data-state", "default");
  });
});
