"use client";

import { TaskItem } from "./TaskItem";
import { ChevronDown, ChevronUp, ListChecks, Plus } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { useState } from "react";
import { Task } from "@/types";
import { TaskModal } from "./TaskModal";

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
    handleOpenModal,
    resetForm,
    showModal,
  } = useTasks();

  const [isMinimized, setIsMinimized] = useState(false);
  return (
    <div
      id="tasks"
      className={`bg-[#1E293C] text-white p-4 rounded shadow transition-all duration-300 ${
        isMinimized ? "min-h-0" : "min-h-[200px]"
      } overflow-x-auto`}
      role="region"
      aria-labelledby="tasks-heading"
    >
      <div className="flex justify-between items-center w-full border-b pb-2 text-white">
        <h2 className="text-xl font-bold flex gap-2 items-center">
          <ListChecks size={25} />
          Lista de Tareas
        </h2>
        <div className="flex items-center gap-1">
          <button
            title="Nueva Tarea"
            className="p-2 rounded hover:bg-blue-500 cursor-pointer transition-colors text-white"
            onClick={handleOpenModal}
          >
            <Plus size={20} />
          </button>

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-blue-400 rounded transition-colors cursor-pointer"
          >
            {isMinimized ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
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
      {showModal && (
        <TaskModal
          onClose={resetForm}
          title={title}
          setTitle={setTitle}
          date={date}
          setDate={setDate}
          onSave={editingTaskId ? handleSave : handleAdd}
          isLoading={tasksLoading}
          inputRef={inputRef}
          editingTaskId={editingTaskId || ""}
        />
      )}
    </div>
  );
};

export default Tasks;
