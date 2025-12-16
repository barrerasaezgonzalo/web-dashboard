import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { PerformancePanel } from "@/components/PerformancePanel/PerformancePanel";
import { usePerformance } from "@/hooks/usePerformance";

// Mock del hook
jest.mock("@/hooks/usePerformance", () => ({
  usePerformance: jest.fn(),
}));

describe("PerformancePanel Component", () => {
  test("muestra los valores de performance cuando están disponibles", () => {
    (usePerformance as jest.Mock).mockReturnValue({
      lcp: 1200,
      ttfb: 200,
      fcp: 500,
      cls: 0.02,
    });

    render(<PerformancePanel />);

    expect(
      screen.getByLabelText("Largest Contentful Paint: 1200 milisegundos"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Time to First Byte: 200 milisegundos"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("First Contentful Paint: 500 milisegundos"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Cumulative Layout Shift: 0.02"),
    ).toBeInTheDocument();
  });

  test("muestra 'Cargando...' cuando los valores son null", () => {
    (usePerformance as jest.Mock).mockReturnValue({
      lcp: null,
      ttfb: null,
      fcp: null,
      cls: null,
    });

    render(<PerformancePanel />);

    expect(
      screen.getByLabelText("Largest Contentful Paint: Cargando milisegundos"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Time to First Byte: Cargando milisegundos"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("First Contentful Paint: Cargando milisegundos"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Cumulative Layout Shift: Cargando"),
    ).toBeInTheDocument();
  });
});
