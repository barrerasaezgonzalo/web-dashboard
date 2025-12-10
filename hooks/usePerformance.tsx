import { PerformanceContext } from "@/context/PerformanceContext";
import { useContext } from "react";

export const usePerformance = () => {
  const context = useContext(PerformanceContext);

  if (!context) {
    throw new Error("usePerformance debe ser usado dentro de un PerformanceProvider");
  }

  return context;
};
