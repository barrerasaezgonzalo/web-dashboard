import { NewsArticle, NewsListProps } from "@/types";

export const NewsList: React.FC<NewsListProps> = ({ newsLoading, news }) => {
  return (
    <>
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
    </>
  );
};
