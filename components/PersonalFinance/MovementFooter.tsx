import { MovementFooterProps } from "@/types";
import React from "react";

export const MovementFooter: React.FC<MovementFooterProps> = ({
  total,
  isPrivate,
  handleOpenAddModal,
}) => {
  return (
    <div className="flex justify-between items-center gap-2 mt-4 pt-4 border-t">
      <div
        className={`text-xl font-bold text-gray-800 ${
          isPrivate ? "privacy-blur" : ""
        }`}
      >
        Total: ${total.toLocaleString()}
      </div>
      <button
        onClick={handleOpenAddModal}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 cursor-pointer"
      >
        Agregar
      </button>
    </div>
  );
};
