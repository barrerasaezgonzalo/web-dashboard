"use client";

import React from "react";
import { TaskItemProps } from "@/types/";
import { formatDateToDMY, getDaysRemainingUntil } from "@/utils";
import { Rocket, SquarePen, Trash } from "lucide-react";
import { usePrivacyMode } from "@/hooks/usePrivacyMode";

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  handleEdit,
  handleRemove,
  handleTaskToggle,
}) => {
  const { isPrivate } = usePrivacyMode();

  return (
    <li
      className={`flex items-center gap-2 p-2 mb-2 ${isPrivate ? "privacy-blur" : ""}
        ${
          task.in_dev
            ? "border-b-4 border-blue-400 text-blue-500"
            : task.date && getDaysRemainingUntil(task.date) < 0
              ? "border-b-4 border-red-400 text-red-400"
              : "border-b-4 border-white text-white"
        }
      `}
    >
      <div className="flex flex-col gap-2 px-2 shrink w-full">
        <h3 className="font-normal text-sm max-w-[250px] select-text">
          {task.title}
        </h3>
        {task.date && (
          <small className="text-white">
            {formatDateToDMY(task.date)}, Quedan{" "}
            {getDaysRemainingUntil(task.date)} días
          </small>
        )}
      </div>
      <div className="flex gap-1">
        <button
          title="Marcar en Curso"
          onClick={() => task.id && handleTaskToggle(task.id)}
          className="p-1 text-gray-400 cursor-pointer hover:bg-gray-100 rounded"
        >
          <Rocket size={22} />
        </button>
        <button
          title="Editar Tarea"
          onClick={() => task.id && handleEdit(task)}
          className="p-1 text-blue-400 cursor-pointer hover:bg-blue-100 rounded"
        >
          <SquarePen size={22} />
        </button>
        <button
          title="Editar Tarea"
          onClick={() => task.id && handleRemove(task.id)}
          className="p-1 text-red-400 cursor-pointer hover:bg-red-100 rounded"
        >
          <Trash size={22} />
        </button>
      </div>
    </li>
  );
};
