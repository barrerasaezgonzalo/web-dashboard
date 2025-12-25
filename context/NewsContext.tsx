"use client";

import { Feed, News, NewsContextType, NewsProviderProps } from "@/types";
import { canAccessBrowserStorage, getBrowserWindow } from "@/utils";
import React, { createContext, useEffect, useState, ReactNode } from "react";

export const NewsContext = createContext<NewsContextType | undefined>(
  undefined,
);

export const NewsProvider: React.FC<NewsProviderProps> = ({ children }) => {
  const [news, setNews] = useState<News>({ totalArticles: 0, articles: [] });
  const [newsLoading, setNewsLoading] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState<Feed>("biobio");

  const readCache = (feed: Feed): News | null => {
    if (!canAccessBrowserStorage(getBrowserWindow())) return null;
    const cacheKey = `newsCache_${feed}`;
    const cacheTimeKey = `newsCacheTime_${feed}`;
    const cacheStr = window.localStorage.getItem(cacheKey);
    const cacheTimeStr = window.localStorage.getItem(cacheTimeKey);

    if (cacheStr && cacheTimeStr) {
      const expiresAt = parseInt(cacheTimeStr);
      if (Date.now() < expiresAt) return JSON.parse(cacheStr);
      window.localStorage.removeItem(cacheKey);
      window.localStorage.removeItem(cacheTimeKey);
    }
    return null;
  };

  const getNews = async (feed: Feed = selectedFeed) => {
    setNewsLoading(true);
    try {
      const cached = readCache(feed);
      if (cached) {
        setNews(cached);
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
    } catch (error) {
      console.error("Error al obtener noticias:", error);
      setNews({ totalArticles: 0, articles: [], _fallback: true });
    } finally {
      setNewsLoading(false);
    }
  };

  const bloquearNews12Horas = () => {
    if (!canAccessBrowserStorage(getBrowserWindow())) return;
    const cacheTimeKey = `newsCacheTime_${selectedFeed}`;
    window.localStorage.setItem(
      cacheTimeKey,
      (Date.now() + 12 * 60 * 60 * 1000).toString(),
    );
    setNews({ totalArticles: 0, articles: [], _fallback: true });
    getNews();
  };

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
