import { NewsArticle, NewsListProps } from "@/types/";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export const NewsList: React.FC<NewsListProps> = ({ newsLoading, news }) => {
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    setLimit(10);
  }, [news.articles?.length]);

  const visibleItems = news.articles ? news.articles.slice(0, limit) : [];
  const handleLoadMore = () => {
    setLimit((prev) => prev + 10);
  };
  return (
    <>
      {newsLoading ? (
        <p>Cargando noticias...</p>
      ) : news.articles.length === 0 ? (
        <p>No se encontraron noticias para este feed.</p>
      ) : (
        <ul>
          {visibleItems.map((article: NewsArticle, index: number) => (
            <li
              key={index}
              className="rounded-xl bg-white p-4 mb-3 border border-gray-100 "
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
      {limit < (news.articles?.length ?? 0) && (
        <button
          onClick={handleLoadMore}
          className="mt-2 flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-dashed border-blue-200"
        >
          <ChevronDown size={18} />
          Mostrar más ({(news.articles?.length ?? 0) - limit} restantes)
        </button>
      )}

      <div className="text-center text-xs text-gray-400 mt-1">
        Mostrando {visibleItems.length} de {news.articles?.length ?? 0}
      </div>
    </>
  );
};
