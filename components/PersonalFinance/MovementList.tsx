import { MovementListProps } from "@/types/";
import { formatCLP, formatDateToDMY, getCategoryLabel } from "@/utils";
import { ChevronDown, SquarePen, Trash } from "lucide-react";
import { useEffect, useState } from "react";

export const MovementList: React.FC<MovementListProps> = ({
  filtrados,
  isPrivate,
  setEditingItem,
  setCategory,
  setValue,
  setModalType,
  setErrors,
  handleDeleteMovement,
}) => {
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    setLimit(10);
  }, [filtrados.length]);

  const visibleItems = filtrados.slice(0, limit);
  const handleLoadMore = () => {
    setLimit((prev) => prev + 10);
  };

  return (
    <>
      {filtrados.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No hay movimientos en este período
        </div>
      ) : (
        visibleItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
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
                className="text-blue-500 cursor-pointer hover:text-blue-700 transition-colors"
                onClick={() => {
                  setEditingItem(item.id);
                  setCategory(item.category);
                  setValue(item.value.toString());
                  setModalType(item.type);
                  setErrors({});
                }}
              >
                <SquarePen size={22} />
              </button>
              <button
                className="text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                onClick={() => handleDeleteMovement(item.id)}
              >
                <Trash size={22} />
              </button>
            </div>
          </div>
        ))
      )}

      {limit < filtrados.length && (
        <button
          onClick={handleLoadMore}
          className="mt-2 flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-dashed border-blue-200"
        >
          <ChevronDown size={18} />
          Mostrar más ({filtrados.length - limit} restantes)
        </button>
      )}

      <div className="text-center text-xs text-gray-400 mt-1">
        Mostrando {visibleItems.length} de {filtrados.length}
      </div>
    </>
  );
};
