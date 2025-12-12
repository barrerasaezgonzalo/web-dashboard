import { useNews } from "@/hooks/useNews";
import { NewsArticle } from "@/types";
import { memo } from "react";

const News: React.FC = ({}) => {
  const { news } = useNews();
 
  return (
    <div
      className={`bg-blue-50 text-black p-4 rounded shadow min-h-[600px] overflow-x-auto`}
    >
      <h2 className="text-xl font-bold mb-4 border-b border-blue-300">
        Noticias
      </h2>
      <ul className="h-[500px] overflow-y-auto">
        {news.articles.map((article: NewsArticle, index: number) => (
          <li
            key={index}
            className="border-b border-blue-300 pb-2 last:border-b-0"
          >
            <a href={article.url} target="_blank" className="text-black">
              <h3 className="font-bold text-blue-500 text-md mt-2">
                {article.title}
              </h3>

              <p className="mt-1 text-sm">{article.description}</p>
            </a>
            <p className="text-gray-500 mt-2 text-sm">{article.source.name}</p>
            <span className="text-gray-500 text-xs block text-left">
              {new Date(article.publishedAt).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default memo(News);
