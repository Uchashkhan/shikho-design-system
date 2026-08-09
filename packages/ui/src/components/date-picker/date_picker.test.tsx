import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as uiRoot from "../../index";
import { DatePicker, DATE_PICKER_PRESETS } from "./date_picker";
import { formatMonthLabel, getMonthGrid } from "./date-utils";

describe("root export", () => {
  it("exposes DatePicker from the @shikho/ui package root", () => {
    expect(uiRoot.DatePicker).toBe(DatePicker);
  });
});

describe("no placeholder implementation remains", () => {
  it("renders a real calendar grid, weekday labels and month heading — not an empty shell", () => {
    render(<DatePicker type="single" size="md" defaultMonth={new Date(2024, 10, 1)} />);
    expect(screen.getByText("Nov 2024")).toBeInTheDocument();
    expect(screen.getByText("SUN")).toBeInTheDocument();
    expect(screen.getByText("MON")).toBeInTheDocument();
    expect(screen.getAllByRole("gridcell").length).toBeGreaterThan(27);
  });

  it("does not render the old placeholder text such as 'single / md'", () => {
    render(<DatePicker type="single" size="md" />);
    expect(screen.queryByText(/single \/ md/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/no preview configured/i)).not.toBeInTheDocument();
  });
});

describe("month grid generation (date-utils)", () => {
  it("builds full weeks (multiples of 7 cells) covering the whole month", () => {
    const weeks = getMonthGrid(new Date(2024, 10, 1)); // Nov 2024
    const allCells = weeks.flat();
    expect(allCells.length % 7).toBe(0);
    const daysInMonth = allCells.filter((c) => c.inCurrentMonth);
    expect(daysInMonth).toHaveLength(30);
  });

  it("includes leading/trailing adjacent-month cells to fill every row", () => {
    const weeks = getMonthGrid(new Date(2024, 10, 1));
    expect(weeks[0][0].inCurrentMonth).toBe(false); // Nov 1 2024 is a Friday
    expect(weeks[0][0].date.getMonth()).toBe(9); // October
  });

  it("formats the month label as confirmed (docs/audit/date-picker-deep-audit.md §5)", () => {
    expect(formatMonthLabel(new Date(2024, 10, 1))).toBe("Nov 2024");
    expect(formatMonthLabel(new Date(2024, 11, 1))).toBe("Dec 2024");
  });
});

describe("previous/next month navigation", () => {
  it("moves to the previous month", async () => {
    
    render(<DatePicker type="single" size="md" defaultMonth={new Date(2024, 10, 1)} />);
    fireEvent.click(screen.getByRole("button", { name: "Previous month" }));
    expect(screen.getByText("Oct 2024")).toBeInTheDocument();
  });

  it("moves to the next month", async () => {
    
    render(<DatePicker type="single" size="md" defaultMonth={new Date(2024, 10, 1)} />);
    fireEvent.click(screen.getByRole("button", { name: "Next month" }));
    expect(screen.getByText("Dec 2024")).toBeInTheDocument();
  });

  it("calls onMonthChange with the new month", async () => {
    
    const onMonthChange = vi.fn();
    render(
      <DatePicker
        type="single"
        size="md"
        defaultMonth={new Date(2024, 10, 1)}
        onMonthChange={onMonthChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Next month" }));
    expect(onMonthChange).toHaveBeenCalledWith(new Date(2024, 11, 1));
  });

  it("range type shows two independently-labeled panels, one month apart", () => {
    render(<DatePicker type="range" size="lg" defaultMonth={new Date(2024, 10, 1)} />);
    expect(screen.getByText("Nov 2024")).toBeInTheDocument();
    expect(screen.getByText("Dec 2024")).toBeInTheDocument();
  });
});

describe("single-date selection", () => {
  it("selects a date on click and calls onChange", async () => {
    
    const onChange = vi.fn();
    render(
      <DatePicker
        type="single"
        size="md"
        defaultMonth={new Date(2024, 10, 1)}
        onChange={onChange}
      />,
    );
    const grid = screen.getByRole("grid");
    fireEvent.click(within(grid).getByText("15"));
    expect(onChange).toHaveBeenCalledWith({
      start: new Date(2024, 10, 15),
      end: new Date(2024, 10, 15),
    });
  });

  it("marks the selected cell aria-selected", async () => {
    
    render(<DatePicker type="single" size="md" defaultMonth={new Date(2024, 10, 1)} />);
    const grid = screen.getByRole("grid");
    const cell = within(grid).getByText("15").closest('[role="gridcell"]') as HTMLElement;
    fireEvent.click(cell);
    expect(cell).toHaveAttribute("aria-selected", "true");
  });
});

describe("date-range selection", () => {
  it("selects a start then an end date, normalizing chronological order", async () => {
    
    const onChange = vi.fn();
    render(
      <DatePicker type="range" size="lg" defaultMonth={new Date(2024, 10, 1)} onChange={onChange} />,
    );
    const grids = screen.getAllByRole("grid");
    fireEvent.click(within(grids[0]).getByText("20"));
    fireEvent.click(within(grids[0]).getByText("10"));

    expect(onChange).toHaveBeenLastCalledWith({
      start: new Date(2024, 10, 10),
      end: new Date(2024, 10, 20),
    });
  });

  it("starts a new range after a complete range is already selected", async () => {
    
    const onChange = vi.fn();
    render(
      <DatePicker type="range" size="lg" defaultMonth={new Date(2024, 10, 1)} onChange={onChange} />,
    );
    const grids = screen.getAllByRole("grid");
    fireEvent.click(within(grids[0]).getByText("5"));
    fireEvent.click(within(grids[0]).getByText("10"));
    fireEvent.click(within(grids[0]).getByText("20"));

    expect(onChange).toHaveBeenLastCalledWith({ start: new Date(2024, 10, 20), end: null });
  });
});

describe("preset range selection", () => {
  it("renders all 7 confirmed presets", () => {
    render(<DatePicker type="range" size="lg" />);
    for (const preset of DATE_PICKER_PRESETS) {
      expect(screen.getByText(preset.label)).toBeInTheDocument();
    }
  });

  it("applies a preset's computed range to the draft value on click", async () => {
    
    const onChange = vi.fn();
    render(<DatePicker type="range" size="lg" onChange={onChange} />);
    fireEvent.click(screen.getByText("Last 7 days"));
    expect(onChange).toHaveBeenCalled();
    const value = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(value.start).toBeInstanceOf(Date);
    expect(value.end).toBeInstanceOf(Date);
  });

  it("can hide the presets sidebar entirely", () => {
    render(<DatePicker type="single" size="md" presets={false} />);
    expect(screen.queryByText("Today")).not.toBeInTheDocument();
  });
});

describe("Cancel behavior", () => {
  it("reverts the draft selection back to the committed value and fires onCancel", async () => {
    
    const onCancel = vi.fn();
    render(
      <DatePicker
        type="single"
        size="lg"
        defaultMonth={new Date(2024, 10, 1)}
        defaultValue={{ start: new Date(2024, 10, 1), end: new Date(2024, 10, 1) }}
        onCancel={onCancel}
      />,
    );
    const grid = screen.getByRole("grid");
    fireEvent.click(within(grid).getByText("15"));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalled();
    const cellOne = within(grid).getByText("1").closest('[role="gridcell"]');
    expect(cellOne).toHaveAttribute("aria-selected", "true");
  });
});

describe("Set Date behavior", () => {
  it("fires onApply with the current draft value", async () => {
    
    const onApply = vi.fn();
    render(
      <DatePicker type="single" size="lg" defaultMonth={new Date(2024, 10, 1)} onApply={onApply} />,
    );
    const grid = screen.getByRole("grid");
    fireEvent.click(within(grid).getByText("15"));
    fireEvent.click(screen.getByRole("button", { name: "Set Date" }));

    expect(onApply).toHaveBeenCalledWith({
      start: new Date(2024, 10, 15),
      end: new Date(2024, 10, 15),
    });
  });

  it("makes the applied value the new Cancel baseline", async () => {
    
    render(<DatePicker type="single" size="lg" defaultMonth={new Date(2024, 10, 1)} />);
    const grid = screen.getByRole("grid");
    fireEvent.click(within(grid).getByText("15"));
    fireEvent.click(screen.getByRole("button", { name: "Set Date" }));
    fireEvent.click(within(grid).getByText("20"));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    const cell15 = within(grid).getByText("15").closest('[role="gridcell"]');
    expect(cell15).toHaveAttribute("aria-selected", "true");
  });
});

describe("controlled value behavior", () => {
  it("reflects an externally-controlled value prop", () => {
    render(
      <DatePicker
        type="single"
        size="lg"
        defaultMonth={new Date(2024, 10, 1)}
        value={{ start: new Date(2024, 10, 10), end: new Date(2024, 10, 10) }}
      />,
    );
    const grid = screen.getByRole("grid");
    const cell = within(grid).getByText("10").closest('[role="gridcell"]');
    expect(cell).toHaveAttribute("aria-selected", "true");
  });

  it("still calls onChange when controlled, letting the consumer own the state", async () => {
    
    const onChange = vi.fn();
    render(
      <DatePicker
        type="single"
        size="lg"
        defaultMonth={new Date(2024, 10, 1)}
        value={{ start: new Date(2024, 10, 10), end: new Date(2024, 10, 10) }}
        onChange={onChange}
      />,
    );
    const grid = screen.getByRole("grid");
    fireEvent.click(within(grid).getByText("15"));
    expect(onChange).toHaveBeenCalledWith({
      start: new Date(2024, 10, 15),
      end: new Date(2024, 10, 15),
    });
  });
});

describe("footer date-input visibility (docs/audit/date-picker-deep-audit.md §10)", () => {
  it("hides the footer date field(s) for type=single, size=md and stretches the CTAs", () => {
    render(<DatePicker type="single" size="md" />);
    expect(screen.queryByDisplayValue(/DD \/ MM \/ YYYY/)).not.toBeInTheDocument();
    expect(screen.queryByText(/DD \/ MM \/ YYYY/)).not.toBeInTheDocument();
  });

  it("shows the footer date field for type=single, size=lg", () => {
    render(<DatePicker type="single" size="lg" />);
    expect(screen.getAllByText(/DD \/ MM \/ YYYY/).length).toBeGreaterThan(0);
  });

  it("shows two footer date fields with a TO separator for type=range at any size", () => {
    render(<DatePicker type="range" size="md" />);
    expect(screen.getByText("TO")).toBeInTheDocument();
    expect(screen.getAllByText(/DD \/ MM \/ YYYY/).length).toBe(2);
  });

  it("can be overridden explicitly via showFooterInputs", () => {
    render(<DatePicker type="single" size="md" showFooterInputs />);
    expect(screen.getAllByText(/DD \/ MM \/ YYYY/).length).toBe(1);
  });
});

describe("disabled dates (functional only, not a confirmed visual)", () => {
  it("does not select a disabled date on click", async () => {
    
    const onChange = vi.fn();
    render(
      <DatePicker
        type="single"
        size="lg"
        defaultMonth={new Date(2024, 10, 1)}
        onChange={onChange}
        isDateDisabled={(date) => date.getDate() === 15}
      />,
    );
    const grid = screen.getByRole("grid");
    const cell = within(grid).getByText("15").closest('[role="gridcell"]') as HTMLElement;
    expect(cell).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(cell);
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("keyboard and ARIA semantics", () => {
  it("exposes a grid/row/gridcell role structure for the calendar", () => {
    render(<DatePicker type="single" size="md" defaultMonth={new Date(2024, 10, 1)} />);
    const grid = screen.getByRole("grid");
    expect(within(grid).getAllByRole("row").length).toBeGreaterThan(0);
    expect(within(grid).getAllByRole("gridcell").length).toBeGreaterThan(0);
  });

  it("marks today's date with aria-current", () => {
    const today = new Date();
    render(<DatePicker type="single" size="md" defaultMonth={today} />);
    expect(screen.getAllByRole("gridcell", { current: "date" }).length).toBeGreaterThan(0);
  });

  it("day cells are real, focusable <button> elements", () => {
    render(<DatePicker type="single" size="md" defaultMonth={new Date(2024, 10, 1)} />);
    const grid = screen.getByRole("grid");
    const cell = within(grid).getByText("15").closest("button");
    expect(cell).toBeInstanceOf(HTMLButtonElement);
  });
});

// P1 one-off repair — nav buttons hug to 42px (18px icon + 12px padding per side), not 40px.
describe("nav button width (P1 repair)", () => {
  it("renders the month nav buttons at 42x40", () => {
    const { container } = render(<DatePicker type="single" size="lg" />);
    const navButtons = Array.from(container.querySelectorAll("button")).filter(
      (b) => b.style.width === "42px" && b.style.height === "40px",
    );
    // A single-month panel renders exactly two nav arrows (previous / next).
    expect(navButtons).toHaveLength(2);
  });
});
