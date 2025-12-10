import { FinancialContext } from "@/context/FinancialContext";
import { useContext } from "react";

export const useFinancial = () => {
  const context = useContext(FinancialContext);

  if (!context) {
    throw new Error("useData debe ser usado dentro de un FinancialProvider");
  }

  return context;
};
