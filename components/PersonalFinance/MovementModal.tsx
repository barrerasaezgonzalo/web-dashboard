import React, { useEffect, useRef } from "react";
import { modalTitles } from "@/constants";
import { getCategoryLabels, getSpecialValue } from "@/utils";
import { MovementModalProps } from "@/types/";
import { usePersonalFinance } from "@/hooks/usePersonalFinance";
import { PlusCircle, Wallet, X } from "lucide-react";

export const MovementModal: React.FC<MovementModalProps> = ({
  modalType,
  category,
  description,
  value,
  errors,
  specialCategoryRules,
  selectedType,
  editingItem,
  onClose,
  onSave,
  onChangeCategory,
  onChangeValue,
  onChangeDescription,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { financial, loading } = usePersonalFinance();

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
              <p className="text-xs text-slate-400">
                Completa los datos del registro
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
              className={`w-full bg-slate-900 border rounded-xl p-3 text-white focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer ${
                errors.category
                  ? "border-red-500 focus:ring-red-500/50"
                  : "border-slate-700 focus:ring-blue-500/50"
              }`}
            >
              <option value="" className="bg-slate-900">
                Selecciona una categoría
              </option>
              {getCategoryLabels(selectedType).map(({ id, label }) => (
                <option key={id} value={id} className="bg-slate-900">
                  {label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-400 text-xs mt-2 font-medium flex items-center gap-1">
                {errors.category}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Valor (sin puntos ni comas)
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold z-10">
                $
              </span>
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
                    onSave();
                  }
                }}
                className={`w-full bg-slate-900 border rounded-xl p-3 pl-8 text-white font-mono text-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.value
                    ? "border-red-500 focus:ring-red-500/50"
                    : "border-slate-700 focus:ring-blue-500/50"
                }`}
              />
            </div>

            {value && !errors.value && (
              <p className="text-blue-400 text-xs mt-2 ml-1 font-medium italic">
                Se guardará como:{" "}
                {new Intl.NumberFormat("es-CL", {
                  style: "currency",
                  currency: "CLP",
                }).format(Number(value))}
              </p>
            )}

            {errors.value && (
              <p className="text-red-400 text-xs mt-2 font-medium flex items-center gap-1">
                {errors.value}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Descripcion (Opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => onChangeDescription(e.target.value)}
              className={`w-full bg-slate-900 border rounded-xl p-3 text-white focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer border-slate-700 focus:ring-blue-500/50`}
            />
          </div>
        </div>

        <div className="p-6 bg-slate-800/80 border-t border-slate-700 flex gap-4">
          <button
            className="flex-1 cursor-pointer bg-slate-700 text-white px-4 py-3 rounded-xl font-bold hover:bg-slate-600 transition-all"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className={`flex-1  px-4 py-3 rounded-xl font-bold transition-all active:scale-95 
              ${
                loading
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
