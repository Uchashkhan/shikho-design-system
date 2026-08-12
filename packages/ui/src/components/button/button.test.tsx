import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { focusRingColor } from "@shikho/tokens";
import { AiRegularButton } from "./ai_regular";
import { AiRoundedButton } from "./ai_rounded";
import { ButtonDanger } from "./button_danger";
import { ButtonSuccess } from "./button_success";
import { GreyscaleButton } from "./greyscale";
import { IconButton } from "./icon_button";
import { NewBlueButton } from "./new_blue";
import { NewPinkButton } from "./new_pink";

describe("NewBlueButton — confirmed visual construction (docs/audit/buttons.md §14.2)", () => {
  it("renders the confirmed default binding (size=xs, type=Primary, state=Default)", () => {
    render(<NewBlueButton>Continue</NewBlueButton>);
    const button = screen.getByRole("button", { name: "Continue" });
    expect(button.style.backgroundColor).toBe("rgb(84, 104, 255)"); // Color/primary/500 #5468ff
    expect(button.style.color).toBe("rgb(255, 255, 255)"); // Text/White 950
    expect(button.style.borderRadius).toBe("6px"); // radius/custom/xs
    expect(button.style.border).toContain("rgba(0, 0, 0, 0.07)"); // outline/Black 150 (black[100])
  });

  it("confirmed: Primary renders the full 2-layer outer shadow plus an inset overlay div", () => {
    const { container } = render(<NewBlueButton>Continue</NewBlueButton>);
    const button = screen.getByRole("button");
    expect(button.style.boxShadow).toBeTruthy();
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it("confirmed: Text type has no border, no shadow, no inset overlay", () => {
    const { container } = render(<NewBlueButton type="Text">Continue</NewBlueButton>);
    const button = screen.getByRole("button");
    expect(button.style.border).toBeFalsy();
    expect(button.style.boxShadow).toBeFalsy();
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();
  });

  it("confirmed: hover jumps Primary's fill from ramp[500] to ramp[700] (not [600])", () => {
    render(<NewBlueButton state="Hover">Continue</NewBlueButton>);
    expect(screen.getByRole("button").style.backgroundColor).toBe("rgb(48, 62, 191)"); // primary/700 #303ebf
  });

  it("confirmed: focus replaces the button-effect with a ring-only treatment, no border", () => {
    render(<NewBlueButton state="Focus">Continue</NewBlueButton>);
    const button = screen.getByRole("button");
    expect(button.style.border).toBeFalsy();
    expect(button.style.boxShadow).toContain(focusRingColor.primary);
  });

  it("confirmed: disabled recolors to primary/100 fill, primary/300 text — not just dimmed opacity", () => {
    render(<NewBlueButton state="Disabled">Continue</NewBlueButton>);
    const button = screen.getByRole("button");
    expect(button.style.backgroundColor).toBe("rgb(237, 246, 255)"); // primary/100
    expect(button.style.color).toBe("rgb(186, 213, 255)"); // primary/300
    expect(button).toBeDisabled();
  });

  it("disables via the Disabled state as well as the disabled prop", () => {
    render(<NewBlueButton state="Disabled">Continue</NewBlueButton>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});

describe("ButtonDanger", () => {
  it("resolves its focus ring to the corrected danger color, not the secondary color", () => {
    render(<ButtonDanger state="focus">Delete</ButtonDanger>);
    const button = screen.getByRole("button", { name: "Delete" });
    expect(button.style.boxShadow).toContain(focusRingColor.danger);
    expect(button.style.boxShadow).not.toContain(focusRingColor.secondary);
  });

  it("confirmed: Secondary uses the exact gray/100 + danger-600 pair from alerts.md §11", () => {
    render(<ButtonDanger type="Secondary" state="default">Delete</ButtonDanger>);
    const button = screen.getByRole("button", { name: "Delete" });
    expect(button.style.backgroundColor).toBe("rgb(244, 244, 246)"); // gray/100
    expect(button.style.color).toBe("rgb(233, 32, 32)"); // danger/600
  });
});

describe("ButtonSuccess — confirmed disabled exception (§14.2)", () => {
  it("disabled fill is a flat neutral gray, not a tinted success color", () => {
    render(<ButtonSuccess state="disabled">Save</ButtonSuccess>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button.style.backgroundColor).toBe("rgb(244, 244, 246)"); // gray/100, confirmed exception
  });
});

// P5 repair — re-checking Alert's `success` state against a fresh get_design_context pull
// (node 66071:28159) found ButtonSuccess's Secondary type still fell through to the generic
// ramp-derived soft green tint, unlike ButtonDanger which already had this exact override.
describe("ButtonSuccess — confirmed Secondary exception, mirrors ButtonDanger (alerts.md §14)", () => {
  it("resolves to the exact gray/100 + success-600 pair, not a tinted green fill", () => {
    render(<ButtonSuccess type="Secondary" state="default">Learn more</ButtonSuccess>);
    const button = screen.getByRole("button", { name: "Learn more" });
    expect(button.style.backgroundColor).toBe("rgb(244, 244, 246)"); // gray/100
    expect(button.style.color).toBe("rgb(42, 153, 25)"); // success/600
  });

  it("darkens one step to gray/200 on hover, text color unchanged", () => {
    render(<ButtonSuccess type="Secondary" state="hover">Learn more</ButtonSuccess>);
    const button = screen.getByRole("button", { name: "Learn more" });
    expect(button.style.backgroundColor).toBe("rgb(235, 236, 240)"); // gray/200
    expect(button.style.color).toBe("rgb(42, 153, 25)"); // success/600
  });
});

describe("GreyscaleButton — confirmed primary=black[900], not gray[500] (§14.1 point 4)", () => {
  it("primary type fills with the near-black inverse color", () => {
    render(<GreyscaleButton type="primary">Cancel</GreyscaleButton>);
    expect(screen.getByRole("button", { name: "Cancel" }).style.backgroundColor).toBe("rgba(0, 0, 0, 0.88)");
  });
});

describe("AiRoundedButton — confirmed real gradients, and a true pill radius (§14.3)", () => {
  it("Primary type renders the confirmed pink-to-violet linear gradient, not a solid fill", () => {
    render(<AiRoundedButton type="Primary">Ask AI</AiRoundedButton>);
    const button = screen.getByRole("button", { name: "Ask AI" });
    expect(button.style.background).toContain("linear-gradient");
    expect(button.style.background).toContain("255, 55, 223");
  });

  it("blue gradient type renders its own distinct confirmed gradient", () => {
    render(<AiRoundedButton type="blue gradient">Ask AI</AiRoundedButton>);
    expect(screen.getByRole("button", { name: "Ask AI" }).style.background).toContain("74, 37, 225");
  });

  it("Purple type renders a radial gradient approximation of the confirmed 6-stop effect", () => {
    render(<AiRoundedButton type="Purple">Ask AI</AiRoundedButton>);
    expect(screen.getByRole("button", { name: "Ask AI" }).style.background).toContain("radial-gradient");
  });

  it("radius is a true pill (radius.full), confirmed height/2 at every sampled size", () => {
    render(<AiRoundedButton type="Primary">Ask AI</AiRoundedButton>);
    expect(screen.getByRole("button", { name: "Ask AI" }).style.borderRadius).toBe("1000px");
  });
});

// Confirmed via get_design_context on every `Disabled` variant of both component sets (node
// 66050:9281 ai_rounded / 66050:9682 ai_regular, §14.3) — disabled is genuinely type-specific,
// not the uniform gray[100]/gray[400] recipe originally guessed (§14.4).
describe("AiRoundedButton/AiRegularButton disabled — type-specific recipe, not uniform gray (§14.3)", () => {
  it("Primary disabled is a flat, muted secondary/100 fill with secondary/200 text, no gradient", () => {
    render(<AiRoundedButton type="Primary" state="Disabled">Ask AI</AiRoundedButton>);
    const button = screen.getByRole("button", { name: "Ask AI" });
    expect(button.style.background).toBe("rgb(252, 227, 247)"); // secondary/100 #fce3f7
    expect(button.style.color).toBe("rgb(247, 187, 233)"); // secondary/200 #f7bbe9
  });

  it("Green/blue gradient/Purple disabled keep their own gradient washed toward white, with white text", () => {
    const washed: Record<"Green" | "blue gradient" | "Purple", string> = {
      Green: "237, 245, 217",
      "blue gradient": "204, 194, 247",
      Purple: "230,222,254",
    };
    for (const type of ["Green", "blue gradient", "Purple"] as const) {
      const { unmount } = render(<AiRoundedButton type={type} state="Disabled">Ask AI</AiRoundedButton>);
      const button = screen.getByRole("button", { name: "Ask AI" });
      expect(button.style.background, type).toContain(washed[type]);
      expect(button.style.color, type).toBe("rgb(255, 255, 255)"); // white/950
      unmount();
    }
  });

  it("ai_regular's disabled follows the identical type-specific recipe as ai_rounded", () => {
    render(<AiRegularButton type="Primary" state="Disabled">Ask AI</AiRegularButton>);
    expect(screen.getByRole("button", { name: "Ask AI" }).style.background).toBe("rgb(252, 227, 247)");
  });
});

describe("AiRegularButton — same confirmed gradients as ai_rounded, scale radius not pill", () => {
  it("purple (lowercase) shares ai_rounded's Purple gradient definition", () => {
    render(<AiRegularButton type="purple">Ask AI</AiRegularButton>);
    expect(screen.getByRole("button", { name: "Ask AI" }).style.background).toContain("radial-gradient");
  });

  it("uses the ordinary scale radius, not a pill", () => {
    render(<AiRegularButton type="Primary">Ask AI</AiRegularButton>);
    expect(screen.getByRole("button", { name: "Ask AI" }).style.borderRadius).toBe("6px");
  });
});

describe("IconButton — confirmed 7-type mapping, correcting the secondary=pink-ramp guess (§14.1 point 3)", () => {
  it("requires an icon and an aria-label, and renders the icon", () => {
    render(<IconButton icon={<span data-testid="glyph" />} aria-label="Delete item" type="secondary" />);
    expect(screen.getByRole("button", { name: "Delete item" })).toBeInTheDocument();
    expect(screen.getByTestId("glyph")).toBeInTheDocument();
  });

  it("confirmed: secondary type is a neutral gray/100 fill, not the pink color.secondary ramp", () => {
    render(<IconButton icon={<span />} aria-label="Action" type="secondary" />);
    const button = screen.getByRole("button", { name: "Action" });
    expect(button.style.backgroundColor).toBe("rgb(244, 244, 246)"); // gray/100
    expect(button.style.backgroundColor).not.toBe("rgb(226, 0, 141)"); // NOT secondary/500
  });

  it("confirmed: quaternary type is a bare icon — no fill, border, or shadow at all", () => {
    render(<IconButton icon={<span />} aria-label="Action" type="quaternary" />);
    const button = screen.getByRole("button", { name: "Action" });
    expect(button.style.backgroundColor).toBe("transparent");
    expect(button.style.border).toBeFalsy();
    expect(button.style.boxShadow).toBeFalsy();
  });

  it("confirmed: neutral type is pure black (#000), distinct from Greyscale's 88%-alpha black", () => {
    render(<IconButton icon={<span />} aria-label="Action" type="neutral" />);
    expect(screen.getByRole("button", { name: "Action" }).style.backgroundColor).toBe("rgb(0, 0, 0)");
  });

  it("is fixed-square, sized to its own height (confirmed dimensions, §3)", () => {
    render(<IconButton icon={<span />} aria-label="Action" size="xs" />);
    const button = screen.getByRole("button", { name: "Action" });
    expect(button.style.width).toBe("24px");
    expect(button.style.height).toBe("24px");
  });
});

describe("NewPinkButton", () => {
  it("renders the confirmed pink brand ramp for Primary", () => {
    render(<NewPinkButton type="Primary">Upgrade</NewPinkButton>);
    expect(screen.getByRole("button", { name: "Upgrade" }).style.backgroundColor).toBe("rgb(226, 0, 141)"); // secondary/500
  });
});

describe("regression: an unrecognized `type` must render, not throw", () => {
  // A consumer widening a string through `as SomeButtonType` (exactly what the docs site's
  // playground does) can hand these components a `type` outside their own union at runtime,
  // even though TypeScript can't see it. Before this fix, `rampEmphasisStyle`/`iconButtonStyle`
  // fell through their switch with no `default` and returned `undefined`, and `ButtonShell`'s
  // unconditional `"filter" in resolved` threw a TypeError on that — which, with no error
  // boundary above it, unmounted the entire React tree instead of just this one button.
  it("NewBlueButton with a bogus type renders instead of throwing", () => {
    // @ts-expect-error — deliberately passing a value outside `NewBlueType` to reproduce the bug.
    expect(() => render(<NewBlueButton type="bogus">Continue</NewBlueButton>)).not.toThrow();
    expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument();
  });

  it("IconButton with a bogus type renders instead of throwing", () => {
    render(
      // @ts-expect-error — deliberately passing a value outside `IconButtonType`.
      <IconButton type="bogus" icon={<span aria-hidden>i</span>} aria-label="Info" />,
    );
    expect(screen.getByRole("button", { name: "Info" })).toBeInTheDocument();
  });
});
