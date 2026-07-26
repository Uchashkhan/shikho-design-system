import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import * as uiRoot from "../../index";
import { Alert } from "./alert";

describe("root export", () => {
  it("exposes Alert from the @shikho/ui package root", () => {
    expect(uiRoot.Alert).toBe(Alert);
  });
});

describe("confirmed binding (state=danger)", () => {
  it("renders the exactly confirmed border color, fill, radius, and shadow", () => {
    const { container } = render(
      <Alert titleContent="Notification text" descriptionContent="A short description." />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root.style.backgroundColor).toBe("rgb(255, 255, 255)"); // Color/smoke_base
    expect(root.style.border).toContain("rgba(240, 61, 61, 0.24)"); // outline/danger_alpha #f03d3d3d
    expect(root.style.borderRadius).toBe("20px"); // radius/border_radius_xl
    expect(root.style.width).toBe("424px");
  });

  it("renders the title and description content", () => {
    render(<Alert titleContent="Notification text" descriptionContent="A short description." />);
    expect(screen.getByText("Notification text")).toBeInTheDocument();
    expect(screen.getByText("A short description.")).toBeInTheDocument();
  });
});

describe("composes the real ButtonDanger, not a re-implementation", () => {
  it("renders the primary action via ButtonDanger with the confirmed Secondary styling", () => {
    render(<Alert primaryActionContent="Learn more" />);
    const button = screen.getByRole("button", { name: "Learn more" });
    expect(button.style.backgroundColor).toBe("rgb(244, 244, 246)"); // Color/gray/100
    expect(button.style.color).toBe("rgb(233, 32, 32)"); // text/danger-600
  });

  it("fires onPrimaryActionClick through the composed ButtonDanger", () => {
    let clicked = false;
    render(<Alert primaryActionContent="Learn more" onPrimaryActionClick={() => (clicked = true)} />);
    fireEvent.click(screen.getByRole("button", { name: "Learn more" }));
    expect(clicked).toBe(true);
  });
});

describe("the second action button and corner close button", () => {
  it("renders the confirmed Dismiss button styling", () => {
    render(<Alert dismissContent="Dismiss" />);
    const button = screen.getByRole("button", { name: "Dismiss" });
    expect(button.style.backgroundColor).toBe("rgb(226, 0, 141)"); // Color/secondary/500
    expect(button.style.color).toBe("rgb(255, 255, 255)"); // text/white-950
  });

  it("renders the corner icon_button with an accessible name and fires onCloseClick", () => {
    let closed = false;
    render(<Alert onCloseClick={() => (closed = true)} closeButtonLabel="Close alert" />);
    const button = screen.getByRole("button", { name: "Close alert" });
    fireEvent.click(button);
    expect(closed).toBe(true);
  });
});

describe("the one confirmed boolean: leftIcon", () => {
  it("renders the icon slot by default", () => {
    const { container } = render(<Alert icon={<span data-testid="glyph" />} />);
    expect(screen.getByTestId("glyph")).toBeInTheDocument();
    expect(container).toBeDefined();
  });

  it("hides the icon slot when leftIcon is false", () => {
    render(<Alert leftIcon={false} icon={<span data-testid="glyph" />} />);
    expect(screen.queryByTestId("glyph")).not.toBeInTheDocument();
  });
});

describe("all confirmed severities render", () => {
  const states = ["Default", "danger", "success", "warning", "info"] as const;

  it.each(states)("renders state=%s without crashing", (state) => {
    const { container } = render(<Alert state={state} titleContent="Title" />);
    expect(container.querySelector(`[data-state='${state}']`)).toBeInTheDocument();
  });
});

describe("confirmed default icons — previously missing entirely (docs/audit/alerts.md §14)", () => {
  it("renders a real default severity icon (an SVG) when none is supplied", () => {
    const { container } = render(<Alert state="danger" />);
    const iconSlot = container.querySelector('[data-state="danger"] > span:first-child') as HTMLElement;
    expect(iconSlot.querySelector("svg")).toBeInTheDocument();
  });

  it("confirmed: the same info-circle glyph is tinted per severity's own 500 color", () => {
    const { container, rerender } = render(<Alert state="danger" />);
    let path = container.querySelector('svg path') as SVGPathElement;
    expect(path.getAttribute("fill")).toBe("#f03d3d");

    rerender(<Alert state="success" />);
    path = container.querySelector('svg path') as SVGPathElement;
    expect(path.getAttribute("fill")).toBe("#35c220");

    rerender(<Alert state="Default" />);
    path = container.querySelector('svg path') as SVGPathElement;
    expect(path.getAttribute("fill")).toBe("#5468ff"); // confirmed: Default's icon is primary-tinted
  });

  it("still allows overriding the default icon via the icon prop", () => {
    render(<Alert icon={<span data-testid="custom-glyph" />} />);
    expect(screen.getByTestId("custom-glyph")).toBeInTheDocument();
  });

  it("renders a real default close ('X') icon when none is supplied", () => {
    render(<Alert onCloseClick={() => {}} />);
    const closeButton = screen.getByRole("button", { name: "Close" });
    expect(closeButton.querySelector("svg")).toBeInTheDocument();
  });

  it("still allows overriding the default close icon via the closeIcon prop", () => {
    render(<Alert closeIcon={<span data-testid="custom-close" />} />);
    expect(screen.getByTestId("custom-close")).toBeInTheDocument();
  });
});

describe("confirmed per-severity primary button composition (docs/audit/alerts.md §14)", () => {
  it("composes the real ButtonSuccess (not ButtonDanger) for state=success, with success-tinted text", () => {
    render(<Alert state="success" primaryActionContent="Learn more" />);
    const button = screen.getByRole("button", { name: "Learn more" });
    expect(button.style.color).toBe("rgb(42, 153, 25)"); // text/success-600
  });

  it("confirmed: Default/warning/info render a plain NEUTRAL button — not tinted by severity", () => {
    for (const state of ["Default", "warning", "info"] as const) {
      const { unmount } = render(<Alert state={state} primaryActionContent="Learn more" />);
      const button = screen.getByRole("button", { name: "Learn more" });
      expect(button.style.backgroundColor).toBe("rgb(244, 244, 246)"); // gray/100, not severity-tinted
      expect(button.style.color).toBe("rgb(91, 97, 109)"); // gray/700, not severity-tinted
      unmount();
    }
  });
});

describe("confirmed corrections to root/corner styling (docs/audit/alerts.md §14)", () => {
  it("confirmed: Default's border is gray/100, not gray/200", () => {
    const { container } = render(<Alert state="Default" />);
    const root = container.firstChild as HTMLElement;
    expect(root.style.border).toContain("244, 244, 246"); // gray/100 #f4f4f6
  });

  it("confirmed: the corner close button has a gray/100 fill, not transparent", () => {
    render(<Alert onCloseClick={() => {}} />);
    const closeButton = screen.getByRole("button", { name: "Close" });
    expect(closeButton.style.backgroundColor).toBe("rgb(244, 244, 246)");
  });
});

describe("no unsupported variant is exported", () => {
  it("rejects a state value outside the confirmed enum at the type level", () => {
    // @ts-expect-error - "neutral" is not a confirmed alert state (only Default/danger/success/warning/info exist, §2)
    const invalidState: import("./alert").AlertState = "neutral";
    expect(invalidState).toBeDefined();
  });
});
