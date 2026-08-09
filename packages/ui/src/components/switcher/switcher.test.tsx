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

// P1 one-off repairs — confirmed container geometry.
describe("container geometry (P1 repair)", () => {
  it("uses radius/custom/md (10px) and a 6px gap, not 12px/8px", () => {
    const { container } = render(
      <Switcher options={[{ label: "One", value: "one" }, { label: "Two", value: "two" }]} />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root.style.borderRadius).toBe("10px");
    expect(root.style.gap).toBe("0.375rem");
    expect(root.style.padding).toBe("0.25rem");
  });
});
