import { CalendarDays, Info, Trash, X } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/useToast";
import { Toast } from "../ui/Toast";

export const EventModalComponent: React.FC<any> = ({
  date,
  eventsToday = [],
  onConfirm,
  onCancel,
}) => {
  const [localEvents, setLocalEvents] = useState<any[]>([]);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const horas = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0"),
  );
  const minutos = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0"),
  );
  const { toast, openToast, closeToast } = useToast();

  useEffect(() => {
    const formatted = eventsToday.map((ev: any) => {
      let h = "09";
      let m = "00";

      if (ev.hora && typeof ev.hora === "string" && ev.hora.includes(":")) {
        const partes = ev.hora.split(":");
        h = partes[0];
        m = partes[1];
      }

      return {
        ...ev,
        hora: h,
        minutos: m,
      };
    });
    setLocalEvents(formatted);
  }, [eventsToday]);

  const handleUpdate = (index: number, field: string, value: string) => {
    const updated = [...localEvents];
    updated[index] = { ...updated[index], [field]: value };
    setLocalEvents(updated);
  };

  const removeEvent = (index: number) => {
    openToast({
      message: "¿Estás seguro que deseas eliminar el evento?",
      onConfirm: () =>
        setLocalEvents(localEvents.filter((_, i) => i !== index)),
      onCancel: closeToast,
    });
  };

  const addNewEvent = () => {
    const ultimoEvento = localEvents[localEvents.length - 1];
    if (localEvents.length > 0 && !ultimoEvento.titulo.trim()) {
      return;
    }
    setLocalEvents([
      ...localEvents,
      { titulo: "", notas: "", hora: "09", minutos: "00" },
    ]);
  };

  const hayCamposVacios = localEvents.some(
    (ev) => !ev.titulo || ev.titulo.trim() === "",
  );

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40"
        onClick={onCancel}
      />
      <div
        ref={modalRef}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1e293b] text-slate-200 rounded-2xl shadow-2xl z-50 w-full max-w-2xl overflow-hidden border border-slate-700"
      >
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
            <div
              key={idx}
              className="group bg-slate-800/40 border border-slate-700 p-4 rounded-xl hover:border-blue-500/50 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-700">
                    <select
                      value={ev.hora}
                      onChange={(e) =>
                        handleUpdate(idx, "hora", e.target.value)
                      }
                      className="bg-transparent text-sm font-bold focus:outline-none cursor-pointer"
                    >
                      {horas.map((h) => (
                        <option className="text-black" key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                    <span className="text-slate-500">:</span>
                    <select
                      value={ev.minutos}
                      onChange={(e) =>
                        handleUpdate(idx, "minutos", e.target.value)
                      }
                      className="bg-transparent text-sm font-bold focus:outline-none cursor-pointer"
                    >
                      {minutos.map((m) => (
                        <option key={m} value={m} className="bg-slate-800">
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => removeEvent(idx)}
                    className="mt-2 text-slate-500 hover:text-red-400 transition-colors flex justify-center"
                  >
                    <Trash size={16} />
                  </button>
                </div>

                <div className="flex-1 space-y-2">
                  <input
                    required
                    type="text"
                    placeholder="Título del evento..."
                    value={ev.titulo}
                    onChange={(e) =>
                      handleUpdate(idx, "titulo", e.target.value)
                    }
                    className="w-full bg-transparent text-white font-semibold placeholder:text-slate-600 focus:outline-none text-lg"
                  />
                  {!ev.titulo.trim() && (
                    <span className="text-[10px] text-red-500">
                      Este campo es obligatorio
                    </span>
                  )}
                  <textarea
                    placeholder="Detalles adicionales (opcional)"
                    value={ev.notas}
                    onChange={(e) => handleUpdate(idx, "notas", e.target.value)}
                    className="w-full bg-transparent text-slate-400 text-sm placeholder:text-slate-600 focus:outline-none resize-none h-10"
                  />
                  {/* <select
                    value={1}
                    onChange={(e) => { }}
                    className="w-full bg-transparent text-white font-semibold placeholder:text-slate-600 focus:outline-none text-lg"                  >
                    <option value="none">No repetir</option>
                    <option value="monthly">Mensual (mismo día de cada mes)</option>
                  </select> */}
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addNewEvent}
            className="w-full py-3 border-2 border-dashed border-slate-700 rounded-xl text-slate-500 hover:text-blue-400 hover:border-blue-400/50 hover:bg-blue-400/5 transition-all flex items-center justify-center gap-2 font-medium"
          >
            + Agregar nuevo evento
          </button>
        </div>

        <div className="p-6 bg-slate-800/80 border-t border-slate-700 flex gap-4">
          <button
            className="flex-1 bg-slate-700 text-white px-4 py-3 rounded-xl font-bold hover:bg-slate-600 transition-all"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-blue-500 shadow-lg shadow-blue-900/20 transition-all active:scale-95"
            onClick={() => onConfirm(localEvents)}
            disabled={hayCamposVacios}
          >
            Guardar cambios
          </button>
        </div>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          onConfirm={() => {
            toast.onConfirm?.();
            closeToast();
          }}
          onCancel={
            toast.onCancel
              ? () => {
                  toast.onCancel?.();
                  closeToast();
                }
              : undefined
          }
        />
      )}
    </>
  );
};
export const EventModal = memo(EventModalComponent);
