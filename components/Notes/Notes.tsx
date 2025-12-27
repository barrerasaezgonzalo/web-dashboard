"use client";

import { memo, useRef, useState } from "react";
import { StickyNote, Plus, List } from "lucide-react";
import { useAutoResize } from "@/hooks/useAutoResize";
import { Toast } from "../ui/Toast";
import { useToast } from "@/hooks/useToast";
import { useNotes } from "@/hooks/useNotes";
import { NotesList } from "./NotesList";

export const NotesComponent: React.FC = () => {
  const { note, setNote, notes, deleteNote, createNote, handleChange } =
    useNotes();
  const [openList, setOpenList] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { toast, openToast, closeToast } = useToast();

  useAutoResize(textareaRef, note?.content || "");

  const handleAddNote = () => {
    openToast({
      message:
        "Esta nota se va a guardar en tu historial. ¿Querés crear una nueva nota?",
      onConfirm: () => {
        createNote();
        closeToast();
      },
      onCancel: closeToast,
    });
  };

  return (
    <div className="bg-amber-300 p-4 rounded shadow min-h-72">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-xl flex gap-2 font-bold">
          <StickyNote size={25} /> Notas Rápidas
        </h2>
        <div className="flex gap-2">
          <button
            className="p-1 rounded hover:bg-amber-400"
            onClick={handleAddNote}
          >
            <Plus size={20} />
          </button>
          <button
            onClick={() => setOpenList((prev) => !prev)}
            className="p-1 rounded hover:bg-amber-400"
          >
            <List size={20} />
          </button>
        </div>
      </div>

      <textarea
        ref={textareaRef}
        value={note?.content || ""}
        onChange={handleChange}
        rows={6}
        placeholder="Escribe tu nota..."
        className="
          w-full p-2 outline-none resize-none
          focus:bg-amber-200 focus:shadow-lg focus:shadow-amber-300/50
        "
      />

      <NotesList
        openList={openList}
        notes={notes}
        setOpenList={setOpenList}
        handleDeleteNote={(n) => {
          openToast({
            message: "¿Querés eliminar esta nota?",
            onConfirm: () => {
              deleteNote(n.id);
              closeToast();
            },
            onCancel: closeToast,
          });
        }}
        openToast={openToast}
        handleClickNote={(n) => {
          setNote(n);
          setOpenList(false);
        }}
      />

      {toast && (
        <Toast
          message={toast.message}
          onConfirm={toast.onConfirm}
          onCancel={toast.onCancel}
        />
      )}
    </div>
  );
};

export const Notes = memo(NotesComponent);
