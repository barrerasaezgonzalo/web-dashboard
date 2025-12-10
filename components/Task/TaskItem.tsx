import { Task } from "@/types";
import { Draggable, DraggableProvided, DraggableStateSnapshot } from "@hello-pangea/dnd";
import { SquarePen, Save, Trash } from "lucide-react";
import React, { memo, useState, useRef, useEffect } from "react";

interface TaskItemProps {
    todo: Task;
    index: number;
    onTaskToggle: (taskId: string) => void;
    onTaskUpdate: (taskId: string, newTitle: string) => void;
    onTaskRequestRemove: (taskId: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = memo(({
    todo,
    index,
    onTaskToggle,
    onTaskUpdate,
    onTaskRequestRemove,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(todo.title);
    const editInputRef = useRef<HTMLInputElement | null>(null);

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
        setNewTitle(todo.title);
    };

    const handleSaveClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (newTitle.trim()) {
            onTaskUpdate(todo.id ?? "", newTitle);
        }
        setIsEditing(false);
    };

    const handleRemoveClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onTaskRequestRemove(todo.id ?? "");
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && newTitle.trim()) {
            handleSaveClick(e as unknown as React.MouseEvent);
        }
    }

    useEffect(() => {
        if (isEditing && editInputRef.current) {
            editInputRef.current.focus();
        }
    }, [isEditing]);

    return (
        <Draggable
            key={todo.id || index}
            draggableId={String(todo.id)}
            index={index}
        >
            {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`border-b-2 border-gray-200 py-2 pr-4 last:border-b-0 rounded flex items-center justify-between 
            ${todo.in_dev ? "bg-blue-300" : "bg-red-300"} 
            ${snapshot.isDragging ? "bg-blue-200" : ""}`}
                >
                    <div className="flex items-center gap-2 px-2 shrink w-full">
                        <input
                            type="checkbox"
                            aria-label={todo.title}
                            checked={todo.in_dev}
                            onChange={() => todo.id && onTaskToggle(todo.id)} />

                        {!isEditing ? (
                            <h3 className="font-normal text-md pl-2 max-w-[250px]">
                                {todo.title}
                            </h3>
                        ) : (
                            <input
                                aria-label={`Editar ${todo.title}`}
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
                                className="text-black hover:text-gray-500 cursor-pointer"
                                aria-label={`Editar ${todo.title}`}
                                onClick={handleEditClick}
                            >
                                <SquarePen size={25} />
                            </button>
                        ) : (
                            <button
                                className="text-black hover:text-gray-500 cursor-pointer"
                                aria-label={`Guardar ${todo.title}`}
                                onClick={handleSaveClick}
                                disabled={!newTitle.trim()}
                            >
                                <Save size={25} />
                            </button>
                        )}

                        <button
                            className="text-black hover:text-gray-500 cursor-pointer"
                            aria-label={`Eliminar ${todo.title}`}
                            onClick={handleRemoveClick}            >
                            <Trash size={25} />
                        </button>
                    </div>
                </li>
            )}
        </Draggable>
    );
});
