import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import * as uiRoot from "../../index";
import { Tags } from "./tags";

describe("root export", () => {
  it("exposes Tags from the @shikho/ui package root", () => {
    expect(uiRoot.Tags).toBe(Tags);
  });
});

describe("renders as a static label, not an interactive control", () => {
  it("renders a <span>, not a <button>", () => {
    render(<Tags type="info">Info</Tags>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByText("Info").closest("span")?.tagName).toBe("SPAN");
  });
});

describe("all 11 confirmed types render with distinct confirmed/derived colours (docs/audit/tags.md §14)", () => {
  const types = [
    "info",
    "warning",
    "danger",
    "Danger Filled",
    "success",
    "Success Filled",
    "tertiary",
    "secondary",
    "primary_outline",
    "primary_light",
    "primary",
  ] as const;

  it.each(types)("renders type=%s without crashing", (type) => {
    render(<Tags type={type}>{type}</Tags>);
    expect(screen.getByText(type)).toBeInTheDocument();
  });

  it("applies the exact confirmed alpha-12 tint and Text/{name} 600 label for bare severities", () => {
    const { container } = render(<Tags type="danger">danger</Tags>);
    const root = container.firstChild as HTMLElement;
    expect(root.style.background).toBe("rgba(240, 61, 61, 0.12)"); // Color/danger/500_alpha_12
    expect(screen.getByText("danger").style.color).toBe("rgb(233, 32, 32)"); // Text/Danger 600
  });

  it("applies the confirmed solid fill for the Filled counterparts, with no border", () => {
    const { container } = render(<Tags type="Danger Filled">Danger Filled</Tags>);
    const root = container.firstChild as HTMLElement;
    expect(root.style.background).toBe("rgb(240, 61, 61)"); // Color/danger/500
    expect(root.style.border).toBeFalsy();
    expect(screen.getByText("Danger Filled").style.color).toBe("rgb(255, 255, 255)");
  });

  it("applies the confirmed primary_light alpha-12 tint (matches the same convention as severities)", () => {
    const { container } = render(<Tags type="primary_light">primary_light</Tags>);
    const root = container.firstChild as HTMLElement;
    expect(root.style.background).toBe("rgba(84, 104, 255, 0.12)"); // Color/primary/500_alpha_12
    expect(screen.getByText("primary_light").style.color).toBe("rgb(59, 78, 227)"); // Text/Primary 600
  });

  it("confirmed: primary_outline is an opaque white fill with a 24%-alpha primary border — not a transparent background with a fully opaque border", () => {
    const { container } = render(<Tags type="primary_outline">primary_outline</Tags>);
    const root = container.firstChild as HTMLElement;
    expect(root.style.background).toBe("rgb(255, 255, 255)");
    expect(root.style.border).toContain("rgba(84, 104, 255, 0.24)");
  });

  it("confirmed: tertiary is a white fill with a black/50 border, not a lighter borderless gray (§14 correction)", () => {
    const { container } = render(<Tags type="tertiary">tertiary</Tags>);
    const root = container.firstChild as HTMLElement;
    expect(root.style.background).toBe("rgb(255, 255, 255)");
    expect(root.style.border).toContain("rgba(0, 0, 0, 0.04)");
  });

  it("confirmed: the solid primary type has a black/50 border, unlike the borderless Filled severities (§14 correction)", () => {
    const { container } = render(<Tags type="primary">primary</Tags>);
    const root = container.firstChild as HTMLElement;
    expect(root.style.background).toBe("rgb(84, 104, 255)");
    expect(root.style.border).toContain("rgba(0, 0, 0, 0.04)");
  });
});

describe("confirmed per-size metrics (docs/audit/tags.md §14) — previously every size shared one font size and horizontal-only padding", () => {
  it("applies the confirmed heights for lg, md, and sm", () => {
    const { container, rerender } = render(<Tags size="lg">Tag</Tags>);
    expect((container.firstChild as HTMLElement).style.height).toBe("32px");
    rerender(<Tags size="md">Tag</Tags>);
    expect((container.firstChild as HTMLElement).style.height).toBe("24px");
    rerender(<Tags size="sm">Tag</Tags>);
    expect((container.firstChild as HTMLElement).style.height).toBe("20px");
  });

  it("confirmed: lg uses caption_2 (12px), md/sm use caption_1 (11px) — a real per-size typography difference", () => {
    const { rerender } = render(<Tags size="lg">Tag</Tags>);
    expect(screen.getByText("Tag").style.fontSize).toBe("12px");
    rerender(<Tags size="md">Tag</Tags>);
    expect(screen.getByText("Tag").style.fontSize).toBe("11px");
  });

  it("confirmed: icon slots carry the elevation/e2 drop-shadow filter (previously entirely absent)", () => {
    render(<Tags selectLeftIcon={<svg data-testid="icon" />}>Tag</Tags>);
    const iconSlot = screen.getByTestId("icon").parentElement as HTMLElement;
    expect(iconSlot.style.filter).toContain("drop-shadow");
  });
});

describe("confirmed states (docs/audit/tags.md §14)", () => {
  it("marks state=disabled with aria-disabled, since a <span> has no native disabled attribute", () => {
    const { container } = render(<Tags state="disabled">Tag</Tags>);
    expect(container.firstChild).toHaveAttribute("aria-disabled", "true");
  });

  it("does not mark default or hover as disabled", () => {
    const { container } = render(<Tags state="hover">Tag</Tags>);
    expect(container.firstChild).not.toHaveAttribute("aria-disabled");
  });

  it("confirmed: disabled uses the distinct vanilla_gray/100 fill (not the gray ramp's gray/100) and keeps the resting inset shadow", () => {
    const { container } = render(<Tags type="primary" state="disabled">Tag</Tags>);
    const root = container.firstChild as HTMLElement;
    expect(root.style.background).toBe("rgb(246, 244, 239)"); // vanilla_gray/100 #f6f4ef
    expect(root.style.border).toBeFalsy();
    expect(root.style.boxShadow).toContain("inset");
    expect(screen.getByText("Tag").style.color).toBe("rgb(195, 198, 204)"); // gray/400
  });

  it("confirmed: tertiary's hover fill darkens from white to gray/100, independently sampled", () => {
    const { container, rerender } = render(<Tags type="tertiary" state="default">Tag</Tags>);
    expect((container.firstChild as HTMLElement).style.background).toBe("rgb(255, 255, 255)");
    rerender(<Tags type="tertiary" state="hover">Tag</Tags>);
    expect((container.firstChild as HTMLElement).style.background).toBe("rgb(244, 244, 246)");
  });
});

describe("confirmed hover corrections from a fresh re-audit (docs/audit/tags.md §14)", () => {
  it("confirmed: the three solid-fill types DO have a real hover — darkening from ramp-500 to ramp-600, previously assumed unconfirmed and left unchanged", () => {
    const { container, rerender } = render(<Tags type="primary" state="default">Tag</Tags>);
    expect((container.firstChild as HTMLElement).style.background).toBe("rgb(84, 104, 255)"); // primary/500
    rerender(<Tags type="primary" state="hover">Tag</Tags>);
    expect((container.firstChild as HTMLElement).style.background).toBe("rgb(59, 78, 227)"); // primary/600

    rerender(<Tags type="Danger Filled" state="hover">Tag</Tags>);
    expect((container.firstChild as HTMLElement).style.background).toBe("rgb(233, 32, 32)"); // danger/600

    rerender(<Tags type="Success Filled" state="hover">Tag</Tags>);
    expect((container.firstChild as HTMLElement).style.background).toBe("rgb(42, 153, 25)"); // success/600
  });

  it("confirmed: primary_outline's hover fill is a light primary tint, not the previously-guessed plain gray/50", () => {
    const { container } = render(<Tags type="primary_outline" state="hover">Tag</Tags>);
    expect((container.firstChild as HTMLElement).style.background).toBe("rgba(84, 104, 255, 0.12)"); // primary/500_alpha_12
  });
});

describe("no unsupported variant is exported", () => {
  it("rejects a state value outside the confirmed 3-value enum — no focus, no drag", () => {
    // @ts-expect-error - "focus" is not a confirmed tags state (only disabled/hover/default exist, §2)
    const invalidState: import("./tags").TagState = "focus";
    // @ts-expect-error - "drag" is not a confirmed tags state either
    const invalidState2: import("./tags").TagState = "drag";
    expect([invalidState, invalidState2]).toBeDefined();
  });
});
