import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import type { RenderResult } from "@testing-library/react";
import { Button } from "./Button";

describe("Button component", () => {
  // More descriptive suite name
  let rendered: RenderResult;

  it("renders children correctly", () => {
    rendered = render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = jest.fn();
    rendered = render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies correct styles for primary variant", () => {
    rendered = render(<Button variant="primary">Primary Button</Button>);
    const button = screen.getByText("Primary Button");
    expect(button).toHaveClass("bg-blue-500");
  });

  it("applies correct styles for secondary variant", () => {
    rendered = render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByText("Secondary Button");
    expect(button).toHaveClass("bg-gray-200");
  });
});
