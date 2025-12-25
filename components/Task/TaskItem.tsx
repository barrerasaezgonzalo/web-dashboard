"use client";

import React from "react";
import { TaskItemProps } from "@/types";
import { TaskActionButton } from "./TaskActionButton";
import { formatDateToDMY, getDaysRemainingUntil } from "@/utils";
import { Rocket, SquarePen, Trash } from "lucide-react";

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  handleEdit,
  handleRemove,
  handleTaskToggle,
}) => {
  return (
    <li
      className={`flex items-center gap-2 p-2 rounded mb-2 ${
        task.in_dev
          ? "bg-blue-500 text-white"
          : task.date && getDaysRemainingUntil(task.date) < 1
            ? "bg-red-500 text-white"
            : "bg-red-300 text-black"
      }`}
    >
      <div className="flex flex-col gap-2 px-2 shrink w-full">
        <h3 className="font-normal text-md pl-2 max-w-[250px] select-text">
          {task.title}
        </h3>
        {task.date && (
          <small className="pl-2">
            {formatDateToDMY(task.date)}, Quedan{" "}
            {getDaysRemainingUntil(task.date)} días
          </small>
        )}
      </div>

      <div className="flex gap-2">
        <TaskActionButton
          icon={<Rocket size={25} />}
          tooltipText="Comenzar Tarea"
          onClick={() => task.id && handleTaskToggle(task.id)}
          inDev={task.in_dev}
        />
        <TaskActionButton
          icon={<SquarePen size={25} />}
          tooltipText="Editar Tarea"
          onClick={() => task.id && handleEdit(task)}
        />
        <TaskActionButton
          icon={<Trash size={25} />}
          tooltipText="Eliminar Tarea"
          tooltipType="danger"
          onClick={() => task.id && handleRemove(task.id)}
        />
      </div>
    </li>
  );
};
