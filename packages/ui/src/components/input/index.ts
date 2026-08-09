export { InputLabel, type InputLabelProps, type InputLabelSize } from "./input_label";
export { InputHint, type InputHintProps, type InputHintSize } from "./input_hint";
export { Field, type FieldProps, type FieldSize, type FieldType } from "./field";
export { InputField, type InputFieldProps, type InputFieldState } from "./input_field";
export { Dropdown, type DropdownProps, type DropdownState } from "./dropdown";
export { Textarea, type TextareaProps, type TextareaState } from "./textarea";
export { DigitInput, type DigitInputProps, type DigitInputState } from "./digit_input";

// `digit_field` is NOT exported for v0.1.0. docs/release-visual-verification.md (Tier B) records
// that Figma contains only a single bare `digit_field` instance — no variant set, no properties,
// no confirmed internal structure — so no faithful implementation is possible. Shipping the
// previous container-only placeholder would have presented unaudited guesswork as a real
// component. Consumers can compose `DigitInput` directly until the Figma evidence exists.
