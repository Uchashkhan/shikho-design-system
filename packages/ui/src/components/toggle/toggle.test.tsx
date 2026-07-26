import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import * as uiRoot from "../../index";
import { Toggle } from "./toggle";
import { ToggleLabel } from "./toggle_label";

describe("root export", () => {
  it("exposes Toggle from the @shikho/ui package root", () => {
    expect(uiRoot.Toggle).toBe(Toggle);
  });

  it("exposes ToggleLabel from the @shikho/ui package root (docs/audit/toggle.md §14)", () => {
    expect(uiRoot.ToggleLabel).toBe(ToggleLabel);
  });
});

describe("switch semantics (native checkbox + role=switch, visually hidden behind a custom track/knob)", () => {
  it("exposes the ARIA switch role, not a plain checkbox", () => {
    render(<Toggle aria-label="Notifications" />);
    expect(screen.getByRole("switch", { name: "Notifications" })).toBeInTheDocument();
  });

  it("renders OFF (unchecked) by default with the confirmed gray/200 track and a white knob on the left", () => {
    const { container } = render(<Toggle aria-label="Notifications" />);
    const input = screen.getByRole("switch", { name: "Notifications" }) as HTMLInputElement;
    expect(input.checked).toBe(false);
    const track = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(track.style.background).toBe("rgb(235, 236, 240)"); // gray/200 #ebecf0
    expect(track.style.borderRadius).toBe("1000px");
    expect(track.style.justifyContent).toBe("flex-start");
    const knob = track.firstElementChild as HTMLElement;
    expect(knob.style.background).toBe("rgb(255, 255, 255)");
    expect(knob.querySelector("svg")).not.toBeInTheDocument(); // no checkmark when OFF
  });

  it("renders ON (checked) with a confirmed primary/500 track, the knob slid to the right, and a checkmark", () => {
    const { container } = render(<Toggle checked readOnly aria-label="Notifications" />);
    const input = screen.getByRole("switch", { name: "Notifications" }) as HTMLInputElement;
    expect(input.checked).toBe(true);
    const track = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(track.style.background).toBe("rgb(84, 104, 255)"); // primary/500
    expect(track.style.justifyContent).toBe("flex-end");
    const knob = track.firstElementChild as HTMLElement;
    expect(knob.querySelector("svg")).toBeInTheDocument();
  });

  it("toggles ON/OFF like a native checkbox on click", () => {
    render(<Toggle defaultChecked={false} aria-label="Notifications" />);
    const el = screen.getByRole("switch", { name: "Notifications" }) as HTMLInputElement;
    expect(el.checked).toBe(false);
    fireEvent.click(el);
    expect(el.checked).toBe(true);
  });
});

describe("knob is a confirmed stadium/pill shape, not a circle (docs/audit/toggle.md §14)", () => {
  it("uses different width/height for the knob at each size", () => {
    const { container, rerender } = render(<Toggle size="sm" aria-label="x" />);
    let knob = (container.querySelector('[aria-hidden="true"]') as HTMLElement).firstElementChild as HTMLElement;
    expect(knob.style.width).toBe("16px");
    expect(knob.style.height).toBe("12px");
    rerender(<Toggle size="md" aria-label="x" />);
    knob = (container.querySelector('[aria-hidden="true"]') as HTMLElement).firstElementChild as HTMLElement;
    expect(knob.style.width).toBe("20px");
    expect(knob.style.height).toBe("16px");
    rerender(<Toggle size="lg" aria-label="x" />);
    knob = (container.querySelector('[aria-hidden="true"]') as HTMLElement).firstElementChild as HTMLElement;
    expect(knob.style.width).toBe("22px");
    expect(knob.style.height).toBe("18px");
  });
});

describe("disabled — confirmed translucent-black knob with no shadow, regardless of ON/OFF (docs/audit/toggle.md §14)", () => {
  it("applies the native disabled attribute", () => {
    render(<Toggle disabled aria-label="Locked setting" />);
    expect(screen.getByRole("switch", { name: "Locked setting" })).toBeDisabled();
  });

  it("confirmed: disabled OFF uses the gray/100 track and a translucent-black knob with no checkmark", () => {
    const { container } = render(<Toggle disabled aria-label="Locked setting" />);
    const track = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(track.style.background).toBe("rgb(244, 244, 246)"); // gray/100 #f4f4f6
    const knob = track.firstElementChild as HTMLElement;
    expect(knob.style.background).toBe("rgba(0, 0, 0, 0.07)"); // black/100, #00000012
    expect(knob.style.boxShadow).toBeFalsy();
    expect(knob.querySelector("svg")).not.toBeInTheDocument();
  });

  it("confirmed: disabled ON keeps the SAME muted gray track (not primary-tinted) and shows a muted checkmark", () => {
    const { container } = render(<Toggle disabled checked readOnly aria-label="Locked setting" />);
    const track = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(track.style.background).toBe("rgb(244, 244, 246)"); // gray/100, not primary/500
    const knob = track.firstElementChild as HTMLElement;
    expect(knob.querySelector("svg")).toBeInTheDocument();
  });
});

describe("focus — confirmed ring only ever applies to the checked (ON) track (docs/audit/toggle.md §2, §8)", () => {
  it("rings the track with outline/focus_primary when focused while ON", () => {
    const { container } = render(<Toggle checked readOnly aria-label="Setting" />);
    const input = screen.getByRole("switch", { name: "Setting" });
    fireEvent.focus(input);
    const track = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(track.style.boxShadow).toContain("#5468ff3d");
  });
});

describe("size", () => {
  it("applies the confirmed sm outer box (32x20) and track/knob dimensions", () => {
    render(<Toggle size="sm" aria-label="Setting" />);
    const el = screen.getByRole("switch", { name: "Setting" }).parentElement as HTMLElement;
    expect(el.style.width).toBe("32px");
    expect(el.style.height).toBe("20px");
  });

  it("renders lg and md at the confirmed identical OUTER box (40x24), but different track sizes", () => {
    const { container, rerender } = render(<Toggle size="lg" aria-label="Setting" />);
    let el = screen.getByRole("switch", { name: "Setting" }).parentElement as HTMLElement;
    expect(el.style.width).toBe("40px");
    let track = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(track.style.width).toBe("38px"); // lg track, confirmed different from md's

    rerender(<Toggle size="md" aria-label="Setting" />);
    el = screen.getByRole("switch", { name: "Setting" }).parentElement as HTMLElement;
    expect(el.style.width).toBe("40px");
    track = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(track.style.width).toBe("34px"); // md track, confirmed narrower than lg's despite same outer box
  });
});

describe("ToggleLabel — confirmed real composition, Medium/500 label weight at both sizes (docs/audit/toggle.md §14)", () => {
  it("composes the real Toggle plus a label/caption text column", () => {
    render(<ToggleLabel labelContent="Email notifications" captionContent="Weekly digest only" />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
    expect(screen.getByText("Email notifications")).toBeInTheDocument();
    expect(screen.getByText("Weekly digest only")).toBeInTheDocument();
  });

  it("confirmed: label is Medium/500 weight at BOTH md and sm, unlike Checkbox/Radio's Regular/400 md label", () => {
    render(<ToggleLabel size="md" labelContent="Label" />);
    const label = screen.getByText("Label");
    expect(label.style.fontWeight).toBe("500");
    expect(label.style.fontSize).toBe("13px");
  });

  it("confirmed: direction=left renders the toggle before the label; direction=right reverses it", () => {
    const { container: leftContainer } = render(<ToggleLabel direction="left" labelContent="Label" />);
    const { container: rightContainer } = render(<ToggleLabel direction="right" labelContent="Label" />);
    expect(leftContainer.querySelector("label")?.firstElementChild?.tagName).toBe("SPAN");
    expect(rightContainer.querySelector("label")?.firstElementChild?.textContent).toContain("Label");
  });

  it("hides the caption when caption=false", () => {
    render(<ToggleLabel labelContent="Label" caption={false} captionContent="Hidden" />);
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
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
