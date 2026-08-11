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
  it("active_primary: primary/500 fill (intentional deviation from Figma's primary_med_em), white text, black-150 border", () => {
    render(<SwitcherItem type="active_primary">Nav item</SwitcherItem>);
    const el = screen.getByRole("button");
    expect(el.style.backgroundColor).toBe("rgb(84, 104, 255)");
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

describe("confirmed default -> hover transitions (§2, re-confirmed via get_design_context on 66065:22392)", () => {
  it("active_primary_accent intensifies from 12% to 20% alpha", () => {
    const { rerender } = render(<SwitcherItem type="active_primary_accent" state="default">Nav item</SwitcherItem>);
    expect(screen.getByRole("button").style.backgroundColor).toBe("rgba(84, 104, 255, 0.12)");
    rerender(<SwitcherItem type="active_primary_accent" state="hover">Nav item</SwitcherItem>);
    expect(screen.getByRole("button").style.backgroundColor).toBe("rgba(84, 104, 255, 0.2)");
  });

  it("active_primary moves from primary/500 to primary/600 on hover (intentional deviation from Figma's confirmed primary_med_em/primary_base pair, bumped one ramp step)", () => {
    const { rerender } = render(<SwitcherItem type="active_primary" state="default">Nav item</SwitcherItem>);
    expect(screen.getByRole("button").style.backgroundColor).toBe("rgb(84, 104, 255)");
    rerender(<SwitcherItem type="active_primary" state="hover">Nav item</SwitcherItem>);
    expect(screen.getByRole("button").style.backgroundColor).toBe("rgb(59, 78, 227)");
  });

  it("active_neutral moves from solid black to ~88% opaque black (previously a static swatch)", () => {
    const { rerender } = render(<SwitcherItem type="active_neutral" state="default">Nav item</SwitcherItem>);
    expect(screen.getByRole("button").style.backgroundColor).toBe("rgb(0, 0, 0)");
    rerender(<SwitcherItem type="active_neutral" state="hover">Nav item</SwitcherItem>);
    expect(screen.getByRole("button").style.backgroundColor).toBe("rgba(0, 0, 0, 0.88)");
  });

  it("active moves from white (smoke_em) to smoke_med gray", () => {
    const { rerender } = render(<SwitcherItem type="active" state="default">Nav item</SwitcherItem>);
    expect(screen.getByRole("button").style.backgroundColor).toBe("rgb(255, 255, 255)");
    rerender(<SwitcherItem type="active" state="hover">Nav item</SwitcherItem>);
    expect(screen.getByRole("button").style.backgroundColor).toBe("rgb(244, 244, 246)");
  });

  it("inactive gains a subtle gray-50 fill only on hover", () => {
    const { rerender } = render(<SwitcherItem type="inactive" state="default">Nav item</SwitcherItem>);
    expect(screen.getByRole("button").style.backgroundColor).toBe("transparent");
    rerender(<SwitcherItem type="inactive" state="hover">Nav item</SwitcherItem>);
    expect(screen.getByRole("button").style.backgroundColor).toBe("rgb(249, 249, 250)");
  });
});

describe("confirmed per-size radius (previously hardcoded to radius.lg at every size)", () => {
  it("xs/sm/md use radius.sm (8px)", () => {
    for (const size of ["xs", "sm", "md"] as const) {
      const { container } = render(<SwitcherItem size={size}>Nav item</SwitcherItem>);
      const root = container.firstChild as HTMLElement;
      expect(root.style.borderRadius).toBe("8px");
    }
  });

  it("lg/xl use radius.lg (12px)", () => {
    for (const size of ["lg", "xl"] as const) {
      const { container } = render(<SwitcherItem size={size}>Nav item</SwitcherItem>);
      const root = container.firstChild as HTMLElement;
      expect(root.style.borderRadius).toBe("12px");
    }
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

  it("with no `state` prop, the real pointer drives hover (previously a static swatch)", () => {
    render(<SwitcherItem type="active_primary_accent">Nav item</SwitcherItem>);
    const el = screen.getByRole("button");
    expect(el.style.backgroundColor).toBe("rgba(84, 104, 255, 0.12)");
    fireEvent.mouseEnter(el);
    expect(el.style.backgroundColor).toBe("rgba(84, 104, 255, 0.2)");
    fireEvent.mouseLeave(el);
    expect(el.style.backgroundColor).toBe("rgba(84, 104, 255, 0.12)");
  });

  it("an explicit `state` prop overrides the pointer", () => {
    render(
      <SwitcherItem type="active_primary_accent" state="default">
        Nav item
      </SwitcherItem>,
    );
    const el = screen.getByRole("button");
    fireEvent.mouseEnter(el);
    expect(el.style.backgroundColor).toBe("rgba(84, 104, 255, 0.12)");
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
