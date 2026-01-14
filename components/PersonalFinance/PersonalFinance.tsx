import { useContext, useState } from "react";
import { formatCLP } from "@/utils";
import { usePrivacyMode } from "@/hooks/usePrivacyMode";
import { Activity, ChevronDown, ChevronUp } from "lucide-react";
import { PersonalFinanceContext } from "@/context/PersonalFinanceContext";
import { useMovements } from "@/hooks/useMovements";

export const PersonalFinance = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [bancoValue, setBancoValue] = useState<number | "">("");
  const { movements } = useMovements();
  const { isPrivate } = usePrivacyMode();
  const { summary } = useContext(PersonalFinanceContext)!;
  const { ingresos, gastos, ahorros, saldo } = summary;
  const diferencia = bancoValue !== "" ? Number(bancoValue) - saldo : 0;
  const summaryCards = [
    { label: "Ingresos", value: ingresos, color: "bg-green-400" },
    { label: "Gastos", value: gastos, color: "bg-red-400" },
    { label: "Ahorros", value: ahorros, color: "bg-blue-400" },
    { label: "Saldo", value: saldo, color: "bg-indigo-400" },
  ];

  const checkInversionDorada = (movements: any[]) => {
    const VALOR_BASE = 2800000;
    const FACTOR = 6;
    const minimoDorada = VALOR_BASE * FACTOR;

    const totalAhorroDorada = movements
      .filter((m) => m.type === "ahorros" && m.category === "dorada_be")
      .reduce((acc, curr) => {
        const monto = Number(curr.value);
        return acc + (isNaN(monto) ? 0 : monto);
      }, 0);

    const canInvest = totalAhorroDorada >= minimoDorada;
    const falta = minimoDorada - totalAhorroDorada;

    return {
      canInvest,
      total: totalAhorroDorada,
      falta: falta > 0 ? falta : 0,
      minimo: minimoDorada,
    };
  };

  const { total, canInvest, falta } = checkInversionDorada(movements);

  return (
    <div
      className={`bg-white text-black p-4 rounded shadow transition-all duration-300 ${
        isMinimized ? "min-h-0" : "min-h-[200px]"
      } overflow-x-auto`}
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
          className="p-1 hover:bg-blue-100 rounded transition-colors"
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
          <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-dashed border-gray-300">
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
                  type="number"
                  placeholder="Ej: 500000"
                  className="w-full p-2 border rounded text-sm outline-none focus:ring-1 focus:ring-blue-400"
                  value={bancoValue}
                  onChange={(e) =>
                    setBancoValue(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                />
              </div>
              <div className="flex-1 text-right">
                <label className="text-[10px] uppercase text-gray-500 font-bold">
                  Diferencia
                </label>
                <div className="flex items-center justify-end gap-1">
                  <p
                    className={`text-lg font-bold ${
                      diferencia === 0
                        ? "text-gray-400"
                        : diferencia < 0
                          ? "text-red-600"
                          : "text-green-600"
                    } ${isPrivate ? "privacy-blur" : ""}`}
                  >
                    {diferencia > 0 && "+"}
                    {formatCLP(diferencia)}
                  </p>
                </div>
              </div>
            </div>
            {diferencia !== 0 && bancoValue !== "" && (
              <p className="text-[10px] mt-1 text-gray-400 italic">
                {diferencia < 0
                  ? "Te falta ingresar un gasto o comisión."
                  : "Tienes más dinero en el banco que en la app."}
              </p>
            )}
          </div>
          <div className="pt-4 text-md">
            {canInvest ? (
              <div className="p-2">
                <p>Ahora Puedes invertir.</p>
                <p
                  className={`text-md mt-2 ${isPrivate ? "privacy-blur" : ""} `}
                >
                  Ahorros Dorada: {formatCLP(total)}
                </p>
              </div>
            ) : (
              <div className="p-2">
                <h3 className="font-normal">
                  Ahorro Dorada Bajo, aún no puedes invertir!
                </h3>
                <div
                  className={`mt-2 space-y-1 ${isPrivate ? "privacy-blur" : ""}`}
                >
                  <p>
                    <strong>Tienes:</strong> {formatCLP(total)}
                  </p>
                  <p className="text-red-600">
                    <strong>Falta:</strong> {formatCLP(falta)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
