import { useMovements } from "@/hooks/useMovements";
import { formatCLP } from "@/utils";
import { useState } from "react";

export const BankReconciliation = () => {
  const [bankValue, setBankValue] = useState<number | "">("");
  const { summary, isPrivate } = useMovements();
  const { balance } = summary;
  const difference = bankValue !== "" ? Number(bankValue) - balance : 0;

  return (
    <div id="BankReconciliation" className="p-3 bg-[#1E293C] rounded shadow">
      <h4 className="text-sm font-bold text-gray-300 mb-2 flex justify-between">
        Conciliación Bancaria
        {bankValue !== "" && (
          <span
            className="text-[10px] cursor-pointer text-blue-500 "
            onClick={() => setBankValue("")}
          >
            Limpiar
          </span>
        )}
      </h4>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="text-[10px] uppercase text-gray-300 font-bold">
            Saldo en Banco
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Ej: 500000"
            className={`w-full bg-gray-50 text-black border rounded-xl p-2 pl-2 font-mono text-sm focus:outline-none f
                  ocus:ring-2 transition-all border-slate-700 focus:ring-blue-500/50`}
            value={bankValue}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || /^\d+$/.test(val)) {
                setBankValue(val === "" ? "" : Number(val));
              }
            }}
          />
        </div>

        <div className="flex-1 text-right">
          <label className="text-[10px] uppercase text-gray-300 font-bold">
            Diferencia
          </label>
          <div className="flex items-center justify-end gap-1">
            <p
              className={`text-sm font-bold ${isPrivate ? "privacy-blur" : ""} ${difference === 0 ? "text-gray-400" : difference < 0 ? "text-red-600" : "text-green-600"}`}
            >
              {difference > 0 && "+"}
              {formatCLP(difference)}
            </p>
          </div>
        </div>
      </div>
      {difference !== 0 && bankValue !== "" && (
        <p className="text-[12px] mt-1 text-gray-400">
          {difference < 0
            ? "Te falta ingresar gastos."
            : "Tienes más dinero en el banco que en la app."}
        </p>
      )}
    </div>
  );
};
