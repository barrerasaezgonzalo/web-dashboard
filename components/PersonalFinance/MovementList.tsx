import { MovementListProps } from "@/types";
import { formatCLP, formatDateToDMY, getCategoryLabel } from "@/utils";
import { SquarePen, Trash } from "lucide-react";

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
  return (
    <>
      {filtrados.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No hay movimientos en este período
        </div>
      ) : (
        filtrados.map((item) => (
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
    </>
  );
};
