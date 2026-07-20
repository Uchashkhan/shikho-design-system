import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DigitField } from "./digit_field";
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
});

describe("InputField", () => {
  it("applies the confirmed active-state border and fill", () => {
    const { container } = render(<InputField state="active" />);
    const field = container.querySelector("[data-type='default']") as HTMLElement;
    expect(field.style.backgroundColor).toBe("rgb(255, 255, 255)"); // Color/smoke_base
    expect(field.style.border).toContain("246, 129, 215"); // outline/Secondary 300 #f681d7
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

describe("remaining Input family members render their confirmed state vocabulary", () => {
  it("Dropdown", () => {
    render(<Dropdown state="error">Select an option</Dropdown>);
    expect(screen.getByRole("button", { name: "Select an option" })).toBeInTheDocument();
  });

  it("Textarea", () => {
    render(<Textarea state="filled" defaultValue="hello" aria-label="Message" />);
    expect(screen.getByRole("textbox", { name: "Message" })).toHaveValue("hello");
  });

  it("DigitInput", () => {
    render(<DigitInput state="active" aria-label="Digit 1" />);
    expect(screen.getByRole("textbox", { name: "Digit 1" })).toBeInTheDocument();
  });

  it("DigitField falls back to a single DigitInput when no children are supplied", () => {
    const { container } = render(<DigitField />);
    expect(container.querySelectorAll("input")).toHaveLength(1);
  });
});
