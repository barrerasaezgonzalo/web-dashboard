"use client";

import { Feed, News } from "@/types";
import React, { createContext, useEffect, useState, ReactNode } from "react";

export interface NewsContextType {
  news: News;
  newsLoading: boolean;
  selectedFeed: Feed;
  setSelectedFeed: (feed: Feed) => void;
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
  const [selectedFeed, setSelectedFeed] = useState<Feed>("gnews");

  const cacheKey = `newsCache_${selectedFeed}`;
  const cacheTimeKey = `newsCacheTime_${selectedFeed}`;

  useEffect(() => {
    getNews();
  }, [selectedFeed]);

  useEffect(() => {
    if (!canAccessBrowserStorage(getBrowserWindow())) return;
    const stored = window.localStorage.getItem(cacheKey);
    const storedTime = window.localStorage.getItem(cacheTimeKey);

    if (stored && storedTime) {
      const ahora = Date.now();
      if (ahora - parseInt(storedTime) < 12 * 60 * 60 * 1000) {
        const data = JSON.parse(stored);
        setNewsCache(data);
        setNews(data);
      } else {
        window.localStorage.removeItem(cacheKey);
        window.localStorage.removeItem(cacheTimeKey);
      }
    }
  }, []);

  const getNews = async () => {
    setNewsLoading(true);
    try {
      if (typeof window !== "undefined") {
        const cacheStr = window.localStorage.getItem(cacheKey);
        const cacheTimeStr = window.localStorage.getItem(cacheTimeKey);
        const now = Date.now();

        if (cacheStr && cacheTimeStr && now < parseInt(cacheTimeStr)) {
          console.log("Noticias cargadas desde cache ", cacheKey);
          const cached = JSON.parse(cacheStr);
          setNews(cached);
          return;
        }
      }

      const feedUrls: Record<Feed, string> = {
        gnews: "/api/news",
        biobio: "/api/rss?url=https://feeds.feedburner.com/radiobiobio/NNeJ",
        latercera:
          "/api/rss?url=https://www.latercera.com/arc/outboundfeeds/rss/?outputType=xml",
      };

      const response = await fetch(feedUrls[selectedFeed]);
      const data = await response.json();

      setNews(data);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(cacheKey, JSON.stringify(data));
        window.localStorage.setItem(
          cacheTimeKey,
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
        cacheTimeKey,
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
