"use client";

import { useEffect, useRef } from "react";
import { useData } from "@/hooks/useData";

export const Notes: React.FC = () => {
  const { note, setNote, saveNote } = useData();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [note]);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setNote(value);
    saveNote(value);
  };

  return (
    <div className="bg-amber-300 p-4 rounded shadow min-h-72">
      <h2 className="text-xl font-bold mb-4 border-b">Nota Rápida</h2>
      <textarea
        ref={textareaRef}
        value={note}
        onChange={handleTextChange}
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

export default Notes;
