import { describe, expect, it } from "vitest";
import { radius, radiusLegacyAliases } from "./index";

describe("radius tokens", () => {
  it("exports the confirmed rank-based scale", () => {
    expect(radius.xs).toBe(6);
    expect(radius.md).toBe(10);
    expect(radius.lg).toBe(12);
    expect(radius.xl).toBe(16);
    expect(radius.full).toBe(1000);
  });

  it("resolves the collision between custom/* and border_radius_* to distinct canonical values", () => {
    expect(radius.md).not.toBe(radius.lg);
    expect(radius.lg).not.toBe(radius.xl);
  });

  it("preserves deprecated aliases pointing at the correct canonical value", () => {
    expect(radiusLegacyAliases.borderRadiusSm2).toBe(radius.md);
    expect(radiusLegacyAliases.borderRadiusMd).toBe(radius.lg);
    expect(radiusLegacyAliases.borderRadiusLg).toBe(radius.xl);
  });
});
