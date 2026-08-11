import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { App } from "./App";
import { componentRegistry, foundationRegistry } from "./registry";

const renderAt = (path: string) =>
  render(
    <MemoryRouter
      initialEntries={[path]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <App />
    </MemoryRouter>,
  );

describe("every route renders directly by URL", () => {
  it("renders the landing hero at /", () => {
    renderAt("/");
    expect(
      screen.getByRole("heading", { level: 1, name: /build consistent products, faster/i }),
    ).toBeInTheDocument();
  });

  it("renders the component gallery at /components", () => {
    renderAt("/components");
    expect(screen.getByRole("heading", { level: 1, name: "Components" })).toBeInTheDocument();
  });

  it.each(componentRegistry.map((entry) => [entry.slug, entry.name]))(
    "renders /components/%s directly",
    (slug, name) => {
      renderAt(`/components/${slug}`);
      expect(screen.getByRole("heading", { level: 1, name })).toBeInTheDocument();
    },
  );

  it.each(foundationRegistry.map((entry) => [entry.slug, entry.name]))(
    "renders /foundations/%s directly",
    (slug, name) => {
      renderAt(`/foundations/${slug}`);
      expect(screen.getByRole("heading", { level: 1, name })).toBeInTheDocument();
    },
  );

  it("renders the playground at /playground", () => {
    renderAt("/playground");
    expect(screen.getByRole("heading", { level: 1, name: "Playground" })).toBeInTheDocument();
  });

  it("renders a not-found page for an unknown route", () => {
    renderAt("/nope");
    expect(screen.getByRole("heading", { level: 1, name: /page not found/i })).toBeInTheDocument();
  });

  it("renders a helpful message for an unknown component slug", () => {
    renderAt("/components/nope");
    expect(
      screen.getByRole("heading", { level: 1, name: /component not found/i }),
    ).toBeInTheDocument();
  });
});

describe("component gallery", () => {
  /** Cards are queried by href — their accessible name includes the live preview's own content. */
  const cardsIn = (main: HTMLElement) =>
    Array.from(main.querySelectorAll<HTMLAnchorElement>("a.sk-card")).map(
      (a) => a.getAttribute("href") ?? "",
    );

  it("shows a card for every registered component", () => {
    renderAt("/components");
    const hrefs = cardsIn(screen.getByRole("main"));

    expect(hrefs).toHaveLength(componentRegistry.length);
    for (const entry of componentRegistry) {
      expect(hrefs).toContain(`/components/${entry.slug}`);
    }
  });

  it("renders live components inside the cards rather than static screenshots", () => {
    renderAt("/components");
    // Real interactive elements from @shikho/ui, not screenshot placeholders. Avatar's own
    // confirmed implementation legitimately renders a real <img> fill (docs/audit/avatars.md
    // §8), so an <img> tag on its own isn't evidence of a screenshot — checkbox/switch roles are.
    expect(screen.getAllByRole("checkbox").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("switch").length).toBeGreaterThan(0);
  });

  it("filters the gallery by search query", async () => {
    const user = userEvent.setup();
    renderAt("/components");
    const main = screen.getByRole("main");

    await user.type(screen.getByLabelText("Filter components"), "toggle");

    expect(cardsIn(main)).toEqual(["/components/toggle"]);
  });

  it("shows an empty state when nothing matches", async () => {
    const user = userEvent.setup();
    renderAt("/components");

    await user.type(screen.getByLabelText("Filter components"), "zzzz");

    expect(cardsIn(screen.getByRole("main"))).toHaveLength(0);
    expect(screen.getByText(/no components match/i)).toBeInTheDocument();
  });
});

describe("sidebar navigation", () => {
  it("always lists every registered component, independent of the gallery's own filter", async () => {
    const user = userEvent.setup();
    renderAt("/components");
    const sidebar = screen.getByRole("complementary");

    expect(within(sidebar).getByRole("link", { name: "Chip" })).toBeInTheDocument();
    expect(within(sidebar).getByRole("link", { name: "Radio" })).toBeInTheDocument();

    // Filtering the main catalogue (a separate control) must not touch the sidebar's own nav —
    // there is only one filtering surface now, not two.
    await user.type(screen.getByLabelText("Filter components"), "radio");

    expect(within(sidebar).getByRole("link", { name: "Chip" })).toBeInTheDocument();
    expect(within(sidebar).getByRole("link", { name: "Radio" })).toBeInTheDocument();
  });
});

describe("component gallery category filter", () => {
  /** Cards are queried by href — several previews attach `aria-label`s to their own inner
      controls (e.g. Toggle's "On"/"Off"), which would otherwise leak into the link's computed
      accessible name and make name-based queries unreliable. */
  const hrefsIn = (main: HTMLElement) =>
    Array.from(main.querySelectorAll<HTMLAnchorElement>("a.sk-card")).map(
      (a) => a.getAttribute("href") ?? "",
    );

  it("narrows the gallery to one category via the real Switcher control", async () => {
    const user = userEvent.setup();
    renderAt("/components");
    const main = screen.getByRole("main");

    expect(hrefsIn(main)).toContain("/components/toggle");
    expect(hrefsIn(main)).toContain("/components/button");

    await user.click(screen.getByRole("button", { name: /^Forms/ }));

    expect(hrefsIn(main)).toContain("/components/toggle");
    expect(hrefsIn(main)).not.toContain("/components/button");
  });
});

describe("component detail page content", () => {
  it("separates preview, variants, props, usage and limitations", () => {
    renderAt("/components/chip");

    expect(screen.getByRole("heading", { name: "Interactive preview" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Installation" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Usage" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Confirmed variants" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Props" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Known limitations" })).toBeInTheDocument();
    expect(screen.getByText(/Known gaps & unresolved audit information/i)).toBeInTheDocument();
  });

  it("drives the interactive preview from its controls", async () => {
    const user = userEvent.setup();
    const { container } = renderAt("/components/toggle");

    const preview = container.querySelector(".sk-preview")!;
    expect(within(preview as HTMLElement).getByRole("switch")).toBeChecked();

    await user.click(screen.getByRole("button", { name: "switch_OFF" }));

    expect(within(preview as HTMLElement).getByRole("switch")).not.toBeChecked();
  });

  it("regression: navigating between components sharing a playground control name doesn't blank the page", async () => {
    // Chip's and Button's playgrounds both key a control as `prop: "type"`, but with completely
    // disjoint value sets (Chip: "selected"/"unselected"/… vs Button: "Primary"/"Outline"/…).
    // `/components/:slug` reuses the same `ComponentDetailPage` React instance across a client-side
    // navigation from one slug to another (only the param changes, not the route pattern) — so
    // this reproduces the exact scenario that used to leak Chip's leftover `type` value into
    // Button's `playground.render`, crash inside @shikho/ui's button internals, and (with no error
    // boundary at the time) blank the whole app. Real link click, not `renderAt`, so the same
    // component instance persists across the navigation the way it does for a real user.
    const user = userEvent.setup();
    renderAt("/components/chip");
    expect(screen.getByRole("heading", { level: 1, name: "Chip" })).toBeInTheDocument();

    const sidebar = screen.getByRole("complementary");
    await user.click(within(sidebar).getByRole("link", { name: "Button" }));

    expect(screen.getByRole("heading", { level: 1, name: "Button" })).toBeInTheDocument();
    // The default state for Button's own `type` control ("Primary") must win — not Chip's
    // leftover "selected" — proving the per-slug state actually reset.
    const preview = document.querySelector(".sk-preview") as HTMLElement;
    expect(within(preview).getByRole("button", { name: "Button" })).toBeInTheDocument();
  });
});
