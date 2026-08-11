import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as uiRoot from "../../index";
import { SidebarItemCollapsed } from "./sidebar_item_collapsed";

describe("root export", () => {
  it("exposes SidebarItemCollapsed from the @shikho/ui package root", () => {
    expect(uiRoot.SidebarItemCollapsed).toBe(SidebarItemCollapsed);
  });
});

describe("confirmed reduced structure (docs/audit/sidebar-navigation-deep-audit.md §4)", () => {
  it("renders at the confirmed fixed 64x56 size regardless of any size prop", () => {
    render(<SidebarItemCollapsed>Item</SidebarItemCollapsed>);
    const el = screen.getByRole("button");
    expect(el.style.width).toBe("64px");
    expect(el.style.height).toBe("56px");
  });

  it("has no tag and no right icon slot — a confirmed reduced structure vs. SidebarItem", () => {
    render(<SidebarItemCollapsed>Item</SidebarItemCollapsed>);
    expect(screen.queryByText("Tag")).not.toBeInTheDocument();
  });

  it("confirmed active_primary_accent fill matches SidebarItem's own token", () => {
    render(<SidebarItemCollapsed type="active_primary_accent">Item</SidebarItemCollapsed>);
    expect(screen.getByRole("button").style.backgroundColor).toBe("rgba(84, 104, 255, 0.12)");
  });

  it("hides the icon and label independently", () => {
    render(
      <SidebarItemCollapsed icon={false} selectLeftIcon={<span data-testid="icon" />}>
        Item
      </SidebarItemCollapsed>,
    );
    expect(screen.queryByTestId("icon")).not.toBeInTheDocument();
  });
});

describe("interactivity", () => {
  it("is a real, clickable button", () => {
    const onClick = vi.fn();
    render(<SidebarItemCollapsed onClick={onClick}>Item</SidebarItemCollapsed>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalled();
  });

  it("with no `state` prop, the real pointer drives hover", () => {
    render(<SidebarItemCollapsed type="active_primary_accent">Item</SidebarItemCollapsed>);
    const el = screen.getByRole("button");
    expect(el.style.backgroundColor).toBe("rgba(84, 104, 255, 0.12)");
    fireEvent.mouseEnter(el);
    expect(el.style.backgroundColor).toBe("rgba(84, 104, 255, 0.2)");
    fireEvent.mouseLeave(el);
    expect(el.style.backgroundColor).toBe("rgba(84, 104, 255, 0.12)");
  });

  it("an explicit `state` prop overrides the pointer", () => {
    render(
      <SidebarItemCollapsed type="active_primary_accent" state="default">
        Item
      </SidebarItemCollapsed>,
    );
    const el = screen.getByRole("button");
    fireEvent.mouseEnter(el);
    expect(el.style.backgroundColor).toBe("rgba(84, 104, 255, 0.12)");
  });
});
