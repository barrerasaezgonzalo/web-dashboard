import type { TopSitesProps } from "../types";

export const TopSites: React.FC<TopSitesProps> = ({ topSites }) => {
  return (
    <div className="bg-green-100 p-4 rounded shadow ">
      <h2 className="text-xl font-bold mb-4 border-b">Top Sites</h2>
      <ul>
        {topSites.map((site) => (
          <li
            key={site.id}
            className="border-b border-gray-200 pb-2 last:border-b-0 flex justify-between"
          >
            <a href={site.url} target="_blank" rel="noopener noreferrer">
              <h3 className="font-normal text-md">{site.titulo}</h3>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
