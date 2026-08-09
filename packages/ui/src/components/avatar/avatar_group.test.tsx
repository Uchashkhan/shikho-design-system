import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import * as uiRoot from "../../index";
import { Avatar } from "./avatar";
import { AvatarGroup } from "./avatar_group";

describe("root export", () => {
  it("exposes AvatarGroup from the @shikho/ui package root", () => {
    expect(uiRoot.AvatarGroup).toBe(AvatarGroup);
  });
});

describe("confirmed per-size overlap", () => {
  // Confirmed by get_metadata on all five avatar_group variants: 7 avatars at a fixed step,
  // so overlap = avatar box - step.
  const rows = [
    ["xs", "-8px"],
    ["sm", "-8px"],
    ["md", "-12px"],
    ["lg", "-16px"],
    ["xl", "-20px"],
  ] as const;

  it.each(rows)("size=%s overlaps by %s on every avatar except the last", (size, overlap) => {
    const { container } = render(
      <AvatarGroup size={size}>
        <Avatar size={size} type="text">AT</Avatar>
        <Avatar size={size} type="text">MT</Avatar>
        <Avatar size={size} type="text">RT</Avatar>
      </AvatarGroup>,
    );
    const items = Array.from(
      container.querySelectorAll("[data-avatar-group-item]"),
    ) as HTMLElement[];
    expect(items).toHaveLength(3);
    expect(items[0].style.marginRight).toBe(overlap);
    expect(items[1].style.marginRight).toBe(overlap);
    // The final avatar must not overlap anything to its right.
    expect(items[2].style.marginRight).toBe("0px");
  });
});

describe("group ring", () => {
  it("draws the confirmed 1px white-88 ring around each avatar", () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar type="text">AT</Avatar>
      </AvatarGroup>,
    );
    const item = container.querySelector("[data-avatar-group-item]") as HTMLElement;
    expect(item.style.border).toContain("1px");
    expect(item.style.border).toContain("rgba(255, 255, 255, 0.88)");
  });
});

describe("overflow counter", () => {
  it("is omitted unless overflowCount is supplied", () => {
    render(
      <AvatarGroup>
        <Avatar type="text">AT</Avatar>
      </AvatarGroup>,
    );
    expect(screen.queryByTestId("avatar-group-overflow")).not.toBeInTheDocument();
  });

  it("renders +N at the avatar box size with the confirmed gray-100 fill", () => {
    render(
      <AvatarGroup size="md" overflowCount={2}>
        <Avatar type="text">AT</Avatar>
      </AvatarGroup>,
    );
    const counter = screen.getByTestId("avatar-group-overflow");
    expect(counter).toHaveTextContent("+2");
    expect(counter.style.width).toBe("40px");
    expect(counter.style.backgroundColor).toBe("rgb(244, 244, 246)");
  });

  it("keeps the last avatar overlapping when a counter follows it", () => {
    const { container } = render(
      <AvatarGroup size="md" overflowCount={3}>
        <Avatar type="text">AT</Avatar>
      </AvatarGroup>,
    );
    const item = container.querySelector("[data-avatar-group-item]") as HTMLElement;
    expect(item.style.marginRight).toBe("-12px");
  });
});

describe("composition", () => {
  it("renders the real Avatar children rather than re-implementing them", () => {
    const { container } = render(
      <AvatarGroup size="lg">
        <Avatar size="lg" type="text">AT</Avatar>
      </AvatarGroup>,
    );
    expect(container.querySelector("[data-type='text']")).toBeInTheDocument();
    expect(screen.getByText("AT")).toBeInTheDocument();
  });
});
