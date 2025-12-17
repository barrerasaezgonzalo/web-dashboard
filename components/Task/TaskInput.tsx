"use client";

import { TaskInputProps } from "@/types";
import { CirclePlus, Save } from "lucide-react";
import React, { memo } from "react";

export const TaskInputComponent: React.FC<TaskInputProps> = ({
  title,
  setTitle,
  date,
  setDate,
  inputRef,
  handleKeyDown,
  editingTaskId,
  handleAdd,
  handleSave,
}) => (
  <div className="flex gap-2 mt-2">
    <div className="flex flex-col w-full gap-4">
      <label htmlFor="task-title" className="sr-only">
        Agregar nueva tarea
      </label>
      <input
        ref={inputRef}
        id="task-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        type="text"
        placeholder="Agregar nueva tarea"
        className="placeholder-black flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        id="task-date"
        value={date || ""}
        onChange={(e) => setDate(e.target.value)}
        type="date"
        className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
    <button
      role="button"
      aria-label="Agregar tarea"
      onClick={editingTaskId ? handleSave : handleAdd}
      className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600 h-10 cursor-pointer"
    >
      {editingTaskId ? <Save size={25} /> : <CirclePlus size={25} />}
    </button>
  </div>
);
export const TaskInput = memo(TaskInputComponent);
