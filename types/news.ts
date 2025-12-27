import { ReactNode } from "react";

export interface NewsSource {
  name: string;
  url: string;
}
export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  source: NewsSource;
}

export interface NewsListProps {
  newsLoading: boolean;
  news: News;
}

export interface News extends NewsResponse {
  _fallback?: boolean;
}

export interface NewsResponse {
  totalArticles: number;
  articles: NewsArticle[];
}

export type Feed = "gnews" | "biobio" | "latercera";

export interface NewsContextType {
  news: News;
  newsLoading: boolean;
  selectedFeed: Feed;
  setSelectedFeed: (feed: Feed) => void;
  getNews: (feed?: Feed) => Promise<void>;
  bloquearNews12Horas: () => void;
}

export interface NewsProviderProps {
  children: ReactNode;
}
