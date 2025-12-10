import { useNews } from "@/hooks/useNews";
import { NewsArticle } from "@/types";
import { memo } from "react";

const News: React.FC = ({}) => {
  const { news } = useNews();
  
  if (!news.articles || news.articles.length === 0) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4 border-b">Noticias</h2>
        <p className="text-gray-500">
          No hay noticias disponibles en este momento.
        </p>
      </div>
    );
  }
  return (
    <div className={`bg-blue-50 text-black p-4 rounded shadow min-h-[500px] overflow-x-auto`}>
  <h2 className="text-xl font-bold mb-4 border-b border-blue-300">Noticias</h2>
  <ul className="h-[400px] overflow-y-auto">
    {news.articles.map((article:NewsArticle, index:number) => (
      <li
        key={index}
        className="border-b border-blue-300 pb-2 last:border-b-0"
      >                                             
        <h3 className="font-bold text-blue-500 text-md mt-2">{article.title}</h3>
        <a
          href={article.url}
          target="_blank"
          className="text-black hover:text-blue-700"
        >
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
