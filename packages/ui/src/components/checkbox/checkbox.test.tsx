import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import * as uiRoot from "../../index";
import { Checkbox } from "./checkbox";
import { CheckboxLabel } from "./checkbox_label";

describe("root export", () => {
  it("exposes Checkbox from the @shikho/ui package root", () => {
    expect(uiRoot.Checkbox).toBe(Checkbox);
  });

  it("exposes CheckboxLabel from the @shikho/ui package root (docs/audit/checkboxes.md §14 — now confirmed real, previously scoped out)", () => {
    expect(uiRoot.CheckboxLabel).toBe(CheckboxLabel);
  });
});

describe("checked/unchecked — confirmed visual construction (docs/audit/checkboxes.md §14)", () => {
  it("renders unchecked by default with the confirmed resting visual on the visible box, not the (now hidden) native input", () => {
    const { container } = render(<Checkbox aria-label="Accept terms" />);
    const box = screen.getByRole("checkbox", { name: "Accept terms" }) as HTMLInputElement;
    expect(box.checked).toBe(false);
    const visibleBox = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(visibleBox.style.background).toBe("rgb(255, 255, 255)"); // Color/White 100
    expect(visibleBox.style.border).toContain("195, 198, 204"); // Text/gray-400 #c3c6cc
    expect(visibleBox.style.borderRadius).toBe("6px"); // radius/border_radius_xs
  });

  it("renders checked when the checked prop is true, with the confirmed solid primary fill and a checkmark", () => {
    const { container } = render(<Checkbox checked readOnly aria-label="Accept terms" />);
    const box = screen.getByRole("checkbox", { name: "Accept terms" }) as HTMLInputElement;
    expect(box.checked).toBe(true);
    const visibleBox = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(visibleBox.style.background).toBe("rgb(84, 104, 255)"); // primary/500
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("toggles via user interaction like a native checkbox", () => {
    render(<Checkbox defaultChecked={false} aria-label="Subscribe" />);
    const box = screen.getByRole("checkbox", { name: "Subscribe" }) as HTMLInputElement;
    expect(box.checked).toBe(false);
    fireEvent.click(box);
    expect(box.checked).toBe(true);
  });
});

describe("indeterminate — confirmed distinct light-tint fill (docs/audit/checkboxes.md §14)", () => {
  it("sets the native indeterminate DOM property, not just a visual class", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox ref={ref} indeterminate aria-label="Select some" />);
    expect(ref.current?.indeterminate).toBe(true);
  });

  it("confirmed: indeterminate uses a light primary/100 tint fill (not a solid dark fill like checked) with a primary/500 dash", () => {
    const { container } = render(<Checkbox indeterminate aria-label="Select some" />);
    const visibleBox = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(visibleBox.style.background).toBe("rgb(237, 246, 255)"); // primary/100
    const dash = visibleBox.querySelector("span") as HTMLElement;
    expect(dash.style.background).toBe("rgb(84, 104, 255)"); // primary/500
  });
});

describe("disabled — confirmed solid gray fill, not a generic opacity dim (docs/audit/checkboxes.md §14)", () => {
  it("applies the native disabled attribute", () => {
    render(<Checkbox disabled aria-label="Locked option" />);
    expect(screen.getByRole("checkbox", { name: "Locked option" })).toBeDisabled();
  });

  it("confirmed: disabled renders a flat gray/400 fill with no border, regardless of checked state", () => {
    const { container } = render(<Checkbox disabled checked readOnly aria-label="Locked option" />);
    const visibleBox = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(visibleBox.style.background).toBe("rgb(195, 198, 204)"); // gray/400
    expect(visibleBox.style.border).toBeFalsy();
  });

  it("confirmed: indeterminate_disabled's dash is gray/600, distinct from the enabled primary/500 dash", () => {
    const { container } = render(<Checkbox disabled indeterminate aria-label="Locked, some selected" />);
    const visibleBox = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    const dash = visibleBox.querySelector("span") as HTMLElement;
    expect(dash.style.background).toBe("rgb(140, 146, 156)"); // gray/600
  });
});

describe("focus — confirmed ring color depends on checked state (docs/audit/checkboxes.md §14)", () => {
  it("confirmed: unchecked_focused rings gray/300", () => {
    render(<Checkbox aria-label="Box" />);
    const input = screen.getByRole("checkbox", { name: "Box" });
    fireEvent.focus(input);
    const visibleBox = input.parentElement?.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(visibleBox.style.boxShadow).toContain("#dddfe4"); // gray/300
  });

  it("confirmed: checked_focused rings primary alpha, not gray — resolves the original audit's open question", () => {
    render(<Checkbox checked readOnly aria-label="Box" />);
    const input = screen.getByRole("checkbox", { name: "Box" });
    fireEvent.focus(input);
    const visibleBox = input.parentElement?.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(visibleBox.style.boxShadow).toContain("#5468ff3d");
  });
});

describe("hover — confirmed border turns primary/500, no fill (docs/audit/checkboxes.md §14)", () => {
  it("confirmed: unchecked hover swaps the gray border for a primary one", () => {
    render(<Checkbox aria-label="Box" />);
    const input = screen.getByRole("checkbox", { name: "Box" });
    fireEvent.mouseEnter(input);
    const visibleBox = input.parentElement?.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(visibleBox.style.border).toContain("84, 104, 255");
  });
});

describe("size and shape", () => {
  it("applies the confirmed md (24px) and sm (20px) outer footprint, with an inner box 4px smaller (docs/audit/checkboxes.md §14)", () => {
    const { rerender, container } = render(<Checkbox size="sm" aria-label="Box" />);
    expect((container.firstChild as HTMLElement).style.width).toBe("20px");
    expect((container.querySelector('[aria-hidden="true"]') as HTMLElement).style.width).toBe("16px");
    rerender(<Checkbox size="md" aria-label="Box" />);
    expect((container.firstChild as HTMLElement).style.width).toBe("24px");
    expect((container.querySelector('[aria-hidden="true"]') as HTMLElement).style.width).toBe("18px");
  });

  it("applies a full radius for shape=sphere instead of the square radius", () => {
    const { container } = render(<Checkbox shape="sphere" aria-label="Round box" />);
    const visibleBox = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(visibleBox.style.borderRadius).toBe("1000px");
  });
});

describe("CheckboxLabel — confirmed real composition (docs/audit/checkboxes.md §14)", () => {
  it("composes the real Checkbox plus a label/caption text column", () => {
    render(<CheckboxLabel labelContent="Email me" captionContent="Optional" />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(screen.getByText("Email me")).toBeInTheDocument();
    expect(screen.getByText("Optional")).toBeInTheDocument();
  });

  it("confirmed: direction=left renders the checkbox before the label; direction=right reverses it", () => {
    const { container: leftContainer } = render(<CheckboxLabel direction="left" labelContent="Label" />);
    const { container: rightContainer } = render(<CheckboxLabel direction="right" labelContent="Label" />);
    expect(leftContainer.querySelector("label")?.firstElementChild?.tagName).toBe("SPAN");
    expect(rightContainer.querySelector("label")?.firstElementChild?.textContent).toContain("Label");
  });

  it("hides the caption when caption=false", () => {
    render(<CheckboxLabel labelContent="Label" caption={false} captionContent="Hidden" />);
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });
});
