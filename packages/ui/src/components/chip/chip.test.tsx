import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import * as uiRoot from "../../index";
import { Chip } from "./chip";

describe("root export", () => {
  it("exposes Chip from the @shikho/ui package root", () => {
    expect(uiRoot.Chip).toBe(Chip);
  });
});

describe("confirmed binding (size=md, type=selected)", () => {
  it("renders the exactly confirmed fill, text color, radius, and height", () => {
    render(<Chip textContent="Chip" />);
    const chip = screen.getByRole("button", { name: "Chip" });
    expect(chip.style.backgroundColor).toBe("rgb(213, 231, 255)"); // Color/primary/200 #d5e7ff
    expect(chip.style.color).toBe("rgb(59, 78, 227)"); // Text/primary-600 #3b4ee3
    expect(chip.style.borderRadius).toBe("1000px"); // radius/border_radius_round
    expect(chip.style.height).toBe("32px"); // confirmed exact for md
  });

  it("applies the confirmed focus ring on state=focus", () => {
    render(<Chip state="focus" textContent="Chip" />);
    expect(screen.getByRole("button", { name: "Chip" }).style.boxShadow).toContain("#5468ff3d"); // outline/primary_alpha
  });
});

describe("all confirmed types render", () => {
  const types = ["unselected", "selected", "selected_neutral", "Green", "Red"] as const;

  it.each(types)("renders type=%s without crashing", (type) => {
    render(<Chip type={type} textContent={type} />);
    expect(screen.getByRole("button", { name: type })).toBeInTheDocument();
  });
});

describe("confirmed boolean slots", () => {
  it("hides left/right icon slots and text when their booleans are false", () => {
    const { container, rerender } = render(
      <Chip textContent="Chip" selectLeftIcon={<span data-testid="left" />} selectRightIcon={<span data-testid="right" />} />,
    );
    expect(screen.getByTestId("left")).toBeInTheDocument();
    expect(screen.getByTestId("right")).toBeInTheDocument();
    expect(screen.getByText("Chip")).toBeInTheDocument();

    rerender(
      <Chip
        textContent="Chip"
        leftIcon={false}
        rightIcon={false}
        text={false}
        selectLeftIcon={<span data-testid="left" />}
        selectRightIcon={<span data-testid="right" />}
      />,
    );
    expect(screen.queryByTestId("left")).not.toBeInTheDocument();
    expect(screen.queryByTestId("right")).not.toBeInTheDocument();
    expect(screen.queryByText("Chip")).not.toBeInTheDocument();
    expect(container).toBeDefined();
  });
});

describe("disabled", () => {
  it("applies the native disabled attribute via state=disabled", () => {
    render(<Chip state="disabled" textContent="Chip" />);
    expect(screen.getByRole("button", { name: "Chip" })).toBeDisabled();
  });

  it("applies the native disabled attribute via the disabled prop directly", () => {
    render(<Chip disabled textContent="Chip" />);
    expect(screen.getByRole("button", { name: "Chip" })).toBeDisabled();
  });
});

describe("confirmed coverage gap: Green/Red only meaningfully support state=default", () => {
  it("still renders Green/Red with other state values, using the same default visual (documented, not invented)", () => {
    render(<Chip type="Green" state="hover" textContent="Green chip" />);
    const chip = screen.getByRole("button", { name: "Green chip" });
    expect(chip.style.backgroundColor).toBe("rgb(53, 194, 32)"); // Color/success/500
  });
});

describe("confirmed corrections from the deep re-audit (docs/audit/chips.md §14)", () => {
  it("unselected/default is white with a black/50 border and the resting inset — not a flat gray fill with no border", () => {
    render(<Chip type="unselected" textContent="Chip" />);
    const chip = screen.getByRole("button", { name: "Chip" });
    expect(chip.style.backgroundColor).toBe("rgb(255, 255, 255)");
    expect(chip.style.border).toContain("rgba(0, 0, 0, 0.04)");
    expect(chip.style.boxShadow).toContain("inset");
  });

  it("unselected/hover lightens to gray/50", () => {
    render(<Chip type="unselected" state="hover" textContent="Chip" />);
    expect(screen.getByRole("button", { name: "Chip" }).style.backgroundColor).toBe("rgb(249, 249, 250)");
  });

  it("selected/default has a primary/400 border — previously missing entirely", () => {
    render(<Chip type="selected" textContent="Chip" />);
    expect(screen.getByRole("button", { name: "Chip" }).style.border).toContain("133, 164, 255");
  });

  it("selected/disabled renders SemiBold text weight, distinct from every other state's Medium", () => {
    render(<Chip type="selected" state="disabled" textContent="Chip" />);
    expect(screen.getByRole("button", { name: "Chip" }).style.fontWeight).toBe("600");
  });

  it("selected_neutral/default text is gray/950, not gray/700 (distinct from unselected)", () => {
    render(<Chip type="selected_neutral" textContent="Chip" />);
    expect(screen.getByRole("button", { name: "Chip" }).style.color).toBe("rgb(10, 12, 17)");
  });

  it("Green/Red render a confirmed black/150 border, not borderless", () => {
    render(<Chip type="Green" textContent="Chip" />);
    expect(screen.getByRole("button", { name: "Chip" }).style.border).toContain("rgba(0, 0, 0, 0.12)");
  });

  it("drag state replaces the resting inset with the confirmed elevation.e5-equivalent outer shadow", () => {
    render(<Chip type="unselected" state="drag" textContent="Chip" />);
    const chip = screen.getByRole("button", { name: "Chip" });
    expect(chip.style.boxShadow).not.toContain("inset");
    expect(chip.style.boxShadow).toContain("56px");
  });

  it("icon slots use a drop-shadow filter, not a boxShadow, on the (empty) icon bounding box", () => {
    render(<Chip selectLeftIcon={<svg data-testid="icon" />} textContent="Chip" />);
    const iconSlot = screen.getByTestId("icon").parentElement as HTMLElement;
    expect(iconSlot.style.filter).toContain("drop-shadow");
    expect(iconSlot.style.boxShadow).toBeFalsy();
  });
});

describe("no unsupported variant is exported", () => {
  it("rejects a size/type/state value outside the confirmed enum at the type level", () => {
    // @ts-expect-error - "xl" is not a confirmed chip size (only lg/md/sm exist, §2)
    const invalidSize: import("./chip").ChipSize = "xl";
    // @ts-expect-error - "checked" is not a confirmed chip type (§2)
    const invalidType: import("./chip").ChipType = "checked";
    expect([invalidSize, invalidType]).toBeDefined();
  });
});

// P1 repair pass — per-size padding/gap/typography replace md-only extrapolation.
// `lg`'s horizontal padding (now 8px, uniform) is a requested override, not the Figma-confirmed
// value (12px, node 66075:28800) — reduced in two steps because it read as button-like. See
// chip.tsx's own SIZE_METRICS comment.
describe("per-size metrics are independent (P1 repair)", () => {
  const rows = [
    ["sm", "24px", "0.25rem 0.375rem", "0", "11px"],
    ["md", "32px", "0.5rem", "0.125rem", "12px"],
    ["lg", "40px", "0.5rem", "0.25rem", "13px"],
  ] as const;

  it.each(rows)("size=%s → height %s, padding %s, gap %s, font %s", (size, height, padding, gap, fontSize) => {
    const { container } = render(<Chip size={size} textContent="Chip" />);
    const root = container.firstChild as HTMLElement;
    expect(root.style.height).toBe(height);
    expect(root.style.padding).toBe(padding);
    expect(root.style.gap).toBe(gap);
    const label = Array.from(root.querySelectorAll("span")).find((el) => el.style.fontSize);
    expect(label?.style.fontSize).toBe(fontSize);
  });
});
