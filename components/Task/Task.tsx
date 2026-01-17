"use client";

import { TaskInput } from "./TaskInput";
import { TaskItem } from "./TaskItem";
import { ChevronDown, ChevronUp, ListChecks } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { useState } from "react";
import { Task } from "@/types";

const Tasks: React.FC = () => {
  const {
    tasks,
    tasksLoading,
    title,
    setTitle,
    date,
    setDate,
    editingTaskId,
    inputRef,
    handleAdd,
    handleSave,
    handleEdit,
    handleDelete,
    handleTaskToggle,
    handleKeyDown,
  } = useTasks();

  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div
      className={`bg-blue-100 text-black p-4 rounded shadow transition-all duration-300 ${
        isMinimized ? "min-h-0" : "min-h-[200px]"
      } overflow-x-auto`}
      role="region"
      aria-labelledby="tasks-heading"
    >
      {/* Título */}
      <div
        className={`flex justify-between items-center border-b ${!isMinimized && "mb-4"} pb-2`}
      >
        <h2 id="tasks-heading" className="flex gap-2 text-xl font-bold mb-2">
          <ListChecks size={25} />
          Lista de pendientes
        </h2>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="p-1 hover:bg-blue-100 rounded transition-colors"
        >
          {isMinimized ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
      </div>

      {!isMinimized && (
        <>
          {/* Input */}
          <TaskInput
            title={title}
            setTitle={setTitle}
            date={date}
            setDate={setDate}
            inputRef={inputRef}
            handleKeyDown={handleKeyDown}
            editingTaskId={editingTaskId}
            handleAdd={() => handleAdd(title, date)}
            handleSave={() => handleSave(editingTaskId, title, date)}
            isLoading={tasksLoading}
          />

          {/* Lista de tareas */}
          <ul role="list" className="mt-4">
            {tasks.map((task: Task) => (
              <TaskItem
                key={task.id}
                task={task}
                handleEdit={() => handleEdit(task)}
                handleRemove={() => handleDelete(task.id)}
                handleTaskToggle={() => handleTaskToggle(task.id)}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Tasks;
