import { EventItemProps } from "@/types";
import { Trash } from "lucide-react";

export const EventItem = ({
  ev,
  idx,
  hours,
  minutes,
  onUpdate,
  onRemove,
}: EventItemProps) => (
  <div className="group bg-slate-800/40 border border-slate-700 p-4 rounded-xl hover:border-blue-500/50 transition-all">
    <div className="flex items-start gap-4">
      <div className="flex flex-col gap-1">
        {ev.id && (
          <input
            type="date"
            value={ev.date}
            onChange={(e) => onUpdate(idx, "date", e.target.value)}
            className={`w-35 bg-slate-900 border rounded-xl p-2 pl-4 text-white font-mono  text-sm focus:outline-none focus:ring-2 transition-all border-slate-700 focus:ring-blue-500/50`}
          />
        )}
        <div className="flex justify-between items-center bg-slate-900 rounded-lg pl-4 pr-4 border border-slate-700">
          <select
            value={ev.hour}
            onChange={(e) => onUpdate(idx, "hour", e.target.value)}
            className="bg-transparent text-sm font-bold focus:outline-none cursor-pointer w-12 h-8"
          >
            {hours.map((h: string) => (
              <option className="bg-slate-800" key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          <span className="text-slate-500 px-1">:</span>
          <select
            value={ev.minutes}
            onChange={(e) => onUpdate(idx, "minutes", e.target.value)}
            className="bg-transparent text-sm font-bold focus:outline-none cursor-pointer w-12 h-8"
          >
            {minutes.map((m: string) => (
              <option key={m} value={m} className="bg-slate-800">
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <input
            required
            type="text"
            placeholder="Título del evento..."
            value={ev.title}
            onChange={(e) => onUpdate(idx, "title", e.target.value)}
            className="flex-1 bg-transparent text-white font-semibold placeholder:text-slate-600 focus:outline-none text-lg"
          />
          <button
            onClick={() => onRemove(idx)}
            className="text-slate-500 hover:text-red-400 transition-colors p-1"
          >
            <Trash size={20} />
          </button>
        </div>
        {!ev.title?.trim() && (
          <p className="text-[12px] text-red-500 -mt-1">
            Este campo es obligatorio
          </p>
        )}
        <textarea
          placeholder="Detalles adicionales (opcional)"
          value={ev.notes}
          onChange={(e) => onUpdate(idx, "notes", e.target.value)}
          className="w-full bg-transparent text-slate-400 text-sm placeholder:text-slate-600 focus:outline-none resize-none h-10 border-t border-slate-700/30 pt-1"
        />
      </div>
    </div>
  </div>
);
