import { useContext } from "react";
import { NewsContext } from "@/context/NewsContext";

export const useNews = () => {
  const context = useContext(NewsContext);

  if (!context) {
    throw new Error("useNews debe ser usado dentro de un NewsProvider");
  }

  // Helper derivado: obtener las N primeras noticias
  const getTopArticles = (count: number) =>
    context.news.articles.slice(0, count);

  return {
    ...context,
    getTopArticles,
  };
};
