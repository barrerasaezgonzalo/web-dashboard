import { useContext } from "react";
import { formatCLP } from "@/utils";
import { usePrivacyMode } from "@/hooks/usePrivacyMode";
import { Activity } from "lucide-react";
import { PersonalFinanceContext } from "@/context/PersonalFinanceContext";
import { useMovements } from "@/hooks/useMovements";

const PersonalFinance = () => {
  const { movements } = useMovements();
  const { isPrivate } = usePrivacyMode();
  const { summary } = useContext(PersonalFinanceContext)!;
  const { ingresos, gastos, ahorros, saldo } = summary;
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
    <div className="bg-blue-50 text-black p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 border-b pb-2 flex gap-2">
        <Activity size={25} />
        Resumen Mensual
      </h2>
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
      <div className="pt-4">
        {canInvest ? (
          <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-800">
            <p>¡Felicidades! Puedes invertir.</p>
            <p className="text-lg mt-2">Ahorros Dorada: {formatCLP(total)}</p>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
            <h3 className="font-bold">⚠️ Ahorro Dorada Bajo</h3>
            <p>Aún no puedes invertir.</p>
            <div className="mt-2 space-y-1">
              <p>
                <strong>Tienes:</strong> {formatCLP(total)}
              </p>
              <p className="text-red-600">
                <strong>Te faltan:</strong> {formatCLP(falta)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalFinance;
