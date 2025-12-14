import { renderHook } from "@testing-library/react";
import { useFinancial } from "@/hooks/useFinancial";
import { FinancialProvider } from "@/context/FinancialContext";

describe("useFinancial hook", () => {
  it("debe lanzar error si se usa fuera del FinancialProvider", () => {
    // Intentamos usar el hook fuera del FinancialProvider, esto debería lanzar el error
    expect(() => renderHook(() => useFinancial())).toThrow(
      "useFinancial debe ser usado dentro de un FinancialProvider",
    );
  });
});
