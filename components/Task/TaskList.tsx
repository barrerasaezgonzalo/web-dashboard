"use client";

import React, { memo, useCallback } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { Task } from "@/types";
import { reorderTasks } from "@/utils";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  toggleTaskInDev: (id: string) => void;
  editTask: (id: string, newTitle: string) => void;
  onTaskRequestRemove: (id: string) => void;
  updateTasksOrder: (tasks: Task[]) => void;
}

const TaskListComponent: React.FC<TaskListProps> = ({
  tasks,
  toggleTaskInDev,
  editTask,
  onTaskRequestRemove,
  updateTasksOrder,
}) => {
  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const reordered = reorderTasks(
        tasks,
        result.source.index,
        result.destination.index,
      );

      updateTasksOrder(reordered);
    },
    [tasks, updateTasksOrder],
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="todos">
        {(provided) => (
          <ul
            className="mt-4"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {tasks.map((task, index) => (
              <TaskItem
                key={task.id || index}
                task={task}
                index={index}
                onTaskToggle={toggleTaskInDev}
                onTaskUpdate={editTask}
                onTaskRequestRemove={onTaskRequestRemove}
              />
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};

// Memoizamos el componente para evitar re-renders innecesarios
export const TaskList = memo(TaskListComponent);
