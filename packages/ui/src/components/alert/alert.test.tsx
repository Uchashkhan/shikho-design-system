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
  // Requested override, docs/audit/alerts.md §15 — the root fill is now severity-tinted
  // (danger/50), not the confirmed flat white/smoke_base (§11).
  it("renders the requested danger/50 fill, the confirmed border color, radius, and shadow", () => {
    const { container } = render(
      <Alert titleContent="Notification text" descriptionContent="A short description." />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root.style.backgroundColor).toBe("rgb(254, 236, 236)"); // Color/danger/50 (requested)
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

// Requested override, §15 — "Learn more" no longer composes ButtonDanger/ButtonSuccess for
// danger/success (Figma's own confirmed construction, §11/§14); it now stays plain neutral at
// every severity. §16 follow-up: gray/100 lost contrast against the now severity-tinted surfaces
// (except Default's own white surface, where it's unchanged), so every non-Default severity now
// renders this button solid white with a border matching the alert's own outer border color.
describe("\"Learn more\" stays neutral at every severity (requested override, no more ButtonDanger/ButtonSuccess)", () => {
  it("renders solid white + a danger-bordered outline on state=danger (§16), gray/700 text (not danger-tinted)", () => {
    render(<Alert primaryActionContent="Learn more" />);
    const button = screen.getByRole("button", { name: "Learn more" });
    expect(button.style.backgroundColor).toBe("rgb(255, 255, 255)"); // Color/white/950 (§16)
    expect(button.style.border).toContain("rgba(240, 61, 61, 0.24)"); // same border as the alert's own outline
    expect(button.style.color).toBe("rgb(91, 97, 109)"); // gray/700, not danger-tinted
  });

  it("keeps the original gray/100 fill and no border on state=Default (confirmed to still work as-is)", () => {
    render(<Alert state="Default" primaryActionContent="Learn more" />);
    const button = screen.getByRole("button", { name: "Learn more" });
    expect(button.style.backgroundColor).toBe("rgb(244, 244, 246)"); // Color/gray/100, unchanged
    expect(button.style.border).toBe(""); // jsdom serializes the "none" shorthand as an empty string
  });

  it("fires onPrimaryActionClick", () => {
    let clicked = false;
    render(<Alert primaryActionContent="Learn more" onPrimaryActionClick={() => (clicked = true)} />);
    fireEvent.click(screen.getByRole("button", { name: "Learn more" }));
    expect(clicked).toBe(true);
  });
});

describe("the second action button and corner close button", () => {
  // Requested override, §15 — Dismiss now inherits state's own color (danger/500 for the default
  // state=danger), not the confirmed flat secondary/500 pink (§11).
  it("renders the requested state-tinted Dismiss button styling (danger/500, white text)", () => {
    render(<Alert dismissContent="Dismiss" />);
    const button = screen.getByRole("button", { name: "Dismiss" });
    expect(button.style.backgroundColor).toBe("rgb(240, 61, 61)"); // Color/danger/500 (requested)
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

  // Requested: "make the icon a little bit bigger" — container 24->28px, glyph 18->22px.
  it("renders the severity icon a bit bigger than confirmed (28px slot, 22px glyph)", () => {
    const { container } = render(<Alert state="danger" />);
    const iconSlot = container.querySelector('[data-state="danger"] > span:first-child') as HTMLElement;
    expect(iconSlot.style.width).toBe("28px");
    expect(iconSlot.style.height).toBe("28px");
    const svg = iconSlot.querySelector("svg") as SVGSVGElement;
    expect(svg.getAttribute("width")).toBe("22");
    expect(svg.getAttribute("height")).toBe("22");
  });

  it("confirmed: the same info-circle glyph is tinted per severity's own 500 color", () => {
    const { container, rerender } = render(<Alert state="danger" />);
    // P2: the glyph now comes from `@shikho/icons` and paints with currentColor, so the tint is
    // asserted on the svg's colour rather than a hard-coded fill attribute.
    let svg = container.querySelector("svg[data-icon='info-circle']") as SVGSVGElement;
    expect(svg.querySelector("path")?.getAttribute("fill")).toBe("currentColor");
    expect(svg.style.color).toBe("rgb(240, 61, 61)");

    rerender(<Alert state="success" />);
    svg = container.querySelector("svg[data-icon='info-circle']") as SVGSVGElement;
    expect(svg.style.color).toBe("rgb(53, 194, 32)");

    rerender(<Alert state="Default" />);
    svg = container.querySelector("svg[data-icon='info-circle']") as SVGSVGElement;
    expect(svg.style.color).toBe("rgb(84, 104, 255)"); // Default's icon is primary-tinted
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

  // P8 repair — a fresh get_design_context re-pull on node 66071:28137 confirmed the "X" glyph
  // sits inset 20.83% inside its 18px container, i.e. it renders at its native 10.5×10.5 size,
  // not stretched to fill all 18px. Forcing size=18 made the X ~70% larger than confirmed.
  it("renders the close icon at its confirmed native 10.5px size, not stretched to 18px", () => {
    render(<Alert onCloseClick={() => {}} />);
    const closeButton = screen.getByRole("button", { name: "Close" });
    const svg = closeButton.querySelector("svg") as SVGSVGElement;
    expect(svg.style.width).toBe("10.5px");
    expect(svg.style.height).toBe("10.5px");
  });

  it("still allows overriding the default close icon via the closeIcon prop", () => {
    render(<Alert closeIcon={<span data-testid="custom-close" />} />);
    expect(screen.getByTestId("custom-close")).toBeInTheDocument();
  });
});

// Requested override, §15 — ALL 5 severities now render the same plain neutral "Learn more"
// button (text color); none are severity-tinted (previously danger/success were, via composed
// ButtonDanger/ButtonSuccess, §14). Fill/border differ by severity as of §16 (contrast follow-up)
// — Default keeps gray/100 + no border; every other severity is white + a bordered outline
// matching the alert's own border color.
describe("\"Learn more\" is neutral (same text color) at every severity, including danger/success (requested override)", () => {
  it("renders gray/700 text at every one of the 5 confirmed severities, with the §16 fill/border split", () => {
    for (const state of ["Default", "danger", "success", "warning", "info"] as const) {
      const { unmount } = render(<Alert state={state} primaryActionContent="Learn more" />);
      const button = screen.getByRole("button", { name: "Learn more" });
      expect(button.style.color, state).toBe("rgb(91, 97, 109)"); // gray/700, every severity
      if (state === "Default") {
        expect(button.style.backgroundColor, state).toBe("rgb(244, 244, 246)"); // gray/100, unchanged
        expect(button.style.border, state).toBe(""); // jsdom serializes "none" as an empty string
      } else {
        expect(button.style.backgroundColor, state).toBe("rgb(255, 255, 255)"); // white/950, §16
        expect(button.style.border, state).not.toBe("none");
      }
      unmount();
    }
  });
});

// Requested color mapping, §15 — Dismiss inherits state's own 500 color; warning's text is
// warning/950 specifically (contrast — warning/500 is a bright yellow), every other state is
// white. Default -> primary/500 ("instead of the current pink/accent action treatment").
describe("Dismiss button inherits the requested per-state color mapping (§15)", () => {
  const rows = [
    ["Default", "rgb(84, 104, 255)", "rgb(255, 255, 255)"], // primary/500, white
    ["danger", "rgb(240, 61, 61)", "rgb(255, 255, 255)"], // danger/500, white
    ["success", "rgb(53, 194, 32)", "rgb(255, 255, 255)"], // success/500, white
    ["warning", "rgb(252, 191, 4)", "rgb(45, 32, 0)"], // warning/500, warning/950 (explicit contrast override)
    ["info", "rgb(17, 139, 232)", "rgb(255, 255, 255)"], // info/500 (extended by analogy), white
  ] as const;

  it.each(rows)("state=%s renders Dismiss with %s fill and %s text", (state, bg, textColor) => {
    render(<Alert state={state} dismissContent="Dismiss" />);
    const button = screen.getByRole("button", { name: "Dismiss" });
    expect(button.style.backgroundColor).toBe(bg);
    expect(button.style.color).toBe(textColor);
  });
});

describe("confirmed corrections to root/corner styling (docs/audit/alerts.md §14)", () => {
  it("confirmed: Default's border is gray/100, not gray/200", () => {
    const { container } = render(<Alert state="Default" />);
    const root = container.firstChild as HTMLElement;
    expect(root.style.border).toContain("244, 244, 246"); // gray/100 #f4f4f6
  });

  it("confirmed: the corner close button has a gray/100 fill on Default, not transparent", () => {
    render(<Alert state="Default" onCloseClick={() => {}} />);
    const closeButton = screen.getByRole("button", { name: "Close" });
    expect(closeButton.style.backgroundColor).toBe("rgb(244, 244, 246)");
  });

  // §16 follow-up — same white+outline treatment as "Learn more" above, for the same contrast
  // reason, on every non-Default severity.
  it("renders solid white + a danger-bordered outline on state=danger (§16, default alert state)", () => {
    render(<Alert onCloseClick={() => {}} />);
    const closeButton = screen.getByRole("button", { name: "Close" });
    expect(closeButton.style.backgroundColor).toBe("rgb(255, 255, 255)");
    expect(closeButton.style.border).toContain("rgba(240, 61, 61, 0.24)");
  });
});

// P6 repair, historical — originally fixed a bug where the composed ButtonDanger/ButtonSuccess
// defaulted leftIcon/rightIcon to true, rendering two empty 18px icon slots. §15's override
// removed that composition entirely (see above), so this now just confirms the plain neutral
// "Learn more" button has no icon slots at any severity, matching the confirmed text-only
// instance — a stronger, simpler guarantee than the original ButtonDanger/ButtonSuccess-specific
// fix it replaced.
describe("primary action button has no icon slots, matching the confirmed text-only instance", () => {
  it("state=danger renders with no icon slot spans", () => {
    render(<Alert state="danger" primaryActionContent="Learn more" />);
    const button = screen.getByRole("button", { name: "Learn more" });
    // Only the label span should remain — no 18px icon slots.
    expect(button.querySelector('[style*="18px"]')).not.toBeInTheDocument();
  });

  it("state=success renders with no icon slot spans", () => {
    render(<Alert state="success" primaryActionContent="Learn more" />);
    const button = screen.getByRole("button", { name: "Learn more" });
    expect(button.querySelector('[style*="18px"]')).not.toBeInTheDocument();
  });
});

// P7 repair — both icon slots wired their confirmed elevation/e2 shadow as a CSS `box-shadow`
// (a rectangle around the transparent span) instead of `filter: drop-shadow(...)` (which follows
// the glyph's own silhouette, the pattern every other icon in this library uses). The mismatch
// made the corner close "X" look smudged/heavier than the confirmed glyph.
describe("icon shadows follow the glyph silhouette, not a rectangular box (P7 repair)", () => {
  it("applies the confirmed e2 shadow as filter: drop-shadow, not box-shadow, on the close icon", () => {
    render(<Alert onCloseClick={() => {}} />);
    const closeButton = screen.getByRole("button", { name: "Close" });
    const iconSlot = closeButton.querySelector("svg")?.parentElement as HTMLElement;
    expect(iconSlot.style.filter).toContain("drop-shadow");
    expect(iconSlot.style.boxShadow).toBe("");
  });

  it("applies the same filter-based shadow on the left severity icon", () => {
    const { container } = render(<Alert state="danger" />);
    const iconSlot = container.querySelector('[data-state="danger"] > span:first-child') as HTMLElement;
    expect(iconSlot.style.filter).toContain("drop-shadow");
    expect(iconSlot.style.boxShadow).toBe("");
  });
});

describe("no unsupported variant is exported", () => {
  it("rejects a state value outside the confirmed enum at the type level", () => {
    // @ts-expect-error - "neutral" is not a confirmed alert state (only Default/danger/success/warning/info exist, §2)
    const invalidState: import("./alert").AlertState = "neutral";
    expect(invalidState).toBeDefined();
  });
});

// P1 one-off repair — the Dismiss button carries a confirmed 1px outline/black-50 border.
describe("Dismiss button border (P1 repair)", () => {
  it("outlines the dismiss button with 1px black-50", () => {
    render(<Alert titleContent="Heads up" dismissContent="Dismiss" />);
    const dismiss = screen.getByRole("button", { name: "Dismiss" });
    expect(dismiss.style.border).toContain("1px");
    expect(dismiss.style.border).toContain("rgba(0, 0, 0, 0.04)");
  });
});

// P4 repair — a fresh get_design_context re-pull on node 66071:28148 confirmed the Dismiss
// button shares the exact same h-[40px] fixed height and outer/inset shadow construction as the
// primary action button; the code previously had neither, so the two buttons rendered at
// different heights with the Dismiss button carrying no shadow at all.
describe("Dismiss button matches the primary action button's confirmed size (P4 repair)", () => {
  it("renders at the confirmed fixed 40px height", () => {
    render(<Alert dismissContent="Dismiss" />);
    const dismiss = screen.getByRole("button", { name: "Dismiss" });
    expect(dismiss.style.height).toBe("40px");
  });

  it("carries the confirmed outer drop-shadow and inset highlight/shadow layers", () => {
    render(<Alert dismissContent="Dismiss" />);
    const dismiss = screen.getByRole("button", { name: "Dismiss" });
    expect(dismiss.style.boxShadow).toContain("inset");
    expect(dismiss.style.boxShadow.length).toBeGreaterThan(0);
  });
});

// P3 repair — none of the alert's own buttons responded to a real pointer at all before this
// fix; every fill was a static inline style regardless of hover, the same "no interactivity"
// defect already fixed across every other component this session.
describe("real pointer-driven hover on the alert's own buttons (P3 repair)", () => {
  // Requested override, §15 — Dismiss's hover now darkens from its own state color (danger/500 ->
  // danger/600 for the default state=danger), not the confirmed flat secondary/500 -> 600.
  it("darkens the Dismiss button from its own state color on real hover and reverts on mouse-leave", () => {
    render(<Alert dismissContent="Dismiss" />);
    const dismiss = screen.getByRole("button", { name: "Dismiss" });
    expect(dismiss.style.backgroundColor).toBe("rgb(240, 61, 61)"); // danger/500
    fireEvent.mouseEnter(dismiss);
    expect(dismiss.style.backgroundColor).toBe("rgb(233, 32, 32)"); // danger/600
    fireEvent.mouseLeave(dismiss);
    expect(dismiss.style.backgroundColor).toBe("rgb(240, 61, 61)");
  });

  // §16 follow-up — resting fill is white on non-Default severities now (was gray/100); hover
  // target is unchanged (gray/200) regardless of resting fill.
  it("darkens the corner close button on real hover and reverts on mouse-leave", () => {
    render(<Alert onCloseClick={() => {}} />);
    const close = screen.getByRole("button", { name: "Close" });
    expect(close.style.backgroundColor).toBe("rgb(255, 255, 255)"); // white/950, §16
    fireEvent.mouseEnter(close);
    expect(close.style.backgroundColor).toBe("rgb(235, 236, 240)"); // gray/200
    fireEvent.mouseLeave(close);
    expect(close.style.backgroundColor).toBe("rgb(255, 255, 255)");
  });

  it("darkens the plain neutral \"Learn more\" button on real hover, at every severity", () => {
    render(<Alert state="warning" primaryActionContent="Learn more" />);
    const button = screen.getByRole("button", { name: "Learn more" });
    expect(button.style.backgroundColor).toBe("rgb(255, 255, 255)"); // white/950, §16
    fireEvent.mouseEnter(button);
    expect(button.style.backgroundColor).toBe("rgb(235, 236, 240)"); // gray/200
    fireEvent.mouseLeave(button);
    expect(button.style.backgroundColor).toBe("rgb(255, 255, 255)");
  });

  // Requested override, §15 — "Learn more" no longer composes ButtonDanger/ButtonSuccess (which
  // set their own `data-state`), so this now asserts the same plain neutral hover behavior
  // directly, matching every other severity.
  it("hovers the same as every other severity on state=danger/success — no more composed Button data-state", () => {
    for (const state of ["danger", "success"] as const) {
      const { unmount } = render(<Alert state={state} primaryActionContent="Learn more" />);
      const button = screen.getByRole("button", { name: "Learn more" });
      expect(button, state).not.toHaveAttribute("data-state");
      expect(button.style.backgroundColor, state).toBe("rgb(255, 255, 255)"); // white/950, §16
      fireEvent.mouseEnter(button);
      expect(button.style.backgroundColor, state).toBe("rgb(235, 236, 240)"); // gray/200
      fireEvent.mouseLeave(button);
      expect(button.style.backgroundColor, state).toBe("rgb(255, 255, 255)");
      unmount();
    }
  });
});

// Requested addition, not part of the original Figma audit — Figma's own sampled instances
// always show both action buttons (no boolean toggle exists for either in the confirmed design).
describe("primaryAction / dismissAction (requested addition)", () => {
  it("both default to true, keeping the confirmed 2-button appearance unchanged", () => {
    render(<Alert primaryActionContent="Learn more" dismissContent="Dismiss" />);
    expect(screen.getByRole("button", { name: "Learn more" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
  });

  it("primaryAction=false hides only the primary action button", () => {
    render(<Alert primaryActionContent="Learn more" dismissContent="Dismiss" primaryAction={false} />);
    expect(screen.queryByRole("button", { name: "Learn more" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
  });

  it("dismissAction=false hides only the dismiss button", () => {
    render(<Alert primaryActionContent="Learn more" dismissContent="Dismiss" dismissAction={false} />);
    expect(screen.getByRole("button", { name: "Learn more" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Dismiss" })).not.toBeInTheDocument();
  });

  it("both false renders neither action button (only the corner close button remains)", () => {
    render(<Alert primaryActionContent="Learn more" dismissContent="Dismiss" primaryAction={false} dismissAction={false} />);
    expect(screen.queryByRole("button", { name: "Learn more" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Dismiss" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });
});
