"use client";

import { TaskInput } from "./TaskInput";
import { TaskItem } from "./TaskItem";
import { ListChecks } from "lucide-react";
import { Toast } from "../ui/Toast";
import { useTasks } from "@/hooks/useTasks";

const Tasks: React.FC = () => {
  const {
    tasks,
    tasksLoading,
    toast,
    closeToast,
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

  return (
    <div
      className="bg-blue-100 p-4 rounded shadow"
      role="region"
      aria-labelledby="tasks-heading"
    >
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          onConfirm={() => {
            toast.onConfirm?.();
            closeToast();
          }}
          onCancel={
            toast.onCancel
              ? () => {
                  toast.onCancel?.();
                  closeToast();
                }
              : undefined
          }
        />
      )}

      {/* Título */}
      <h2
        id="tasks-heading"
        className="flex gap-2 text-xl font-bold mb-4 border-b"
      >
        <ListChecks size={25} />
        Lista de pendientes
      </h2>

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
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            handleEdit={() => handleEdit(task)}
            handleRemove={() => handleDelete(task.id)}
            handleTaskToggle={() => handleTaskToggle(task.id)}
          />
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
