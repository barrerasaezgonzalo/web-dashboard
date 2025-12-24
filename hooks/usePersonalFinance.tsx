import { PersonalFinanceContext } from "@/context/PersonalFinanceContext";
import { useContext } from "react";

export function usePersonalFinance() {
  const context = useContext(PersonalFinanceContext);
  if (!context) {
    throw new Error(
      "usePersonalFinance debe ser usado dentro de un PersonalFinance Provider",
    );
  }

  return context;
}
