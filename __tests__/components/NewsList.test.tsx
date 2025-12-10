import { render, screen } from "@testing-library/react";
import NewsList from "@/components/News/News";
import { News } from "@/types";

const mockNews: News = {
  totalArticles: 2,
  articles: [
    {
      title: "Noticia 1",
      description: "Descripción 1",
      url: "http://example.com/1",
      image: "http://example.com/1.jpg",
      source: { 
        name: "Fuente 1",
        url: "http://fuente1.com"  // <-- obligatorio según tu tipo
      },
      publishedAt: "2025-12-07T10:00:00Z",
    },
    {
      title: "Noticia 2",
      description: "Descripción 2",
      url: "http://example.com/2",
      image: "http://example.com/2.jpg",
      source: { 
        name: "Fuente 2",
        url: "http://fuente2.com"  // <-- obligatorio
      },
      publishedAt: "2025-12-07T11:00:00Z",
    },
  ],
};

describe("NewsList Component", () => {
  it("renders fallback when no articles are available", () => {
    render(<NewsList news={{ totalArticles: 2, articles: [] }} />);
    expect(screen.getByText("Noticias")).toBeInTheDocument();
    expect(
      screen.getByText("No hay noticias disponibles en este momento.")
    ).toBeInTheDocument();
  });

  it("renders news articles when provided", () => {
    render(<NewsList news={mockNews} />);
    mockNews.articles.forEach((article) => {
      expect(screen.getByText(article.title)).toBeInTheDocument();
      expect(screen.getByText(article.description)).toBeInTheDocument();
      expect(screen.getByText(article.source.name)).toBeInTheDocument();
    });
  });
});
