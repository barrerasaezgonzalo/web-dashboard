"use client";

import { useData } from "@/hooks/useData";
import { formatFechaHora } from "@/utils";
import { memo, useEffect, useState } from "react";

export const WheaterComponent: React.FC = () => {
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

  if (!wheater) return null;

  return (
    <div className="bg-[#4D677E] text-white p-4 rounded shadow ">
      <p className="text-center text-6xl mb-4">{wheater.temperatura}</p>
      <p className="text-center text-2xl">{fecha}</p>
      <p className="text-center text-xl">{hora}</p>
    </div>
  );
};

export const Wheater = memo(WheaterComponent);
