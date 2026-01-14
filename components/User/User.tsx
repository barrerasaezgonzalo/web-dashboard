"use client";

import { formatFechaHora, getDaysRemainingUntil, getGreeting } from "@/utils";
import { useTasks } from "@/hooks/useTasks";
import { useUser } from "@/context/UserContext";
import { useData } from "@/hooks/useData";
import { useState, useEffect } from "react";

export const User = () => {
  const { userName } = useUser();
  const { tasks } = useTasks();
  const pending = tasks.filter(
    (task) =>
      !task.in_dev && task.date && getDaysRemainingUntil(task.date) >= 0,
  ).length;
  const overdueTasks = tasks.filter(
    (task) => !task.in_dev && task.date && getDaysRemainingUntil(task.date) < 0,
  ).length;
  const in_dev = tasks.filter((task) => task.in_dev).length;
  const { wheater } = useData();
  const [fecha, setFecha] = useState("Cargando...");
  const [hora, setHora] = useState("Cargando...");

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

  return (
    <div className="flex flex-col bg-[#4D677E] p-4 rounded gap-4">
      <div className="w-full">
        <h1 className="text-2xl text-white">
          {getGreeting()}, {userName?.split(" ")[0]}!{" "}
        </h1>
        <p className="text-md flex gap-3 mt-1">
          <span className="flex gap-1 text-white">
            <b className="text-amber-500 ">{pending}</b> Pendientes
          </span>
          <span className="flex gap-1 text-white">
            <b className="text-blue-100 ">{in_dev}</b> En Curso
          </span>
          <span className="flex items-center gap-1  text-white">
            <b className="text-red-500">{overdueTasks}</b> Atrasadas
          </span>
        </p>
      </div>
      <div className="w-full">
        <span className="text-4xl text-white">{wheater?.temperatura}</span>
        <div className="flex flex-col items-end">
          <span className="text-lg  text-white leading-none">{hora}</span>
          <span className="text-lg text-white ">{fecha}</span>
        </div>
      </div>
    </div>
  );
};
