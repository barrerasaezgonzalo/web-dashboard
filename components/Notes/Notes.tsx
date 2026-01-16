"use client";

import { memo, useState } from "react";
import { StickyNote, Plus, List, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { useNotes } from "@/hooks/useNotes";
import { NotesList } from "./NotesList";
import { Note } from "@/types/";
import { usePrivacyMode } from "@/hooks/usePrivacyMode";

export const NotesComponent: React.FC = () => {
  const { note, setNote, notes, deleteNote, createNote, handleChange } =
    useNotes();
  const [openList, setOpenList] = useState(false);
  const { openToast, closeToast } = useToast();
  const [isMinimized, setIsMinimized] = useState(false);
  const { isPrivate } = usePrivacyMode();

  const handleAddNote = () => {
    openToast({
      message: "¿Querés crear una nueva nota?",
      onConfirm: async () => {
        await createNote();
        closeToast();
      },
      onCancel: closeToast,
    });
  };

  return (
    <div
      className={`bg-amber-300 p-4 rounded shadow transition-all duration-300 ${isMinimized ? "min-h-0" : "min-h-72"}`}
    >
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-xl flex gap-2 font-bold">
          <StickyNote size={25} /> Notas Rápidas
        </h2>
        <div className="flex gap-2">
          {!isMinimized && (
            <>
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
            </>
          )}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded hover:bg-amber-400"
          >
            {isMinimized ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {notes.length === 0 ? (
            <div className="text-center py-10">
              <p>No tienes notas todavía.</p>
              <button
                onClick={handleAddNote}
                className="mt-4 px-4 py-2 bg-amber-400 rounded hover:bg-amber-500"
              >
                Crear primera nota
              </button>
            </div>
          ) : (
            <textarea
              value={note?.content || ""}
              onChange={handleChange}
              rows={12}
              placeholder="Escribe tu nota..."
              className={`w-full p-2 outline-none bg-amber-100 ${isPrivate ? "privacy-blur" : ""} `}
            />
          )}
        </>
      )}

      {notes.length > 0 && (
        <NotesList
          openList={openList}
          notes={notes}
          setOpenList={setOpenList}
          handleDeleteNote={(n: Note) => {
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
          handleClickNote={(n: Note) => {
            setNote(n);
            setOpenList(false);
          }}
        />
      )}
    </div>
  );
};

export const Notes = memo(NotesComponent);
