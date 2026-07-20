import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import * as uiRoot from "../../index";
import { Checkbox } from "./checkbox";

describe("root export", () => {
  it("exposes Checkbox from the @shikho/ui package root", () => {
    expect(uiRoot.Checkbox).toBe(Checkbox);
  });
});

describe("checked/unchecked", () => {
  it("renders unchecked by default with the confirmed resting visual", () => {
    render(<Checkbox aria-label="Accept terms" />);
    const box = screen.getByRole("checkbox", { name: "Accept terms" }) as HTMLInputElement;
    expect(box.checked).toBe(false);
    expect(box.style.backgroundColor).toBe("rgb(255, 255, 255)"); // Color/White 100
    expect(box.style.border).toContain("195, 198, 204"); // Text/gray-400 #c3c6cc
    expect(box.style.borderRadius).toBe("6px"); // radius/border_radius_xs
  });

  it("renders checked when the checked prop is true", () => {
    render(<Checkbox checked readOnly aria-label="Accept terms" />);
    const box = screen.getByRole("checkbox", { name: "Accept terms" }) as HTMLInputElement;
    expect(box.checked).toBe(true);
  });

  it("toggles via user interaction like a native checkbox", () => {
    render(<Checkbox defaultChecked={false} aria-label="Subscribe" />);
    const box = screen.getByRole("checkbox", { name: "Subscribe" }) as HTMLInputElement;
    expect(box.checked).toBe(false);
    fireEvent.click(box);
    expect(box.checked).toBe(true);
  });
});

describe("indeterminate", () => {
  it("sets the native indeterminate DOM property, not just a visual class", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox ref={ref} indeterminate aria-label="Select some" />);
    expect(ref.current?.indeterminate).toBe(true);
  });
});

describe("disabled", () => {
  it("applies the native disabled attribute", () => {
    render(<Checkbox disabled aria-label="Locked option" />);
    expect(screen.getByRole("checkbox", { name: "Locked option" })).toBeDisabled();
  });
});

describe("size and shape", () => {
  it("applies the confirmed md (24px) and sm (20px) dimensions", () => {
    const { rerender } = render(<Checkbox size="sm" aria-label="Box" />);
    expect(screen.getByRole("checkbox", { name: "Box" }).style.width).toBe("20px");
    rerender(<Checkbox size="md" aria-label="Box" />);
    expect(screen.getByRole("checkbox", { name: "Box" }).style.width).toBe("24px");
  });

  it("applies a full radius for shape=sphere instead of the square radius", () => {
    render(<Checkbox shape="sphere" aria-label="Round box" />);
    const box = screen.getByRole("checkbox", { name: "Round box" });
    expect(box.style.borderRadius).toBe("1000px");
  });
});

describe("unsupported/unconfirmed states are not exported", () => {
  it("does not export CheckboxLabel (scoped out of this task, see README)", () => {
    expect((uiRoot as Record<string, unknown>).CheckboxLabel).toBeUndefined();
  });

  it("only renders the two confirmed shapes' radii — no third shape value is accepted", () => {
    render(<Checkbox shape="square" aria-label="Square box" />);
    expect(screen.getByRole("checkbox", { name: "Square box" }).style.borderRadius).toBe("6px");
  });
});
