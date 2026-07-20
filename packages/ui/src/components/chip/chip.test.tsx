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

describe("no unsupported variant is exported", () => {
  it("rejects a size/type/state value outside the confirmed enum at the type level", () => {
    // @ts-expect-error - "xl" is not a confirmed chip size (only lg/md/sm exist, §2)
    const invalidSize: import("./chip").ChipSize = "xl";
    // @ts-expect-error - "checked" is not a confirmed chip type (§2)
    const invalidType: import("./chip").ChipType = "checked";
    expect([invalidSize, invalidType]).toBeDefined();
  });
});
