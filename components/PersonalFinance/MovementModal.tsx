import React, { useEffect, useRef, useMemo } from "react";
import { modalTitles } from "@/constants";
import { getCategoryLabels, getSpecialValue } from "@/utils";
import { MovementModalProps } from "@/types/";
import { usePersonalFinance } from "@/hooks/usePersonalFinance";
import { PlusCircle, Wallet, X } from "lucide-react";
import { format } from "date-fns";

export const MovementModal: React.FC<MovementModalProps> = ({
  modalType,
  category,
  description,
  value,
  specialCategoryRules,
  selectedType,
  editingItem,
  onClose,
  onSave,
  onChangeCategory,
  onChangeValue,
  onChangeDescription,
  disableSubmit,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { financial } = usePersonalFinance();

  useEffect(() => {
    if (modalType && inputRef.current) {
      inputRef.current.focus();
    }
  }, [modalType]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const refValue = useMemo(() => {
    if (!modalType || !category || editingItem) return "";

    const key = `${modalType}-${category}`;
    const isSpecial = !!specialCategoryRules[key];

    if (isSpecial) {
      const specialValue = getSpecialValue(
        modalType,
        category,
        financial,
        0,
        specialCategoryRules,
      );
      return specialValue.toFixed(0);
    }

    return "";
  }, [category, modalType, financial, editingItem, specialCategoryRules]);

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1e293b] text-slate-200 rounded-2xl shadow-2xl z-50 w-full max-w-md overflow-hidden border border-slate-700">
        <div className="p-6 border-b border-slate-700 bg-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
              {editingItem ? <Wallet size={24} /> : <PlusCircle size={24} />}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {editingItem ? "Editar movimiento" : modalTitles[modalType]}
              </h3>
              <p className="text-sm mt-1 text-slate-400">
                Con fecha {format(new Date(), "dd-MM-yyyy")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Categoría
            </label>
            <select
              value={category}
              onChange={(e) => onChangeCategory(e.target.value)}
              className="w-full bg-transparent border rounded-xl p-3 text-white focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer border-slate-700 focus:ring-blue-500/50"
            >
              <option value="" className="bg-[#1E293B]">
                Selecciona una categoría
              </option>
              {getCategoryLabels(selectedType).map(({ id, label }) => (
                <option key={id} value={id} className="bg-[#1E293B]">
                  {label}
                </option>
              ))}
            </select>
            {category.trim() === "" && (
              <p className="text-[12px] text-red-500 pl-1 mt-1">
                Este campo es obligatorio
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Valor (sin puntos ni comas)
            </label>

            {refValue !== "" && (
              <div className="flex flex-col mb-2 h-6">
                <button
                  type="button"
                  onClick={() => onChangeValue(refValue)}
                  className="text-left w-fit text-sm font-bold text-green-400 hover:text-green-300 transition-colors cursor-pointer"
                >
                  Referencia Sugerida: {refValue} (Usar este valor)
                </button>
              </div>
            )}

            <div className="relative">
              <input
                type="text"
                ref={inputRef}
                placeholder="0"
                value={value}
                onChange={(e) =>
                  onChangeValue(e.target.value.replace(/\D/g, ""))
                }
                onKeyDown={(e) => {
                  if (e.key === "." || e.key === ",") e.preventDefault();
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (!disableSubmit) onSave();
                  }
                }}
                className="flex-1 bg-transparent text-white font-semibold placeholder:text-slate-600 focus:outline-none text-lg w-full"
              />
            </div>

            {value && (
              <p className="text-blue-400 text-xs mt-2 ml-1 font-medium italic">
                Se guardará como:{" "}
                {new Intl.NumberFormat("es-CL", {
                  style: "currency",
                  currency: "CLP",
                }).format(Number(value))}
              </p>
            )}

            {value.trim() === "" && (
              <p className="text-[12px] text-red-500 pl-1 mt-1">
                Este campo es obligatorio
              </p>
            )}
          </div>

          <div>
            <textarea
              value={description}
              placeholder="Descripción (Opcional)"
              onChange={(e) => onChangeDescription(e.target.value)}
              className="w-full bg-transparent text-slate-400 text-sm placeholder:text-slate-600 focus:outline-none resize-none h-10 border-t border-slate-700/30 pt-1"
            />
          </div>
        </div>

        <div className="p-6 bg-slate-800/80 border-t border-slate-700 flex gap-4">
          <button
            type="button"
            className="flex-1 cursor-pointer bg-slate-700 text-white px-4 py-3 rounded-xl font-bold hover:bg-slate-600 transition-all"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={disableSubmit}
            className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all active:scale-95 
              ${
                disableSubmit
                  ? "bg-slate-700 text-slate-400 cursor-not-allowed opacity-70"
                  : "bg-blue-600 cursor-pointer text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20"
              }`}
            onClick={onSave}
          >
            {editingItem ? "Actualizar" : "Guardar"}
          </button>
        </div>
      </div>
    </>
  );
};
