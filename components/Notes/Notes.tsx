"use client";

import { memo, useRef, useState } from "react";
import { StickyNote, Plus, List, Trash } from "lucide-react";
import { useAutoResize } from "@/hooks/useAutoResize";
import { Toast } from "../ui/Toast";
import { useToast } from "@/hooks/useToast";
import { useUser } from "@/context/UserContext";
import { useNotes } from "@/hooks/useNotes";
import { NotesList } from "./NotesList";

export const NotesComponent: React.FC = () => {
  const {
    note,
    setNote,
    saveNote,
    notes,
    deleteNote,
    createNote,
    createNoteAPI,
  } = useNotes();
  const [openList, setOpenList] = useState(false);
  const [search, setSearch] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { toast, openToast, closeToast } = useToast();
  const { userId } = useUser();
  const [isTempNote, setIsTempNote] = useState(false);

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
        rows={6}
        onChange={async (e) => {
          const value = e.target.value;
          if (!note?.id && !isTempNote) {
            setIsTempNote(true);
            const newNote = await createNoteAPI(value, userId!);
            if (newNote) {
              setNote(newNote);
              setIsTempNote(false);
            }
          } else if (note?.id) {
            setNote({ ...note, content: value });
            saveNote(value, note.id);
          }
        }}
        placeholder="Escribe tu nota..."
        className="
          w-full p-2 outline-none resize-none
          focus:bg-amber-200 focus:shadow-lg focus:shadow-amber-300/50
        "
      />

      <NotesList
        openList={openList}
        search={search}
        setSearch={setSearch}
        notes={notes}
        setNote={setNote}
        setOpenList={setOpenList}
        openToast={openToast}
        deleteNote={deleteNote}
        closeToast={closeToast}
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
