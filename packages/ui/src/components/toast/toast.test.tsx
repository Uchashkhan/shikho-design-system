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

describe("no unsupported variant is exported", () => {
  it("rejects a state value outside the confirmed enum, and rejects Alert's capitalized Default", () => {
    // @ts-expect-error - "Default" (capitalized) is alert's baseline value, not toast's (§2, §11)
    const invalidState: import("./toast").ToastState = "Default";
    expect(invalidState).toBeDefined();
  });
});
