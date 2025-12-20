// pages/api/rss.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Parser from "rss-parser";
import { News, NewsArticle } from "@/types";

const parser = new Parser();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res
      .status(400)
      .json({ error: "Debe proporcionar la url del feed RSS" });
  }

  try {
    const feed = await parser.parseURL(url);
    const articles: NewsArticle[] = feed.items.map((item) => ({
      title: item.title || "",
      description: item.contentSnippet || item.content || "",
      url: item.link || "",
      source: {
        name: feed.title || "RSS",
        url: item.link || "",
      },
      publishedAt: item.pubDate
        ? new Date(item.pubDate).toISOString()
        : new Date().toISOString(),
      image: item.enclosure?.url || "",
    }));

    const news: News = {
      totalArticles: articles.length,
      articles,
    };

    res.status(200).json(news);
  } catch (error) {
    console.error("Error al parsear RSS:", error);
    res.status(500).json({ totalArticles: 0, articles: [], _fallback: true });
  }
}
