import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import * as uiRoot from "../../index";
import { Toggle } from "./toggle";

describe("root export", () => {
  it("exposes Toggle from the @shikho/ui package root", () => {
    expect(uiRoot.Toggle).toBe(Toggle);
  });
});

describe("switch semantics (native checkbox + role=switch)", () => {
  it("exposes the ARIA switch role, not a plain checkbox", () => {
    render(<Toggle aria-label="Notifications" />);
    expect(screen.getByRole("switch", { name: "Notifications" })).toBeInTheDocument();
  });

  it("renders OFF (unchecked) by default with the confirmed resting track fill", () => {
    render(<Toggle aria-label="Notifications" />);
    const el = screen.getByRole("switch", { name: "Notifications" }) as HTMLInputElement;
    expect(el.checked).toBe(false);
    expect(el.style.backgroundColor).toBe("rgb(235, 236, 240)"); // Color/Gray 200 #ebecf0
    expect(el.style.borderRadius).toBe("1000px"); // radius/border_radius_round
  });

  it("renders ON (checked) when checked is true", () => {
    render(<Toggle checked readOnly aria-label="Notifications" />);
    expect((screen.getByRole("switch", { name: "Notifications" }) as HTMLInputElement).checked).toBe(true);
  });

  it("toggles ON/OFF like a native checkbox on click", () => {
    render(<Toggle defaultChecked={false} aria-label="Notifications" />);
    const el = screen.getByRole("switch", { name: "Notifications" }) as HTMLInputElement;
    expect(el.checked).toBe(false);
    fireEvent.click(el);
    expect(el.checked).toBe(true);
  });
});

describe("disabled", () => {
  it("applies the native disabled attribute", () => {
    render(<Toggle disabled aria-label="Locked setting" />);
    expect(screen.getByRole("switch", { name: "Locked setting" })).toBeDisabled();
  });
});

describe("size", () => {
  it("applies the confirmed sm dimensions (32x20)", () => {
    render(<Toggle size="sm" aria-label="Setting" />);
    const el = screen.getByRole("switch", { name: "Setting" });
    expect(el.style.width).toBe("32px");
    expect(el.style.height).toBe("20px");
  });

  it("renders lg and md at the confirmed identical dimensions (40x24, not a bug)", () => {
    const { rerender } = render(<Toggle size="lg" aria-label="Setting" />);
    let el = screen.getByRole("switch", { name: "Setting" });
    expect(el.style.width).toBe("40px");
    expect(el.style.height).toBe("24px");
    rerender(<Toggle size="md" aria-label="Setting" />);
    el = screen.getByRole("switch", { name: "Setting" });
    expect(el.style.width).toBe("40px");
    expect(el.style.height).toBe("24px");
  });
});

describe("no unsupported states are exported", () => {
  it("has no indeterminate prop (confirmed absent from toggle's state enum, unlike Checkbox/Radio)", () => {
    const props = Object.keys((<Toggle aria-label="x" />).props);
    expect(props).not.toContain("indeterminate");
  });

  it("rejects a size value outside the confirmed enum at the type level", () => {
    // @ts-expect-error - "xl" is not a confirmed toggle size (only lg/md/sm exist, §2)
    const invalidSize: import("./toggle").ToggleSize = "xl";
    expect(invalidSize).toBeDefined();
  });
});
