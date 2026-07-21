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
});

describe("confirmed verification badge (§8)", () => {
  it("does not render by default", () => {
    render(<Avatar type="image" src="/photo.jpg" />);
    expect(screen.queryByTestId("avatar-verification")).not.toBeInTheDocument();
  });

  it("renders the confirmed 12x12 container when verification is true", () => {
    render(
      <Avatar type="image" src="/photo.jpg" verification verificationContent={<span>✓</span>} />,
    );
    const badge = screen.getByTestId("avatar-verification");
    expect(badge.style.width).toBe("12px");
    expect(badge.style.height).toBe("12px");
    expect(screen.getByText("✓")).toBeInTheDocument();
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
