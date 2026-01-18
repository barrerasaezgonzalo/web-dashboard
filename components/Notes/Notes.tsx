import { Note } from "@/types";
import { NotesList } from "./NotesList";
import { useNotes } from "@/hooks/useNotes";
import { usePrivacyMode } from "@/hooks/usePrivacyMode";
import { useToast } from "@/hooks/useToast";
import { StickyNote, Plus, List, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export const Notes: React.FC = () => {
  const { note, selectNote, notes, deleteNote, createNote, handleChange } =
    useNotes();
  const [openList, setOpenList] = useState(false);
  const { openToast, closeToast } = useToast();
  const [isMinimized, setIsMinimized] = useState(false);
  const { isPrivate } = usePrivacyMode();

  const handleAddNote = () => {
    openToast({
      message: "¿Quieres crear una nueva nota?",
      onConfirm: async () => {
        await createNote();
        setOpenList(false);
        closeToast();
      },
      onCancel: closeToast,
    });
  };

  return (
    <div
      className={`
    relative 
    bg-linear-to-br 
    from-amber-200 
    to-amber-300 
    rounded 
    shadow 
    transition-all 
    duration-500 
    ${isMinimized ? "min-h-0" : "min-h-120"}
    flex 
    flex-col 
    overflow-hidden
    p-4
    `}
    >
      <div className="flex justify-between items-center pb-2">
        <div className="flex justify-between items-center mb-4 border-b w-full pb-2">
          <h2 className="text-xl flex gap-2 font-bold">
            <StickyNote size={25} />
            Notas Rápidas
          </h2>
          <div className="flex items-center gap-1">
            {!isMinimized && (
              <>
                <button
                  title="Nueva nota"
                  className="p-2 rounded-full hover:bg-amber-400/50 transition-colors text-amber-900"
                  onClick={handleAddNote}
                >
                  <Plus size={20} />
                </button>
                <button
                  title="Historial"
                  onClick={() => setOpenList(!openList)}
                  className={`p-2 rounded-full transition-colors ${openList ? "bg-amber-500 text-white" : "hover:bg-amber-400/50 text-amber-900"}`}
                >
                  <List size={20} />
                </button>
              </>
            )}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 rounded-full hover:bg-amber-400/50 transition-colors text-amber-900 cursor-pointer"
            >
              {isMinimized ? (
                <ChevronDown size={24} />
              ) : (
                <ChevronUp size={24} />
              )}
            </button>
          </div>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex-1 relative p-2">
          <textarea
            value={note?.content || ""}
            onChange={handleChange}
            placeholder="Empieza a escribir algo importante..."
            className={`w-full h-full p-4 resize-none outline-none bg-transparent text-amber-950 placeholder-amber-700/50 leading-relaxed scrollbar-thin scrollbar-thumb-amber-400 ${isPrivate ? "privacy-blur" : ""}`}
          />

          <div className="absolute bottom-2 right-4 text-[10px] uppercase font-bold text-amber-700/60 tracking-widest">
            Auto-guardado
          </div>
        </div>
      )}

      {notes.length > 0 && !isMinimized && openList && (
        <NotesList
          openList={openList}
          notes={notes}
          setOpenList={setOpenList}
          handleDeleteNote={(n: Note) => {
            openToast({
              message: "¿Eliminar esta nota permanentemente?",
              onConfirm: () => {
                deleteNote(n.id);
                closeToast();
              },
              onCancel: closeToast,
            });
          }}
          handleClickNote={(n: Note) => {
            selectNote(n);
            setOpenList(false);
          }}
        />
      )}
    </div>
  );
};
