"use client";

import { memo, useRef } from "react";
import { useData } from "@/hooks/useData";
import { useAutoResize } from "@/hooks/useAutoResize";
import { handleTextChange } from "@/utils";

export const NotesComponent: React.FC = () => {
  const { note, setNote, saveNote } = useData();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  useAutoResize(textareaRef, note);

  return (
    <div className="bg-amber-300 p-4 rounded shadow min-h-72">
      <h2 className="text-xl font-bold mb-4 border-b">Nota Rápida</h2>
      <textarea
        ref={textareaRef}
        value={note}
        onChange={(e) => handleTextChange(e, setNote, saveNote)}
        className="
          w-full
          p-2
          outline-none
          focus:outline-none
          focus:ring-0
          focus:border-gray-300
          overflow-hidden
          resize-none
          focus:bg-amber-200
          focus:shadow-lg focus:shadow-amber-300/50
        "
        placeholder="Escribe tu nota..."
      />
    </div>
  );
};

export const Notes = memo(NotesComponent);
