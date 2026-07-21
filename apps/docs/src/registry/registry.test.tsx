import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  componentRegistry,
  foundationRegistry,
  getComponent,
  groupByCategory,
  searchComponents,
  searchFoundations,
} from "./index";

describe("component registry integrity", () => {
  it("registers every documented component exactly once", () => {
    const slugs = componentRegistry.map((entry) => entry.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs).toEqual(["button", "input", "checkbox", "list", "radio", "toggle", "chip"]);
  });

  it("gives every entry the fields the sidebar, gallery and detail page depend on", () => {
    for (const entry of componentRegistry) {
      expect(entry.name, `${entry.slug} name`).toBeTruthy();
      expect(entry.summary, `${entry.slug} summary`).toBeTruthy();
      expect(entry.description, `${entry.slug} description`).toBeTruthy();
      expect(entry.auditFile, `${entry.slug} auditFile`).toMatch(/^docs\/audit\//);
      expect(entry.exports.length, `${entry.slug} exports`).toBeGreaterThan(0);
      expect(entry.variants.length, `${entry.slug} variants`).toBeGreaterThan(0);
      expect(entry.props.length, `${entry.slug} props`).toBeGreaterThan(0);
      expect(entry.gaps.length, `${entry.slug} gaps`).toBeGreaterThan(0);
      expect(entry.importExample, `${entry.slug} importExample`).toContain("@shikho/ui");
    }
  });

  it("only offers confirmed variant values through playground controls", () => {
    for (const entry of componentRegistry) {
      for (const control of entry.playground?.controls ?? []) {
        expect(control.options.length, `${entry.slug}.${control.prop}`).toBeGreaterThan(0);
        const values = control.options.map((option) => option.value);
        expect(values, `${entry.slug}.${control.prop} default`).toContain(control.defaultValue);
      }
    }
  });

  it("resolves entries by slug", () => {
    expect(getComponent("checkbox")?.name).toBe("Checkbox");
    expect(getComponent("does-not-exist")).toBeUndefined();
  });
});

describe("search", () => {
  it("returns everything for an empty query", () => {
    expect(searchComponents("")).toHaveLength(componentRegistry.length);
    expect(searchFoundations("")).toHaveLength(foundationRegistry.length);
  });

  it("matches on name, export symbol and Figma set name", () => {
    expect(searchComponents("checkbox").map((e) => e.slug)).toContain("checkbox");
    expect(searchComponents("IconButton").map((e) => e.slug)).toContain("button");
    expect(searchComponents("input_field").map((e) => e.slug)).toContain("input");
  });

  it("is case-insensitive and returns nothing for a miss", () => {
    expect(searchComponents("TOGGLE").map((e) => e.slug)).toEqual(["toggle"]);
    expect(searchComponents("zzzz")).toHaveLength(0);
  });
});

describe("category grouping", () => {
  it("omits categories with no registered components", () => {
    for (const group of groupByCategory()) {
      expect(group.entries.length).toBeGreaterThan(0);
    }
  });

  it("places every component in exactly one group", () => {
    const grouped = groupByCategory().flatMap((group) => group.entries);
    expect(grouped).toHaveLength(componentRegistry.length);
  });
});

describe("previews render real @shikho/ui components", () => {
  it("renders every gallery preview without crashing", () => {
    for (const entry of componentRegistry) {
      const { unmount } = render(<div>{entry.preview()}</div>);
      unmount();
    }
  });

  it("renders each playground at its default values", () => {
    for (const entry of componentRegistry) {
      if (!entry.playground) continue;
      const values: Record<string, string> = {};
      for (const control of entry.playground.controls) {
        values[control.prop] = control.defaultValue;
      }
      const { unmount } = render(<div>{entry.playground.render(values)}</div>);
      unmount();
    }
  });

  it("renders a real interactive control, not a static image", () => {
    render(<div>{getComponent("checkbox")!.preview()}</div>);
    expect(screen.getAllByRole("checkbox").length).toBeGreaterThan(0);
  });
});
