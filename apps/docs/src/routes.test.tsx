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
  it("renders the overview at /", () => {
    renderAt("/");
    expect(
      screen.getByRole("heading", { name: /built strictly from what the audit confirmed/i }),
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

  it("renders live components inside the cards rather than images", () => {
    const { container } = renderAt("/components");
    // Real interactive elements from @shikho/ui, not <img> screenshots.
    expect(container.querySelectorAll("img")).toHaveLength(0);
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

describe("sidebar search", () => {
  it("narrows the sidebar nav to matching components", async () => {
    const user = userEvent.setup();
    renderAt("/");
    const sidebar = screen.getByRole("complementary");

    expect(within(sidebar).getByRole("link", { name: "Chip" })).toBeInTheDocument();

    await user.type(screen.getByLabelText("Search documentation"), "radio");

    expect(within(sidebar).getByRole("link", { name: "Radio" })).toBeInTheDocument();
    expect(within(sidebar).queryByRole("link", { name: "Chip" })).not.toBeInTheDocument();
  });

  it("reports when nothing matches", async () => {
    const user = userEvent.setup();
    renderAt("/");

    await user.type(screen.getByLabelText("Search documentation"), "zzzz");

    expect(screen.getByText(/no matches for/i)).toBeInTheDocument();
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
});
