"use client";

import { Feed, News } from "@/types";
import React, { createContext, useEffect, useState, ReactNode } from "react";

export interface NewsContextType {
  news: News;
  newsLoading: boolean;
  selectedFeed: Feed;
  setSelectedFeed: (feed: Feed) => void;
  getNews: (feed?: Feed) => Promise<void>;
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
  const [selectedFeed, setSelectedFeed] = useState<Feed>("biobio");

  // --- Función unificada de lectura de cache ---
  const readCache = (feed: Feed): News | null => {
    if (!canAccessBrowserStorage(getBrowserWindow())) return null;

    const cacheKey = `newsCache_${feed}`;
    const cacheTimeKey = `newsCacheTime_${feed}`;
    const cacheStr = window.localStorage.getItem(cacheKey);
    const cacheTimeStr = window.localStorage.getItem(cacheTimeKey);

    if (cacheStr && cacheTimeStr) {
      const expiresAt = parseInt(cacheTimeStr);
      if (Date.now() < expiresAt) {
        return JSON.parse(cacheStr);
      } else {
        window.localStorage.removeItem(cacheKey);
        window.localStorage.removeItem(cacheTimeKey);
      }
    }
    return null;
  };

  // --- Función unificada de fetch de noticias ---
  const getNews = async (feed: Feed = selectedFeed) => {
    setNewsLoading(true);
    try {
      const cached = readCache(feed);
      if (cached) {
        setNews(cached);
        console.log("Noticias desde cache:", feed);
        return;
      }

      const feedUrls: Record<Feed, string> = {
        gnews: "/api/news",
        biobio: "/api/rss?url=https://feeds.feedburner.com/radiobiobio/NNeJ",
        latercera:
          "/api/rss?url=https://www.latercera.com/arc/outboundfeeds/rss/?outputType=xml",
      };
      const url = feedUrls[feed];

      const response = await fetch(url);
      const data: News = await response.json();

      setNews(data);
      if (canAccessBrowserStorage(getBrowserWindow())) {
        window.localStorage.setItem(`newsCache_${feed}`, JSON.stringify(data));
        window.localStorage.setItem(
          `newsCacheTime_${feed}`,
          (Date.now() + 12 * 60 * 60 * 1000).toString(),
        );
      }

      console.log("Noticias desde API:", feed);
    } catch (error) {
      console.error("Error al obtener noticias:", error);
      setNews({ totalArticles: 0, articles: [], _fallback: true });
    } finally {
      setNewsLoading(false);
    }
  };

  // --- Función para bloquear noticias 12h ---
  const bloquearNews12Horas = () => {
    if (!canAccessBrowserStorage(getBrowserWindow())) return;

    const cacheTimeKey = `newsCacheTime_${selectedFeed}`;
    window.localStorage.setItem(
      cacheTimeKey,
      (Date.now() + 12 * 60 * 60 * 1000).toString(),
    );
    // Actualizar el estado para reflejar bloqueo
    setNews({ totalArticles: 0, articles: [], _fallback: true });
    // Refrescar noticias desde API si se desea
    getNews();
  };

  // --- Efecto principal: actualizar noticias al cambiar feed ---
  useEffect(() => {
    getNews(selectedFeed);
  }, [selectedFeed]);

  return (
    <NewsContext.Provider
      value={{
        news,
        newsLoading,
        selectedFeed,
        setSelectedFeed,
        getNews,
        bloquearNews12Horas,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};
