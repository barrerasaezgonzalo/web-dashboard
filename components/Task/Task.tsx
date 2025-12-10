"use client";

import { useState, memo } from "react";
import { Toast } from "../ui/Toast";
import { Task } from "@/types";
import {
  DragDropContext,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { Skeleton } from "../ui/Skeleton";
import { useTasks } from "@/hooks/useTasks";
import { reorderTasks } from "@/utils";
import { TaskItem } from "./TaskItem";

const Tasks: React.FC = ({ }) => {
  const [title, setTitle] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [removingTaskId, setRemovingTaskId] = useState("");
  const { tasksLoading, toggleTaskInDev, tasks, addTask, editTask, updateTasksOrder, removeTask } = useTasks();

  const handleAdd = () => {
    if (!title.trim()) return;
    addTask(title);
    setTitle("");
  };

  const handleAddTitle = (e: { key: string }) => {
    if (e.key === "Enter" && title.trim()) {
      handleAdd();
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = reorderTasks(
      tasks,
      result.source.index,
      result.destination.index
    );
    updateTasksOrder(reordered);
  };

  if (tasksLoading) {
    return <Skeleton rows={5} height={40} />;
  }

  return (
    <div className="bg-blue-100 p-4 rounded shadow">
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

      <h2 className="text-xl font-bold mb-4 border-b">Lista de pendientes</h2>

      <div className="flex gap-2 mt-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleAddTitle}
          type="text"
          placeholder="Agregar nueva tarea"
          className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
        >
          +
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd} data-testid="drag-drop-context">
        <Droppable droppableId="todos">
          {(provided) => (
            <ul
              className="mt-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {tasks?.map((todo: Task, index) => (
                <TaskItem
                  key={todo.id || index}
                  todo={todo}
                  index={index}
                  onTaskToggle={(taskId) => toggleTaskInDev(taskId)}
                  onTaskUpdate={(taskId, newTitle) => editTask(taskId, newTitle)}
                  onTaskRequestRemove={(taskId) => {
                    setRemovingTaskId(taskId);
                    setShowToast(true);
                  }}
                />
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default memo(Tasks);
