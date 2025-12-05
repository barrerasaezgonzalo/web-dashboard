"use client";

import { memo, useEffect, useState } from "react";

interface ClimaProps {
  clima: string;
}
const Time: React.FC<ClimaProps> = ({ clima }) => {
  const [fecha, setFecha] = useState("Cargando...");
  const [hora, setHora] = useState("Cargando...");

  useEffect(() => {
    function actualizarFechaHora() {
      const ahora = new Date();

      const opciones: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      const fechaFormateada = ahora.toLocaleDateString("es-CL", opciones);
      setFecha(fechaFormateada);

      const horaFormateada = ahora.toLocaleTimeString("es-CL", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setHora(horaFormateada);
    }

    actualizarFechaHora();
    const intervalo = setInterval(actualizarFechaHora, 1000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="bg-[#4D677E] text-white p-4 rounded shadow ">
      <p className="text-center text-6xl mb-4">{clima}</p>
      <p className="text-center text-2xl">{fecha}</p>
      <p className="text-center text-xl">{hora}</p>
    </div>
  );
};

export default memo(Time);
