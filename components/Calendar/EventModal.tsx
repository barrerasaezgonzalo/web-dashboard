// EventModal.tsx
import { CalendarDays, Info, Trash, X } from "lucide-react";
import { memo } from "react";
import { useEventModal } from "@/hooks/useEventModal";
import { EventItem } from "./EventItem";
import { horas, minutos } from "@/constants";

export const EventModalComponent: React.FC<any> = ({
  date,
  eventsToday,
  onConfirm,
  onCancel,
}) => {
  const {
    localEvents,
    isSaving,
    botonBloqueado,
    handleUpdate,
    removeEvent,
    addNewEvent,
    handleConfirm,
  } = useEventModal(eventsToday, date, onConfirm);

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40"
        onClick={onCancel}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1e293b] text-slate-200 rounded-2xl shadow-2xl z-50 w-full max-w-2xl overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 bg-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
              <CalendarDays size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Eventos</h3>
              <p className="text-xs text-slate-400">{date}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 custom-scrollbar">
          {localEvents.length === 0 && (
            <div className="text-center py-10 border-2 border-dashed border-slate-700 rounded-xl">
              <Info className="mx-auto mb-2 text-slate-500" />
              <p className="text-slate-400 text-sm">
                No hay nada programado para hoy
              </p>
            </div>
          )}

          {localEvents.map((ev, idx) => (
            <EventItem
              key={idx}
              ev={ev}
              idx={idx}
              horas={horas}
              minutos={minutos}
              onUpdate={handleUpdate}
              onRemove={removeEvent}
            />
          ))}

          <button
            onClick={addNewEvent}
            className="w-full py-3 border-2 border-dashed border-slate-700 rounded-xl text-slate-500 hover:text-blue-400 hover:border-blue-400/50 hover:bg-blue-400/5 transition-all flex items-center justify-center gap-2 font-medium"
          >
            + Agregar nuevo evento
          </button>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-800/80 border-t border-slate-700 flex gap-4">
          <button
            className="flex-1 bg-slate-700 text-white px-4 py-3 rounded-xl font-bold hover:bg-slate-600 transition-all"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all active:scale-95 ${
              botonBloqueado
                ? "bg-slate-700 text-slate-400 cursor-not-allowed opacity-70"
                : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20"
            }`}
            onClick={handleConfirm}
            disabled={botonBloqueado}
          >
            {isSaving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </>
  );
};

<EventItem />;

export const EventModal = memo(EventModalComponent);
