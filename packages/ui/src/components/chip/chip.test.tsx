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

  // Fix: leftIcon/rightIcon default to true (confirmed, §9), but with no selectLeftIcon/
  // selectRightIcon content, this used to still render an EMPTY icon-slot span that reserved its
  // full iconSize width — invisible, but ~18px of dead space per side on the very common
  // icon-less chip. That's what a "horizontal padding still looks bigger than vertical" report
  // turned out to actually be about, not padding at all. Now the slot only renders when there's
  // real content to show.
  it("does not render an icon slot at all when left/rightIcon are true but no icon content is supplied", () => {
    const { container } = render(<Chip textContent="Chip" />);
    const root = container.firstChild as HTMLElement;
    // Only the text span should exist as a child — no empty leading/trailing icon spans.
    expect(root.children.length).toBe(1);
    expect(root.children[0].textContent).toBe("Chip");
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
// `md`/`lg` padding is a requested override across several rounds of direct feedback, not the
// Figma-confirmed values (md 8px, lg 12px horizontal/8px vertical, node 66075:28885/66075:28800)
// — reduced because both read as button-like, then given a horizontal-only bump back once the
// empty-icon-slot fix (§16) made a fully-uniform, hug-the-text chip read as a circle rather than
// a pill. See chip.tsx's own SIZE_METRICS comment.
describe("per-size metrics are independent (P1 repair)", () => {
  const rows = [
    ["sm", "24px", "0.25rem 0.375rem", "0", "11px"],
    ["md", "32px", "0.25rem 0.5rem", "0.125rem", "12px"],
    ["lg", "40px", "0.375rem 0.625rem", "0.25rem", "13px"],
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

// The inner text span's own confirmed horizontal-only padding (px-[spacing/2, 2px]) was zeroed
// at md/lg so it wouldn't stack invisibly on top of the OUTER padding (which now carries any
// deliberate horizontal/vertical difference on its own, explicitly — see SIZE_METRICS' own
// comment on why md/lg went back to a horizontal bump after briefly being fully uniform).
// sm keeps the confirmed 2px (never part of any round of this request).
describe("inner text span padding — md/lg zeroed so the outer padding is the only source of any h/v difference", () => {
  const rows = [
    ["sm", "0px 0.125rem"],
    ["md", "0px"],
    ["lg", "0px"],
  ] as const;

  it.each(rows)("size=%s inner text span padding is %s", (size, padding) => {
    render(<Chip size={size} textContent="Chip" />);
    const label = screen.getByText("Chip");
    expect(label.style.padding).toBe(padding);
  });
});
