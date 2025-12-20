import { useNews } from "@/hooks/useNews";
import { Feed, NewsArticle } from "@/types";
import { memo } from "react";

const feeds: { label: string; value: Feed }[] = [
  { label: "GNews", value: "gnews" },
  { label: "BioBio", value: "biobio" },
  { label: "La Tercera", value: "latercera" },
];

const News: React.FC = ({}) => {
  const { news, newsLoading, selectedFeed, setSelectedFeed, getNews } =
    useNews();

  const handleFeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const feed = e.target.value as Feed;
    setSelectedFeed(feed);
  };

  return (
    <div
      className={`bg-blue-50 text-black p-4 rounded shadow min-h-[600px] overflow-x-auto`}
      role="region"
      aria-labelledby="news-heading"
    >
      <h2
        id="news-heading"
        className="text-xl font-bold mb-4 border-b border-blue-300"
      >
        Noticias
      </h2>

      <div className="mb-4 flex items-center gap-2 justify-between">
        <label htmlFor="feed-select" className="font-medium">
          Seleccionar fuente:
        </label>
        <select
          id="feed-select"
          value={selectedFeed}
          onChange={handleFeedChange}
          className="border border-gray-300 rounded px-2 py-1"
        >
          {feeds.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>
      {newsLoading ? (
        <p>Cargando noticias...</p>
      ) : news.articles.length === 0 ? (
        <p>No se encontraron noticias para este feed.</p>
      ) : (
        <ul className="h-[500px] overflow-y-auto">
          {news.articles.map((article: NewsArticle, index: number) => (
            <li
              key={index}
              className="border-b border-blue-300 pb-2 last:border-b-0"
            >
              <a
                href={article.url}
                target="_blank"
                className="text-black"
                aria-labelledby={`article-title-${index}`}
              >
                <h3
                  id={`article-title-${index}`}
                  className="font-bold text-blue-500 text-md mt-2"
                >
                  {article.title}
                </h3>

                <p className="mt-1 text-sm">{article.description}</p>
              </a>
              <p className="text-gray-500 mt-2 text-sm">
                {article.source.name}
              </p>
              <span className="text-gray-500 text-xs block text-left">
                {new Date(article.publishedAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default memo(News);
