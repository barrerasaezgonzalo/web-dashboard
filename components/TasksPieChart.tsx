"use client";

import React, { memo, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Task } from "@/types";

interface TasksPieChartProps {
  tasks: Task[];
}

const COLORS = ["#4ade80", "#f87171"];

export const TasksPieChart: React.FC<TasksPieChartProps> = memo(({ tasks }) => {
  const data = useMemo(() => {
    const completed = tasks.filter((t) => t.completed).length;
    const pending = tasks.length - completed;
    const total = tasks.length || 1;
    return [
      {
        name: "Completadas",
        value: completed,
        label: `${completed} (${Math.round((completed / total) * 100)}%)`,
      },
      {
        name: "Pendientes",
        value: pending,
        label: `${pending} (${Math.round((pending / total) * 100)}%)`,
      },
    ];
  }, [tasks]);

  return (
    <div className="w-full h-64 bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-2">Resumen de Tareas</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={(props) => {
              const dataPoint = data[props.index];
              return dataPoint?.label || "";
            }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
});

export default TasksPieChart;
