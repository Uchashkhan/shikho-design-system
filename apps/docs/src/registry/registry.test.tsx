import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  componentRegistry,
  foundationRegistry,
  getComponent,
  getPageConfig,
  groupByCategory,
  resolveControlOptions,
  searchComponents,
  searchFoundations,
} from "./index";

describe("component registry integrity", () => {
  it("registers every documented component exactly once, with no duplicate slugs", () => {
    const slugs = componentRegistry.map((entry) => entry.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs.length).toBeGreaterThan(0);
  });

  it("gives every entry the fields the sidebar, gallery and detail page depend on", () => {
    for (const entry of componentRegistry) {
      expect(entry.name, `${entry.slug} name`).toBeTruthy();
      expect(entry.description, `${entry.slug} description`).toBeTruthy();
      expect(entry.auditFile, `${entry.slug} auditFile`).toMatch(/^docs\/audit\//);
      expect(entry.exports.length, `${entry.slug} exports`).toBeGreaterThan(0);
      expect(entry.packageImport, `${entry.slug} packageImport`).toContain("@shikho/ui");
    }
  });

  it("gives every entry with a page config confirmed props and gaps", () => {
    for (const entry of componentRegistry) {
      const page = getPageConfig(entry.slug);
      if (!page) continue; // no custom page yet — the safe fallback covers this entry instead
      // variants.length is NOT asserted here: some components (e.g. Progress) are confirmed to
      // have no variant property at all — a genuinely empty axis, not a missing one.
      expect(page.props.length, `${entry.slug} props`).toBeGreaterThan(0);
      expect(page.gaps.length, `${entry.slug} gaps`).toBeGreaterThan(0);
    }
  });

  it("only offers confirmed variant values through playground controls", () => {
    for (const entry of componentRegistry) {
      const page = getPageConfig(entry.slug);
      const controls = page?.playground?.controls ?? [];
      // Some controls' options depend on another control's current value (e.g. Button's Type is
      // filtered by the selected Family) — resolve against every control's own default, matching
      // how the real pages seed their initial values, so dependent options are resolved for real
      // rather than skipped.
      const defaultValues: Record<string, string> = {};
      for (const control of controls) defaultValues[control.prop] = control.defaultValue;

      for (const control of controls) {
        const options = resolveControlOptions(control, defaultValues);
        expect(options.length, `${entry.slug}.${control.prop}`).toBeGreaterThan(0);
        const values = options.map((option) => option.value);
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
      const page = getPageConfig(entry.slug);
      if (!page) continue;
      const { unmount } = render(<div>{page.preview()}</div>);
      unmount();
    }
  });

  it("renders each playground at its default values", () => {
    for (const entry of componentRegistry) {
      const page = getPageConfig(entry.slug);
      if (!page?.playground) continue;
      const values: Record<string, string> = {};
      for (const control of page.playground.controls) {
        values[control.prop] = control.defaultValue;
      }
      const { unmount } = render(<div>{page.playground.render(values)}</div>);
      unmount();
    }
  });

  it("renders a real interactive control, not a static image", () => {
    render(<div>{getPageConfig("checkbox")!.preview()}</div>);
    expect(screen.getAllByRole("checkbox").length).toBeGreaterThan(0);
  });
});
