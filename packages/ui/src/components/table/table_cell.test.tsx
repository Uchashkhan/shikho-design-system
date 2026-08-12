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

// P18 repair — a fresh get_design_context re-pull on all 4 loading-state variants (node
// 66084:36288 and siblings) found the previous implementation applied one invented "2 circles +
// bar" skeleton to every type unchanged. Figma confirms header/header_compact have NO circles at
// all (just a thin bar), and default_compact's circles/bar are their own confirmed smaller sizes
// — not default's reused. Padding/gap were also confirmed distinct from each type's normal-state
// values.
describe("loading skeleton composition genuinely differs by type (P18 repair)", () => {
  it("header/header_compact render NO circles, only a thin bar", () => {
    for (const type of ["header", "header_compact"] as const) {
      const { container, unmount } = render(<TableCell type={type} state="loading" />);
      const circles = [...container.querySelectorAll('[aria-hidden="true"]')].filter(
        (el) => (el as HTMLElement).style.borderRadius === "1000px" && (el as HTMLElement).style.width,
      );
      expect(circles).toHaveLength(0);
      unmount();
    }
  });

  it("header's bar is 12px tall; header_compact's is 8px", () => {
    const { container: headerC } = render(<TableCell type="header" state="loading" />);
    const headerBar = headerC.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(headerBar.style.height).toBe("12px");

    const { container: compactC } = render(<TableCell type="header_compact" state="loading" />);
    const compactBar = compactC.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(compactBar.style.height).toBe("8px");
  });

  it("default renders 32px + 24px circles and a 16px bar", () => {
    const { container } = render(<TableCell type="default" state="loading" />);
    const nodes = [...container.querySelectorAll('[aria-hidden="true"]')] as HTMLElement[];
    expect(nodes.map((n) => n.style.width)).toEqual(["32px", "24px", ""]);
    expect(nodes.at(-1)?.style.height).toBe("16px");
  });

  it("default_compact renders its OWN confirmed 24px + 20px circles and a 12px bar, not default's 32/24/16", () => {
    const { container } = render(<TableCell type="default_compact" state="loading" />);
    const nodes = [...container.querySelectorAll('[aria-hidden="true"]')] as HTMLElement[];
    expect(nodes.map((n) => n.style.width)).toEqual(["24px", "20px", ""]);
    expect(nodes.at(-1)?.style.height).toBe("12px");
  });

  it("each type's loading padding/gap is confirmed distinct from its normal-state values", () => {
    const { container: headerLoading } = render(<TableCell type="header" state="loading" />);
    expect((headerLoading.firstChild as HTMLElement).style.padding).toBe("0.5rem 1rem 1.25rem");
    expect((headerLoading.firstChild as HTMLElement).style.gap).toBe("0.375rem");

    const { container: defaultCompactLoading } = render(<TableCell type="default_compact" state="loading" />);
    expect((defaultCompactLoading.firstChild as HTMLElement).style.padding).toBe("0.75rem");
    expect((defaultCompactLoading.firstChild as HTMLElement).style.gap).toBe("0.5rem");
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
