"use client";

import { News } from "@/types";
import React, { createContext, useEffect, useState, ReactNode } from "react";

export interface NewsContextType {
  news: News;
  newsLoading: boolean;
  getNews: () => Promise<void>;
  bloquearNews12Horas: () => void;
}

export const NewsContext = createContext<NewsContextType | undefined>(
  undefined,
);

interface NewsProviderProps {
  children: ReactNode;
}

export const canAccessBrowserStorage = (win: unknown): boolean => {
  return typeof win !== "undefined";
};

export const getBrowserWindow = () => {
  return typeof window !== "undefined" ? window : undefined;
};

export const NewsProvider: React.FC<NewsProviderProps> = ({ children }) => {
  const [news, setNews] = useState<News>({ totalArticles: 0, articles: [] });
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsCache, setNewsCache] = useState<News | null>(null);

  useEffect(() => {
    if (!canAccessBrowserStorage(getBrowserWindow())) return;

    const stored = window.localStorage.getItem("newsCache");
    const storedTime = window.localStorage.getItem("newsCacheTime");

    if (stored && storedTime) {
      const ahora = Date.now();
      if (ahora - parseInt(storedTime) < 12 * 60 * 60 * 1000) {
        const data = JSON.parse(stored);
        setNewsCache(data);
        setNews(data);
      } else {
        window.localStorage.removeItem("newsCache");
        window.localStorage.removeItem("newsCacheTime");
      }
    }
  }, []);

  const getNews = async () => {
    setNewsLoading(true);
    try {
      if (typeof window !== "undefined") {
        const cacheStr = window.localStorage.getItem("newsCache");
        const cacheTimeStr = window.localStorage.getItem("newsCacheTime");
        const now = Date.now();

        if (cacheStr && cacheTimeStr && now < parseInt(cacheTimeStr)) {
          console.log("Noticias cargadas desde cache");
          const cached = JSON.parse(cacheStr);
          setNews(cached);
          return;
        }
      }

      const response = await fetch("/api/news");
      const data = await response.json();

      setNews(data);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("newsCache", JSON.stringify(data));
        window.localStorage.setItem(
          "newsCacheTime",
          (Date.now() + 12 * 60 * 60 * 1000).toString(),
        ); // válida 12 horas
      }

      console.log("Noticias cargadas desde API");
    } catch (error) {
      console.error("Error al obtener noticias:", error);
      setNews({ totalArticles: 0, articles: [], _fallback: true });
    } finally {
      setNewsLoading(false);
    }
  };

  const bloquearNews12Horas = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "newsCacheTime",
        (Date.now() + 12 * 60 * 60 * 1000).toString(),
      ); // bloquea 12h
      setNewsCache(null);
      getNews();
    }
  };

  useEffect(() => {
    getNews();
  }, []);

  return (
    <NewsContext.Provider
      value={{
        news,
        newsLoading,
        getNews,
        bloquearNews12Horas,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};
