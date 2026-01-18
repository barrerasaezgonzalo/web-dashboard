import React, { useMemo, useState } from "react";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { MovementListProps } from "@/types/";
import { formatCLP, formatDateToDMY, getCategoryLabel } from "@/utils";
import {
  ChevronDown,
  ChevronUp,
  SquarePen,
  Trash,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface ExtendedProps extends MovementListProps {
  listaParaGráfico: any[];
}

export const MovementList: React.FC<ExtendedProps> = ({
  filtrados,
  isPrivate,
  onEdit,
  onDelete,
  listaParaGráfico = [],
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // --- 1. PROCESAR ESTADÍSTICAS POR LLAVE ÚNICA (TIPO-CATEGORÍA) ---
  const statsPorCategoria = useMemo(() => {
    const data: Record<string, any> = {};
    const hoy = new Date();

    const ultimos6MesesKeys: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(
        Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth() - i, 1),
      );
      ultimos6MesesKeys.push(`${d.getUTCFullYear()}-${d.getUTCMonth()}`);
    }

    listaParaGráfico.forEach((m) => {
      // FILTRO: Solo procesamos tendencias para Gastos
      if (m.type !== "gastos") return;

      // LLAVE ÚNICA para evitar que se mezcle con Ahorros/Ingresos del mismo nombre
      const statsKey = `${m.type}-${m.category}`;

      const d = new Date(m.date);
      const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}`;

      if (!ultimos6MesesKeys.includes(key)) return;

      if (!data[statsKey]) {
        data[statsKey] = {
          puntos: ultimos6MesesKeys.map((k) => ({ mes: k, valor: 0 })),
        };
      }

      const punto = data[statsKey].puntos.find((p: any) => p.mes === key);
      if (punto) punto.valor += m.value;
    });

    // Calcular variación y preparar puntos para el gráfico
    Object.keys(data).forEach((sKey) => {
      const p = data[sKey].puntos;
      const actual = p[5].valor;
      const anterior = p[4].valor;

      let variacion = 0;
      let tieneComparativa = false;

      if (anterior > 0) {
        variacion = ((actual - anterior) / anterior) * 100;
        tieneComparativa = true;
      }

      data[sKey].variacion = variacion;
      data[sKey].tieneComparativa = tieneComparativa;

      const puntosConDatos = p.filter((punto: any) => punto.valor > 0);
      if (puntosConDatos.length === 1) {
        data[sKey].puntosParaGraficar = [
          { ...puntosConDatos[0], mes: "prev" },
          puntosConDatos[0],
        ];
      } else {
        data[sKey].puntosParaGraficar = p.filter(
          (punto: any, index: number) => {
            if (index >= 4) return true;
            return punto.valor > 0;
          },
        );
      }
    });

    return data;
  }, [listaParaGráfico]);

  // --- 2. AGRUPAR LISTA ACTUAL ---
  const groupedData = filtrados.reduce(
    (acc, item) => {
      const key = `${item.type}-${item.category}`; // Usar la misma llave aquí
      if (!acc[key])
        acc[key] = {
          category: item.category,
          type: item.type,
          total: 0,
          items: [],
        };
      acc[key].total += item.value;
      acc[key].items.push(item);
      return acc;
    },
    {} as Record<string, any>,
  );

  const groupedArray = Object.values(groupedData);

  return (
    <div className="flex flex-col gap-2">
      {groupedArray.map((grupo) => {
        // BUSCAMOS EN EL DICCIONARIO USANDO LA LLAVE TIPO-CATEGORIA
        const statsKey = `${grupo.type}-${grupo.category}`;
        const stats = statsPorCategoria[statsKey];
        const variacion = stats?.variacion || 0;
        const tieneComparativa = stats?.tieneComparativa || false;
        const isExpanded = expandedCategory === statsKey;

        return (
          <div
            key={statsKey}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
          >
            <div className="flex items-center p-3 gap-3">
              <button
                onClick={() =>
                  setExpandedCategory(isExpanded ? null : statsKey)
                }
                className="flex flex-col flex-1 min-w-0 text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-blue-600 truncate">
                    {getCategoryLabel(grupo.type, grupo.category)}
                  </span>
                  {isExpanded ? (
                    <ChevronUp size={14} className="text-blue-400" />
                  ) : (
                    <ChevronDown size={14} className="text-gray-300" />
                  )}
                </div>

                <div className="flex items-center gap-1 min-h-[14px]">
                  {grupo.type === "gastos" &&
                  tieneComparativa &&
                  variacion !== 0 ? (
                    <span
                      className={`flex items-center text-[10px] font-bold ${variacion > 0 ? "text-red-500" : "text-emerald-500"}`}
                    >
                      {variacion > 0 ? (
                        <TrendingUp size={10} className="mr-0.5" />
                      ) : (
                        <TrendingDown size={10} className="mr-0.5" />
                      )}
                      {Math.abs(variacion).toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-400 font-medium italic">
                      {grupo.type === "gastos" ? "Nueva categoría" : ""}
                    </span>
                  )}
                </div>
              </button>

              {/* Sparkline solo para Gastos */}
              <div className="h-7 w-16 sm:w-20">
                {grupo.type === "gastos" && stats?.puntosParaGraficar ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.puntosParaGraficar}>
                      <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
                      <Line
                        type="monotone"
                        dataKey="valor"
                        stroke={
                          !tieneComparativa
                            ? "#cbd5e1"
                            : variacion > 0
                              ? "#ef4444"
                              : "#10b981"
                        }
                        strokeWidth={2.5}
                        dot={false}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full flex items-center justify-center opacity-20">
                    <div className="w-8 h-[1px] bg-gray-300" />
                  </div>
                )}
              </div>

              <div className="text-right min-w-[90px]">
                <span
                  className={`font-bold text-sm text-gray-900 ${isPrivate ? "privacy-blur" : ""}`}
                >
                  {formatCLP(grupo.total)}
                </span>
              </div>
            </div>

            {isExpanded && (
              <div className="bg-gray-50 border-t border-gray-100 divide-y divide-gray-200/50">
                {grupo.items.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 pl-11 pr-4"
                  >
                    <span className="text-[11px] font-medium text-gray-400">
                      {formatDateToDMY(item.date)}
                    </span>
                    {item.description && (
                      <span
                        title={item.description}
                        className="text-[10px] text-slate-500 italic leading-tight truncate max-w-[120px] sm:max-w-[200px]"
                      >
                        {item.description}
                      </span>
                    )}
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-sm font-semibold text-gray-700 ${isPrivate ? "privacy-blur" : ""}`}
                      >
                        {formatCLP(item.value)}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1 text-blue-400"
                        >
                          <SquarePen size={15} />
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="p-1 text-red-400"
                        >
                          <Trash size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
