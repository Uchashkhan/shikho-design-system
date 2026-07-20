import { describe, expect, it } from "vitest";
import type { IconSize } from "./index";

describe("icons scaffold", () => {
  it("accepts the documented icon size scale", () => {
    const sizes: IconSize[] = [14, 16, 18, 20, 22, 24, 28];
    expect(sizes).toHaveLength(7);
  });
});
