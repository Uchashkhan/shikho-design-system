import { describe, expect, it } from "vitest";
import { color, focusRingColor } from "./index";

describe("color tokens", () => {
  it("exports the confirmed primitive ramps", () => {
    expect(color.primary[500]).toBe("#5468ff");
    expect(color.danger[500]).toBe("#f03d3d");
    expect(Object.keys(color)).toEqual(
      expect.arrayContaining([
        "primary",
        "secondary",
        "shikhoAi",
        "secondary2",
        "info",
        "success",
        "danger",
        "warning",
        "gray",
        "vanillaGray",
        "dark",
        "black",
        "white",
      ]),
    );
  });

  it("exports the full 12-step black/white opacity ramps", () => {
    expect(Object.keys(color.black)).toHaveLength(12);
    expect(color.black[50]).toBe("#0000000a");
    expect(color.black[950]).toBe("#000000");
    expect(color.white[950]).toBe("#ffffff");
  });

  it("resolves focus.danger to the danger ramp's alpha-24 value, not secondary's", () => {
    expect(focusRingColor.danger).toBe("#f03d3d3d");
    expect(focusRingColor.danger).not.toBe(focusRingColor.secondary);
    expect(focusRingColor.danger).not.toBe("#e2008d3d"); // the confirmed buggy Figma binding
  });
});
