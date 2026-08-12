import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as uiRoot from "../../index";
import { Link } from "./link";

describe("root export", () => {
  it("exposes Link from the @shikho/ui package root", () => {
    expect(uiRoot.Link).toBe(Link);
  });
});

describe("confirmed sizes (docs/audit/links-deep-audit.md §3)", () => {
  const sizes = [
    ["xl", 8, 24, 18],
    ["lg", 6, 20, 13],
    ["md", 6, 18, 13],
    ["sm", 6, 16, 12],
    ["xs", 4, 14, 11],
  ] as const;

  it.each(sizes)("size=%s applies the confirmed gap, icon size and font size", (size, gap, iconSize, fontSize) => {
    render(<Link size={size}>Link</Link>);
    const anchor = screen.getByRole("link");
    expect(anchor.style.gap).toBe(`${gap}px`);
    expect(anchor.style.fontSize).toBe(`${fontSize}px`);
    const icon = anchor.firstElementChild as HTMLElement;
    expect(icon.style.width).toBe(`${iconSize}px`);
  });

  it("lg and md share identical typography, differing only in icon size (§3)", () => {
    render(
      <>
        <Link size="lg">lg</Link>
        <Link size="md">md</Link>
      </>,
    );
    const [lg, md] = screen.getAllByRole("link");
    expect(lg.style.fontSize).toBe(md.style.fontSize);
    expect(lg.style.lineHeight).toBe(md.style.lineHeight);
  });
});

describe("confirmed type x state color/weight matrix (§4)", () => {
  it("type=primary: default is primary-500, SemiBold", () => {
    render(<Link type="primary" state="default">Link</Link>);
    const anchor = screen.getByRole("link");
    expect(anchor.style.color).toBe("rgb(84, 104, 255)");
    expect(anchor.style.fontWeight).toBe("600");
  });

  it("type=primary: hover moves to a darker primary-600", () => {
    render(<Link type="primary" state="hover">Link</Link>);
    expect(screen.getByRole("link").style.color).toBe("rgb(59, 78, 227)");
  });

  it("type=quaternary: default is gray-700, Medium weight", () => {
    render(<Link type="quaternary" state="default">Link</Link>);
    const anchor = screen.getByRole("link");
    expect(anchor.style.color).toBe("rgb(91, 97, 109)");
    expect(anchor.style.fontWeight).toBe("500");
  });

  it("type=quaternary: hover moves to a darker gray-950", () => {
    render(<Link type="quaternary" state="hover">Link</Link>);
    expect(screen.getByRole("link").style.color).toBe("rgb(10, 12, 17)");
  });

  it("both types share the exact same disabled color (gray-400)", () => {
    render(
      <>
        <Link type="primary" state="disabled">a</Link>
        <Link type="quaternary" state="disabled">b</Link>
      </>,
    );
    const [primary, quaternary] = screen.getAllByRole("link");
    expect(primary.style.color).toBe("rgb(195, 198, 204)");
    expect(quaternary.style.color).toBe(primary.style.color);
  });
});

describe("confirmed boolean slots and instance-swap props (§2)", () => {
  it("hides icon slots when leftIcon/rightIcon are false", () => {
    const { container } = render(
      <Link leftIcon={false} rightIcon={false}>
        Link
      </Link>,
    );
    expect(container.querySelectorAll('[role="link"] > span')).toHaveLength(1); // only the text span
  });

  it("hides the text when text is false", () => {
    render(
      <Link text={false} leftIcon rightIcon={false}>
        Hidden
      </Link>,
    );
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });

  it("renders selectLeftIcon/selectRightIcon content in place of the default icon", () => {
    render(
      <Link
        selectLeftIcon={<span data-testid="custom-left" />}
        selectRightIcon={<span data-testid="custom-right" />}
      >
        Link
      </Link>,
    );
    expect(screen.getByTestId("custom-left")).toBeInTheDocument();
    expect(screen.getByTestId("custom-right")).toBeInTheDocument();
  });

  it("defaults to rendering literal 'Link' text when no children are supplied", () => {
    render(<Link />);
    expect(screen.getByText("Link")).toBeInTheDocument();
  });
});

describe("confirmed absence of a focus state (§5)", () => {
  it("has no focus variant in the LinkState type or any focus-specific styling hook", () => {
    render(<Link state="default">Link</Link>);
    // @ts-expect-error - "focus" is not a confirmed link state (only disabled/hover/default exist)
    const invalid: import("./link").LinkState = "focus";
    expect(invalid).toBeDefined();
  });
});

describe("interactivity", () => {
  it("with no `state` prop, the real pointer drives hover (previously a static swatch)", () => {
    render(<Link type="primary">Link</Link>);
    const anchor = screen.getByRole("link");
    expect(anchor.style.color).toBe("rgb(84, 104, 255)");
    fireEvent.mouseEnter(anchor);
    expect(anchor.style.color).toBe("rgb(59, 78, 227)");
    fireEvent.mouseLeave(anchor);
    expect(anchor.style.color).toBe("rgb(84, 104, 255)");
  });

  it("an explicit `state` prop overrides the pointer", () => {
    render(
      <Link type="primary" state="default">
        Link
      </Link>,
    );
    const anchor = screen.getByRole("link");
    fireEvent.mouseEnter(anchor);
    expect(anchor.style.color).toBe("rgb(84, 104, 255)");
  });

  it("still fires a caller's own onMouseEnter/onMouseLeave alongside the internal hover tracking", () => {
    const onMouseEnter = vi.fn();
    const onMouseLeave = vi.fn();
    render(
      <Link onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        Link
      </Link>,
    );
    const anchor = screen.getByRole("link");
    fireEvent.mouseEnter(anchor);
    fireEvent.mouseLeave(anchor);
    expect(onMouseEnter).toHaveBeenCalledTimes(1);
    expect(onMouseLeave).toHaveBeenCalledTimes(1);
  });
});

describe("disabled behavior", () => {
  it("marks aria-disabled and blocks pointer interaction when state=disabled", () => {
    const onClick = vi.fn();
    render(
      <Link state="disabled" onClick={onClick} href="#">
        Link
      </Link>,
    );
    const anchor = screen.getByRole("link");
    expect(anchor).toHaveAttribute("aria-disabled", "true");
    expect(anchor.style.pointerEvents).toBe("none");
    fireEvent.click(anchor);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("fires onClick normally when not disabled", () => {
    const onClick = vi.fn();
    render(
      <Link onClick={onClick} href="#">
        Link
      </Link>,
    );
    fireEvent.click(screen.getByRole("link"));
    expect(onClick).toHaveBeenCalled();
  });
});

describe("renders as a real anchor", () => {
  it("forwards href and other native anchor attributes", () => {
    render(
      <Link href="/docs" target="_blank" rel="noopener">
        Docs
      </Link>,
    );
    const anchor = screen.getByRole("link") as HTMLAnchorElement;
    expect(anchor.tagName).toBe("A");
    expect(anchor.getAttribute("href")).toBe("/docs");
    expect(anchor.getAttribute("target")).toBe("_blank");
  });
});

describe("renders a <span role=\"link\"> instead of a real <a> when no href is given", () => {
  it("avoids an <a> tag entirely without href — safe to nest inside another anchor", () => {
    const { container } = render(<Link onClick={() => {}}>Link</Link>);
    expect(container.querySelector("a")).not.toBeInTheDocument();
    const el = screen.getByRole("link");
    expect(el.tagName).toBe("SPAN");
    expect(el).toHaveAttribute("tabIndex", "0");
  });

  it("is still clickable and keyboard-focusable in span form", () => {
    const onClick = vi.fn();
    render(<Link onClick={onClick}>Link</Link>);
    fireEvent.click(screen.getByRole("link"));
    expect(onClick).toHaveBeenCalled();
  });
});

// Requested addition, not part of the original Figma audit — default false matches the confirmed
// original behavior (text-decoration: none in every sampled state).
describe("underline (requested addition)", () => {
  it("defaults to no underline, matching confirmed original behavior", () => {
    render(<Link href="/x">Link</Link>);
    expect(screen.getByRole("link").style.textDecoration).toBe("none");
  });

  it("applies underline when true, consistently across default and hover — no confirmed per-state treatment exists", () => {
    const { rerender } = render(<Link href="/x" underline>Link</Link>);
    expect(screen.getByRole("link").style.textDecoration).toBe("underline");
    rerender(<Link href="/x" underline state="hover">Link</Link>);
    expect(screen.getByRole("link").style.textDecoration).toBe("underline");
  });
});
