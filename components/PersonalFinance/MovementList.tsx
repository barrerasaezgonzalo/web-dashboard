import { movementListSize } from "@/constants";
import { MovementListProps } from "@/types/";
import { formatCLP, formatDateToDMY, getCategoryLabel } from "@/utils";
import { ChevronDown, SquarePen, Trash } from "lucide-react";
import { useEffect, useState } from "react";

export const MovementList: React.FC<MovementListProps> = ({
  filtrados,
  isPrivate,
  onEdit,
  onDelete,
}) => {
  const [limit, setLimit] = useState(movementListSize);

  useEffect(() => {
    setLimit(movementListSize);
  }, [filtrados.length]);

  const visibleItems = filtrados.slice(0, limit);

  return (
    <>
      {filtrados.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No hay movimientos</div>
      ) : (
        visibleItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow-sm"
          >
            <div className="w-1/3 flex flex-col">
              <span className="font-medium text-gray-800">
                {getCategoryLabel(item.type, item.category)}
              </span>
              <span className="text-sm text-gray-500">
                {formatDateToDMY(item.date)}
              </span>
            </div>

            <div
              className={`w-1/3 text-center font-bold text-gray-900 ${isPrivate ? "privacy-blur" : ""}`}
            >
              {formatCLP(item.value)}
            </div>

            <div className="w-1/3 flex justify-end gap-2">
              <button
                className="text-blue-500 hover:text-blue-700 cursor-pointer"
                onClick={() => onEdit(item)}
              >
                <SquarePen size={22} />
              </button>
              <button
                className="text-red-400 hover:text-red-700 cursor-pointer"
                onClick={() => onDelete(item.id)}
              >
                <Trash size={22} />
              </button>
            </div>
          </div>
        ))
      )}

      {limit < filtrados.length && (
        <button
          onClick={() => setLimit((prev) => prev + movementListSize)}
          className="mt-2 flex items-center justify-center gap-2 w-full py-2 text-sm text-blue-600 border border-dashed border-blue-200 rounded-lg cursor-pointer"
        >
          <ChevronDown size={18} />
          Mostrar más ({filtrados.length - limit} restantes)
        </button>
      )}
    </>
  );
};
