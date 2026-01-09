"use client";

import { TaskInputProps } from "@/types/";
import { CirclePlus, Loader2, Save } from "lucide-react";
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
  isLoading,
}) => {
  return (
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
          disabled={isLoading}
          className="placeholder-black flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100 bg-white"
        />
        <input
          id="task-date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          type="date"
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100 bg-white"
        />
      </div>
      <button
        type="button"
        onClick={editingTaskId ? handleSave : handleAdd}
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600 h-10 flex items-center justify-center min-w-[60px] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? (
          <Loader2 size={25} className="animate-spin" />
        ) : editingTaskId ? (
          <Save size={25} />
        ) : (
          <CirclePlus size={25} />
        )}
      </button>
    </div>
  );
};

export const TaskInput = memo(TaskInputComponent);
