import { MovementListProps } from "@/types/";
import { formatCLP, formatDateToDMY, getCategoryLabel } from "@/utils";
import { ChevronDown, ChevronUp, SquarePen, Trash } from "lucide-react";
import { useState } from "react";

export const MovementList: React.FC<MovementListProps> = ({
  filtrados,
  isPrivate,
  onEdit,
  onDelete,
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const groupedData = filtrados.reduce(
    (acc, item) => {
      const key = item.category;
      if (!acc[key]) {
        acc[key] = {
          category: item.category,
          type: item.type,
          total: 0,
          items: [],
        };
      }
      acc[key].total += item.value;
      acc[key].items.push(item);
      return acc;
    },
    {} as Record<string, any>,
  );

  const groupedArray = Object.values(groupedData);

  return (
    <div className="flex flex-col gap-2">
      {filtrados.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No hay movimientos</div>
      ) : (
        groupedArray.map((grupo: any) => {
          const isExpanded = expandedCategory === grupo.category;

          return (
            <div
              key={grupo.category}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-all"
            >
              <button
                onClick={() => toggleCategory(grupo.category)}
                className={`w-full flex justify-between items-center p-3 hover:bg-gray-50 transition-colors ${isExpanded ? "bg-blue-50/50 borde-b" : ""}`}
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronUp size={16} className="text-blue-500" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-400" />
                  )}
                  <span className="font-bold uppercase text-xs tracking-wider text-blue-500 mr-1">
                    {getCategoryLabel(grupo.type, grupo.category)}
                  </span>
                  <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
                    {grupo.items.length}
                  </span>
                </div>
                <span
                  className={`font-bold text-sm ${isExpanded ? "text-blue-600" : "text-gray-900"} ${isPrivate ? "privacy-blur" : ""}`}
                >
                  {formatCLP(grupo.total)}
                </span>
              </button>

              {isExpanded && (
                <div className="divide-y divide-gray-100 bg-gray-50/30 animate-in slide-in-from-top-2 duration-200">
                  {grupo.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 pl-8 hover:bg-white transition-colors border! border-b! border-dashed border-blue-500!"
                    >
                      <div className="flex flex-col">
                        <span className="text-[12px] font-medium text-gray-400">
                          {formatDateToDMY(item.date)}
                        </span>
                      </div>

                      <div
                        className={`font-medium text-sm text-gray-600 ${isPrivate ? "privacy-blur" : ""}`}
                      >
                        {formatCLP(item.value)}
                      </div>

                      <div className="flex gap-2">
                        <button
                          className="p-1.5 text-blue-500 hover:bg-blue-100 rounded-md transition-colors"
                          onClick={() => onEdit(item)}
                        >
                          <SquarePen size={16} />
                        </button>
                        <button
                          className="p-1.5 text-gray-500 hover:bg-red-400 rounded-md transition-colors"
                          onClick={() => onDelete(item.id)}
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};
