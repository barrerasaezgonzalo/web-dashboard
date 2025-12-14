import "@testing-library/jest-dom";
// __test__/components/WebVitals/WebVitals.test.tsx
import { render } from "@testing-library/react";
import { WebVitals } from "@/components/WebVitals/WebVitals";

jest.mock("@/hooks/usePerformance", () => ({
  usePerformance: jest.fn(),
}));

jest.mock("web-vitals", () => ({
  onLCP: jest.fn(),
  onTTFB: jest.fn(),
  onFCP: jest.fn(),
  onCLS: jest.fn(),
}));

import { usePerformance } from "@/hooks/usePerformance";
import { onLCP, onTTFB, onFCP, onCLS } from "web-vitals";

describe("WebVitals Component", () => {
  beforeEach(() => {
    const mainContent = document.createElement("div");
    mainContent.id = "main-content";
    document.body.appendChild(mainContent);
  });

  afterEach(() => {
    const mainContent = document.getElementById("main-content");
    mainContent?.remove();
    jest.clearAllMocks();
  });

  it("llama a los métodos de web-vitals y setters del hook", () => {
    const setLCP = jest.fn();
    const setTTFB = jest.fn();
    const setFCP = jest.fn();
    const setCLS = jest.fn();

    (usePerformance as jest.Mock).mockReturnValue({
      setLCP,
      setTTFB,
      setFCP,
      setCLS,
    });

    render(<WebVitals />);

    expect(onLCP).toHaveBeenCalled();
    expect(onTTFB).toHaveBeenCalled();
    expect(onFCP).toHaveBeenCalled();
    expect(onCLS).toHaveBeenCalled();
  });
});
