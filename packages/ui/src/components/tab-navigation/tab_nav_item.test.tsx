import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as uiRoot from "../../index";
import { TabNavItem } from "./tab_nav_item";

describe("root export", () => {
  it("exposes TabNavItem from the @shikho/ui package root", () => {
    expect(uiRoot.TabNavItem).toBe(TabNavItem);
  });
});

describe("confirmed sizes (docs/audit/tab-navigation-deep-audit.md §2)", () => {
  const sizes = [
    ["xs", 24],
    ["sm", 32],
    ["md", 40],
    ["lg", 48],
    ["xl", 56],
  ] as const;

  it.each(sizes)("size=%s renders at the confirmed %ipx height", (size, px) => {
    render(<TabNavItem size={size}>Nav item</TabNavItem>);
    expect(screen.getByRole("button").style.height).toBe(`${px}px`);
  });
});

describe("confirmed type x state matrix (§1)", () => {
  it("active: border-bottom in outline/b (black), gray-950 text", () => {
    render(<TabNavItem type="active">Nav item</TabNavItem>);
    const el = screen.getByRole("button");
    expect(el.style.borderBottom).toContain("rgb(0, 0, 0)");
    expect(screen.getByText("Nav item").style.color).toBe("rgb(10, 12, 17)");
  });

  it("inactive/default: no border, gray-600 text", () => {
    render(<TabNavItem type="inactive" state="default">Nav item</TabNavItem>);
    const el = screen.getByRole("button");
    expect(el.style.borderBottom).toContain("transparent");
    expect(screen.getByText("Nav item").style.color).toBe("rgb(140, 146, 156)");
  });

  it("inactive/hover: no background fill, only a darker gray-700 text color (confirmed different mechanism from SwitcherItem/SidebarItem)", () => {
    render(<TabNavItem type="inactive" state="hover">Nav item</TabNavItem>);
    const el = screen.getByRole("button");
    expect(el.style.background).toBe("transparent");
    expect(screen.getByText("Nav item").style.color).toBe("rgb(91, 97, 109)");
  });

  it("confirmed: active never has an hover-distinct treatment — state is ignored when type=active", () => {
    render(<TabNavItem type="active" state="hover">Nav item</TabNavItem>);
    expect(screen.getByText("Nav item").style.color).toBe("rgb(10, 12, 17)");
  });
});

describe("confirmed boolean slots", () => {
  it("hides icon slots independently", () => {
    render(
      <TabNavItem leftIcon={false} rightIcon={false}>
        Nav item
      </TabNavItem>,
    );
    expect(screen.getByText("Nav item")).toBeInTheDocument();
  });

  it("hides the label when text is false", () => {
    render(<TabNavItem text={false}>Hidden</TabNavItem>);
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });
});

describe("interactivity", () => {
  it("is a real, clickable button", () => {
    const onClick = vi.fn();
    render(<TabNavItem onClick={onClick}>Nav item</TabNavItem>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalled();
  });
});
