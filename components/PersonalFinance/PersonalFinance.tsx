"use client";

import { formatCLP } from "@/utils";
import { Activity } from "lucide-react";
import { useMovements } from "@/hooks/useMovements";

export const PersonalFinance = () => {
  const { summary, isPrivate } = useMovements();

  const { income, bills, saving, balance } = summary;

  const summaryCards = [
    { label: "Ingresos", value: income, color: "bg-green-200" },
    { label: "Gastos", value: bills, color: "bg-red-200" },
    { label: "Ahorros", value: saving, color: "bg-blue-200" },
    { label: "Saldo", value: balance, color: "bg-indigo-200" },
  ];

  return (
    <div
      id="PersonalFinances"
      className={`bg-[#1E293C] p-4 rounded shadow transition-all duration-300 text-white`}
    >
      <div className={`flex justify-between items-center border-b pb-2 mb-4`}>
        <h2 className="text-xl font-bold pb-2 flex gap-2 w-full ">
          <Activity size={25} />
          Resumen Mensual
        </h2>
      </div>

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
    </div>
  );
};
