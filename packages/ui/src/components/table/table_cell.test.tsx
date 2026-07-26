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

describe("confirmed corrections from a fresh get_design_context re-audit (docs/audit/table-deep-audit.md §6)", () => {
  it("confirmed: the header family's avatar is fixed at 24px regardless of avatar.size or header vs. header_compact", () => {
    const { container, rerender } = render(
      <TableCell type="header" heading="Row" avatar={{ size: "md", src: "/a.png" }} />,
    );
    let avatarSlot = container.querySelector("span > img")!.parentElement as HTMLElement;
    expect(avatarSlot.style.width).toBe("24px");
    rerender(<TableCell type="header_compact" heading="Row" avatar={{ size: "sm", src: "/a.png" }} />);
    avatarSlot = container.querySelector("span > img")!.parentElement as HTMLElement;
    expect(avatarSlot.style.width).toBe("24px");
  });

  it("confirmed: default_compact's root gap (8px) is genuinely narrower than default's (12px)", () => {
    const { container, rerender } = render(<TableCell type="default" heading="Row" />);
    expect((container.firstChild as HTMLElement).style.gap).toBe("0.75rem");
    rerender(<TableCell type="default_compact" heading="Row" />);
    expect((container.firstChild as HTMLElement).style.gap).toBe("0.5rem");
  });

  it("confirmed: header_compact's heading text drops to caption_2 (12/16), unlike header/default/default_compact's body_1 (13/20)", () => {
    render(<TableCell type="header_compact" heading="Name" />);
    const heading = screen.getByText("Name");
    expect(heading.parentElement?.style.fontSize).toBe("12px");
    expect(heading.parentElement?.style.lineHeight).toBe("16px");
  });

  it("confirmed: header's heading is SemiBold(600), but default's heading is Medium(500), not SemiBold", () => {
    const { rerender } = render(<TableCell type="header" heading="Name" />);
    expect(screen.getByText("Name").style.fontWeight).toBe("600");
    rerender(<TableCell type="default" heading="Name" />);
    expect(screen.getByText("Name").style.fontWeight).toBe("500");
  });

  it("confirmed: tag1/tag2 use Tags' md size (24px height), not sm (20px)", () => {
    render(<TableCell heading="Row" tag1="Gray" tag2="Primary" />);
    expect(screen.getByText("Gray").closest("[data-size]")).toHaveAttribute("data-size", "md");
    expect(screen.getByText("Primary").closest("[data-size]")).toHaveAttribute("data-size", "md");
  });

  it("confirmed: the dropdown field carries the real 2-layer special_drop inset shadow, not a single flat shadow", () => {
    render(<TableCell heading="Row" dropdownContent="Admin" />);
    const button = screen.getByText("Admin").closest("button") as HTMLElement;
    expect(button.style.boxShadow).toContain("#ffffff0a");
    expect(button.style.boxShadow).toContain("rgba(0,0,0,0.07)");
    expect(button.style.boxShadow.match(/inset/g)?.length).toBe(2);
  });

  it("confirmed: the icon_button action carries NO inset shadow (previously misapplied there instead of the dropdown)", () => {
    render(<TableCell heading="Row" actionIcon={<span data-testid="icon" />} />);
    const button = screen.getByTestId("icon").closest("button") as HTMLElement;
    expect(button.style.boxShadow).toBeFalsy();
  });
});
