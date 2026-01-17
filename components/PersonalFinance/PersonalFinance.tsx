"use client";

import { useState } from "react";
import { formatCLP } from "@/utils";
import { Activity, ChevronDown, ChevronUp } from "lucide-react";
import { useMovements } from "@/hooks/useMovements";
import { FinancialPerformanceChart } from "./FinancialTrends";

export const PersonalFinance = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [bancoValue, setBancoValue] = useState<number | "">("");

  const { summary, isPrivate, canInvest, totalDorada, faltaDorada } =
    useMovements();

  const { ingresos, gastos, ahorros, saldo } = summary;
  const diferencia = bancoValue !== "" ? Number(bancoValue) - saldo : 0;

  const summaryCards = [
    { label: "Ingresos", value: ingresos, color: "bg-green-400" },
    { label: "Gastos", value: gastos, color: "bg-red-400" },
    { label: "Ahorros", value: ahorros, color: "bg-blue-400" },
    { label: "Saldo", value: saldo, color: "bg-indigo-400" },
  ];

  return (
    <div
      className={`bg-white text-black p-4 rounded shadow transition-all duration-300 ${isMinimized ? "min-h-0" : "min-h-[200px]"} overflow-x-auto`}
    >
      <div
        className={`flex justify-between items-center border-b ${!isMinimized && "mb-4"} pb-2`}
      >
        <h2 className="text-xl font-bold pb-2 flex gap-2 w-full">
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
                className={`${color} text-white p-4 rounded-lg shadow h-24`}
              >
                <h3 className="text-sm font-medium">{label}</h3>
                <p
                  className={`text-2xl font-bold mt-2 ${isPrivate ? "privacy-blur" : ""}`}
                >
                  {formatCLP(value)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-3 bg-gray-50 rounded-lg shadow">
            <h4 className="text-sm font-bold text-gray-600 mb-2 flex justify-between">
              Conciliación Bancaria
              {bancoValue !== "" && (
                <span
                  className="text-[10px] cursor-pointer text-blue-500 underline"
                  onClick={() => setBancoValue("")}
                >
                  Limpiar
                </span>
              )}
            </h4>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-[10px] uppercase text-gray-500 font-bold">
                  Saldo en Banco
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Ej: 500000"
                  className="w-full p-2 border rounded text-sm outline-none focus:ring-1 focus:ring-blue-400"
                  value={bancoValue}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || /^\d+$/.test(val)) {
                      setBancoValue(val === "" ? "" : Number(val));
                    }
                  }}
                />
              </div>

              <div className="flex-1 text-right">
                <label className="text-[10px] uppercase text-gray-500 font-bold">
                  Diferencia
                </label>
                <div className="flex items-center justify-end gap-1">
                  <p
                    className={`text-lg font-bold ${isPrivate ? "privacy-blur" : ""} ${diferencia === 0 ? "text-gray-400" : diferencia < 0 ? "text-red-600" : "text-green-600"}`}
                  >
                    {diferencia > 0 && "+"}
                    {formatCLP(diferencia)}
                  </p>
                </div>
              </div>
            </div>
            {diferencia !== 0 && bancoValue !== "" && (
              <p className="text-[12px] mt-1 text-gray-400 italic">
                {diferencia < 0
                  ? "Te falta ingresar gastos a ahorro."
                  : "Tienes más dinero en el banco que en la app."}
              </p>
            )}
          </div>

          <div className="pt-4 text-md">
            {canInvest ? (
              <div className="p-2">
                <p className="text-sm font-bold text-green-600">
                  ¡Ahora puedes invertir!
                </p>
                <p
                  className={`text-sm font-bold ${isPrivate ? "privacy-blur" : ""}`}
                >
                  Ahorros Dorada: {formatCLP(totalDorada)}
                </p>
              </div>
            ) : (
              <div className="p-2 ">
                <h3 className="text-sm font-bold text-gray-600 ">
                  Ahorro Dorada bajo el mínimo de inversión.
                </h3>
                <div
                  className={`text-sm font-bold text-gray-600  ${isPrivate ? "privacy-blur" : ""}`}
                >
                  <p>
                    <strong>Actual:</strong> {formatCLP(totalDorada)}
                  </p>
                  <p className="text-red-400">
                    <strong>Falta:</strong> {formatCLP(faltaDorada)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      {!isMinimized && (
        <section>
          <FinancialPerformanceChart />
        </section>
      )}
    </div>
  );
};
