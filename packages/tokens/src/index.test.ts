import { describe, expect, it } from "vitest";
import { tokens } from "./index";

describe("tokens scaffold", () => {
  it("exposes the expected top-level token categories", () => {
    expect(Object.keys(tokens)).toEqual([
      "color",
      "typography",
      "elevation",
      "radius",
      "spacing",
    ]);
  });
});
