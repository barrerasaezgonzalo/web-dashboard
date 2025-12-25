import { useContext, useMemo } from "react";
import { PersonalFinanceContext } from "@/context/PersonalFinanceContext";

export function usePersonalFinance() {
  const context = useContext(PersonalFinanceContext);
  if (!context) {
    throw new Error(
      "usePersonalFinance debe ser usado dentro de un PersonalFinanceProvider",
    );
  }

  // Helper derivado: filtrar movimientos por tipo
  const movimientosPorTipo = useMemo(() => {
    return {
      ingresos: context.movements.filter((m) => m.type === "ingresos"),
      gastos: context.movements.filter((m) => m.type === "gastos"),
      ahorros: context.movements.filter((m) => m.type === "ahorros"),
    };
  }, [context.movements]);

  return {
    ...context,
    movimientosPorTipo,
  };
}
