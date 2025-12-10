"use client";

import { useWheater } from "@/hooks/useWheater";
import { useEffect, useState } from "react";

export const Wheater: React.FC = () => {
  const { wheater } = useWheater();
  const [fecha, setFecha] = useState("Cargando...");
  const [hora, setHora] = useState("Cargando...");

  useEffect(() => {
    function actualizarFechaHora() {
      const ahora = new Date();

      setFecha(
        ahora.toLocaleDateString("es-CL", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      );

      setHora(
        ahora.toLocaleTimeString("es-CL", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    }

    actualizarFechaHora();
    const intervalo = setInterval(actualizarFechaHora, 1000);
    return () => clearInterval(intervalo);
  }, []);

  if (!wheater) return null;

  return (
    <div className="bg-[#4D677E] text-white p-4 rounded shadow ">
      <p className="text-center text-6xl mb-4">
        {wheater.temperatura}
      </p>
      <p className="text-center text-2xl">{fecha}</p>
      <p className="text-center text-xl">{hora}</p>
    </div>
  );
};
