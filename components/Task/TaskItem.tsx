import { TaskItemProps } from "@/types";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import { SquarePen, Save, Trash, GripHorizontal } from "lucide-react";
import React, { memo, useState, useRef, useEffect } from "react";

export const TaskListComponent: React.FC<TaskItemProps> = ({
  task,
  index,
  onTaskToggle,
  onTaskUpdate,
  onTaskRequestRemove,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);
  const editInputRef = useRef<HTMLInputElement | null>(null);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setNewTitle(task.title);
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (newTitle.trim()) {
      onTaskUpdate(task.id ?? "", newTitle);
    }
    setIsEditing(false);
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTaskRequestRemove(task.id ?? "");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTitle.trim()) {
      handleSaveClick(e as unknown as React.MouseEvent);
    }
  };

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const buttonStyle = "text-black hover:text-gray-500 cursor-pointer";

  return (
    <Draggable
      key={task.id || index}
      draggableId={String(task.id)}
      index={index}
    >
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`border-b-2 border-gray-200 py-2 pr-4 last:border-b-0 rounded flex items-center justify-between 
            ${task.in_dev ? "bg-blue-300" : "bg-red-300"} 
            ${snapshot.isDragging ? "bg-blue-200" : ""}`}
        >
          <div
            {...provided.dragHandleProps}
            className="cursor-grab pl-2 select-none"
          >
            <GripHorizontal size={25} />
          </div>

          <div className="flex items-center gap-2 px-2 shrink w-full">
            <input
              type="checkbox"
              aria-label={task.title}
              checked={task.in_dev}
              onChange={() => task.id && onTaskToggle(task.id)}
            />

            {!isEditing ? (
              <h3
                className="font-normal text-md pl-2 max-w-[250px] select-text"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                {task.title}
              </h3>
            ) : (
              <input
                aria-label={`Editar ${task.title}`}
                ref={editInputRef}
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="
                        mt-2 
                        w-full 
                        text-black  
                        p-2 border 
                        border-gray-300 
                        rounded 
                        focus:outline-none 
                        focus:ring-1 
                        focus:ring-blue-400"
              />
            )}
          </div>

          <div className="flex gap-2">
            {!isEditing ? (
              <button
                className={buttonStyle}
                aria-label={`Editar ${task.title}`}
                onClick={handleEditClick}
              >
                <SquarePen size={25} />
              </button>
            ) : (
              <button
                className={buttonStyle}
                aria-label={`Guardar ${task.title}`}
                onClick={handleSaveClick}
                disabled={!newTitle.trim()}
              >
                <Save size={25} />
              </button>
            )}

            <button
              className={buttonStyle}
              aria-label={`Eliminar ${task.title}`}
              onClick={handleRemoveClick}
            >
              <Trash size={25} />
            </button>
          </div>
        </li>
      )}
    </Draggable>
  );
};
export const TaskItem = memo(TaskListComponent);
