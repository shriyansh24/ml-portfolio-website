/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FallbackError from "../../../components/error/FallbackError";
import "@testing-library/jest-dom";
import { expect } from "@playwright/test";
import { expect } from "@playwright/test";
import test from "@playwright/test";
import { expect } from "@playwright/test";
import test from "@playwright/test";
import { expect } from "@playwright/test";
import test from "@playwright/test";
import { expect } from "@playwright/test";
import test from "@playwright/test";
import { expect } from "@playwright/test";
import test from "@playwright/test";
import { expect } from "@playwright/test";
import { expect } from "@playwright/test";
import { expect } from "@playwright/test";
import { expect } from "@playwright/test";
import test from "@playwright/test";
import { beforeEach } from "node:test";
import { describe } from "node:test";

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
    // Use Object.defineProperty to modify NODE_ENV since it's read-only
    Object.defineProperty(process.env, "NODE_ENV", {
      value: "development",
      configurable: true,
    });

    const testError = new Error("Test error message");
    render(<FallbackError error={testError} />);

    expect(screen.getByText(/Error: Test error message/)).toBeInTheDocument();

    // Restore original NODE_ENV
    Object.defineProperty(process.env, "NODE_ENV", {
      value: originalNodeEnv,
      configurable: true,
    });
  });

  test("does not show error details in production environment", () => {
    const originalNodeEnv = process.env.NODE_ENV;
    // Use Object.defineProperty to modify NODE_ENV since it's read-only
    Object.defineProperty(process.env, "NODE_ENV", {
      value: "production",
      configurable: true,
    });

    const testError = new Error("Test error message");
    render(<FallbackError error={testError} />);

    expect(screen.queryByText(/Error: Test error message/)).not.toBeInTheDocument();

    // Restore original NODE_ENV
    Object.defineProperty(process.env, "NODE_ENV", {
      value: originalNodeEnv,
      configurable: true,
    });
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
