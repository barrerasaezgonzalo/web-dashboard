import { NewsContext } from "@/context/NewsContext";
import { useContext } from "react";

export const useNews = () => {
  const context = useContext(NewsContext);

  if (!context) {
    throw new Error("useNews debe ser usado dentro de un NewsProvider");
  }

  return context;
};
