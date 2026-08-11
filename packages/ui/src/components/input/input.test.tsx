import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
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
    expect(screen.getByDisplayValue("Input text")).toBeInTheDocument();
  });

  it("is a genuine editable <input> — not decorative static text", () => {
    const onChange = vi.fn();
    render(<Field textContent="Input text" onChange={onChange} />);
    const input = screen.getByDisplayValue("Input text") as HTMLInputElement;
    expect(input.tagName).toBe("INPUT");
    fireEvent.change(input, { target: { value: "Input text updated" } });
    expect(onChange).toHaveBeenCalled();
  });

  it("supports controlled usage via value + onChange, taking precedence over textContent", () => {
    render(<Field textContent="ignored" value="controlled" onChange={() => {}} />);
    expect(screen.getByDisplayValue("controlled")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("ignored")).not.toBeInTheDocument();
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
    const textarea = screen.getByDisplayValue("Notes");
    expect(textarea.tagName).toBe("TEXTAREA");
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument(); // the resizer glyph
  });

  it("confirmed: type=advanced_with_buttons composes a real NewPinkButton action, not a drawn approximation", () => {
    render(<Field type="advanced_with_buttons" textContent="Input text" buttonLabels={["Send"]} />);
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
  });

  // P14 — a fresh get_design_context re-pull (node 66056:19069) found a third, previously
  // missing boolean-gated glyph in the lead chip: a stacked up/down chevron pair marking it as a
  // select/dropdown control, distinct from leftLead's own icon slot.
  it("confirmed: type=advanced_with_buttons renders the default select-chevrons glyph in the lead chip", () => {
    const { container } = render(
      <Field type="advanced_with_buttons" leadTextContent="+1" textContent="Input text" />,
    );
    const lead = container.querySelector('[data-testid="field-lead"]') as HTMLElement;
    expect(lead.querySelector("svg[data-icon='select-chevrons']")).toBeInTheDocument();
  });

  it("hides the chevron when leadChevron is false, and allows overriding it", () => {
    const { container, rerender } = render(
      <Field type="advanced_with_buttons" leadTextContent="+1" leadChevron={false} textContent="Input text" />,
    );
    let lead = container.querySelector('[data-testid="field-lead"]') as HTMLElement;
    expect(lead.querySelector("svg[data-icon='select-chevrons']")).not.toBeInTheDocument();

    rerender(
      <Field
        type="advanced_with_buttons"
        leadTextContent="+1"
        selectLeadChevron={<span data-testid="custom-chevron" />}
        textContent="Input text"
      />,
    );
    lead = container.querySelector('[data-testid="field-lead"]') as HTMLElement;
    expect(lead.querySelector('[data-testid="custom-chevron"]')).toBeInTheDocument();
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
    render(<InputField state="hover" fieldProps={{ textContent: "Input text" }} />);
    const container = screen.getByDisplayValue("Input text").closest("[data-type='default']") as HTMLElement;
    expect(container.style.backgroundColor).toBe("rgb(235, 236, 240)"); // smoke_high / gray[200]
    expect(screen.getByDisplayValue("Input text").style.color).toBe("rgb(140, 146, 156)"); // gray/600
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

describe("InputField — real interactivity (previously state was static, and the field itself was a decorative <div>, not a real <input>)", () => {
  it("is a genuine editable <input> — typing actually works", () => {
    render(<InputField fieldProps={{ textContent: "" }} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.tagName).toBe("INPUT");
    fireEvent.change(input, { target: { value: "hello@shikho.com" } });
    expect(input.value).toBe("hello@shikho.com");
  });

  it("with no `state` prop, real focus drives it to `active` and blur returns it to `default`", () => {
    render(<InputField fieldProps={{ textContent: "" }} />);
    const input = screen.getByRole("textbox");
    const wrapper = input.closest("[data-state]") as HTMLElement;
    expect(wrapper).toHaveAttribute("data-state", "default");
    fireEvent.focus(input);
    expect(wrapper).toHaveAttribute("data-state", "active");
    fireEvent.blur(input);
    expect(wrapper).toHaveAttribute("data-state", "default");
  });

  it("with no `state` prop, typing a value drives it to `filled` once blurred", () => {
    render(<InputField fieldProps={{ textContent: "" }} />);
    const input = screen.getByRole("textbox");
    const wrapper = input.closest("[data-state]") as HTMLElement;
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "hi" } });
    fireEvent.blur(input);
    expect(wrapper).toHaveAttribute("data-state", "filled");
  });

  it("with no `state` prop, real pointer hover drives it to `hover`", () => {
    render(<InputField fieldProps={{ textContent: "" }} />);
    const input = screen.getByRole("textbox");
    const wrapper = input.closest("[data-state]") as HTMLElement;
    const fieldRoot = input.closest("[data-type='default']") as HTMLElement;
    fireEvent.mouseEnter(fieldRoot);
    expect(wrapper).toHaveAttribute("data-state", "hover");
    fireEvent.mouseLeave(fieldRoot);
    expect(wrapper).toHaveAttribute("data-state", "default");
  });

  it("an explicit `state` prop overrides all real interaction", () => {
    render(<InputField state="error" fieldProps={{ textContent: "" }} />);
    const input = screen.getByRole("textbox");
    const wrapper = input.closest("[data-state]") as HTMLElement;
    fireEvent.focus(input);
    expect(wrapper).toHaveAttribute("data-state", "error");
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

  it("confirmed (§15): default/hover/default_dark text is gray-950, not InputField's lighter gray-700 — a genuine divergence found on a full re-pull of the component set", () => {
    const { rerender } = render(<Dropdown state="default">Select an option</Dropdown>);
    expect(screen.getByRole("button").style.color).toBe("rgb(10, 12, 17)"); // gray-950
    rerender(<Dropdown state="hover">Select an option</Dropdown>);
    expect(screen.getByRole("button").style.color).toBe("rgb(10, 12, 17)");
  });

  it("confirmed (§15): brand has its own primary-tinted fill+text — previously silently fell back to plain default gray", () => {
    render(<Dropdown state="brand">Select an option</Dropdown>);
    const el = screen.getByRole("button");
    expect(el.style.backgroundColor).toBe("rgba(84, 104, 255, 0.12)");
    expect(el.style.color).toBe("rgb(59, 78, 227)"); // primary-600
  });

  it("confirmed (§15): active_no_focus is white + an outer elevation shadow, no border, no ring — a distinct look, not \"active minus its ring\" as previously assumed", () => {
    render(<Dropdown state="active_no_focus">Select an option</Dropdown>);
    const el = screen.getByRole("button");
    expect(el.style.backgroundColor).toBe("rgb(255, 255, 255)");
    expect(el.style.border).not.toContain("solid"); // no border color/width applied
    expect(el.style.boxShadow).not.toContain("inset"); // no ring, no inner shadow — only the outer one
  });

  it("confirmed (§15): field padding is 12px uniform and gap is 6px — previously 8px/10px padding and a 4px gap", () => {
    render(<Dropdown state="default">Select an option</Dropdown>);
    const el = screen.getByRole("button");
    expect(el.style.padding).toBe("0.75rem");
    expect(el.style.gap).toBe("0.375rem");
  });
});

describe("Dropdown — real interactivity (previously not keyboard-focusable at all, and state was static)", () => {
  it("is keyboard-focusable (previously missing tabIndex entirely)", () => {
    render(<Dropdown>Select an option</Dropdown>);
    expect(screen.getByRole("button")).toHaveAttribute("tabIndex", "0");
  });

  it("is not focusable when disabled", () => {
    render(<Dropdown state="disabled">Select an option</Dropdown>);
    expect(screen.getByRole("button")).not.toHaveAttribute("tabIndex");
  });

  it("with no `state` prop, real pointer hover and keyboard focus drive it", () => {
    render(<Dropdown>Select an option</Dropdown>);
    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("data-state", "default");
    fireEvent.mouseEnter(trigger);
    expect(trigger).toHaveAttribute("data-state", "hover");
    fireEvent.mouseLeave(trigger);
    fireEvent.focus(trigger);
    expect(trigger).toHaveAttribute("data-state", "active");
    fireEvent.blur(trigger);
    expect(trigger).toHaveAttribute("data-state", "default");
  });

  it("an explicit `state` prop overrides real interaction", () => {
    render(<Dropdown state="error">Select an option</Dropdown>);
    const trigger = screen.getByRole("button");
    fireEvent.mouseEnter(trigger);
    expect(trigger).toHaveAttribute("data-state", "error");
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

  it("with no `state` prop, real focus/blur/hover/value drive it, same fix as InputField", () => {
    render(<DigitInput aria-label="Digit" />);
    const input = screen.getByRole("textbox", { name: "Digit" });
    expect(input).toHaveAttribute("data-state", "default");
    fireEvent.mouseEnter(input);
    expect(input).toHaveAttribute("data-state", "hover");
    fireEvent.mouseLeave(input);
    fireEvent.focus(input);
    expect(input).toHaveAttribute("data-state", "active");
    fireEvent.change(input, { target: { value: "5" } });
    fireEvent.blur(input);
    expect(input).toHaveAttribute("data-state", "filled");
  });
});

describe("remaining Input family members render their confirmed state vocabulary", () => {
  it("Textarea", () => {
    render(<Textarea state="filled" defaultValue="hello" aria-label="Message" />);
    expect(screen.getByRole("textbox", { name: "Message" })).toHaveValue("hello");
  });

  it("Textarea: state now actually changes styling — previously accepted but never applied", () => {
    const { rerender } = render(<Textarea state="default" aria-label="Message" />);
    const textarea = screen.getByRole("textbox", { name: "Message" });
    expect(textarea.style.backgroundColor).toBe("rgb(244, 244, 246)"); // smoke_med / gray[100]
    rerender(<Textarea state="active" aria-label="Message" />);
    expect(textarea.style.backgroundColor).toBe("rgb(255, 255, 255)"); // smoke_base / white
    expect(textarea.style.border).toContain("246, 129, 215"); // secondary/300 ring border
  });

  it("Textarea: confirmed own radius/padding via a live get_design_context pull on its own component set (§15) — distinct from Field's", () => {
    render(<Textarea aria-label="Message" />);
    const textarea = screen.getByRole("textbox", { name: "Message" });
    expect(textarea.style.borderRadius).toBe("16px"); // radius/border_radius_lg, not field's 10px
    expect(textarea.style.padding).toBe("0.75rem 1rem"); // py-12/px-16, not field's 8px/10px
  });

  it("Textarea: confirmed error reddens the input text itself (danger-500) — a genuine divergence from InputField's error, which keeps gray-700 text", () => {
    render(<Textarea state="error" aria-label="Message" />);
    expect(screen.getByRole("textbox", { name: "Message" }).style.color).toBe("rgb(240, 61, 61)");
  });

  it("Textarea: with no `state` prop, real focus/blur/hover/value drive it", () => {
    render(<Textarea aria-label="Message" />);
    const textarea = screen.getByRole("textbox", { name: "Message" });
    expect(textarea).toHaveAttribute("data-state", "default");
    fireEvent.mouseEnter(textarea);
    expect(textarea).toHaveAttribute("data-state", "hover");
    fireEvent.mouseLeave(textarea);
    fireEvent.focus(textarea);
    expect(textarea).toHaveAttribute("data-state", "active");
    fireEvent.change(textarea, { target: { value: "hello" } });
    fireEvent.blur(textarea);
    expect(textarea).toHaveAttribute("data-state", "filled");
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

      const textInput = screen.getByTestId("field-text") as HTMLInputElement;
      expect(textInput.value).toBe("Input text");
      expect(textInput.style.padding).toBe(textPad);

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
