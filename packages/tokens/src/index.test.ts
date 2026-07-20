import { describe, expect, it } from "vitest";
import * as tokensPackage from "./index";
import { tokens } from "./index";

describe("package root exports", () => {
  it("exports the three implemented categories", () => {
    expect(tokens).toHaveProperty("color");
    expect(tokens).toHaveProperty("radius");
    expect(tokens).toHaveProperty("elevation");
  });

  it("does not export unresolved categories (typography, spacing, gradients, subject colors)", () => {
    expect(Object.keys(tokens)).toEqual(["color", "radius", "elevation"]);
    expect(tokensPackage).not.toHaveProperty("typography");
    expect(tokensPackage).not.toHaveProperty("spacing");
    expect(tokensPackage).not.toHaveProperty("gradient");
    expect(tokensPackage).not.toHaveProperty("gradients");
    expect(tokensPackage).not.toHaveProperty("subjectColor");
    expect(tokensPackage).not.toHaveProperty("subjectColors");
  });
});
