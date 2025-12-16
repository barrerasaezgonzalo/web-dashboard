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
  afterEach(() => {
    const mainContent = document.getElementById("main-content");
    mainContent?.remove();
    jest.clearAllMocks();
  });

  it("llama a los métodos de web-vitals y setters del hook", () => {
    const mainContent = document.createElement("div");
    mainContent.id = "main-content";
    document.body.appendChild(mainContent);

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
  it("no inicializa web-vitals si main-content no existe", () => {
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

    // Importante: NO crear main-content
    render(<WebVitals />);

    expect(onLCP).not.toHaveBeenCalled();
    expect(onTTFB).not.toHaveBeenCalled();
    expect(onFCP).not.toHaveBeenCalled();
    expect(onCLS).not.toHaveBeenCalled();
  });

  it("ejecuta los callbacks de web-vitals y llama a los setters", () => {
    // 1. Crear main-content
    const mainContent = document.createElement("div");
    mainContent.id = "main-content";
    document.body.appendChild(mainContent);

    // 2. Mocks de setters
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

    // 3. Render
    render(<WebVitals />);

    // 4. Obtener los callbacks registrados
    const lcpCallback = (onLCP as jest.Mock).mock.calls[0][0];
    const ttfbCallback = (onTTFB as jest.Mock).mock.calls[0][0];
    const fcpCallback = (onFCP as jest.Mock).mock.calls[0][0];
    const clsCallback = (onCLS as jest.Mock).mock.calls[0][0];

    // 5. Ejecutarlos manualmente
    lcpCallback({ value: 123.7 });
    ttfbCallback({ value: 456.2 });
    fcpCallback({ value: 78.9 });
    clsCallback({ value: 0.456 });

    // 6. Verificaciones (Math.round)
    expect(setLCP).toHaveBeenCalledWith(124);
    expect(setTTFB).toHaveBeenCalledWith(456);
    expect(setFCP).toHaveBeenCalledWith(79);
    expect(setCLS).toHaveBeenCalledWith(0);
  });
});
