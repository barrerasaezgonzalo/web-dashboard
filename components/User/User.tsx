"use client";

import {
  formatCLP,
  formatFechaHora,
  getDaysRemainingUntil,
  getGreeting,
} from "@/utils";
import { useTasks } from "@/hooks/useTasks";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useContext, useRef } from "react";
import { usePrivacyMode } from "@/hooks/usePrivacyMode";
import {
  Eye,
  EyeOff,
  LogOut,
  CalendarDays,
  Thermometer,
  PiggyBank,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { CalendarContext } from "@/context/CalendarContext";
import { format } from "date-fns";
import { useWheater } from "@/hooks/useWheater";
import { Task } from "@/types";
import { useMovements } from "@/hooks/useMovements";

export const User = () => {
  const { userName, signOut } = useAuth();
  const { isPrivate } = usePrivacyMode();
  const { tasks } = useTasks();
  const { openToast, closeToast } = useToast();
  const { events, handleShowModal } = useContext(CalendarContext)!;
  const { canInvest, missingGolden } = useMovements();
  const hoyStr = format(new Date(), "yyyy-MM-dd");
  const todayEvents = events.filter((ev) => ev.date === hoyStr).length;
  const { weather } = useWheater();

  const handleLogout = () => {
    openToast({
      message: "¿Estás seguro que deseas desconectarte?",
      onConfirm: () => signOut(),
      onCancel: closeToast,
    });
  };

  const pending = tasks.filter((task: Task) => !task.in_dev).length;
  const overdueTasks = tasks.filter(
    (task: Task) =>
      !task.in_dev && task.date && getDaysRemainingUntil(task.date) < 0,
  ).length;
  const in_dev = tasks.filter((task: Task) => task.in_dev).length;
  const statsConfig = [
    { label: "Pendientes", value: pending, color: "text-amber-500" },
    { label: "En Curso", value: in_dev, color: "text-blue-300" },
    { label: "Atrasadas", value: overdueTasks, color: "text-red-500" },
  ];

  const hourRef = useRef<HTMLSpanElement>(null);
  const dateRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    function actualizar() {
      const now = new Date();
      const { date, hour } = formatFechaHora(now);
      if (hourRef.current) hourRef.current.textContent = hour;
      if (dateRef.current) dateRef.current.textContent = date;
    }
    const interval = setInterval(actualizar, 1000);
    actualizar();

    return () => clearInterval(interval);
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
    <div
      id="user"
      className="relative flex flex-col bg-[#4D677E] p-5 rounded shadow-lg gap-6 text-white"
    >
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

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-light tracking-tight">
            {getGreeting()},{" "}
            <div className="font-bold">{userName?.split(" ")[0]}!</div>
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex flex-col opacity-80 border-r border-white/20 pr-4">
              <span ref={dateRef} className="text-sm font-medium" />
              <span
                ref={hourRef}
                className="text-2xl font-mono font-bold tracking-widest"
              />
            </div>
            <div className="flex items-center ml-[-15px] gap-1 text-amber-300 mr-4">
              <Thermometer size={25} />
              <span className="text-4xl font-semibold">
                {weather?.temperature}
              </span>
            </div>
          </div>
        </div>
      </div>

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

      <div className="border-t border-white/10 pt-2">
        {todayEvents === 0 ? (
          <div className="flex items-center gap-2 text-white/70">
            <CalendarDays size={18} />
            <h3 className="text-sm tracking-wider">
              No hay eventos programados para hoy.
            </h3>
          </div>
        ) : (
          <div
            className={`text-sm tracking-wider cursor-pointer ${isPrivate ? "privacy-blur" : ""} `}
            onClick={() => handleShowModal(new Date())}
          >
            {todayEvents} {todayEvents === 1 ? "Evento" : "Eventos"} del día
          </div>
        )}
      </div>

      <div className="border-t border-white/10 pt-2 -mt-4">
        <div className="flex items-center gap-2  text-white/70">
          <PiggyBank size={18} />
          <h3
            className={`text-sm tracking-wider ${isPrivate ? "privacy-blur" : ""} `}
          >
            {canInvest
              ? "Ahora puedes invertir!"
              : `Dorada bajo el mínimo de inversión: - ${formatCLP(missingGolden)}`}
          </h3>
        </div>
      </div>
    </div>
  );
};
