import { describe, expect, it } from "vitest";
import { elevation } from "./index";

describe("elevation tokens", () => {
  it("exports all six confirmed elevation levels", () => {
    expect(Object.keys(elevation)).toEqual(["e1", "e2", "e3", "e4", "e5", "e6"]);
  });

  it("matches the confirmed layer count per level (layer count = level number)", () => {
    expect(elevation.e1).toHaveLength(1);
    expect(elevation.e2).toHaveLength(2);
    expect(elevation.e3).toHaveLength(3);
    expect(elevation.e4).toHaveLength(4);
    expect(elevation.e5).toHaveLength(5);
    expect(elevation.e6).toHaveLength(6);
  });

  it("uses the single confirmed shadow color across every layer", () => {
    const allLayers = Object.values(elevation).flat();
    expect(allLayers.every((l) => l.color === "#0000000a")).toBe(true);
    expect(allLayers.every((l) => l.x === 0)).toBe(true);
  });

  it("confirms e6's tail is an exact superset match of e2 (additive-stacking relationship)", () => {
    expect(elevation.e6.slice(-2)).toEqual(elevation.e2);
  });
});
