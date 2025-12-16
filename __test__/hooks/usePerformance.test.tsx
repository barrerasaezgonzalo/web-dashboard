import { render, renderHook } from "@testing-library/react";
import { usePerformance } from "@/hooks/usePerformance";
import { PerformanceProvider } from "@/context/PerformanceContext";

describe("usePerformance hook", () => {
  it("debe lanzar error si se usa fuera del PerformanceProvider", () => {
    expect(() => renderHook(() => usePerformance())).toThrow(
      "usePerformance debe ser usado dentro de un PerformanceProvider",
    );
  });

  test("devuelve el contexto correctamente dentro del PerformanceProvider", () => {
    let contextValue: any;

    const TestComponent = () => {
      contextValue = usePerformance();
      return null;
    };

    render(
      <PerformanceProvider>
        <TestComponent />
      </PerformanceProvider>,
    );

    expect(contextValue).toHaveProperty("lcp");
    expect(contextValue).toHaveProperty("ttfb");
    expect(contextValue).toHaveProperty("fcp");
    expect(contextValue).toHaveProperty("cls");
    expect(contextValue).toHaveProperty("setLCP");
    expect(contextValue).toHaveProperty("setTTFB");
    expect(contextValue).toHaveProperty("setFCP");
    expect(contextValue).toHaveProperty("setCLS");
  });
});
