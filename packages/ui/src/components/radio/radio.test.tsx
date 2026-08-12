import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import * as uiRoot from "../../index";
import { Radio } from "./radio";
import { RadioLabel } from "./radio_label";

describe("root export", () => {
  it("exposes Radio from the @shikho/ui package root", () => {
    expect(uiRoot.Radio).toBe(Radio);
  });

  it("exposes RadioLabel from the @shikho/ui package root (docs/audit/radio-buttons.md §15)", () => {
    expect(uiRoot.RadioLabel).toBe(RadioLabel);
  });
});

describe("inactive (unselected default) — confirmed white fill + gray/400 border (docs/audit/radio-buttons.md §15)", () => {
  it("renders unchecked by default with the confirmed resting visual", () => {
    const { container } = render(<Radio aria-label="Option A" />);
    const input = screen.getByRole("radio", { name: "Option A" }) as HTMLInputElement;
    expect(input.checked).toBe(false);
    const visibleCircle = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(visibleCircle.style.background).toBe("rgb(255, 255, 255)"); // Color/White 100
    expect(visibleCircle.style.border).toContain("195, 198, 204"); // gray/400 #c3c6cc
    expect(visibleCircle.style.borderRadius).toBe("1000px"); // radius.full
    expect(visibleCircle.querySelector("span")).not.toBeInTheDocument(); // no mark
  });
});

describe("hover — confirmed TRANSPARENT fill (not white) + primary/500 border (docs/audit/radio-buttons.md §15)", () => {
  it("swaps to a transparent fill and a primary border on hover", () => {
    render(<Radio aria-label="Option" />);
    const input = screen.getByRole("radio", { name: "Option" });
    fireEvent.mouseEnter(input);
    const visibleCircle = input.parentElement?.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(visibleCircle.style.background).toBe("transparent");
    expect(visibleCircle.style.border).toContain("84, 104, 255"); // primary/500
  });
});

describe("active (selected) — confirmed edge-to-edge primary fill with a punched-out white center dot (docs/audit/radio-buttons.md §15)", () => {
  it("renders checked with a solid primary/500 disc and a white center dot, no border", () => {
    const { container } = render(<Radio checked readOnly aria-label="Option A" />);
    const input = screen.getByRole("radio", { name: "Option A" }) as HTMLInputElement;
    expect(input.checked).toBe(true);
    const visibleCircle = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(visibleCircle.style.background).toBe("rgb(84, 104, 255)"); // primary/500
    expect(visibleCircle.style.border).toBeFalsy();
    const dot = visibleCircle.querySelector("span") as HTMLElement;
    expect(dot.style.background).toBe("rgb(255, 255, 255)"); // white dot
    expect(dot.style.width).toBe("6px"); // confirmed sm dot size
  });

  it("scales the dot to the confirmed 8px at md", () => {
    const { container } = render(<Radio size="md" checked readOnly aria-label="Option A" />);
    const dot = (container.querySelector('[aria-hidden="true"]') as HTMLElement).querySelector("span") as HTMLElement;
    expect(dot.style.width).toBe("8px");
  });

  it("behaves like a native mutually-exclusive radio group when sharing a name", () => {
    render(
      <div>
        <Radio name="choice" defaultChecked aria-label="Option A" />
        <Radio name="choice" aria-label="Option B" />
      </div>,
    );
    const a = screen.getByRole("radio", { name: "Option A" }) as HTMLInputElement;
    const b = screen.getByRole("radio", { name: "Option B" }) as HTMLInputElement;
    expect(a.checked).toBe(true);
    fireEvent.click(b);
    expect(b.checked).toBe(true);
    expect(a.checked).toBe(false);
  });
});

describe("indeterminate — confirmed light primary/100 fill with a primary/500 dash mark, not a dot (docs/audit/radio-buttons.md §15)", () => {
  it("renders a horizontal pill mark (8x2px), not a circular dot", () => {
    const { container } = render(<Radio indeterminate aria-label="Odd option" />);
    const visibleCircle = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(visibleCircle.style.background).toBe("rgb(237, 246, 255)"); // primary/100
    const dash = visibleCircle.querySelector("span") as HTMLElement;
    expect(dash.style.width).toBe("8px");
    expect(dash.style.height).toBe("2px");
    expect(dash.style.background).toBe("rgb(84, 104, 255)"); // primary/500
  });

  it("exposes data-indeterminate on the native input", () => {
    render(<Radio indeterminate aria-label="Odd option" />);
    expect(screen.getByRole("radio", { name: "Odd option" })).toHaveAttribute(
      "data-indeterminate",
      "true",
    );
  });
});

describe("disabled — confirmed single variant: gray/400 fill + gray/600 dash, ALWAYS shown regardless of checked/indeterminate (docs/audit/radio-buttons.md §15)", () => {
  it("applies the native disabled attribute", () => {
    render(<Radio disabled aria-label="Locked option" />);
    expect(screen.getByRole("radio", { name: "Locked option" })).toBeDisabled();
  });

  it("shows the gray dash mark even when plain disabled+unchecked (no separate confirmed disabled-unchecked variant)", () => {
    const { container } = render(<Radio disabled aria-label="Locked option" />);
    const visibleCircle = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(visibleCircle.style.background).toBe("rgb(195, 198, 204)"); // gray/400
    expect(visibleCircle.style.border).toBeFalsy();
    const dash = visibleCircle.querySelector("span") as HTMLElement;
    expect(dash.style.background).toBe("rgb(140, 146, 156)"); // gray/600
  });

  it("still shows the same gray dash mark when disabled+checked — confirmed there is only one disabled visual", () => {
    const { container } = render(<Radio disabled checked readOnly aria-label="Locked option" />);
    const visibleCircle = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(visibleCircle.style.background).toBe("rgb(195, 198, 204)"); // gray/400, not primary/500
    const dash = visibleCircle.querySelector("span") as HTMLElement;
    expect(dash.style.background).toBe("rgb(140, 146, 156)"); // gray/600 dash, not a white dot
  });
});

describe("focus — confirmed ring color depends on checked state (docs/audit/radio-buttons.md §15)", () => {
  it("confirmed: inactive_focused rings gray/300 and darkens the border to gray/600", () => {
    render(<Radio aria-label="Option" />);
    const input = screen.getByRole("radio", { name: "Option" });
    fireEvent.focus(input);
    const visibleCircle = input.parentElement?.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(visibleCircle.style.boxShadow).toContain("#dddfe4"); // gray/300
    expect(visibleCircle.style.border).toContain("140, 146, 156"); // gray/600
  });

  it("confirmed: active_focused rings primary alpha, not gray", () => {
    render(<Radio checked readOnly aria-label="Option" />);
    const input = screen.getByRole("radio", { name: "Option" });
    fireEvent.focus(input);
    const visibleCircle = input.parentElement?.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(visibleCircle.style.boxShadow).toContain("#5468ff3d");
  });
});

describe("size", () => {
  it("applies the confirmed md (24px) and sm (20px) outer footprint, with the confirmed inner box (docs/audit/radio-buttons.md §4, §15)", () => {
    const { rerender, container } = render(<Radio size="sm" aria-label="Box" />);
    expect((container.firstChild as HTMLElement).style.width).toBe("20px");
    expect((container.querySelector('[aria-hidden="true"]') as HTMLElement).style.width).toBe("16px");
    rerender(<Radio size="md" aria-label="Box" />);
    expect((container.firstChild as HTMLElement).style.width).toBe("24px");
    expect((container.querySelector('[aria-hidden="true"]') as HTMLElement).style.width).toBe("18px");
  });
});

describe("RadioLabel — confirmed real composition with size-dependent label typography (docs/audit/radio-buttons.md §15)", () => {
  it("composes the real Radio plus a label/caption text column", () => {
    render(<RadioLabel labelContent="Weekly plan" captionContent="Billed monthly" />);
    expect(screen.getByRole("radio")).toBeInTheDocument();
    expect(screen.getByText("Weekly plan")).toBeInTheDocument();
    expect(screen.getByText("Billed monthly")).toBeInTheDocument();
  });

  it("confirmed: md label uses Regular/400 weight at body_1 (13/20)", () => {
    render(<RadioLabel size="md" labelContent="Label" />);
    const label = screen.getByText("Label");
    expect(label.style.fontWeight).toBe("400");
    expect(label.style.fontSize).toBe("13px");
  });

  it("confirmed: sm label collapses to Medium/500 weight at caption_2 (12/16), same as the caption", () => {
    render(<RadioLabel size="sm" labelContent="Label" />);
    const label = screen.getByText("Label");
    expect(label.style.fontWeight).toBe("500");
    expect(label.style.fontSize).toBe("12px");
  });

  it("confirmed: direction=left renders the radio before the label; direction=right reverses it", () => {
    const { container: leftContainer } = render(<RadioLabel direction="left" labelContent="Label" />);
    const { container: rightContainer } = render(<RadioLabel direction="right" labelContent="Label" />);
    expect(leftContainer.querySelector("label")?.firstElementChild?.tagName).toBe("SPAN");
    expect(rightContainer.querySelector("label")?.firstElementChild?.textContent).toContain("Label");
  });

  it("hides the caption when caption=false", () => {
    render(<RadioLabel labelContent="Label" caption={false} captionContent="Hidden" />);
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });
});

// P15 — Figma's own `state` property is a confirmed 7-value variant axis, but there was
// previously no way to force any of it for a static preview (e.g. active_focused, which
// otherwise only appears while a real cursor/keyboard is actively focusing the element).
describe("explicit `state` forces any of the 7 confirmed visuals (P15)", () => {
  it("active_focused renders the checked disc/dot AND the primary-alpha ring without a real pointer/keyboard", () => {
    const { container } = render(<Radio state="active_focused" aria-label="Preview" />);
    const visibleCircle = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(visibleCircle.style.background).toBe("rgb(84, 104, 255)"); // primary/500
    expect(visibleCircle.style.boxShadow).toContain("#5468ff3d");
    expect(visibleCircle.querySelector("span")).toBeInTheDocument(); // the white dot
  });

  it("inactive_focused renders the gray ring and darkened border without real focus", () => {
    const { container } = render(<Radio state="inactive_focused" aria-label="Preview" />);
    const visibleCircle = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(visibleCircle.style.boxShadow).toContain("#dddfe4");
    expect(visibleCircle.style.border).toContain("140, 146, 156"); // gray/600
  });

  it("sets data-state to the resolved value for every forced state", () => {
    const states = [
      "inactive",
      "hover",
      "inactive_focused",
      "active",
      "active_focused",
      "indeterminate",
      "disabled",
    ] as const;
    for (const s of states) {
      const { unmount } = render(<Radio state={s} aria-label="Preview" />);
      expect(screen.getByRole("radio", { name: "Preview" })).toHaveAttribute("data-state", s);
      unmount();
    }
  });

  it("without an explicit state, data-state still derives from real checked/hover/focus", () => {
    render(<Radio aria-label="Real" />);
    const input = screen.getByRole("radio", { name: "Real" });
    expect(input).toHaveAttribute("data-state", "inactive");
    fireEvent.mouseEnter(input);
    expect(input).toHaveAttribute("data-state", "hover");
  });
});

describe("no unsupported properties are exported", () => {
  it("rejects a size value outside the confirmed enum at the type level", () => {
    // @ts-expect-error - "lg" is not a confirmed radio size (only md/sm exist, §4)
    const invalidSize: import("./radio").RadioSize = "lg";
    expect(invalidSize).toBeDefined();
  });
});
