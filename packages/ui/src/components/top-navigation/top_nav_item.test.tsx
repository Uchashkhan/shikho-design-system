import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as uiRoot from "../../index";
import { TopNavItem } from "./top_nav_item";

describe("root export", () => {
  it("exposes TopNavItem from the @shikho/ui package root", () => {
    expect(uiRoot.TopNavItem).toBe(TopNavItem);
  });
});

describe("confirmed sizes (docs/audit/top-navigation-deep-audit.md §5)", () => {
  const sizes = [
    ["xs", 24],
    ["sm", 32],
    ["md", 40],
    ["lg", 48],
    ["xl", 56],
  ] as const;

  it.each(sizes)("size=%s renders at the confirmed %ipx height", (size, px) => {
    render(<TopNavItem size={size}>Nav item</TopNavItem>);
    expect(screen.getByRole("button").style.height).toBe(`${px}px`);
  });
});

describe("confirmed type x state=default matrix (§3)", () => {
  it("active_primary: primary/500 fill (intentional deviation from Figma's confirmed primary/400), white text, black-100 border", () => {
    render(<TopNavItem type="active_primary">Nav item</TopNavItem>);
    const el = screen.getByRole("button");
    expect(el.style.backgroundColor).toBe("rgb(84, 104, 255)");
    expect(el.style.border).toContain("rgba(0, 0, 0, 0.07)");
  });

  it("active_primary_accent: gray/100 fill, primary/500 text", () => {
    render(<TopNavItem type="active_primary_accent">Nav item</TopNavItem>);
    expect(screen.getByRole("button").style.backgroundColor).toBe("rgb(244, 244, 246)");
    expect(screen.getByText("Nav item").style.color).toBe("rgb(84, 104, 255)");
  });

  it("active: gray/200 (smoke_high) fill, gray-950 text", () => {
    render(<TopNavItem type="active">Nav item</TopNavItem>);
    expect(screen.getByRole("button").style.backgroundColor).toBe("rgb(235, 236, 240)");
  });

  it("active_neutral: pure black fill, white text", () => {
    render(<TopNavItem type="active_neutral">Nav item</TopNavItem>);
    expect(screen.getByRole("button").style.backgroundColor).toBe("rgb(0, 0, 0)");
  });

  it("active_outline: no fill, 2px black-300 border, gray-950 text", () => {
    render(<TopNavItem type="active_outline">Nav item</TopNavItem>);
    const el = screen.getByRole("button");
    expect(el.style.backgroundColor).toBe("transparent");
    expect(el.style.border).toContain("2px");
  });

  it("inactive: no fill, gray-600 text", () => {
    render(<TopNavItem type="inactive">Nav item</TopNavItem>);
    const el = screen.getByRole("button");
    expect(el.style.backgroundColor).toBe("transparent");
    expect(screen.getByText("Nav item").style.color).toBe("rgb(140, 146, 156)");
  });

  it("inactive_outline: no fill, 1px gray-200 border, gray-600 text", () => {
    render(<TopNavItem type="inactive_outline">Nav item</TopNavItem>);
    expect(screen.getByRole("button").style.border).toContain("1px");
  });
});

describe("confirmed focus behavior — drops inset shadow, adds a ring (§3)", () => {
  it("active: focus swaps the inset special_drop shadow for an outer gray ring", () => {
    const { rerender } = render(<TopNavItem type="active" state="default">Nav item</TopNavItem>);
    expect(screen.getByRole("button").style.boxShadow).toContain("inset");
    rerender(<TopNavItem type="active" state="focus">Nav item</TopNavItem>);
    const boxShadow = screen.getByRole("button").style.boxShadow;
    expect(boxShadow).not.toContain("inset");
    expect(boxShadow).toContain("#dddfe4");
  });

  it("active_primary: focus rings with the primary alpha color", () => {
    render(<TopNavItem type="active_primary" state="focus">Nav item</TopNavItem>);
    expect(screen.getByRole("button").style.boxShadow).toContain("#5468ff3d");
  });

  it("inactive has no focus state — falls back to default styling", () => {
    const { rerender } = render(<TopNavItem type="inactive" state="default">Nav item</TopNavItem>);
    const before = screen.getByRole("button").style.backgroundColor;
    rerender(<TopNavItem type="inactive" state="focus">Nav item</TopNavItem>);
    expect(screen.getByRole("button").style.backgroundColor).toBe(before);
  });
});

describe("confirmed boolean slots (§2) — no badge/counter/separator", () => {
  it("hides icon slots independently", () => {
    render(
      <TopNavItem leftIcon={false} rightIcon={false}>
        Nav item
      </TopNavItem>,
    );
    expect(screen.getByText("Nav item")).toBeInTheDocument();
  });

  it("hides the text slot when text=false", () => {
    render(<TopNavItem text={false}>Nav item</TopNavItem>);
    expect(screen.queryByText("Nav item")).not.toBeInTheDocument();
  });
});

describe("interactivity", () => {
  it("is a real, clickable button", () => {
    const onClick = vi.fn();
    render(<TopNavItem onClick={onClick}>Nav item</TopNavItem>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalled();
  });
});

// P1 one-off repair — text_wrap padding is px-6, not px-4.
describe("text_wrap padding (P1 repair)", () => {
  it("pads the label wrapper by 6px horizontally", () => {
    const { container } = render(<TopNavItem>Nav item</TopNavItem>);
    const label = Array.from(container.querySelectorAll("span")).find((el) => el.style.padding);
    expect(label?.style.padding).toBe("0px 0.375rem");
  });
});
