"use client";

import { TaskInputProps } from "@/types";
import React, { memo } from "react";

export const TaskInputComponent: React.FC<TaskInputProps> = ({
  title,
  setTitle,
  onAdd,
  onKeyDown,
}) => (
  <div className="flex gap-2 mt-2">
    <label htmlFor="task-input" className="sr-only">
      Agregar nueva tarea
    </label>
    <input
      id="task-input"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      onKeyDown={onKeyDown}
      type="text"
      placeholder="Agregar nueva tarea"
      className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <button
      role="button"
      aria-label="Agregar tarea"
      onClick={onAdd}
      className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
    >
      +
    </button>
  </div>
);
export const TaskInput = memo(TaskInputComponent);
