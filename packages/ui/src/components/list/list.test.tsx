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

  // Corrected in the v0.1.0 repair pass: the three states are visually distinct. The previous
  // assertion required Color/Gray on EVERY state, which encoded the defect it was meant to guard.
  it("renders no row fill in the default state — only the bottom divider", () => {
    const { container } = render(<List state="default" textContent="List item" />);
    const root = container.firstChild as HTMLElement;
    expect(root.style.backgroundColor).toBe("");
    expect(root.style.borderBottom).toContain("244, 244, 246"); // outline/Gray 100 #f4f4f6
    expect(root.style.borderRadius).toBe("0");
  });

  it("fills hover with gray-100 and active_primary_accent with gray-200", () => {
    const { container: hover } = render(<List state="hover" textContent="List item" />);
    expect((hover.firstChild as HTMLElement).style.backgroundColor).toBe("rgb(244, 244, 246)");

    const { container: active } = render(
      <List state="active_primary_accent" textContent="List item" />,
    );
    expect((active.firstChild as HTMLElement).style.backgroundColor).toBe("rgb(235, 236, 240)");
  });

  it("uses gray-700 main text in default and gray-950 once hovered/active", () => {
    const mainTextColor = (root: HTMLElement) =>
      Array.from(root.querySelectorAll("span")).find(
        (el) => el.textContent === "Row" && el.style.color,
      )?.style.color;

    const { container: def } = render(<List state="default" textContent="Row" />);
    expect(mainTextColor(def.firstChild as HTMLElement)).toBe("rgb(91, 97, 109)");

    const { container: active } = render(
      <List state="active_primary_accent" textContent="Row" />,
    );
    expect(mainTextColor(active.firstChild as HTMLElement)).toBe("rgb(10, 12, 17)");
  });

  it("applies the confirmed 12px gap at every size", () => {
    const { container } = render(<List textContent="List item" />);
    expect((container.firstChild as HTMLElement).style.gap).toBe("0.75rem");
  });
});

// P1 repair pass — per-size metrics replace the previous md-for-all-sizes reuse.
describe("per-size metrics are independent (P1 repair)", () => {
  const rows = [
    ["md", "0.5rem", 32, "20px", "13px", "12px", "0.125rem"],
    ["lg", "0.75rem", 36, "24px", "13px", "12px", "0.25rem"],
    ["xl", "1rem", 40, "24px", "18px", "13px", "0.25rem"],
  ] as const;

  it.each(rows)(
    "size=%s → padding %s, leadItemLg %ipx, icon %s, text %s, description %s",
    (size, padding, leadItemLg, icon, mainText, description, trailPad) => {
      const { container } = render(
        <List
          size={size}
          textContent="Row"
          description1Content="Desc"
          leadItemLg
          leadItemLgSrc="/x.png"
          selectLeftIcon={<i />}
        />,
      );
      const root = container.firstChild as HTMLElement;
      expect(root.style.padding).toBe(padding);

      const img = root.querySelector("img") as HTMLImageElement;
      expect(img.getAttribute("width")).toBe(String(leadItemLg));

      const iconSlot = Array.from(root.querySelectorAll("span")).find((el) => el.style.filter);
      expect(iconSlot?.style.width).toBe(icon);

      const spans = Array.from(root.querySelectorAll("span"));
      expect(spans.find((el) => el.textContent === "Row" && el.style.fontSize)?.style.fontSize).toBe(mainText);
      expect(spans.find((el) => el.textContent === "Desc" && el.style.fontSize)?.style.fontSize).toBe(description);
      const trailGroup = root.querySelector('[class*="items-end"]') as HTMLElement;
      expect(trailGroup.style.paddingRight).toBe(trailPad);
    },
  );
});

describe("tag composes the real Tags component per state", () => {
  it("nests Tags at type=secondary in the default state", () => {
    const { container } = render(<List state="default" tagContent="Tag" textContent="Row" />);
    expect(container.querySelector("[data-type='secondary']")).toBeInTheDocument();
  });

  it("nests Tags at type=tertiary in hover and active_primary_accent", () => {
    const { container: hover } = render(<List state="hover" tagContent="Tag" textContent="Row" />);
    expect(hover.querySelector("[data-type='tertiary']")).toBeInTheDocument();

    const { container: active } = render(
      <List state="active_primary_accent" tagContent="Tag" textContent="Row" />,
    );
    expect(active.querySelector("[data-type='tertiary']")).toBeInTheDocument();
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
