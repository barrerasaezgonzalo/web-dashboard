import { render, renderHook } from "@testing-library/react";
import { useFinancial } from "@/hooks/useFinancial";
import { FinancialProvider } from "@/context/FinancialContext";

describe("useFinancial hook", () => {
  it("debe lanzar error si se usa fuera del FinancialProvider", () => {
    // Intentamos usar el hook fuera del FinancialProvider, esto debería lanzar el error
    expect(() => renderHook(() => useFinancial())).toThrow(
      "useFinancial debe ser usado dentro de un FinancialProvider",
    );
  });

  test("devuelve el contexto correctamente dentro del FinancialProvider", () => {
    let contextValue: any;

    const TestComponent = () => {
      contextValue = useFinancial();
      return null;
    };

    render(
      <FinancialProvider>
        <TestComponent />
      </FinancialProvider>,
    );

    expect(contextValue).toHaveProperty("financial");
    expect(contextValue).toHaveProperty("financialLoading");
    expect(contextValue).toHaveProperty("getFinancial");
  });
});
