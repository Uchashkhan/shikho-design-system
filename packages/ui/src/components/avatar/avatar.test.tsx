import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import * as uiRoot from "../../index";
import { Avatar } from "./avatar";

describe("root export", () => {
  it("exposes Avatar from the @shikho/ui package root", () => {
    expect(uiRoot.Avatar).toBe(Avatar);
  });
});

describe("confirmed sizes", () => {
  const sizes = [
    ["xl", 64],
    ["lg", 48],
    ["md", 40],
    ["sm", 32],
    ["xs", 24],
  ] as const;

  it.each(sizes)("renders size=%s at the confirmed %ipx square dimension", (size, px) => {
    const { container } = render(<Avatar size={size} type="image" src="/photo.jpg" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.width).toBe(`${px}px`);
    expect(root.style.height).toBe(`${px}px`);
  });
});

describe("type=image — the deep-audited variant", () => {
  it("renders a plain <img> fill with object-cover and full circular radius", () => {
    render(<Avatar type="image" src="/photo.jpg" alt="Profile" />);
    const img = screen.getByRole("img") as HTMLImageElement;
    expect(img.src).toContain("/photo.jpg");
    expect(img.alt).toBe("Profile");
    expect(img.style.objectFit).toBe("cover");
    expect(img.style.borderRadius).toBe("1000px");
  });
});

describe("type=icon / type=text — structurally unconfirmed, derived fallback fill", () => {
  it("renders children content on a derived neutral background for type=icon", () => {
    render(
      <Avatar type="icon" data-testid="avatar-root">
        <span>ICON</span>
      </Avatar>,
    );
    expect(screen.getByText("ICON")).toBeInTheDocument();
  });

  it("renders the requested default UserIcon glyph when no children are supplied", () => {
    const { container } = render(<Avatar type="icon" />);
    const svg = container.querySelector('svg[data-icon="user"]');
    expect(svg).toBeInTheDocument();
  });

  it("paints the default icon glyph gray/50, a requested override (was white/900, then gray/500)", () => {
    const { container } = render(<Avatar type="icon" />);
    const slot = container.querySelector('svg[data-icon="user"]')?.parentElement as HTMLElement;
    expect(slot.style.color).toBe("rgb(249, 249, 250)"); // color/gray/50 (#f9f9fa)
  });

  it("renders the default glyph at 130% of its confirmed inset container, a requested increase (§21)", () => {
    // size="md": box=40, container=box/2=20, glyph=20*1.3=26.
    const { container } = render(<Avatar type="icon" size="md" />);
    const svg = container.querySelector('svg[data-icon="user"]');
    expect(svg?.getAttribute("width")).toBe("26");
    expect(svg?.getAttribute("height")).toBe("26");
  });

  it("keeps the bigger glyph from being squished by the flex row's default shrink behavior", () => {
    // A real bug caught live: without flex-shrink: 0, the flex row only shrinks the glyph's
    // WIDTH to fit its container, leaving height at the full 130% — a visibly non-uniform,
    // squished-looking glyph. flex-shrink: 0 keeps both dimensions equal.
    const { container } = render(<Avatar type="icon" />);
    const svg = container.querySelector('svg[data-icon="user"]') as SVGSVGElement;
    expect(svg.style.flexShrink).toBe("0");
  });

  it("prefers explicit children over the default UserIcon glyph", () => {
    const { container } = render(
      <Avatar type="icon">
        <span data-testid="custom-glyph" />
      </Avatar>,
    );
    expect(screen.getByTestId("custom-glyph")).toBeInTheDocument();
    expect(container.querySelector('svg[data-icon="user"]')).not.toBeInTheDocument();
  });

  it("renders initials content for type=text", () => {
    render(<Avatar type="text">AB</Avatar>);
    expect(screen.getByText("AB")).toBeInTheDocument();
  });

  it("does not render an <img> for type=icon or type=text", () => {
    render(<Avatar type="text">AB</Avatar>);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});

describe("confirmed status indicator (§8)", () => {
  it("does not render by default", () => {
    render(<Avatar type="image" src="/photo.jpg" />);
    expect(screen.queryByTestId("avatar-status")).not.toBeInTheDocument();
  });

  it("renders the confirmed 10px circular badge when status is true", () => {
    render(<Avatar type="image" src="/photo.jpg" status />);
    const badge = screen.getByTestId("avatar-status");
    expect(badge.style.width).toBe("10px");
    expect(badge.style.height).toBe("10px");
    expect(badge.style.borderRadius).toBe("1000px");
    expect(badge.style.border).toContain("1.5625px"); // md's re-derived border, see below
    expect(badge.style.backgroundColor).toBe("rgb(80, 223, 58)"); // surface/success_med_em
  });

  // Requested override: opaque white, not the Figma-confirmed translucent white[800] (72% alpha)
  // — at that alpha the ring let the green fill show through, reading as a washed/greenish ring.
  it("the status border is opaque white, not the confirmed 72%-alpha white", () => {
    render(<Avatar type="image" src="/photo.jpg" status />);
    const badge = screen.getByTestId("avatar-status");
    expect(badge.style.border).toContain("rgb(255, 255, 255)");
    expect(badge.style.border).not.toContain("0.72");
  });

  // Re-confirmed against a fresh reference (node 66200:18587's "online-badge": SVG circle
  // r=6.75 stroke-width=2.5 in a 16x16 slot, at xl/64px) — this IS the real model: `status` is
  // the total diameter, and border-box is correct, just with a much larger total/thinner-relative
  // border than the original 10px/3px guess that caused the earlier disproportion complaint.
  it("is explicitly box-sizing: border-box, matching the confirmed online-badge reference", () => {
    render(<Avatar type="image" src="/photo.jpg" status />);
    const badge = screen.getByTestId("avatar-status");
    expect(badge.style.boxSizing).toBe("border-box");
  });
});

// `verification` (a confirmed top-right checkmark badge, §8) was removed entirely per direct
// user request ("rename ring with badge and remove the current badge") — replaced by `badge`
// below, which is unrelated in both shape and Figma provenance.
describe("no auto-layout, no elevation — confirmed architectural differences", () => {
  it("positions status absolutely against a relative root", () => {
    render(<Avatar type="image" src="/photo.jpg" status />);
    const status = screen.getByTestId("avatar-status");
    expect(status.style.position).toBe("absolute");
  });
});

// Requested addition, not part of the original Figma audit (docs/audit/avatars.md §15–§17) — no
// confirmed reusable "ring"/"badge" property exists on the actual `avatar` component set; this
// reuses the 3px stroke width from a one-off reference example (node 66200:18587), scaled per
// size. Named `badge` per direct follow-up request (renamed from `ring`, which replaced and
// removed the unrelated `verification` prop entirely — see above).
describe("badge (requested addition, renamed from ring)", () => {
  it("does not render a border by default", () => {
    const { container } = render(<Avatar type="image" src="/photo.jpg" />);
    const root = container.firstChild as HTMLElement;
    expect(root.style.border).toBe("");
  });

  it("draws a solid ring in the given color at the confirmed md ratio (1.875px, 3px * 40/64)", () => {
    const { container } = render(
      <Avatar type="image" src="/photo.jpg" badge badgeColor="#8f45f5" />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root.style.border).toContain("1.875px");
    expect(root.style.border).toContain("rgb(143, 69, 245)"); // #8f45f5
  });

  it("scales the badge ring width per size the same way statusBorder does", () => {
    const { container, rerender } = render(<Avatar type="image" src="/photo.jpg" size="xl" badge badgeColor="#8f45f5" />);
    expect((container.firstChild as HTMLElement).style.border).toContain("3px");
    rerender(<Avatar type="image" src="/photo.jpg" size="xs" badge badgeColor="#8f45f5" />);
    expect((container.firstChild as HTMLElement).style.border).toContain("1.125px");
  });

  it("is explicitly box-sizing: content-box, so the ring adds around the avatar rather than shrinking it", () => {
    const { container } = render(<Avatar type="image" src="/photo.jpg" badge badgeColor="#8f45f5" />);
    const root = container.firstChild as HTMLElement;
    expect(root.style.boxSizing).toBe("content-box");
    expect(root.style.width).toBe("40px"); // md's own confirmed box, unaffected by the ring
  });
});

// ---------------------------------------------------------------------------
// v0.1.0 repair pass — corrections verified against live Figma
// (docs/release-visual-verification.md — Avatar).
// ---------------------------------------------------------------------------

describe("type=text and type=icon render brand gradients, not a flat gray fill", () => {
  it("fills type=text with the primary gradient and white-900 initials", () => {
    const { container } = render(<Avatar type="text">AT</Avatar>);
    const root = container.firstChild as HTMLElement;
    expect(root.style.background).toContain("linear-gradient");
    expect(root.style.background).toContain("#85a4ff"); // primary_med_em
    expect(root.style.background).toContain("#5468ff"); // primary_base

    const initials = screen.getByText("AT");
    expect(initials.style.color).toBe("rgba(255, 255, 255, 0.88)"); // color/white/900
  });

  it("fills type=icon with a flat gray/500, a requested override (was the secondary gradient)", () => {
    const { container } = render(<Avatar type="icon" />);
    const root = container.firstChild as HTMLElement;
    expect(root.style.background).toBe("rgb(175, 179, 187)"); // color/gray/500 (#afb3bb)
  });

  it("leaves type=image with no background fill", () => {
    const { container } = render(<Avatar type="image" src="/photo.jpg" />);
    expect((container.firstChild as HTMLElement).style.background).toBe("");
  });
});

describe("per-size metrics are independent, not extrapolated from md", () => {
  // `statusBorder` column is re-derived from the confirmed online-badge reference (node
  // 66200:18587): border = 0.15625 * status, at every size. `xl`'s own `status` corrects from a
  // previously-measured 14 to the newly-confirmed 16 (xs/sm/md/lg unchanged).
  const cases = [
    ["xs", "11px", 6, "0.9375px"],
    ["sm", "12px", 8, "1.25px"],
    ["md", "13px", 10, "1.5625px"],
    ["lg", "13px", 12, "1.875px"],
    ["xl", "22px", 16, "2.5px"],
  ] as const;

  it.each(cases)(
    "size=%s uses %s initials and a %ipx status dot",
    (size, fontSize, status, statusBorder) => {
      render(
        <Avatar size={size} type="text" status>
          AT
        </Avatar>,
      );
      expect(screen.getByText("AT").style.fontSize).toBe(fontSize);

      const dot = screen.getByTestId("avatar-status");
      expect(dot.style.width).toBe(`${status}px`);
      expect(dot.style.border).toContain(statusBorder);
    },
  );
});

describe("type=icon glyph container", () => {
  it("is exactly half the avatar box and carries the e2 drop-shadow filter", () => {
    const { container } = render(
      <Avatar size="xl" type="icon">
        <span data-testid="glyph" />
      </Avatar>,
    );
    const slot = screen.getByTestId("glyph").parentElement as HTMLElement;
    expect(slot.style.width).toBe("32px"); // half of xl's 64px box
    expect(slot.style.filter).toContain("drop-shadow");
    expect(container.firstChild).toBeInTheDocument();
  });
});
