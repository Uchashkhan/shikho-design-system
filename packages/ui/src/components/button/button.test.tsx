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

describe("NewBlueButton", () => {
  it("renders the confirmed default binding (size=xs, type=Primary, state=Default)", () => {
    render(<NewBlueButton>Continue</NewBlueButton>);
    const button = screen.getByRole("button", { name: "Continue" });
    expect(button).toBeInTheDocument();
    expect(button.style.backgroundColor).toBe("rgb(84, 104, 255)"); // Color/primary/500 #5468ff
    expect(button.style.color).toBe("rgb(255, 255, 255)"); // Text/White 950
    expect(button.style.borderRadius).toBe("6px"); // radius/custom/xs
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
});

describe("remaining button families render their confirmed variant vocabulary", () => {
  it("ButtonSuccess", () => {
    render(<ButtonSuccess type="Outline">Save</ButtonSuccess>);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("GreyscaleButton", () => {
    render(<GreyscaleButton type="Text">Cancel</GreyscaleButton>);
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("NewPinkButton", () => {
    render(<NewPinkButton type="Secondary">Upgrade</NewPinkButton>);
    expect(screen.getByRole("button", { name: "Upgrade" })).toBeInTheDocument();
  });

  it("AiRoundedButton", () => {
    render(<AiRoundedButton type="Purple">Ask AI</AiRoundedButton>);
    expect(screen.getByRole("button", { name: "Ask AI" })).toBeInTheDocument();
  });

  it("AiRegularButton", () => {
    render(<AiRegularButton type="purple">Ask AI</AiRegularButton>);
    expect(screen.getByRole("button", { name: "Ask AI" })).toBeInTheDocument();
  });

  it("IconButton requires an icon and an aria-label", () => {
    render(
      <IconButton icon={<span data-testid="glyph" />} aria-label="Delete item" type="secondary" />,
    );
    const button = screen.getByRole("button", { name: "Delete item" });
    expect(button).toBeInTheDocument();
    expect(screen.getByTestId("glyph")).toBeInTheDocument();
  });
});
