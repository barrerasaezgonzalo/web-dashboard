"use client";

import { useState } from "react";
import { formatCLP } from "@/utils";
import { Activity, ChevronDown, ChevronUp } from "lucide-react";
import { useMovements } from "@/hooks/useMovements";

export const PersonalFinance = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const { summary, isPrivate } = useMovements();

  const { ingresos, gastos, ahorros, saldo } = summary;

  const summaryCards = [
    { label: "Ingresos", value: ingresos, color: "bg-green-200" },
    { label: "Gastos", value: gastos, color: "bg-red-200" },
    { label: "Ahorros", value: ahorros, color: "bg-blue-200" },
    { label: "Saldo", value: saldo, color: "bg-indigo-200" },
  ];

  return (
    <div
      id="PersonalFinances"
      className={`bg-[#1E293C] p-4 rounded shadow transition-all duration-300 ${isMinimized ? "min-h-0" : "min-h-[200px]"} text-white`}
    >
      <div
        className={`flex justify-between items-center border-b ${!isMinimized && "mb-4"} pb-2`}
      >
        <h2 className="text-xl font-bold pb-2 flex gap-2 w-full ">
          <Activity size={25} />
          Resumen Mensual
        </h2>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="p-1 hover:bg-blue-100 rounded cursor-pointer"
        >
          {isMinimized ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
      </div>

      {!isMinimized && (
        <>
          <div className="grid grid-cols-2 gap-4">
            {summaryCards.map(({ label, value, color }) => (
              <div
                key={label}
                className={`${color} text-black p-4 rounded-lg shadow h-24`}
              >
                <h3 className="text-sm font-medium">{label}</h3>
                <p
                  className={`text-xl font-bold mt-1 ${isPrivate ? "privacy-blur" : ""}`}
                >
                  {formatCLP(value)}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
