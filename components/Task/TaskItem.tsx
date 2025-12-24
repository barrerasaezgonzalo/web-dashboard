"use client";

import React from "react";
import { DraggableProvided, DraggableStateSnapshot } from "@hello-pangea/dnd";
import { Task } from "@/types";
import { TaskActionButton } from "./TaskActionButton";
import { formatDateToDMY, getDaysRemainingUntil } from "@/utils";
import { GripHorizontal, Rocket, SquarePen, Trash } from "lucide-react";

interface TaskItemProps {
  task: Task;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  handleEdit: (task: Task) => void;
  handleRemove: (taskId: string) => void;
  handleTaskToggle: (taskId: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  provided,
  snapshot,
  handleEdit,
  handleRemove,
  handleTaskToggle,
}) => {
  return (
    <li
      ref={provided.innerRef}
      {...provided.draggableProps}
      className={`flex items-center gap-2 p-2 rounded mb-2 ${
        task.in_dev
          ? "bg-blue-500 text-white"
          : task.date && getDaysRemainingUntil(task.date) < 3
            ? "bg-red-500 text-white"
            : "bg-red-300 text-black"
      }`}
    >
      {/* Drag handle */}
      <TaskActionButton
        icon={<GripHorizontal size={25} className="cursor-grab" />}
        tooltipText="Arrastra para ordenar"
        dragging={snapshot.isDragging}
        onClick={() => {}}
        dragHandleProps={provided.dragHandleProps || undefined}
      />

      {/* Contenido */}
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

      {/* Botones de acción */}
      <div className="flex gap-2">
        <TaskActionButton
          icon={<Rocket size={25} />}
          tooltipText="Comenzar Tarea"
          onClick={() => task.id && handleTaskToggle(task.id)}
          dragging={snapshot.isDragging}
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
