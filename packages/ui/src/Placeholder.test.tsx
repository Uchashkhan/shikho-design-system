import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Placeholder } from "./Placeholder";

describe("Placeholder", () => {
  it("renders its children", () => {
    render(<Placeholder>hello</Placeholder>);
    expect(screen.getByText("hello")).toBeInTheDocument();
  });
});
