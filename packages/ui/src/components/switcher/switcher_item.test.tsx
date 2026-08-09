import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as uiRoot from "../../index";
import { SwitcherItem } from "./switcher_item";

describe("root export", () => {
  it("exposes SwitcherItem from the @shikho/ui package root", () => {
    expect(uiRoot.SwitcherItem).toBe(SwitcherItem);
  });
});

describe("confirmed sizes (docs/audit/switcher-deep-audit.md §4)", () => {
  const sizes = [
    ["xs", 24],
    ["sm", 32],
    ["md", 40],
    ["lg", 48],
    ["xl", 56],
  ] as const;

  it.each(sizes)("size=%s renders at the confirmed %ipx height", (size, px) => {
    render(<SwitcherItem size={size}>Nav item</SwitcherItem>);
    expect(screen.getByRole("button").style.height).toBe(`${px}px`);
  });
});

describe("confirmed type x state=default matrix (§2)", () => {
  it("active_primary: primary_med_em fill, white text, black-150 border", () => {
    render(<SwitcherItem type="active_primary">Nav item</SwitcherItem>);
    const el = screen.getByRole("button");
    expect(el.style.backgroundColor).toBe("rgb(133, 164, 255)");
    expect(el.style.border).toContain("rgba(0, 0, 0, 0.12)");
  });

  it("active_primary_accent: 12% primary alpha, primary-600 text", () => {
    render(<SwitcherItem type="active_primary_accent">Nav item</SwitcherItem>);
    expect(screen.getByRole("button").style.backgroundColor).toBe("rgba(84, 104, 255, 0.12)");
  });

  it("active: white (smoke_em) fill, gray-950 text", () => {
    render(<SwitcherItem type="active">Nav item</SwitcherItem>);
    expect(screen.getByRole("button").style.backgroundColor).toBe("rgb(255, 255, 255)");
  });

  it("active_neutral: black fill, white text", () => {
    render(<SwitcherItem type="active_neutral">Nav item</SwitcherItem>);
    expect(screen.getByRole("button").style.backgroundColor).toBe("rgb(0, 0, 0)");
  });

  it("inactive: no fill, SemiBold weight at gray-600 (confirmed different from SidebarItem's Medium/gray-700)", () => {
    render(<SwitcherItem type="inactive">Nav item</SwitcherItem>);
    const label = screen.getByText("Nav item");
    expect(label.style.fontWeight).toBe("600");
    expect(label.style.color).toBe("rgb(140, 146, 156)");
  });
});

describe("confirmed default -> hover transition for active_primary_accent (§2)", () => {
  it("intensifies from 12% to 20% alpha", () => {
    const { rerender } = render(<SwitcherItem type="active_primary_accent" state="default">Nav item</SwitcherItem>);
    expect(screen.getByRole("button").style.backgroundColor).toBe("rgba(84, 104, 255, 0.12)");
    rerender(<SwitcherItem type="active_primary_accent" state="hover">Nav item</SwitcherItem>);
    expect(screen.getByRole("button").style.backgroundColor).toBe("rgba(84, 104, 255, 0.2)");
  });
});

describe("confirmed simpler structure than SidebarItem (§3) — no tag slot", () => {
  it("has no tag prop or rendered tag content", () => {
    render(<SwitcherItem>Nav item</SwitcherItem>);
    expect(screen.queryByText("Tag")).not.toBeInTheDocument();
  });

  it("hides icon slots independently", () => {
    render(
      <SwitcherItem leftIcon={false} rightIcon={false}>
        Nav item
      </SwitcherItem>,
    );
    expect(screen.getByText("Nav item")).toBeInTheDocument();
  });
});

describe("interactivity", () => {
  it("is a real, clickable button", () => {
    const onClick = vi.fn();
    render(<SwitcherItem onClick={onClick}>Nav item</SwitcherItem>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalled();
  });
});

// P1 one-off repair — xs is caption_1 (11px), not sm's 12px.
describe("xs typography (P1 repair)", () => {
  it("renders xs at 11px/16px and sm at 12px/16px", () => {
    const { container: xs } = render(<SwitcherItem size="xs">Nav</SwitcherItem>);
    const xsLabel = Array.from(xs.querySelectorAll("span")).find((el) => el.style.fontSize);
    expect(xsLabel?.style.fontSize).toBe("11px");

    const { container: sm } = render(<SwitcherItem size="sm">Nav</SwitcherItem>);
    const smLabel = Array.from(sm.querySelectorAll("span")).find((el) => el.style.fontSize);
    expect(smLabel?.style.fontSize).toBe("12px");
  });
});
