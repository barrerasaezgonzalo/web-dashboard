import { useNews } from "@/hooks/useNews";
import { Feed } from "@/types";
import { Newspaper } from "lucide-react";
import { memo } from "react";
import { NewsList } from "./NewsList";
import { feeds } from "@/constants";

const News: React.FC = ({}) => {
  const { news, newsLoading, selectedFeed, setSelectedFeed } = useNews();

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
      <NewsList newsLoading={newsLoading} news={news} />
    </div>
  );
};

export default memo(News);
