import React from "react";
import { render, screen } from "@testing-library/react";
import RootLayout, { metadata } from "@/app/layout";

// Mock de DataProvider para no depender del contexto real
jest.mock("@/context/DataContext", () => ({
  DataProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="data-provider">{children}</div>,
}));

describe("RootLayout", () => {
  it("renders children inside DataProvider", () => {
    render(
      <RootLayout>
        <p>Test Child</p>
      </RootLayout>
    );

    // Verifica que el DataProvider esté presente
    const provider = screen.getByTestId("data-provider");
    expect(provider).toBeInTheDocument();

    // Verifica que el children se renderice
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  it("has correct metadata", () => {
    expect(metadata.title).toBe("Dashboard App");
    expect(metadata.description).toBe("Dashboard application built with Next.js and TypeScript");
  });
  
});
