"use client";

import { useState, memo } from "react";
import { Toast } from "../ui/Toast";
import { useTasks } from "@/hooks/useTasks";
import { TaskInput } from "./TaskInput";
import { TaskList } from "./TaskList";

const Tasks: React.FC = () => {
  const [title, setTitle] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [removingTaskId, setRemovingTaskId] = useState("");
  const {
    toggleTaskInDev,
    tasks,
    addTask,
    editTask,
    updateTasksOrder,
    removeTask,
  } = useTasks();

  const handleAdd = () => {
    if (!title.trim()) return;
    addTask(title);
    setTitle("");
  };

  const handleAddTitle = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && title.trim()) handleAdd();
  };

  return (
    <div
      className="bg-blue-100 p-4 rounded shadow"
      role="region"
      aria-labelledby="tasks-heading"
    >
      {showToast && (
        <Toast
          message="¿Estás seguro que deseas eliminar la tarea?"
          onConfirm={() => {
            removeTask(removingTaskId);
            setShowToast(false);
          }}
          onCancel={() => setShowToast(false)}
        />
      )}

      <h2 id="tasks-heading" className="text-xl font-bold mb-4 border-b">
        Lista de pendientes
      </h2>

      <TaskInput
        title={title}
        setTitle={setTitle}
        onAdd={handleAdd}
        onKeyDown={handleAddTitle}
      />

      <TaskList
        tasks={tasks}
        toggleTaskInDev={toggleTaskInDev}
        editTask={editTask}
        onTaskRequestRemove={(id) => {
          setRemovingTaskId(id);
          setShowToast(true);
        }}
        updateTasksOrder={updateTasksOrder}
      />
    </div>
  );
};

export default memo(Tasks);
