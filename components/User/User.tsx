"use client";

import { formatFechaHora, getDaysRemainingUntil, getGreeting } from "@/utils";
import { useTasks } from "@/hooks/useTasks";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useContext } from "react";
import { usePrivacyMode } from "@/hooks/usePrivacyMode";
import { Eye, EyeOff, LogOut, CalendarDays, Thermometer } from "lucide-react";
import { Toast } from "../ui/Toast";
import { useToast } from "@/hooks/useToast";
import { CalendarContext } from "@/context/CalendarContext";
import { format } from "date-fns";
import { useWheater } from "@/hooks/useWheater";

export const User = () => {
  const { userName, signOut } = useAuth();
  const { isPrivate } = usePrivacyMode();
  const { tasks } = useTasks();
  const { openToast, closeToast } = useToast();
  const [fecha, setFecha] = useState("Cargando...");
  const [hora, setHora] = useState("Cargando...");
  const { events, handleShowModal } = useContext(CalendarContext)!;

  const hoyStr = format(new Date(), "yyyy-MM-dd");
  const eventosHoy = events.filter((ev) => ev.fecha === hoyStr).length;
  const { wheater } = useWheater();

  const handleLogout = () => {
    openToast({
      message: "¿Estás seguro que deseas desconectarte?",
      onConfirm: () => signOut(),
      onCancel: closeToast,
    });
  };

  const pending = tasks.filter((task) => !task.in_dev).length;
  const overdueTasks = tasks.filter(
    (task) => !task.in_dev && task.date && getDaysRemainingUntil(task.date) < 0,
  ).length;
  const in_dev = tasks.filter((task) => task.in_dev).length;
  const statsConfig = [
    { label: "Pendientes", value: pending, color: "text-amber-500" },
    { label: "En Curso", value: in_dev, color: "text-blue-300" },
    { label: "Atrasadas", value: overdueTasks, color: "text-red-500" },
  ];

  useEffect(() => {
    function actualizar() {
      const ahora = new Date();
      const { fecha, hora } = formatFechaHora(ahora);
      setFecha(fecha);
      setHora(hora);
    }
    actualizar();
    const intervalo = setInterval(actualizar, 1000);
    return () => clearInterval(intervalo);
  }, []);

  const handlePrivacyClick = () => {
    const event = new KeyboardEvent("keydown", {
      key: "h",
      code: "KeyH",
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="relative flex flex-col bg-[#4D677E] p-5 rounded-lg shadow-lg gap-6 text-white">
      {/* Botones de acción */}
      <div className="absolute top-3 right-3 flex gap-2">
        <button
          onClick={handlePrivacyClick}
          className="p-2 hover:bg-white/20 rounded-full transition-all"
        >
          {isPrivate ? (
            <Eye size={18} className="text-amber-400" />
          ) : (
            <EyeOff size={18} className="opacity-60" />
          )}
        </button>
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-red-500/30 rounded-full transition-all"
        >
          <LogOut size={18} className="text-red-300" />
        </button>
      </div>

      {/* Saludo y Reloj + Clima */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-light tracking-tight">
            {getGreeting()},{" "}
            <span className="font-bold">
              {isPrivate ? "Gonzalo" : userName?.split(" ")[0]}
            </span>
            !
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex flex-col opacity-80 border-r border-white/20 pr-4">
              <span className="text-sm font-medium">{fecha}</span>
              <span className="text-2xl font-mono font-bold tracking-widest">
                {hora}
              </span>
            </div>
            <div className="flex items-center gap-1 text-amber-300">
              <Thermometer size={25} />
              <span className="text-4xl font-semibold">
                {wheater?.temperatura}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats de Tareas */}
      <div className="grid grid-cols-3 gap-2 bg-black/10 p-3 rounded-md">
        {statsConfig.map((stat, index) => (
          <div
            key={stat.label}
            className={`flex flex-col items-center ${
              index !== statsConfig.length - 1 ? "border-r border-white/10" : ""
            }`}
          >
            <span className="text-xs uppercase opacity-60">{stat.label}</span>
            <b className={`text-xl ${stat.color}`}>
              {isPrivate ? "—" : stat.value}
            </b>
          </div>
        ))}
      </div>

      {/* Placeholder Eventos */}
      <div className="border-t border-white/10 pt-4">
        {eventosHoy === 0 ? (
          <div className="flex items-center gap-2 mb-2 text-white/70">
            <CalendarDays size={18} />
            <h3 className="text-sm font-bold uppercase tracking-wider">
              No hay eventos programados para hoy.
            </h3>
          </div>
        ) : (
          <div
            className="text-sm font-bold uppercase tracking-wider cursor-pointer"
            onClick={() => handleShowModal(new Date())}
          >
            {eventosHoy} {eventosHoy === 1 ? "Evento" : "Eventos"} del día
          </div>
        )}
      </div>
    </div>
  );
};
