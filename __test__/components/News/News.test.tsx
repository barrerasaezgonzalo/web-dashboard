import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import News from "@/components/News/News";
import { useNews } from "@/hooks/useNews";

// Mock de useNews
jest.mock("@/hooks/useNews", () => ({
  useNews: jest.fn(),
}));

const mockNews = {
  news: {
    articles: [
      {
        title: "Noticia 1",
        description: "Descripción 1",
        url: "https://example.com/1",
        source: { name: "Fuente 1" },
        publishedAt: "2025-12-13T20:00:00Z",
      },
      {
        title: "Noticia 2",
        description: "Descripción 2",
        url: "https://example.com/2",
        source: { name: "Fuente 2" },
        publishedAt: "2025-12-12T18:30:00Z",
      },
    ],
  },
};

describe("News Component", () => {
  beforeEach(() => {
    (useNews as jest.Mock).mockReturnValue(mockNews);
  });

  test("renderiza el título 'Noticias'", () => {
    render(<News />);
    expect(screen.getByText("Noticias")).toBeInTheDocument();
  });

  test("renderiza todas las noticias con título, descripción y fuente", () => {
    render(<News />);

    mockNews.news.articles.forEach((article) => {
      expect(screen.getByText(article.title)).toBeInTheDocument();
      expect(screen.getByText(article.description)).toBeInTheDocument();
      expect(screen.getByText(article.source.name)).toBeInTheDocument();
      // También se podría validar que el enlace tenga la URL correcta
      expect(screen.getByText(article.title).closest("a")).toHaveAttribute(
        "href",
        article.url,
      );
    });
  });
});
