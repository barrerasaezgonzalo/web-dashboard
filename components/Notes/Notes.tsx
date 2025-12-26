"use client";

import { memo, useEffect, useRef, useState } from "react";
import { useData } from "@/hooks/useData";
import { StickyNote, Plus, List, Trash } from "lucide-react";
import { useAutoResize } from "@/hooks/useAutoResize";
import { Toast } from "../ui/Toast";
import { useToast } from "@/hooks/useToast";
import { useUser } from "@/context/UserContext";

export const NotesComponent: React.FC = () => {
  const {
    note,
    setNote,
    saveNote,
    fetchNotes,
    notes,
    deleteNote,
    createNoteAPI,
  } = useData();
  const [openList, setOpenList] = useState(false);
  const [search, setSearch] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { toast, openToast, closeToast } = useToast();
  const { userId } = useUser();
  const [isTempNote, setIsTempNote] = useState(false);

  useAutoResize(textareaRef, note?.content || "");

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const createNote = async () => {
    if (!note) return;

    try {
      // guardamos la nota actual
      await saveNote(note.content, note.id);

      // creamos nueva nota en blanco
      const res = await fetch("/api/note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "" }),
      });

      const newNote = await res.json();
      setNote(newNote);
    } catch (err) {
      console.error("Error creando nueva nota:", err);
    }
  };

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

          // Si no hay nota real, crear nota nueva UNA VEZ
          if (!note?.id && !isTempNote) {
            setIsTempNote(true); // evita múltiples llamadas
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

      {openList && (
        <div className="mt-4 p-2 bg-amber-100 rounded shadow max-h-64 overflow-auto">
          <input
            type="text"
            placeholder="Buscar notas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-1 mb-2 rounded border focus:outline-none focus:ring focus:border-amber-300"
          />

          {notes
            .filter((n) =>
              n.content.toLowerCase().includes(search.toLowerCase()),
            )
            .map((n) => (
              <div
                key={n.id}
                className="flex justify-between items-center p-2 border-b hover:bg-amber-200 cursor-pointer"
              >
                <span
                  className="truncate flex-1"
                  onClick={() => {
                    setNote(n);
                    setOpenList(false);
                  }}
                >
                  {n.content}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openToast({
                      message: "¿Querés eliminar esta nota?",
                      onConfirm: () => {
                        deleteNote(n.id);
                        closeToast();
                      },
                      onCancel: closeToast,
                    });
                  }}
                  className="p-1 rounded hover:bg-red-400"
                >
                  <Trash size={16} />
                </button>
              </div>
            ))}

          {notes.filter((n) =>
            n.content.toLowerCase().includes(search.toLowerCase()),
          ).length === 0 && (
            <p className="text-sm text-gray-500">No se encontraron notas</p>
          )}
        </div>
      )}

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
