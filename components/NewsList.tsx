import { NewsListProps } from "@/types";
import { memo } from "react";

const NewsList: React.FC<NewsListProps> = ({ news }) => {
  if (!news.articles || news.articles.length === 0) {
    return (
      <div className="bg-white p-4 rounded shadow h-[400px] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 border-b">Noticias</h2>
        <p className="text-gray-500">
          No hay noticias disponibles en este momento.
        </p>
      </div>
    );
  }
  return (
    <div className="bg-blue-100 p-4 rounded shadow h-[400px] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 border-b">Noticias</h2>
      <ul>
        {news.articles.map((article, index) => (
          <li
            key={index}
            className="border-b border-gray-200 pb-2 last:border-b-0"
          >
            <h3 className="font-bold text-md mt-2">{article.title}</h3>
            <a
              href={article.url}
              target="_blank"
              className="text-blue-500 text-sm"
            >
              <p className="text-gray-700 text-sm">{article.description}</p>
            </a>
            <span className="text-gray-400 text-xs text-right">
              {new Date(article.publishedAt).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default memo(NewsList);
