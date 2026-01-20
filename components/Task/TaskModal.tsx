import { TaskModalProps } from "@/types";
import { PlusCircle, SquarePen, X } from "lucide-react";
import React, { useEffect } from "react";

export const TaskModal: React.FC<TaskModalProps> = ({
  onClose,
  title,
  setTitle,
  date,
  setDate,
  onSave,
  editingTaskId,
  isLoading,
  inputRef,
  description,
  setDescription,
  disableSubmit,
}) => {
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
              {editingTaskId ? (
                <SquarePen size={24} />
              ) : (
                <PlusCircle size={24} />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {editingTaskId ? "Editar Tarea" : "Nueva Tarea"}
              </h3>
              <p className="text-xs text-slate-400">Completa los datos</p>
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
              Título
            </label>
            <input
              type="text"
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full bg-slate-900 border rounded-xl p-3 pl-4 text-white font-mono text-sm focus:outline-none focus:ring-2 transition-all border-slate-700 focus:ring-blue-500/50`}
            />
          </div>
          {title.trim().length < 5 && (
            <p className="text-[12px] text-red-500 pl-1 mt-1">
              Título debe tener al menos 5 Letras
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Fecha (Opcional)
            </label>

            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`w-full bg-slate-900 border rounded-xl p-3 pl-4 text-white font-mono text-sm focus:outline-none focus:ring-2 transition-all border-slate-700 focus:ring-blue-500/50`}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Notas (Opcional)
            </label>
            <textarea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full bg-slate-900 border rounded-xl p-3 pl-4 text-white font-mono text-sm focus:outline-none focus:ring-2 transition-all border-slate-700 focus:ring-blue-500/50`}
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
            disabled={disableSubmit}
            className={`flex-1  px-4 py-3 rounded-xl font-bold transition-all active:scale-95 
              ${
                disableSubmit
                  ? "bg-slate-700 text-slate-400 cursor-not-allowed opacity-70"
                  : "bg-blue-600 cursor-pointer text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20"
              }`}
            onClick={onSave}
          >
            {editingTaskId ? "Actualizar" : "Guardar"}
          </button>
        </div>
      </div>
    </>
  );
};
