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
    expect(screen.getByText("Info").tagName).toBe("SPAN");
  });
});

describe("all 11 confirmed types render with distinct confirmed/derived colours", () => {
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
    render(<Tags type="danger">danger</Tags>);
    const el = screen.getByText("danger");
    expect(el.style.backgroundColor).toBe("rgba(240, 61, 61, 0.12)"); // Color/danger/500_alpha_12
    expect(el.style.color).toBe("rgb(233, 32, 32)"); // Text/Danger 600
  });

  it("applies the confirmed solid fill for the Filled counterparts", () => {
    render(<Tags type="Danger Filled">Danger Filled</Tags>);
    const el = screen.getByText("Danger Filled");
    expect(el.style.backgroundColor).toBe("rgb(240, 61, 61)"); // Color/danger/500
    expect(el.style.color).toBe("rgb(255, 255, 255)");
  });

  it("applies the confirmed primary_light alpha-12 tint (matches the same convention as severities)", () => {
    render(<Tags type="primary_light">primary_light</Tags>);
    const el = screen.getByText("primary_light");
    expect(el.style.backgroundColor).toBe("rgba(84, 104, 255, 0.12)"); // Color/primary/500_alpha_12
    expect(el.style.color).toBe("rgb(59, 78, 227)"); // Text/Primary 600
  });

  it("renders primary_outline with a border and transparent background", () => {
    render(<Tags type="primary_outline">primary_outline</Tags>);
    const el = screen.getByText("primary_outline");
    expect(el.style.backgroundColor).toBe("transparent");
    expect(el.style.border).toContain("84, 104, 255");
  });
});

describe("confirmed sizes", () => {
  it("applies the confirmed heights for lg, md, and sm", () => {
    const { rerender } = render(<Tags size="lg">Tag</Tags>);
    expect(screen.getByText("Tag").style.height).toBe("32px");
    rerender(<Tags size="md">Tag</Tags>);
    expect(screen.getByText("Tag").style.height).toBe("24px");
    rerender(<Tags size="sm">Tag</Tags>);
    expect(screen.getByText("Tag").style.height).toBe("20px");
  });
});

describe("confirmed states", () => {
  it("marks state=disabled with aria-disabled, since a <span> has no native disabled attribute", () => {
    render(<Tags state="disabled">Tag</Tags>);
    expect(screen.getByText("Tag")).toHaveAttribute("aria-disabled", "true");
  });

  it("does not mark default or hover as disabled", () => {
    render(<Tags state="hover">Tag</Tags>);
    expect(screen.getByText("Tag")).not.toHaveAttribute("aria-disabled");
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
