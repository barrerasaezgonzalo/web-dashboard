import { DataContext } from "@/context/DataContext";
import { useContext } from "react";

export const useData = () => {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("useData debe ser usado dentro de un DataProvider");
  }

  return context;
};
