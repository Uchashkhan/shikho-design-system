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
    expect(badge.style.border).toContain("3px");
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
    expect(badge.style.border).toContain("3px"); // md's own statusBorder width, reused
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
  const cases = [
    ["xs", "11px", 6, "2px", 10],
    ["sm", "12px", 8, "2px", 12],
    ["md", "13px", 10, "3px", 14],
    ["lg", "13px", 12, "3px", 16],
    ["xl", "22px", 14, "3px", 20],
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
