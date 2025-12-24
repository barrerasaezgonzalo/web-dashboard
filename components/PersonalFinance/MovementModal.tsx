import React, { useEffect, useRef } from "react";
import { modalTitles } from "@/constants";
import { getCategoryLabels, getSpecialValue } from "@/utils";
import { MovementModalProps } from "@/types";

export const MovementModal: React.FC<MovementModalProps> = ({
  modalType,
  category,
  value,
  errors,
  specialCategoryRules,
  financial,
  selectedType,
  editingItem,
  onClose,
  onSave,
  onChangeCategory,
  onChangeValue,
  onKeyDown,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (modalType && inputRef.current) {
      inputRef.current.focus();
    }
  }, [modalType]);

  useEffect(() => {
    if (!modalType || !category) return;

    const key = `${modalType}-${category}`;
    if (specialCategoryRules[key]) {
      const specialValue = getSpecialValue(
        modalType,
        category,
        financial,
        Number(value),
        specialCategoryRules,
      );
      if (Number(value) !== specialValue) {
        onChangeValue(specialValue.toFixed(0));
      }
    }
  }, [category, modalType, financial]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
        <button
          className="absolute top-3 right-4 cursor-pointer text-3xl text-gray-400 hover:text-gray-700 font-bold transition-colors"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
          {editingItem ? "Editar movimiento" : modalTitles[modalType]}
        </h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              value={category}
              onChange={(e) => onChangeCategory(e.target.value)}
              className={`w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 transition-all ${
                errors.category
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            >
              {Object.entries(getCategoryLabels(selectedType)).map(
                ([key, label]) => (
                  <option key={key} value={key}>
                    {label as string}
                  </option>
                ),
              )}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1 font-semibold">
                ⚠️ {errors.category}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor
            </label>
            <input
              type="text"
              ref={inputRef}
              placeholder="Ingresa el monto"
              value={value}
              onChange={(e) => onChangeValue(e.target.value)}
              onKeyDown={onKeyDown}
              className={`w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 transition-all ${
                errors.value
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.value && (
              <p className="text-red-500 text-sm mt-1 font-semibold">
                ⚠️ {errors.value}
              </p>
            )}
          </div>

          <button
            className="bg-blue-500 text-white py-2.5 rounded-lg hover:bg-blue-600 transition-colors font-medium cursor-pointer mt-2"
            onClick={onSave}
          >
            {editingItem ? "Actualizar" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};
