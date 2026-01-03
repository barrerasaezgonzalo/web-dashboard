import { useContext } from "react";
import { PersonalFinanceContext } from "@/context/PersonalFinanceContext";

export function usePersonalFinance() {
  const context = useContext(PersonalFinanceContext);
  if (!context) {
    throw new Error(
      "usePersonalFinance debe ser usado dentro de un PersonalFinanceProvider",
    );
  }

  return {
    ...context,
  };
}
