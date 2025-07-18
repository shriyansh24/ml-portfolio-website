import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FallbackError from "../../../components/error/FallbackError";

// Mock next/link
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock window.location.reload
const mockReload = jest.fn();
Object.defineProperty(window, "location", {
  value: {
    reload: mockReload,
  },
  writable: true,
});

describe("FallbackError Component", () => {
  beforeEach(() => {
    mockReload.mockClear();
  });

  test("renders error message and action buttons", () => {
    render(<FallbackError error={new Error("Test error")} />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText(/We apologize for the inconvenience/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Refresh Page/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Go to Homepage/i })).toBeInTheDocument();
  });

  test("shows error details in development environment", () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    const testError = new Error("Test error message");
    render(<FallbackError error={testError} />);

    expect(screen.getByText(/Error: Test error message/)).toBeInTheDocument();

    process.env.NODE_ENV = originalNodeEnv;
  });

  test("does not show error details in production environment", () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    const testError = new Error("Test error message");
    render(<FallbackError error={testError} />);

    expect(screen.queryByText(/Error: Test error message/)).not.toBeInTheDocument();

    process.env.NODE_ENV = originalNodeEnv;
  });

  test("reloads page when refresh button is clicked", async () => {
    const user = userEvent.setup();
    render(<FallbackError error={new Error("Test error")} />);

    await user.click(screen.getByRole("button", { name: /Refresh Page/i }));

    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  test("links to homepage", () => {
    render(<FallbackError error={new Error("Test error")} />);

    const homeLink = screen.getByRole("link", { name: /Go to Homepage/i });
    expect(homeLink).toHaveAttribute("href", "/");
  });

  test("handles null error gracefully", () => {
    render(<FallbackError error={null} />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.queryByText(/Error:/)).not.toBeInTheDocument();
  });
});
