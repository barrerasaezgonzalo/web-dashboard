"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { useMovements } from "@/hooks/useMovements";
import { formatCLP } from "@/utils";
import { monthlyDataSummary } from "@/types";

export const FinancialPerformanceChart = () => {
  const { movements, isPrivate } = useMovements();

  const data = useMemo(() => {
    const monthlyData: Record<string, monthlyDataSummary> = {};
    movements.forEach((m) => {
      const monthKey = m.date.slice(0, 7);
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          name: monthKey,
          ingresos: 0,
          gastos: 0,
          ahorros: 0,
        };
      }
      monthlyData[monthKey][m.type] += m.value;
    });

    const sortedData = Object.values(monthlyData).sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    return sortedData.slice(-6).map((item) => ({
      ...item,
      displayDate: new Date(item.name + "-01T12:00:00").toLocaleDateString(
        "es-CL",
        {
          month: "short",
          year: "2-digit",
        },
      ),
    }));
  }, [movements]);

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 mt-2">
      <div className="mb-4">
        <h2 className="text-sm font-bold text-gray-600">Rendimiento Mensual</h2>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="displayDate"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />
            <YAxis
              hide={isPrivate}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              cursor={{ fill: "#f9fafb" }}
              contentStyle={{
                borderRadius: "8px",
                fontSize: "14px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              formatter={(value: number) =>
                isPrivate ? "****" : formatCLP(value)
              }
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: 14 }}
            />
            <ReferenceLine y={0} stroke="#e5e7eb" />
            <Bar
              dataKey="ingresos"
              fill="#05DF72"
              radius={[4, 4, 0, 0]}
              barSize={30}
              name="Ingresos"
            />
            <Bar
              dataKey="gastos"
              fill="#FF6467"
              radius={[4, 4, 0, 0]}
              barSize={30}
              name="Gastos"
            />
            <Bar
              dataKey="ahorros"
              fill="#50A2FF"
              radius={[4, 4, 0, 0]}
              barSize={30}
              name="Ahorros"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
