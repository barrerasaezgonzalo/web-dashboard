import React from "react";
import { render } from "@testing-library/react";
import { WebVitals } from "@/components/WebVitals/WebVitals";
import { usePerformance } from "@/context/PerformanceContext";
import * as webVitals from "web-vitals";

// Mock del contexto
jest.mock("@/context/PerformanceContext", () => ({
  usePerformance: jest.fn(),
}));

// Mock de web-vitals
jest.mock("web-vitals", () => ({
  onLCP: jest.fn(),
  onTTFB: jest.fn(),
  onFCP: jest.fn(),
  onCLS: jest.fn(),
}));

describe("WebVitals component", () => {
  const mockSetLCP = jest.fn();
  const mockSetTTFB = jest.fn();
  const mockSetFCP = jest.fn();
  const mockSetCLS = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (usePerformance as jest.Mock).mockReturnValue({
      setLCP: mockSetLCP,
      setTTFB: mockSetTTFB,
      setFCP: mockSetFCP,
      setCLS: mockSetCLS,
    });

    // Mock del main content
    const mainDiv = document.createElement("div");
    mainDiv.setAttribute("id", "main-content");
    document.body.appendChild(mainDiv);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("subscribes to web-vitals metrics and calls context setters", () => {
    const lcpCallback = jest.fn();
    const ttfbCallback = jest.fn();
    const fcpCallback = jest.fn();
    const clsCallback = jest.fn();

    (webVitals.onLCP as jest.Mock).mockImplementation((cb) => {
      cb({ value: 123.4 });
      lcpCallback();
    });
    (webVitals.onTTFB as jest.Mock).mockImplementation((cb) => {
      cb({ value: 200.5 });
      ttfbCallback();
    });
    (webVitals.onFCP as jest.Mock).mockImplementation((cb) => {
      cb({ value: 150.6 });
      fcpCallback();
    });
    (webVitals.onCLS as jest.Mock).mockImplementation((cb) => {
      cb({ value: 0.03 });
      clsCallback();
    });

    render(<WebVitals />);

    // Verifica que los mocks de web-vitals fueron llamados
    expect(webVitals.onLCP).toHaveBeenCalled();
    expect(webVitals.onTTFB).toHaveBeenCalled();
    expect(webVitals.onFCP).toHaveBeenCalled();
    expect(webVitals.onCLS).toHaveBeenCalled();

    // Verifica que los setters del contexto fueron llamados con valores redondeados
    expect(mockSetLCP).toHaveBeenCalledWith(123);
    expect(mockSetTTFB).toHaveBeenCalledWith(201);
    expect(mockSetFCP).toHaveBeenCalledWith(151);
    expect(mockSetCLS).toHaveBeenCalledWith(0); // CLS redondea a 0
  });
});
