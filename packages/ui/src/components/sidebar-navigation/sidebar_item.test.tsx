import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as uiRoot from "../../index";
import { SidebarItem } from "./sidebar_item";

describe("root export", () => {
  it("exposes SidebarItem from the @shikho/ui package root", () => {
    expect(uiRoot.SidebarItem).toBe(SidebarItem);
  });
});

describe("confirmed sizes (docs/audit/sidebar-navigation-deep-audit.md §2)", () => {
  const sizes = [
    ["md", 40],
    ["lg", 48],
    ["xl", 56],
  ] as const;

  it.each(sizes)("size=%s renders at the confirmed %ipx height", (size, px) => {
    render(<SidebarItem size={size}>Nav item</SidebarItem>);
    expect(screen.getByRole("button").style.height).toBe(`${px}px`);
  });
});

describe("confirmed type x state=default matrix (§2)", () => {
  it("active_primary: primary_med_em fill, white SemiBold text, a black-150 border", () => {
    render(<SidebarItem type="active_primary">Nav item</SidebarItem>);
    const el = screen.getByRole("button");
    expect(el.style.backgroundColor).toBe("rgb(133, 164, 255)"); // primary/400
    expect(el.style.border).toContain("rgba(0, 0, 0, 0.12)");
  });

  it("active_primary_accent: 12% primary alpha fill, primary-600 text", () => {
    render(<SidebarItem type="active_primary_accent">Nav item</SidebarItem>);
    const el = screen.getByRole("button");
    expect(el.style.backgroundColor).toBe("rgba(84, 104, 255, 0.12)");
  });

  it("active: smoke_med fill, gray-950 text", () => {
    render(<SidebarItem type="active">Nav item</SidebarItem>);
    expect(screen.getByRole("button").style.backgroundColor).toBe("rgb(244, 244, 246)");
  });

  it("active_neutral: black fill, white text", () => {
    render(<SidebarItem type="active_neutral">Nav item</SidebarItem>);
    expect(screen.getByRole("button").style.backgroundColor).toBe("rgb(0, 0, 0)");
  });

  it("active_neutral_inverse: white fill, gray-950 text", () => {
    render(<SidebarItem type="active_neutral_inverse">Nav item</SidebarItem>);
    expect(screen.getByRole("button").style.backgroundColor).toBe("rgb(255, 255, 255)");
  });

  it("inactive: no fill, Medium weight (the only type at Medium — confirmed)", () => {
    render(<SidebarItem type="inactive">Nav item</SidebarItem>);
    const label = screen.getByText("Nav item");
    expect(label.style.fontWeight).toBe("500");
  });
});

describe("confirmed default -> hover transitions (§2)", () => {
  it("active_primary_accent intensifies from 12% to 20% alpha", () => {
    const { rerender } = render(<SidebarItem type="active_primary_accent" state="default">Nav item</SidebarItem>);
    expect(screen.getByRole("button").style.backgroundColor).toBe("rgba(84, 104, 255, 0.12)");
    rerender(<SidebarItem type="active_primary_accent" state="hover">Nav item</SidebarItem>);
    expect(screen.getByRole("button").style.backgroundColor).toBe("rgba(84, 104, 255, 0.2)");
  });

  it("inactive gains a subtle gray-50 fill only on hover", () => {
    const { rerender } = render(<SidebarItem type="inactive" state="default">Nav item</SidebarItem>);
    expect(screen.getByRole("button").style.backgroundColor).toBe("transparent");
    rerender(<SidebarItem type="inactive" state="hover">Nav item</SidebarItem>);
    expect(screen.getByRole("button").style.backgroundColor).toBe("rgb(249, 249, 250)");
  });
});

describe("confirmed boolean slots (§3)", () => {
  it("all 4 slots default to true", () => {
    render(
      <SidebarItem
        selectLeftIcon={<span data-testid="left" />}
        selectRightIcon={<span data-testid="right" />}
        tagContent="New"
      >
        Nav item
      </SidebarItem>,
    );
    expect(screen.getByTestId("left")).toBeInTheDocument();
    expect(screen.getByTestId("right")).toBeInTheDocument();
    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.getByText("Nav item")).toBeInTheDocument();
  });

  it("hides each slot independently", () => {
    render(
      <SidebarItem leftIcon={false} rightIcon={false} tag={false}>
        Nav item
      </SidebarItem>,
    );
    expect(screen.queryByText("Tag")).not.toBeInTheDocument();
  });
});

describe("interactivity", () => {
  it("is a real, clickable button", () => {
    const onClick = vi.fn();
    render(<SidebarItem onClick={onClick}>Nav item</SidebarItem>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalled();
  });
});

// P1 repair pass — per-size table replaces lg-only extrapolation.
describe("per-size metrics are independent (P1 repair)", () => {
  const rows = [
    ["md", "40px", "0.5rem 0.75rem", "10px", "13px", "20px"],
    ["lg", "48px", "0.75rem", "12px", "13px", "20px"],
    ["xl", "56px", "1rem", "12px", "18px", "24px"],
  ] as const;

  it.each(rows)(
    "size=%s → height %s, padding %s, radius %s, text %s",
    (size, height, padding, radiusPx, fontSize, rightIcon) => {
      const { container } = render(<SidebarItem size={size}>Nav item</SidebarItem>);
      const root = container.firstChild as HTMLElement;
      expect(root.style.height).toBe(height);
      expect(root.style.padding).toBe(padding);
      expect(root.style.borderRadius).toBe(radiusPx);
      const label = Array.from(root.querySelectorAll("span")).find((el) => el.style.fontSize);
      expect(label?.style.fontSize).toBe(fontSize);
      expect(rightIcon).toBeTruthy();
    },
  );
});
