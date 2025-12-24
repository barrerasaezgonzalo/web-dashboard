"use client";
import * as Icons from "lucide-react";
import { useEffect, useState } from "react";
import { useRoutine } from "@/hooks/useRoutine";
import { useToast } from "@/hooks/useToast";
import { Toast } from "../ui/Toast";

export const Routine: React.FC = () => {
  const { data, toggleDone, getBg } = useRoutine();
  const [currentHour, setCurrentHour] = useState(new Date());
  const routine = data;
  const { toast, openToast, closeToast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => setCurrentHour(new Date()), 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatus = (start: string, end: string) => {
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);
    const nowH = currentHour.getHours();
    const nowM = currentHour.getMinutes();

    const startTime = startH * 60 + startM;
    const endTime = endH * 60 + endM;
    const nowTime = nowH * 60 + nowM;

    if (nowTime >= startTime && nowTime < endTime) return "current";
    if (nowTime > endTime) return "past";
    return "future";
  };

  return (
    <div
      className="bg-blue-50 text-black p-4 rounded shadow"
      role="region"
      aria-labelledby="routine-heading"
    >
      <h2
        id="routine-heading"
        className="text-xl flex gap-2 font-bold mb-4 border-b border-blue-300"
      >
        <Icons.Coffee size={20} /> Rutina
      </h2>

      <ul>
        {routine.map((item) => {
          const status = getStatus(item.start_time, item.end_time);
          const DynamicIcon =
            (Icons as any)[item.icon.replace(/[<>]/g, "")] || Icons.Activity;

          return (
            <li
              key={item.id}
              onClick={() => {
                const toDay = new Date().toISOString().split("T")[0];
                const lastRecord = item.last_updated
                  ? item.last_updated.split("T")[0]
                  : null;
                const allreadyDone = lastRecord === toDay;

                if (item.done) {
                  openToast({
                    message:
                      "¡Felicidades! Ya completaste este hábito de 21 días",
                    onConfirm: () => closeToast(),
                  });
                  return;
                }

                if (allreadyDone) {
                  openToast({
                    message:
                      "Ya registraste tu progreso de hoy. ¡Vuelve mañana!",
                    onConfirm: () => closeToast(),
                  });
                  return;
                }

                toggleDone(item.id, item.done_count, item.last_updated);
              }}
              className={`
          group cursor-pointer relative overflow-hidden
          my-3 p-4 rounded-xl border-2 transition-all active:scale-95
          flex items-center gap-4
          ${item.done ? "bg-gray-100 border-gray-200" : `border-blue-100 hover:border-blue-400 shadow-sm ${getBg(item.done_count, status)}`}
        `}
            >
              <div className="relative flex items-center justify-center shrink-0">
                <DynamicIcon
                  size={28}
                  className={item.done ? "text-gray-400" : "text-blue-600"}
                />
                <svg className="absolute -rotate-90 w-12 h-12">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray={125.6}
                    strokeDashoffset={
                      125.6 - (125.6 * Math.min(item.done_count, 21)) / 21
                    }
                    fill="transparent"
                    className="text-blue-500 transition-all duration-500"
                  />
                </svg>
              </div>

              <div className="flex-1">
                <h3
                  className={`font-bold ${item.done ? "text-gray-400 line-through" : "text-gray-800"}`}
                >
                  {item.label}
                </h3>
                <p className="text-xs text-gray-500">
                  {item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-blue-600">
                  {item.done_count}
                </span>
                <span className="text-[10px] block uppercase text-gray-400 font-bold">
                  Días
                </span>
              </div>

              {item.done && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    Hábito Logrado
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {toast && (
        <Toast
          message={toast.message}
          onConfirm={toast.onConfirm}
          onCancel={toast.onCancel}
        />
      )}
    </div>
  );
};
