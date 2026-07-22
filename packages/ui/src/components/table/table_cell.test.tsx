import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as uiRoot from "../../index";
import { TableCell } from "./table_cell";

describe("root export", () => {
  it("exposes TableCell from the @shikho/ui package root", () => {
    expect(uiRoot.TableCell).toBe(TableCell);
  });
});

describe("confirmed rich composition (docs/audit/table-deep-audit.md §1)", () => {
  it("renders a real nested Checkbox for row selection", () => {
    render(<TableCell checkbox heading="Row" />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("renders an avatar-style image slot at the confirmed pixel size", () => {
    const { container } = render(
      <TableCell heading="Row" avatar={{ size: "sm", src: "/a.png", alt: "Avatar" }} />,
    );
    const avatarSlot = container.querySelector("span > img")!.parentElement as HTMLElement;
    expect(avatarSlot.style.width).toBe("32px"); // confirmed default-density sm size
  });

  it("scales the avatar down for compact types", () => {
    const { container } = render(
      <TableCell type="default_compact" heading="Row" avatar={{ size: "sm", src: "/a.png" }} />,
    );
    const avatarSlot = container.querySelector("span > img")!.parentElement as HTMLElement;
    expect(avatarSlot.style.width).toBe("24px"); // confirmed compact-density sm size
  });

  it("renders both confirmed tag slots via the real Tags component", () => {
    render(<TableCell heading="Row" tag1="Gray" tag2="Primary" />);
    expect(screen.getByText("Gray")).toBeInTheDocument();
    expect(screen.getByText("Primary")).toBeInTheDocument();
  });

  it("renders a dropdown action and an icon-button action", () => {
    const onDropdownClick = vi.fn();
    const onActionClick = vi.fn();
    render(
      <TableCell
        heading="Row"
        dropdownContent="Admin"
        onDropdownClick={onDropdownClick}
        actionIcon={<span data-testid="action-icon" />}
        onActionClick={onActionClick}
      />,
    );
    fireEvent.click(screen.getByText("Admin"));
    expect(onDropdownClick).toHaveBeenCalled();
    fireEvent.click(screen.getByTestId("action-icon").closest("button")!);
    expect(onActionClick).toHaveBeenCalled();
  });
});

describe("confirmed type structure (§2)", () => {
  it("header types omit the description line even if supplied", () => {
    render(<TableCell type="header" heading="Name" description="Hidden" />);
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });

  it("default types render the description line", () => {
    render(<TableCell type="default" heading="Name" description="Shown" />);
    expect(screen.getByText("Shown")).toBeInTheDocument();
  });

  it("header types ignore tag/dropdown/action slots even if supplied", () => {
    render(
      <TableCell type="header" heading="Name" tag1="Tag" dropdownContent="Admin" actionIcon={<span />} />,
    );
    expect(screen.queryByText("Tag")).not.toBeInTheDocument();
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });

  it("heading uses muted gray-600 on header types vs. gray-950 on default types", () => {
    const { rerender } = render(<TableCell type="header" heading="Name" />);
    expect(screen.getByText("Name").style.color).toBe("rgb(140, 146, 156)");
    rerender(<TableCell type="default" heading="Name" />);
    expect(screen.getByText("Name").style.color).toBe("rgb(10, 12, 17)");
  });
});

describe("confirmed state=loading skeleton row (§4)", () => {
  it("renders skeleton placeholders instead of real content", () => {
    const { container } = render(
      <TableCell state="loading" heading="Should not render" checkbox tag1="Should not render" />,
    );
    expect(screen.queryByText("Should not render")).not.toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(0);
  });
});

describe("checkbox interactivity", () => {
  it("calls onCheckedChange when the row checkbox is toggled", () => {
    const onCheckedChange = vi.fn();
    render(<TableCell checkbox checked={false} onCheckedChange={onCheckedChange} heading="Row" />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});
