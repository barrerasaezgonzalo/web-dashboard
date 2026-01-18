import { useMovements } from "@/hooks/useMovements";
import { formatCLP } from "@/utils";
import { useState } from "react";

export const BankReconciliation = () => {
  const [bancoValue, setBancoValue] = useState<number | "">("");
  const { summary, isPrivate } = useMovements();
  const { saldo } = summary;
  const diferencia = bancoValue !== "" ? Number(bancoValue) - saldo : 0;

  return (
    <div className="p-3 bg-[#1E293C] rounded shadow">
      <h4 className="text-sm font-bold text-gray-300 mb-2 flex justify-between">
        Conciliación Bancaria
        {bancoValue !== "" && (
          <span
            className="text-[10px] cursor-pointer text-blue-500 "
            onClick={() => setBancoValue("")}
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
          <label className="text-[10px] uppercase text-gray-300 font-bold">
            Diferencia
          </label>
          <div className="flex items-center justify-end gap-1">
            <p
              className={`text-sm font-bold ${isPrivate ? "privacy-blur" : ""} ${diferencia === 0 ? "text-gray-400" : diferencia < 0 ? "text-red-600" : "text-green-600"}`}
            >
              {diferencia > 0 && "+"}
              {formatCLP(diferencia)}
            </p>
          </div>
        </div>
      </div>
      {diferencia !== 0 && bancoValue !== "" && (
        <p className="text-[12px] mt-1 text-gray-400">
          {diferencia < 0
            ? "Te falta ingresar gastos."
            : "Tienes más dinero en el banco que en la app."}
        </p>
      )}
    </div>
  );
};
