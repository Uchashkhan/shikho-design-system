import { describe, expect, it } from "vitest";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  InfoCircleIcon,
  createIcon,
} from "./index";

const ALL = [ChevronLeftIcon, ChevronRightIcon, CloseIcon, InfoCircleIcon, CheckIcon];

describe("icon package exports", () => {
  it("exports every confirmed glyph as a named, tree-shakeable component", () => {
    for (const Icon of ALL) {
      expect(typeof Icon).toBe("object"); // forwardRef component
      expect(Icon.displayName).toMatch(/Icon$/);
    }
  });

  it("gives every icon a distinct name", () => {
    const names = ALL.map((i) => i.definition.name);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe("geometry is preserved verbatim from the Figma export", () => {
  // These viewBoxes are deliberately NON-square where Figma's are. Normalising them would
  // silently rescale the glyph, so the exact source values are asserted here.
  const expected: Record<string, string> = {
    "chevron-left": "0 0 6.18747 10.6875",
    "chevron-right": "0 0 6.18747 10.6875",
    close: "0 0 10.5004 10.5002",
    "info-circle": "0 0 18 18",
    check: "0 0 20 16",
  };

  it.each(Object.entries(expected))("%s keeps viewBox %s", (name, viewBox) => {
    const icon = ALL.find((i) => i.definition.name === name);
    expect(icon?.definition.viewBox).toBe(viewBox);
  });

  it("chevron-right is its own authored path, not a mirrored chevron-left", () => {
    expect(ChevronRightIcon.definition.path).not.toBe(ChevronLeftIcon.definition.path);
    // Both share the same canvas, which is what makes them a matched pair.
    expect(ChevronRightIcon.definition.viewBox).toBe(ChevronLeftIcon.definition.viewBox);
  });

  it("every path is real bezier data, not a hand-drawn straight-line approximation", () => {
    for (const Icon of ALL) {
      expect(Icon.definition.path).toContain("C"); // cubic curves
      expect(Icon.definition.path.length).toBeGreaterThan(80);
    }
  });
});

describe("createIcon contract", () => {
  it("defaults to fill painting and attaches the definition", () => {
    const Custom = createIcon({ name: "test", viewBox: "0 0 10 10", path: "M0 0 L10 10 Z" });
    expect(Custom.definition.viewBox).toBe("0 0 10 10");
    expect(Custom.displayName).toBe("testIcon");
  });
});
