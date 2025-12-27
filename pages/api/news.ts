import { News } from "@/types/";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "GNEWS_API_KEY no está configurada" });
  }

  const noticias = await getNews(apiKey);
  res.status(200).json(noticias);
}

export async function getNews(apiKey: string): Promise<News> {
  try {
    const res = await fetch(
      `https://gnews.io/api/v4/top-headlines?category=technology&lang=es&country=cl&apikey=${apiKey}`,
      {
        signal: AbortSignal.timeout(5000),
      },
    );

    if (!res.ok) {
      throw new Error(`GNews API failed: HTTP ${res.status}`);
    }

    const data = await res.json();
    return {
      totalArticles: data.totalArticles ?? 0,
      articles: data.articles ?? [],
    };
  } catch (error) {
    console.error("Error fetching news:", error);
    return {
      totalArticles: 0,
      articles: [],
      _fallback: true,
    };
  }
}
