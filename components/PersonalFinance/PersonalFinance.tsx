import { useContext } from "react";
import { formatCLP } from "@/utils";
import { usePrivacyMode } from "@/hooks/usePrivacyMode";
import { Activity } from "lucide-react";
import { PersonalFinanceContext } from "@/context/PersonalFinanceContext";

const PersonalFinance = () => {
  const { isPrivate } = usePrivacyMode();
  const { summary } = useContext(PersonalFinanceContext)!;
  const { ingresos, gastos, ahorros, saldo } = summary;
  const summaryCards = [
    { label: "Ingresos", value: ingresos, color: "bg-green-400" },
    { label: "Gastos", value: gastos, color: "bg-red-400" },
    { label: "Ahorros", value: ahorros, color: "bg-blue-400" },
    { label: "Saldo", value: saldo, color: "bg-indigo-400" },
  ];

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
    </div>
  );
};

export default PersonalFinance;
