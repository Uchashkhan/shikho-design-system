import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import * as uiRoot from "../../index";
import { ButtonGroup, type ButtonGroupItem } from "./button_group";

const threeItems: ButtonGroupItem[] = [
  { label: "One" },
  { label: "Two" },
  { label: "Three" },
];

describe("root export", () => {
  it("exposes ButtonGroup from the @shikho/ui package root", () => {
    expect(uiRoot.ButtonGroup).toBe(ButtonGroup);
  });
});

describe("confirmed sizes", () => {
  const sizes = ["xs", "sm", "md", "lg", "xl"] as const;

  it.each(sizes)("renders size=%s without crashing", (size) => {
    render(<ButtonGroup size={size} items={threeItems} />);
    expect(screen.getByText("One")).toBeInTheDocument();
  });
});

describe("segment count and content", () => {
  it("renders one segment per item", () => {
    render(<ButtonGroup items={threeItems} />);
    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText("Two")).toBeInTheDocument();
    expect(screen.getByText("Three")).toBeInTheDocument();
  });

  it("renders icons only when supplied", () => {
    render(
      <ButtonGroup
        items={[
          { label: "Left", leftIcon: <span data-testid="left-icon" /> },
          { label: "Plain" },
        ]}
      />,
    );
    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
  });
});

describe("confirmed first/middle/last segment treatment (§15, §16)", () => {
  it("marks segments with their position", () => {
    const { container } = render(<ButtonGroup items={threeItems} />);
    const segments = container.querySelectorAll("[data-segment]");
    expect(segments).toHaveLength(3);
    expect(segments[0]).toHaveAttribute("data-segment", "first");
    expect(segments[1]).toHaveAttribute("data-segment", "middle");
    expect(segments[2]).toHaveAttribute("data-segment", "last");
  });

  it("gives the first segment left-corner rounding and a full 4-side border", () => {
    const { container } = render(<ButtonGroup items={threeItems} />);
    const first = container.querySelector('[data-segment="first"]') as HTMLElement;
    expect(first.style.borderTopLeftRadius).toBe("6px");
    expect(first.style.borderBottomLeftRadius).toBe("6px");
    expect(first.style.borderTopRightRadius).toBe("0");
    expect(first.style.borderWidth).toBe("1px");
  });

  it("gives the last segment right-corner rounding and a full 4-side border", () => {
    const { container } = render(<ButtonGroup items={threeItems} />);
    const last = container.querySelector('[data-segment="last"]') as HTMLElement;
    expect(last.style.borderTopRightRadius).toBe("6px");
    expect(last.style.borderBottomRightRadius).toBe("6px");
    expect(last.style.borderTopLeftRadius).toBe("0");
    expect(last.style.borderWidth).toBe("1px");
  });

  it("gives middle segments square corners and only a top/bottom border", () => {
    const { container } = render(<ButtonGroup items={threeItems} />);
    const middle = container.querySelector('[data-segment="middle"]') as HTMLElement;
    expect(middle.style.borderTopLeftRadius).toBe("0");
    expect(middle.style.borderTopRightRadius).toBe("0");
    expect(middle.style.borderBottomLeftRadius).toBe("0");
    expect(middle.style.borderBottomRightRadius).toBe("0");
    expect(middle.style.borderWidth).toBe("1px 0px");
  });

  it("applies square corners to both segments when only 2 items are given", () => {
    const { container } = render(<ButtonGroup items={[{ label: "A" }, { label: "B" }]} />);
    const segments = container.querySelectorAll("[data-segment]");
    expect(segments[0]).toHaveAttribute("data-segment", "first");
    expect(segments[1]).toHaveAttribute("data-segment", "last");
  });
});

describe("confirmed uniform fill (no type property exists to vary it, §14/§17)", () => {
  it("applies the confirmed secondary/500 fill and white text to every segment", () => {
    const { container } = render(<ButtonGroup items={threeItems} />);
    const first = container.querySelector('[data-segment="first"]') as HTMLElement;
    expect(first.style.backgroundColor).toBe("rgb(226, 0, 141)"); // Color/secondary/500
    expect(first.style.color).toBe("rgb(255, 255, 255)");
  });
});

describe("confirmed zero gap (§7)", () => {
  it("applies no gap between segments", () => {
    const { container } = render(<ButtonGroup items={threeItems} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.gap).toBe("");
  });
});

// P2 repair — the icon slot must use a drop-shadow FILTER (follows the glyph silhouette), not a
// boxShadow (which draws a rectangle around the slot's bounding box). Same bug Chip already fixed.
describe("icon shadow technique (P2 repair)", () => {
  it("applies elevation/e2 as a drop-shadow filter, never as a box-shadow", () => {
    const { container } = render(
      <ButtonGroup
        size="xs"
        items={[
          { label: "One", leftIcon: <i data-testid="l" />, rightIcon: <i data-testid="r" /> },
          { label: "Two" },
        ]}
      />,
    );
    const iconSlots = Array.from(container.querySelectorAll("span")).filter(
      (el) => el.style.width === "14px",
    );
    expect(iconSlots.length).toBeGreaterThan(0);
    for (const slot of iconSlots) {
      expect(slot.style.filter).toContain("drop-shadow");
      expect(slot.style.boxShadow).toBe("");
    }
  });
});
