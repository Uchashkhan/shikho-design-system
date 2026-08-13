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

describe("confirmed verification badge (§8)", () => {
  it("does not render by default", () => {
    render(<Avatar type="image" src="/photo.jpg" />);
    expect(screen.queryByTestId("avatar-verification")).not.toBeInTheDocument();
  });

  it("renders at the requested +2px size (14px at md — was the confirmed 12px) with a white ring", () => {
    render(
      <Avatar type="image" src="/photo.jpg" verification verificationContent={<span>✓</span>} />,
    );
    const badge = screen.getByTestId("avatar-verification");
    expect(badge.style.width).toBe("14px");
    expect(badge.style.height).toBe("14px");
    expect(screen.getByText("✓")).toBeInTheDocument();
    // Requested addition — Figma's own confirmed verification_tick carries no border at all.
    expect(badge.style.borderRadius).toBe("1000px");
    expect(badge.style.border).toContain("rgb(255, 255, 255)");
    expect(badge.style.border).toContain("1.5625px"); // md's own statusBorder width, reused
  });

  // Fix: a fixed-size consumer glyph bigger than the ring's inner content area (which shrinks
  // under border-box) overflowed the circular boundary and read as a pill/capsule, not a circle.
  it("is explicitly box-sizing: content-box, and clips content to the circle via overflow: hidden", () => {
    render(
      <Avatar type="image" src="/photo.jpg" verification verificationContent={<span>✓</span>} />,
    );
    const badge = screen.getByTestId("avatar-verification");
    expect(badge.style.boxSizing).toBe("content-box");
    expect(badge.style.overflow).toBe("hidden");
  });
});

describe("no auto-layout, no elevation — confirmed architectural differences", () => {
  it("positions status and verification absolutely against a relative root", () => {
    render(<Avatar type="image" src="/photo.jpg" status verification />);
    const status = screen.getByTestId("avatar-status");
    const verification = screen.getByTestId("avatar-verification");
    expect(status.style.position).toBe("absolute");
    expect(verification.style.position).toBe("absolute");
  });
});

// Requested addition, not part of the original Figma audit (docs/audit/avatars.md §15) — no
// confirmed reusable "ring" property exists on the actual `avatar` component set; this reuses the
// 3px stroke width from a one-off reference example (node 66200:18587), scaled per size.
describe("ring (requested addition)", () => {
  it("does not render a border by default", () => {
    const { container } = render(<Avatar type="image" src="/photo.jpg" />);
    const root = container.firstChild as HTMLElement;
    expect(root.style.border).toBe("");
  });

  it("draws a solid ring in the given color at the confirmed md ratio (1.875px, 3px * 40/64)", () => {
    const { container } = render(
      <Avatar type="image" src="/photo.jpg" ring ringColor="#8f45f5" />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root.style.border).toContain("1.875px");
    expect(root.style.border).toContain("rgb(143, 69, 245)"); // #8f45f5
  });

  it("scales the ring width per size the same way statusBorder does", () => {
    const { container, rerender } = render(<Avatar type="image" src="/photo.jpg" size="xl" ring ringColor="#8f45f5" />);
    expect((container.firstChild as HTMLElement).style.border).toContain("3px");
    rerender(<Avatar type="image" src="/photo.jpg" size="xs" ring ringColor="#8f45f5" />);
    expect((container.firstChild as HTMLElement).style.border).toContain("1.125px");
  });

  it("is explicitly box-sizing: content-box, so the ring adds around the avatar rather than shrinking it", () => {
    const { container } = render(<Avatar type="image" src="/photo.jpg" ring ringColor="#8f45f5" />);
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

  it("fills type=icon with the secondary gradient", () => {
    const { container } = render(<Avatar type="icon" />);
    const root = container.firstChild as HTMLElement;
    expect(root.style.background).toContain("#ea42b2"); // secondary_med_em
    expect(root.style.background).toContain("#e2008d"); // secondary_base
  });

  it("leaves type=image with no background fill", () => {
    const { container } = render(<Avatar type="image" src="/photo.jpg" />);
    expect((container.firstChild as HTMLElement).style.background).toBe("");
  });
});

describe("per-size metrics are independent, not extrapolated from md", () => {
  // `verification` column is the requested +2px-per-size bump (was 8/10/12/14/18).
  // `statusBorder` column is re-derived from the confirmed online-badge reference (node
  // 66200:18587): border = 0.15625 * status, at every size. `xl`'s own `status` corrects from a
  // previously-measured 14 to the newly-confirmed 16 (xs/sm/md/lg unchanged).
  const cases = [
    ["xs", "11px", 6, "0.9375px", 10],
    ["sm", "12px", 8, "1.25px", 12],
    ["md", "13px", 10, "1.5625px", 14],
    ["lg", "13px", 12, "1.875px", 16],
    ["xl", "22px", 16, "2.5px", 20],
  ] as const;

  it.each(cases)(
    "size=%s uses %s initials, a %ipx status dot and a %ipx verification tick",
    (size, fontSize, status, statusBorder, verification) => {
      render(
        <Avatar size={size} type="text" status verification>
          AT
        </Avatar>,
      );
      expect(screen.getByText("AT").style.fontSize).toBe(fontSize);

      const dot = screen.getByTestId("avatar-status");
      expect(dot.style.width).toBe(`${status}px`);
      expect(dot.style.border).toContain(statusBorder);

      expect(screen.getByTestId("avatar-verification").style.width).toBe(`${verification}px`);
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
