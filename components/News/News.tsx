import { useNews } from "@/hooks/useNews";
import { Feed, NewsArticle } from "@/types";
import { Newspaper } from "lucide-react";
import { memo } from "react";

const feeds: { label: string; value: Feed }[] = [
  { label: "BioBio", value: "biobio" },
  { label: "La Tercera", value: "latercera" },
  { label: "GNews", value: "gnews" },
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
      className={`bg-blue-50 text-black p-4 rounded shadow min-h-[982px] overflow-x-auto`}
      role="region"
      aria-labelledby="news-heading"
    >
      <h2
        id="news-heading"
        className="text-xl flex gap-2 font-bold mb-4 border-b border-blue-300"
      >
        <Newspaper size={25} /> Noticias
      </h2>

      <div className="mb-4 flex items-center gap-2 justify-between">
        <label htmlFor="feed-select" className="font-medium">
          Seleccionar fuente:
        </label>
        <div className="relative inline-block w-30">
          <select
            className="
            appearance-none
            w-full
            border 
            border-gray-300 
            rounded-lg 
            p-2 
            bg-white 
            text-gray-800 
            focus:outline-none"
            id="feed-select"
            value={selectedFeed}
            onChange={handleFeedChange}
          >
            {feeds.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="w-4 h-4 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
      {newsLoading ? (
        <p>Cargando noticias...</p>
      ) : news.articles.length === 0 ? (
        <p>No se encontraron noticias para este feed.</p>
      ) : (
        <ul className="h-[800px] overflow-y-auto">
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
