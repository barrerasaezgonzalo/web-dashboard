import { renderHook, act } from "@testing-library/react";
import React, { ReactNode } from "react";
import {
  PerformanceProvider,
  PerformanceContext,
} from "@/context/PerformanceContext";

describe("PerformanceProvider", () => {
  const wrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
    <PerformanceProvider>{children}</PerformanceProvider>
  );

  test("inicializa valores en null y permite actualizarlos", () => {
    const { result } = renderHook(() => React.useContext(PerformanceContext), {
      wrapper,
    });

    // Los valores iniciales son null
    expect(result.current?.lcp).toBeNull();
    expect(result.current?.ttfb).toBeNull();
    expect(result.current?.fcp).toBeNull();
    expect(result.current?.cls).toBeNull();

    // Actualizamos los valores
    act(() => {
      result.current?.setLCP(1200);
      result.current?.setTTFB(300);
      result.current?.setFCP(500);
      result.current?.setCLS(10);
    });

    expect(result.current?.lcp).toBe(1200);
    expect(result.current?.ttfb).toBe(300);
    expect(result.current?.fcp).toBe(500);
    expect(result.current?.cls).toBe(10);
  });
});
