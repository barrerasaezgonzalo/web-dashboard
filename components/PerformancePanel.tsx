"use client";

import React, { useEffect, useState } from "react";
import { Financial, Task } from "@/types";

interface PerformancePanelProps {
  tasks: Task[];
  news: any[];
  financial?: Financial;
}

export const PerformancePanel: React.FC<PerformancePanelProps> = ({
  tasks,
  news,
  financial,
}) => {
  const [tasksLoadTime, setTasksLoadTime] = useState(0);
  const [chartRenderTime, setChartRenderTime] = useState(0);

  const [startTime] = useState(performance.now());

  useEffect(() => {
    setTasksLoadTime(Math.round(performance.now() - startTime));
  }, [tasks]);

  useEffect(() => {
    const renderStart = performance.now();
    const timer = setTimeout(() => {
      setChartRenderTime(Math.round(performance.now() - renderStart));
    }, 0);
    return () => clearTimeout(timer);
  }, [tasks]);

  const getColor = (ms: number) => {
    if (ms < 200) return "bg-green-500";
    if (ms < 500) return "bg-yellow-500";
    return "bg-red-500";
  };

  const maxTasks = 20;
  const maxNews = 10;
  const maxFinancial = 5;

  return (
    <div className="bg-[#4D677E] text-white p-4 rounded shadow ">
      <h2 className="font-bold text-lg mb-4 border-b">Performance Panel</h2>

      <div className="my-4">
        <p className="mb-2">Tareas cargadas: {tasksLoadTime} ms</p>
        <div className="w-full bg-gray-700 h-3 rounded">
          <div
            className={`${getColor(tasksLoadTime)} h-3 rounded`}
            style={{ width: `${Math.min((tasksLoadTime / 1000) * 100, 100)}%` }}
          />
        </div>
      </div>

      <div className="my-4">
        <p className="mb-2">Render TasksPieChart: {chartRenderTime} ms</p>
        <div className="w-full bg-gray-700 h-3 rounded">
          <div
            className={`${getColor(chartRenderTime)} h-3 rounded`}
            style={{
              width: `${Math.min((chartRenderTime / 500) * 100, 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Datos */}
      <div className="my-4">
        <p className="mb-2">Total tareas: {tasks.length}</p>
        <div className="w-full bg-gray-700 h-3 rounded">
          <div
            className="bg-blue-500 h-3 rounded"
            style={{
              width: `${Math.min((tasks.length / maxTasks) * 100, 100)}%`,
            }}
          />
        </div>
      </div>

      <div className="my-4">
        <p className="mb-2">Total noticias: {news.length}</p>
        <div className="w-full bg-gray-700 h-3 rounded">
          <div
            className="bg-purple-500 h-3 rounded"
            style={{
              width: `${Math.min((news.length / maxNews) * 100, 100)}%`,
            }}
          />
        </div>
      </div>

      <div className="my-4">
        <p className="mb-2">
          Total indicadores financieros:{" "}
          {financial ? Object.keys(financial).length : 0}
        </p>
        <div className="w-full bg-gray-700 h-3 rounded">
          <div
            className="bg-yellow-400 h-3 rounded"
            style={{
              width: `${((financial ? Object.keys(financial).length : 0) / 4) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PerformancePanel;
