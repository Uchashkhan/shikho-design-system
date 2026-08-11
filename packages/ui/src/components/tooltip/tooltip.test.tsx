import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as uiRoot from "../../index";
import { Tooltip } from "./tooltip";

describe("root export", () => {
  it("exposes Tooltip from the @shikho/ui package root", () => {
    expect(uiRoot.Tooltip).toBe(Tooltip);
  });
});

describe("the one confirmed variant property: direction", () => {
  const directions = [
    "botom_left",
    "top_left",
    "botom_right",
    "top_right",
    "bottom_center",
    "top_center",
    "left_center",
    "right_center",
  ] as const;

  it.each(directions)("renders direction=%s without crashing", (direction) => {
    render(<Tooltip direction={direction} heading="Tip" />);
    expect(screen.getByRole("tooltip")).toHaveAttribute("data-direction", direction);
  });

  it("preserves the confirmed typo verbatim rather than correcting it", () => {
    render(<Tooltip direction="botom_left" heading="Tip" />);
    expect(screen.getByRole("tooltip")).toHaveAttribute("data-direction", "botom_left");
  });

  it("confirmed: top_* renders BELOW the anchor and botom_*/bottom_center renders ABOVE it — derived from the confirmed pointer direction (docs/audit/tooltips.md §14), not the naive placement convention", () => {
    const { rerender } = render(<Tooltip direction="top_center" heading="Tip" />);
    let el = screen.getByRole("tooltip");
    expect(el.style.top).toContain("100%");
    expect(el.style.bottom).toBe("");

    rerender(<Tooltip direction="bottom_center" heading="Tip" />);
    el = screen.getByRole("tooltip");
    expect(el.style.bottom).toContain("100%");
    expect(el.style.top).toBe("");
  });

  it("confirmed: left_center renders to the anchor's right, right_center to the anchor's left", () => {
    const { rerender } = render(<Tooltip direction="left_center" heading="Tip" />);
    let el = screen.getByRole("tooltip");
    expect(el.style.left).toContain("100%");

    rerender(<Tooltip direction="right_center" heading="Tip" />);
    el = screen.getByRole("tooltip");
    expect(el.style.right).toContain("100%");
  });
});

describe("confirmed rich composition (docs/audit/tooltips.md §14) — previously a bare, contentless box", () => {
  it("renders a fixed 240px width, not a max-width", () => {
    render(<Tooltip direction="top_center" heading="Tip" />);
    const el = screen.getByRole("tooltip");
    expect(el.style.width).toBe("240px");
    expect(el.style.maxWidth).toBe("");
  });

  it("renders heading and description content", () => {
    render(<Tooltip direction="top_center" heading="Heads up" description="More detail here." />);
    expect(screen.getByText("Heads up")).toBeInTheDocument();
    expect(screen.getByText("More detail here.")).toBeInTheDocument();
  });

  it("renders a confirmed pointer triangle as a real SVG, not just a bare box", () => {
    const { container } = render(<Tooltip direction="top_center" heading="Tip" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders the secondary and primary CTA actions and fires their click handlers", () => {
    const onSecondary = vi.fn();
    const onPrimary = vi.fn();
    render(
      <Tooltip
        direction="top_center"
        heading="Tip"
        secondaryAction={{ label: "Learn more", onClick: onSecondary }}
        primaryAction={{ label: "Got it", onClick: onPrimary }}
      />,
    );
    fireEvent.click(screen.getByText("Learn more"));
    expect(onSecondary).toHaveBeenCalled();
    fireEvent.click(screen.getByText("Got it"));
    expect(onPrimary).toHaveBeenCalled();
  });

  it("does not render the actions row when neither action is supplied", () => {
    render(<Tooltip direction="top_center" heading="Tip" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("uses the confirmed white tip fill and dark heading text", () => {
    const { container } = render(<Tooltip direction="top_center" heading="Tip" />);
    const tip = container.querySelector('[data-name="tip"]') as HTMLElement;
    expect(tip.style.background).toBe("rgb(255, 255, 255)");
    expect(screen.getByText("Tip").style.color).toBe("rgb(10, 12, 17)");
  });

  it("confirmed: the tip omits its border on the edge touching the pointer", () => {
    const { container, rerender } = render(<Tooltip direction="top_center" heading="Tip" />);
    let tip = container.querySelector('[data-name="tip"]') as HTMLElement;
    expect(tip.style.borderTop).toBeFalsy();
    expect(tip.style.borderBottom).toBeTruthy();

    rerender(<Tooltip direction="bottom_center" heading="Tip" />);
    tip = container.querySelector('[data-name="tip"]') as HTMLElement;
    expect(tip.style.borderBottom).toBeFalsy();
    expect(tip.style.borderTop).toBeTruthy();
  });
});

// P12 repair — a fresh get_design_context re-pull found both action buttons were missing their
// confirmed OUTER shadow (only the inset pair was implemented), and the pointer glyph for the 4
// corner directions was rendered as a bare 16×8 triangle instead of the confirmed 48×8 box with
// the triangle offset inside it — a real geometry/position bug, not just a color mismatch.
describe("confirmed corrections (P12 repair)", () => {
  it("both action buttons carry their confirmed outer shadow, not just the inset pair", () => {
    render(
      <Tooltip
        direction="top_center"
        heading="Tip"
        secondaryAction={{ label: "Learn more" }}
        primaryAction={{ label: "Got it" }}
      />,
    );
    const secondary = screen.getByRole("button", { name: "Learn more" });
    const primary = screen.getByRole("button", { name: "Got it" });
    expect(secondary.style.boxShadow).toContain("0px 1px 1px -0.5px #0000000a");
    expect(primary.style.boxShadow).toContain("0px 1px 1px -0.5px #0000000a");
    expect(primary.style.boxShadow).toContain("0px 3px 3px -1.5px #0000000a");
  });

  it("real pointer hover darkens both action buttons", () => {
    render(
      <Tooltip
        direction="top_center"
        heading="Tip"
        secondaryAction={{ label: "Learn more" }}
        primaryAction={{ label: "Got it" }}
      />,
    );
    const secondary = screen.getByRole("button", { name: "Learn more" });
    const primary = screen.getByRole("button", { name: "Got it" });
    expect(secondary.style.backgroundColor).toBe("rgb(244, 244, 246)");
    fireEvent.mouseEnter(secondary);
    expect(secondary.style.backgroundColor).toBe("rgb(235, 236, 240)");
    expect(primary.style.backgroundColor).toBe("rgb(84, 104, 255)");
    fireEvent.mouseEnter(primary);
    expect(primary.style.backgroundColor).not.toBe("rgb(84, 104, 255)");
  });

  it.each(["top_left", "botom_left"] as const)(
    "%s: the pointer glyph sits offset 32px inside its confirmed 48px-wide box",
    (direction) => {
      const { container } = render(<Tooltip direction={direction} heading="Tip" />);
      const pointerBox = container.querySelector('[data-name="pointer"]') as HTMLElement;
      expect(pointerBox.style.width).toBe("48px");
      const svg = pointerBox.querySelector("svg") as SVGSVGElement;
      expect(svg.style.left).toBe("32px");
    },
  );

  it.each(["top_right", "botom_right"] as const)(
    "%s: the pointer glyph sits flush at 0 inside its confirmed 48px-wide box",
    (direction) => {
      const { container } = render(<Tooltip direction={direction} heading="Tip" />);
      const pointerBox = container.querySelector('[data-name="pointer"]') as HTMLElement;
      expect(pointerBox.style.width).toBe("48px");
      const svg = pointerBox.querySelector("svg") as SVGSVGElement;
      expect(svg.style.left).toBe("0px");
    },
  );

  it.each(["top_center", "bottom_center", "left_center", "right_center"] as const)(
    "%s: the pointer box is NOT widened — confirmed unchanged from the plain glyph box",
    (direction) => {
      const { container } = render(<Tooltip direction={direction} heading="Tip" />);
      const pointerBox = container.querySelector('[data-name="pointer"]') as HTMLElement;
      expect(pointerBox.style.width).not.toBe("48px");
    },
  );
});

describe("no unsupported variant is exported", () => {
  it("rejects a direction value outside the confirmed 8-value enum at the type level", () => {
    // @ts-expect-error - "center" is not a confirmed tooltip direction (only the 8 listed exist, §2)
    const invalid: import("./tooltip").TooltipDirection = "center";
    expect(invalid).toBeDefined();
  });

  it("has no size, type, or state prop — none are confirmed to exist on tooltip", () => {
    render(<Tooltip direction="top_center" heading="Tip" />);
    const el = screen.getByRole("tooltip");
    expect(el).not.toHaveAttribute("data-size");
    expect(el).not.toHaveAttribute("data-type");
    expect(el).not.toHaveAttribute("data-state");
  });
});
