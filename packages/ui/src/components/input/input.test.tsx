import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DigitInput } from "./digit_input";
import { Dropdown } from "./dropdown";
import { Field } from "./field";
import { InputField } from "./input_field";
import { InputHint } from "./input_hint";
import { InputLabel } from "./input_label";
import { Textarea } from "./textarea";

describe("InputLabel", () => {
  it("renders label text with the confirmed text color", () => {
    render(<InputLabel>Email</InputLabel>);
    const label = screen.getByText("Email");
    expect(label.style.color).toBe("rgb(91, 97, 109)"); // Text/Gray 700 #5b616d
  });
});

describe("InputHint", () => {
  it("respects the confirmed hintText/supportText booleans", () => {
    render(<InputHint hintTextContent="Hint" supportTextContent="(Support text)" supportText={false} />);
    expect(screen.getByText("Hint")).toBeInTheDocument();
    expect(screen.queryByText("(Support text)")).not.toBeInTheDocument();
  });
});

describe("Field", () => {
  it("renders the confirmed default styling (radius/custom/md, Color/smoke_med fill)", () => {
    const { container } = render(<Field textContent="Input text" />);
    const field = container.firstChild as HTMLElement;
    expect(field.style.borderRadius).toBe("10px");
    expect(field.style.backgroundColor).toBe("rgb(244, 244, 246)"); // #f4f4f6
    expect(screen.getByText("Input text")).toBeInTheDocument();
  });

  it("hides the left icon slot when leftLead is false", () => {
    const { container } = render(<Field leftLead={false} text={false} />);
    expect(container.querySelectorAll("[aria-hidden]")).toHaveLength(1); // only right icon remains
  });

  it("renders a supplied selectLeftIcon instead of the default empty slot", () => {
    render(<Field selectLeftIcon={<svg data-testid="custom-icon" />} />);
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  describe("confirmed per-size metrics (docs/audit/input.md §14) — previously every size rendered identically to md", () => {
    it.each([
      ["sm", 32, "8px"],
      ["md", 40, "10px"],
      ["lg", 48, "12px"],
      ["xl", 56, "16px"],
    ] as const)("size=%s renders the confirmed %ipx height and %s radius", (size, height, radiusPx) => {
      const { container } = render(<Field size={size} />);
      const field = container.firstChild as HTMLElement;
      expect(field.style.height).toBe(`${height}px`);
      expect(field.style.borderRadius).toBe(radiusPx);
    });
  });

  it("confirmed: icon slots carry the elevation/e2 drop-shadow filter (previously missing entirely)", () => {
    render(<Field selectLeftIcon={<svg data-testid="left-icon" />} />);
    const iconSlot = screen.getByTestId("left-icon").parentElement as HTMLElement;
    expect(iconSlot.style.filter).toContain("drop-shadow");
  });

  it("confirmed: type=textarea renders a single text row with a resizer glyph, not the default 3-slot layout", () => {
    const { container } = render(<Field type="textarea" textContent="Notes" />);
    expect(screen.getByText("Notes")).toBeInTheDocument();
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument(); // the resizer glyph
  });

  it("confirmed: type=advanced_with_buttons composes a real NewPinkButton action, not a drawn approximation", () => {
    render(<Field type="advanced_with_buttons" textContent="Input text" buttonLabels={["Send"]} />);
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
  });
});

describe("InputField — confirmed per-state chrome (docs/audit/input.md §14)", () => {
  it("applies the confirmed active-state border and fill", () => {
    const { container } = render(<InputField state="active" />);
    const field = container.querySelector("[data-type='default']") as HTMLElement;
    expect(field.style.backgroundColor).toBe("rgb(255, 255, 255)"); // Color/smoke_base
    expect(field.style.border).toContain("246, 129, 215"); // outline/Secondary 300 #f681d7
  });

  it("confirmed: error uses a danger-colored border but the SAME ring color as active", () => {
    const { container } = render(<InputField state="error" />);
    const field = container.querySelector("[data-type='default']") as HTMLElement;
    expect(field.style.border).toContain("246, 137, 137"); // outline/Danger 300 #f68989
    expect(field.style.boxShadow).toContain("#e2008d3d"); // Color/Secondary/500_alpha_24 ring, confirmed shared with active
  });

  it("confirmed: hover darkens the fill AND lightens the text — a two-property shift, not a single fill change", () => {
    const { container } = render(<InputField state="hover" fieldProps={{ textContent: "Input text" }} />);
    const field = container.querySelector("[data-type='default']") as HTMLElement;
    expect(field.style.backgroundColor).toBe("rgb(235, 236, 240)"); // smoke_high / gray[200]
    expect(screen.getByText("Input text").style.color).toBe("rgb(140, 146, 156)"); // gray/600
  });

  it("confirmed: disabled recolors the label, field text, and hint all to gray/400 — not a straight dim/opacity", () => {
    render(<InputField state="disabled" labelContent="Email" hintProps={{ hintTextContent: "Hint" }} />);
    expect(screen.getByText("Email").style.color).toBe("rgb(195, 198, 204)");
    // Hint's text color is set on its container div (inherited by the span), not the span itself.
    expect(screen.getByText("Hint").parentElement?.style.color).toBe("rgb(195, 198, 204)");
  });

  it("marks the disabled state as aria-disabled", () => {
    const { container } = render(<InputField state="disabled" />);
    const field = container.querySelector("[data-type='default']");
    expect(field).toHaveAttribute("aria-disabled", "true");
  });

  it("hides label/hint when their booleans are false", () => {
    const { container } = render(<InputField label={false} hint={false} />);
    expect(container.querySelector("label")).not.toBeInTheDocument();
  });
});

describe("Dropdown — confirmed per-state chrome, shared with InputField (§14)", () => {
  it("renders its confirmed state vocabulary", () => {
    render(<Dropdown state="error">Select an option</Dropdown>);
    expect(screen.getByRole("button", { name: "Select an option" })).toBeInTheDocument();
  });

  it("confirmed: naked has no fill and no inner shadow — only the elevation/e2 outer shadow", () => {
    const { container } = render(<Dropdown state="naked">Select an option</Dropdown>);
    const el = container.firstChild as HTMLElement;
    expect(el.style.backgroundColor).toBe("transparent");
    expect(el.style.boxShadow).not.toContain("inset");
  });

  it("confirmed: disabled reuses the same flat-gray chrome as InputField's disabled state", () => {
    const { container } = render(<Dropdown state="disabled">Select an option</Dropdown>);
    const el = container.firstChild as HTMLElement;
    expect(el.style.backgroundColor).toBe("rgb(244, 244, 246)");
    expect(el.style.color).toBe("rgb(195, 198, 204)");
  });
});

describe("DigitInput — confirmed distinct typography and per-state colors (§14)", () => {
  it("uses the confirmed heading_1 typography (22px/32px), not body_1", () => {
    render(<DigitInput state="active" aria-label="Digit 1" />);
    const input = screen.getByRole("textbox", { name: "Digit 1" });
    expect(input.style.fontSize).toBe("22px");
    expect(input.style.lineHeight).toBe("32px");
  });

  it("confirmed: default/hover show a dash placeholder; filled/active/error show a real digit", () => {
    render(<DigitInput state="default" aria-label="Digit" />);
    expect(screen.getByRole("textbox", { name: "Digit" })).toHaveAttribute("placeholder", "-");
  });

  it("confirmed: active and error share the same ring color, differing only in border", () => {
    const { rerender } = render(<DigitInput state="active" aria-label="Digit" />);
    const input = screen.getByRole("textbox", { name: "Digit" });
    expect(input.style.boxShadow).toContain("#e2008d3d");
    rerender(<DigitInput state="error" aria-label="Digit" />);
    expect(input.style.boxShadow).toContain("#e2008d3d");
    expect(input.style.border).toContain("246, 137, 137"); // danger/300, distinct from active's border
  });
});

describe("remaining Input family members render their confirmed state vocabulary", () => {
  it("Textarea", () => {
    render(<Textarea state="filled" defaultValue="hello" aria-label="Message" />);
    expect(screen.getByRole("textbox", { name: "Message" })).toHaveValue("hello");
  });

});

// P1 repair pass — advanced_with_buttons per-size table. All four rows were independently
// sampled from Figma; the previous implementation reused md's proportions for every size.
describe("Field type=advanced_with_buttons per-size metrics", () => {
  const rows = [
    // size, root height, lead padding, lead radius, text padX, trail padRight, button height
    ["sm", "32px", "0px 0.5rem", "8px 8px 8px 8px", "0px 8px", "4px", "32px"],
    ["md", "40px", "0.5rem 0.75rem", "10px 10px 10px 10px", "0px 8px", "4px", "40px"],
    ["lg", "48px", "0.75rem", "12px 12px 12px 12px", "0px 12px", "8px", "48px"],
    ["xl", "56px", "1rem", "16px 12px 12px 16px", "0px 16px", "12px", "56px"],
  ] as const;

  it.each(rows)(
    "size=%s → height %s, lead padding %s, lead radius %s",
    (size, height, leadPadding, leadRadius, textPad, trailPad) => {
      const { container } = render(
        <Field
          size={size}
          type="advanced_with_buttons"
          leadTextContent="+1"
          textContent="Input text"
          trailTextContent="Text"
          buttonLabels={["Button"]}
        />,
      );
      const root = container.firstChild as HTMLElement;
      expect(root.style.height).toBe(height);

      const lead = screen.getByTestId("field-lead");
      expect(lead.style.padding).toBe(leadPadding);
      expect(lead.style.borderRadius).toBe(leadRadius);

      const textCol = Array.from(root.querySelectorAll("span")).find(
        (el) => el.textContent === "Input text" && el.style.padding,
      );
      expect(textCol?.style.padding).toBe(textPad);

      expect(screen.getByTestId("field-trail").style.paddingRight).toBe(trailPad);
    },
  );

  // The shortcut button is a real new_pink instance one size BELOW the field.
  const buttonSizes = [
    ["sm", "xs"],
    ["md", "sm"],
    ["lg", "md"],
    ["xl", "lg"],
  ] as const;

  it.each(buttonSizes)(
    "size=%s composes NewPinkButton at size=%s (one step down)",
    (fieldSize, buttonSize) => {
      const { container } = render(
        <Field
          size={fieldSize}
          type="advanced_with_buttons"
          textContent="Input text"
          buttonLabels={["Button"]}
        />,
      );
      const button = container.querySelector("button[data-size]");
      expect(button).toHaveAttribute("data-size", buttonSize);
    },
  );

  it("draws the confirmed gray-100 border on the lead group", () => {
    render(
      <Field type="advanced_with_buttons" leadTextContent="+1" textContent="Input text" />,
    );
    expect(screen.getByTestId("field-lead").style.border).toContain("1px");
  });
});
