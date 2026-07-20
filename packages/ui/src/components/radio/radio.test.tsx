import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import * as uiRoot from "../../index";
import { Radio } from "./radio";

describe("root export", () => {
  it("exposes Radio from the @shikho/ui package root", () => {
    expect(uiRoot.Radio).toBe(Radio);
  });
});

describe("checked/unchecked (Figma's active/inactive)", () => {
  it("renders unchecked by default with the confirmed-reused resting visual", () => {
    render(<Radio aria-label="Option A" />);
    const radio = screen.getByRole("radio", { name: "Option A" }) as HTMLInputElement;
    expect(radio.checked).toBe(false);
    expect(radio.style.backgroundColor).toBe("rgb(255, 255, 255)"); // Color/White 100
    expect(radio.style.border).toContain("195, 198, 204"); // Text/gray-400 #c3c6cc
    expect(radio.style.borderRadius).toBe("1000px"); // radius.full — no bound token exists (§8)
  });

  it("renders checked when checked is true", () => {
    render(<Radio checked readOnly aria-label="Option A" />);
    expect((screen.getByRole("radio", { name: "Option A" }) as HTMLInputElement).checked).toBe(true);
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

describe("disabled", () => {
  it("applies the native disabled attribute", () => {
    render(<Radio disabled aria-label="Locked option" />);
    expect(screen.getByRole("radio", { name: "Locked option" })).toBeDisabled();
  });
});

describe("indeterminate (confirmed enum value, no native mechanism)", () => {
  it("exposes data-indeterminate without any native/visual behavior beyond the attribute", () => {
    render(<Radio indeterminate aria-label="Odd option" />);
    const radio = screen.getByRole("radio", { name: "Odd option" });
    expect(radio).toHaveAttribute("data-indeterminate", "true");
  });
});

describe("size", () => {
  it("applies the confirmed md (24px) and sm (20px) dimensions", () => {
    const { rerender } = render(<Radio size="sm" aria-label="Box" />);
    expect(screen.getByRole("radio", { name: "Box" }).style.width).toBe("20px");
    rerender(<Radio size="md" aria-label="Box" />);
    expect(screen.getByRole("radio", { name: "Box" }).style.width).toBe("24px");
  });
});

describe("no unsupported properties are exported", () => {
  it("does not export RadioLabel (scoped out of this task, see README) or a shape prop", () => {
    expect((uiRoot as Record<string, unknown>).RadioLabel).toBeUndefined();
  });

  it("rejects a size value outside the confirmed enum at the type level", () => {
    // @ts-expect-error - "lg" is not a confirmed radio size (only md/sm exist, §4)
    const invalidSize: import("./radio").RadioSize = "lg";
    expect(invalidSize).toBeDefined();
  });
});
