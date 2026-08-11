import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import * as uiRoot from "../../index";
import { Toast } from "./toast";

describe("root export", () => {
  it("exposes Toast from the @shikho/ui package root", () => {
    expect(uiRoot.Toast).toBe(Toast);
  });
});

describe("confirmed binding (state=danger)", () => {
  it("renders the exactly confirmed border, fill, radius, elevation, and width", () => {
    const { container } = render(<Toast titleContent="Withdrawal Successful" />);
    const root = container.firstChild as HTMLElement;
    expect(root.style.backgroundColor).toBe("rgb(255, 255, 255)"); // Color/smoke_base
    expect(root.style.border).toContain("rgba(240, 61, 61, 0.24)"); // outline/danger_alpha
    expect(root.style.borderRadius).toBe("20px"); // radius/border_radius_xl
    expect(root.style.width).toBe("528px");
    expect(root.style.boxShadow.split(",").length).toBe(6); // elevation/e6 — 6 layers, not e5
  });

  it("uses items-center alignment, confirmed different from Alert's items-start", () => {
    const { container } = render(<Toast titleContent="Title" />);
    expect((container.firstChild as HTMLElement).style.alignItems).toBe("center");
  });

  it("applies the confirmed asymmetric padding (12/16/16), not alert's uniform 24", () => {
    const { container } = render(<Toast titleContent="Title" />);
    const root = container.firstChild as HTMLElement;
    expect(root.style.paddingTop).toBe("0.75rem");
    expect(root.style.paddingBottom).toBe("1rem");
    expect(root.style.paddingLeft).toBe("1rem");
  });
});

describe("composes the real ButtonDanger with a different confirmed fill than Alert", () => {
  it("renders the action button via ButtonDanger with the danger-alpha-12 fill override", () => {
    render(<Toast actionContent="UNDO" />);
    const button = screen.getByRole("button", { name: "UNDO" });
    expect(button.style.backgroundColor).toBe("rgba(240, 61, 61, 0.12)"); // Color/danger/500_alpha_12
    expect(button.style.color).toBe("rgb(233, 32, 32)"); // text/danger-600, unchanged from Secondary
  });

  it("fires onActionClick through the composed ButtonDanger", () => {
    let clicked = false;
    render(<Toast actionContent="UNDO" onActionClick={() => (clicked = true)} />);
    fireEvent.click(screen.getByRole("button", { name: "UNDO" }));
    expect(clicked).toBe(true);
  });
});

describe("the confirmed dismiss control differs structurally from Alert's", () => {
  it("renders inline (not absolutely positioned) with the confirmed rounded-square radius", () => {
    render(<Toast dismissButtonLabel="Dismiss toast" />);
    const button = screen.getByRole("button", { name: "Dismiss toast" });
    expect(button.style.position).not.toBe("absolute");
    expect(button.style.borderRadius).toBe("8px"); // radius/custom/sm, not radius.full
  });

  it("fires onDismissClick", () => {
    let dismissed = false;
    render(<Toast onDismissClick={() => (dismissed = true)} />);
    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(dismissed).toBe(true);
  });
});

describe("the 5 confirmed booleans, including featureIcon's confirmed default false", () => {
  it("does not render featureIcon by default", () => {
    render(<Toast featureIconContent={<span data-testid="feature" />} />);
    expect(screen.queryByTestId("feature")).not.toBeInTheDocument();
  });

  it("renders featureIcon when explicitly enabled", () => {
    render(<Toast featureIcon featureIconContent={<span data-testid="feature" />} />);
    expect(screen.getByTestId("feature")).toBeInTheDocument();
  });

  it("hides description/action/dismiss/leftIcon when their booleans are false", () => {
    render(
      <Toast
        leftIcon={false}
        desc={false}
        actionButton={false}
        rightIcon={false}
        titleContent="Title only"
        descriptionContent="Should not render"
      />,
    );
    expect(screen.getByText("Title only")).toBeInTheDocument();
    expect(screen.queryByText("Should not render")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

describe("all confirmed severities render", () => {
  const states = ["default", "danger", "success", "warning", "info"] as const;

  it.each(states)("renders state=%s without crashing", (state) => {
    const { container } = render(<Toast state={state} titleContent="Title" />);
    expect(container.querySelector(`[data-state='${state}']`)).toBeInTheDocument();
  });
});

describe("confirmed default icons — previously missing entirely (docs/audit/toasts.md §14)", () => {
  it("renders a real default severity icon (an SVG) when none is supplied", () => {
    const { container } = render(<Toast state="danger" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("confirmed: default's icon is gray-950, NOT primary-tinted like Alert's Default", () => {
    const { container } = render(<Toast state="default" />);
    // P2: the glyph now comes from `@shikho/icons` and paints with currentColor.
    const svg = container.querySelector("svg[data-icon='info-circle']") as SVGSVGElement;
    expect(svg.querySelector("path")?.getAttribute("fill")).toBe("currentColor");
    expect(svg.style.color).toBe("rgb(10, 12, 17)");
  });

  it("confirmed: danger/success/warning/info icons tint to that severity's own 500 color", () => {
    const tint = (c: HTMLElement) =>
      (c.querySelector("svg[data-icon='info-circle']") as SVGSVGElement).style.color;
    const { container, rerender } = render(<Toast state="danger" />);
    expect(tint(container)).toBe("rgb(240, 61, 61)");
    rerender(<Toast state="success" />);
    expect(tint(container)).toBe("rgb(53, 194, 32)");
  });

  it("still allows overriding the default icon via the icon prop", () => {
    render(<Toast icon={<span data-testid="custom-glyph" />} />);
    expect(screen.getByTestId("custom-glyph")).toBeInTheDocument();
  });

  it("renders a real default dismiss ('X') icon when none is supplied", () => {
    render(<Toast />);
    const dismissButton = screen.getByRole("button", { name: "Dismiss" });
    expect(dismissButton.querySelector("svg")).toBeInTheDocument();
  });

  it("still allows overriding the default dismiss icon via the dismissIcon prop", () => {
    render(<Toast dismissIcon={<span data-testid="custom-dismiss" />} />);
    expect(screen.getByTestId("custom-dismiss")).toBeInTheDocument();
  });
});

describe("confirmed per-severity action button composition (docs/audit/toasts.md §14)", () => {
  it("composes the real ButtonSuccess (not ButtonDanger) for state=success, with a success-tinted background", () => {
    render(<Toast state="success" actionContent="UNDO" />);
    const button = screen.getByRole("button", { name: "UNDO" });
    expect(button.style.backgroundColor).toBe("rgba(53, 194, 32, 0.12)"); // success/500_alpha_12
    expect(button.style.color).toBe("rgb(42, 153, 25)"); // text/success-600
  });

  it("confirmed: warning/info render a plain neutral gray button, not tinted by severity", () => {
    for (const state of ["warning", "info"] as const) {
      const { unmount } = render(<Toast state={state} actionContent="UNDO" />);
      const button = screen.getByRole("button", { name: "UNDO" });
      expect(button.style.backgroundColor).toBe("rgb(244, 244, 246)"); // gray/100
      expect(button.style.color).toBe("rgb(91, 97, 109)"); // gray/700
      unmount();
    }
  });

  it("confirmed: state=default's own action button uses secondary/500 fill + white text, distinct from warning/info", () => {
    render(<Toast state="default" actionContent="UNDO" />);
    const button = screen.getByRole("button", { name: "UNDO" });
    expect(button.style.backgroundColor).toBe("rgb(226, 0, 141)"); // secondary/500
    expect(button.style.color).toBe("rgb(255, 255, 255)");
  });
});

describe("confirmed correction to root styling (docs/audit/toasts.md §14)", () => {
  it("confirmed: default's border is gray/100, not gray/200", () => {
    const { container } = render(<Toast state="default" />);
    const root = container.firstChild as HTMLElement;
    expect(root.style.border).toContain("244, 244, 246"); // gray/100 #f4f4f6
  });
});

// P9 repair — re-checking against Alert's fixes this session found Toast had the same set of
// bugs: box-shadow instead of drop-shadow on icon slots, the close icon stretched to 18px instead
// of its confirmed native 10.5px, the composed action button missing its confirmed 40px height,
// the neutral action button missing its border/shadow for state="default", and zero real
// pointer-driven hover anywhere.
describe("real interactivity and confirmed sizing, mirroring Alert's fixes (P9 repair)", () => {
  it("the close icon renders at its confirmed native 10.5px size, not stretched to 18px", () => {
    render(<Toast />);
    const dismissButton = screen.getByRole("button", { name: "Dismiss" });
    const svg = dismissButton.querySelector("svg") as SVGSVGElement;
    expect(svg.style.width).toBe("10.5px");
    expect(svg.style.height).toBe("10.5px");
  });

  it("the composed action button renders at the confirmed 40px height", () => {
    render(<Toast state="danger" actionContent="UNDO" />);
    const button = screen.getByRole("button", { name: "UNDO" });
    expect(button.style.height).toBe("40px");
  });

  it("state=default's action button carries the confirmed border and shadow", () => {
    render(<Toast state="default" actionContent="UNDO" />);
    const button = screen.getByRole("button", { name: "UNDO" });
    expect(button.style.border).toContain("rgba(0, 0, 0, 0.04)");
    expect(button.style.boxShadow.length).toBeGreaterThan(0);
  });

  // P10 correction — a re-pull of warning (66074:28544) and info (66074:28556) found the border
  // is NOT shared by every neutral-branch state: only default's secondary/500 fill has it,
  // matching Alert's Dismiss button; warning/info's plain gray/100 button has none, matching
  // Alert's own neutral "Learn more". The shadow IS shared by all three.
  it("warning/info's action button has no border, unlike state=default's", () => {
    for (const state of ["warning", "info"] as const) {
      const { unmount } = render(<Toast state={state} actionContent="UNDO" />);
      const button = screen.getByRole("button", { name: "UNDO" });
      // jsdom serializes `border: "none"` as an empty string on the shorthand read.
      expect(button.style.border).not.toContain("solid");
      expect(button.style.boxShadow.length).toBeGreaterThan(0);
      unmount();
    }
  });

  // P11 repair — a fresh get_design_context re-pull confirmed the "text" column carries
  // flex-[1_0_0] + min-w-px (node 66074:28512), which this component lacked entirely. Without
  // it, the action button sat wherever its own content happened to end rather than being pushed
  // flush against the row's end by the text column growing to fill the remaining space — visibly
  // ~75px left of the confirmed position on a 528px-wide toast.
  it("the text column grows to push the action button flush against the row's end", () => {
    render(<Toast titleContent="Title" descriptionContent="Description" actionContent="UNDO" />);
    const button = screen.getByRole("button", { name: "UNDO" });
    const textColumn = screen.getByText("Title").parentElement as HTMLElement;
    expect(textColumn.style.flex).toBe("1 0 0px"); // jsdom normalizes the `0` basis to `0px`
    // The actions wrapper must not be compressible, so a long title/description compresses text
    // wrapping instead of squeezing the button.
    expect((button.parentElement as HTMLElement).style.flexShrink).toBe("0");
  });

  it("real pointer hover darkens the dismiss button from transparent to gray-100", () => {
    render(<Toast onDismissClick={() => {}} />);
    const dismissButton = screen.getByRole("button", { name: "Dismiss" });
    expect(dismissButton.style.backgroundColor).toBe("transparent");
    fireEvent.mouseEnter(dismissButton);
    expect(dismissButton.style.backgroundColor).toBe("rgb(244, 244, 246)");
    fireEvent.mouseLeave(dismissButton);
    expect(dismissButton.style.backgroundColor).toBe("transparent");
  });

  it("real pointer hover drives the composed ButtonDanger to its hover state", () => {
    render(<Toast state="danger" actionContent="UNDO" />);
    const button = screen.getByRole("button", { name: "UNDO" });
    expect(button).toHaveAttribute("data-state", "default");
    fireEvent.mouseEnter(button);
    expect(button).toHaveAttribute("data-state", "hover");
    fireEvent.mouseLeave(button);
    expect(button).toHaveAttribute("data-state", "default");
  });

  it("the composed action button has no icon slots, matching the confirmed text-only instance", () => {
    render(<Toast state="danger" actionContent="UNDO" />);
    const button = screen.getByRole("button", { name: "UNDO" });
    expect(button.querySelector('[style*="18px"]')).not.toBeInTheDocument();
  });
});

describe("no unsupported variant is exported", () => {
  it("rejects a state value outside the confirmed enum, and rejects Alert's capitalized Default", () => {
    // @ts-expect-error - "Default" (capitalized) is alert's baseline value, not toast's (§2, §11)
    const invalidState: import("./toast").ToastState = "Default";
    expect(invalidState).toBeDefined();
  });
});
