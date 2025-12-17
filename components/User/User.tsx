"use client";

import { Smile } from "lucide-react";
import { getGreeting } from "@/utils";
import { useTasks } from "@/hooks/useTasks";
import { useUser } from "@/context/UserContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Task } from "@/types";

interface TaskStatusChartProps {
  tasks: Task[];
}

export const User: React.FC = ({}) => {
  const { tasks } = useTasks();
  const inDevTask = tasks.filter((task) => task.in_dev).length;
  const pending = tasks.length - inDevTask;
  const { userName } = useUser();

  const chartData = [
    {
      status: "Pendientes",
      count: tasks.filter((task) => !task.in_dev).length,
    },
    {
      status: "En curso",
      count: tasks.filter((task) => task.in_dev).length,
    },
  ];

  return (
    <div
      role="region"
      aria-labelledby="user-heading"
      className={`
        bg-slate-600
        text-white
        p-4
        rounded 
        shadow
      `}
      data-testid="User"
    >
      <p
        id="user-heading"
        className="text-center text-4xl mb-2 mx-4 flex items-left gap-2"
      >
        {getGreeting()}, {userName?.split(" ")[0]}!{" "}
        <Smile className="text-yellow-300" />
      </p>

      <p className="text-center text-lg">
        Tienes <span className="font-bold">{inDevTask}</span> tareas en curso y{" "}
        <span className="font-bold text-red-300">{pending}</span> pendientes.
      </p>

      <div className="flex p-4 bg-gray-800 mt-4">
        <div className="w-full max-w-md">
          {" "}
          {/* Contenedor limitado y centrado */}
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 20, left: -15, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="status"
                tick={{ fill: "#FFFFFF", fontSize: 14 }}
                tickMargin={15}
              />
              <YAxis tick={{ fill: "#e17100", fontSize: 14 }} tickMargin={10} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#fff"
                strokeWidth={2}
                activeDot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
