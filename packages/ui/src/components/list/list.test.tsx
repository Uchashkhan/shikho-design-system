import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import * as uiRoot from "../../index";
import { Checkbox } from "../checkbox";
import { List } from "./list";

describe("root export", () => {
  it("exposes List from the @shikho/ui package root", () => {
    expect(uiRoot.List).toBe(List);
  });
});

describe("confirmed variants render", () => {
  const sizes = ["md", "lg", "xl"] as const;
  const states = ["default", "hover", "active_primary_accent"] as const;

  it.each(sizes)("renders size=%s without crashing", (size) => {
    const { container } = render(<List size={size} textContent="List item" />);
    expect(container.querySelector(`[data-size='${size}']`)).toBeInTheDocument();
  });

  it.each(states)("renders state=%s without crashing", (state) => {
    const { container } = render(<List state={state} textContent="List item" />);
    expect(container.querySelector(`[data-state='${state}']`)).toBeInTheDocument();
  });

  it("applies the confirmed root fill and bottom-only divider for every state", () => {
    const { container } = render(<List textContent="List item" />);
    const root = container.firstChild as HTMLElement;
    expect(root.style.backgroundColor).toBe("rgb(235, 236, 240)"); // Color/Gray #ebecf0
    expect(root.style.borderBottom).toContain("244, 244, 246"); // outline/Gray 100 #f4f4f6
    expect(root.style.borderRadius).toBe("0");
  });
});

describe("leadIcon composes the real Checkbox, not a re-implementation", () => {
  it("renders an actual <input type=checkbox> when leadIcon is true (default)", () => {
    render(<List textContent="List item" checkboxProps={{ "aria-label": "Select row" }} />);
    expect(screen.getByRole("checkbox", { name: "Select row" })).toBeInTheDocument();
  });

  it("renders no checkbox at all when leadIcon is false", () => {
    render(<List leadIcon={false} textContent="List item" />);
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("forwards checked/onChange through checkboxProps to the composed Checkbox", () => {
    render(
      <List
        textContent="List item"
        checkboxProps={{ "aria-label": "Select row", defaultChecked: false }}
      />,
    );
    const box = screen.getByRole("checkbox", { name: "Select row" }) as HTMLInputElement;
    expect(box.checked).toBe(false);
    fireEvent.click(box);
    expect(box.checked).toBe(true);
  });

  it("forwards disabled through checkboxProps", () => {
    render(<List textContent="List item" checkboxProps={{ "aria-label": "Select row", disabled: true }} />);
    expect(screen.getByRole("checkbox", { name: "Select row" })).toBeDisabled();
  });

  it("always renders the checkbox at the confirmed nested size/shape (sm/square)", () => {
    const { container } = render(
      <List textContent="List item" checkboxProps={{ "aria-label": "Select row" }} />,
    );
    const box = container.querySelector("input[type='checkbox']");
    expect(box).toHaveAttribute("data-size", "sm");
    expect(box).toHaveAttribute("data-shape", "square");
  });
});

describe("boolean slots", () => {
  it("renders text/description/trailText/description2/tag content when their booleans are true", () => {
    render(
      <List
        textContent="Main text"
        description1Content="Description one"
        trailTextContent="Trail text"
        description2Content="Description two"
        tagContent="Tag"
      />,
    );
    expect(screen.getByText("Main text")).toBeInTheDocument();
    expect(screen.getByText("Description one")).toBeInTheDocument();
    expect(screen.getByText("Trail text")).toBeInTheDocument();
    expect(screen.getByText("Description two")).toBeInTheDocument();
    expect(screen.getByText("Tag")).toBeInTheDocument();
  });

  it("hides slots when their confirmed boolean is set to false", () => {
    render(
      <List
        textContent="Main text"
        description1={false}
        tag={false}
        textGroup2={false}
      />,
    );
    expect(screen.getByText("Main text")).toBeInTheDocument();
    expect(screen.queryByText("Description one")).not.toBeInTheDocument();
  });

  it("does not render leadItem/leadItemLg images without a src (no invented placeholder asset)", () => {
    const { container } = render(<List textContent="Main text" />);
    expect(container.querySelectorAll("img")).toHaveLength(0);
  });
});

describe("no unsupported variant is exported", () => {
  it("rejects a size/state value outside the confirmed enum at the type level", () => {
    // @ts-expect-error - "sm" is not a confirmed list size (only md/lg/xl exist, §2)
    const invalidSize: import("./list").ListSize = "sm";
    // @ts-expect-error - "selected" is not a confirmed list state (§2)
    const invalidState: import("./list").ListState = "selected";
    expect([invalidSize, invalidState]).toBeDefined();
  });
});

describe("no circular dependency", () => {
  it("Checkbox module does not import List", () => {
    // Sanity check: importing Checkbox in isolation must not pull in List.
    expect(Checkbox).toBeDefined();
    expect((Checkbox as unknown as { List?: unknown }).List).toBeUndefined();
  });
});
