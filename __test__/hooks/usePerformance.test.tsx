import { renderHook } from "@testing-library/react";
import { usePerformance } from "@/hooks/usePerformance";

describe("usePerformance hook", () => {
  it("debe lanzar error si se usa fuera del PerformanceProvider", () => {
    expect(() => renderHook(() => usePerformance())).toThrow(
      "usePerformance debe ser usado dentro de un PerformanceProvider",
    );
  });
});
