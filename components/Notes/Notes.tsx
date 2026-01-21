import { Note } from "@/types";
import { NotesList } from "./NotesList";
import { useNotes } from "@/hooks/useNotes";
import { usePrivacyMode } from "@/hooks/usePrivacyMode";
import { useToast } from "@/hooks/useToast";
import { StickyNote, Plus, List, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

export const Notes: React.FC = () => {
  const {
    note,
    selectNote,
    notes,
    deleteNote,
    createNote,
    handleChange,
    favoriteNote,
    noteRef,
    editorRef,
  } = useNotes();
  const [openList, setOpenList] = useState(false);
  const { openToast, closeToast } = useToast();
  const [isMinimized, setIsMinimized] = useState(false);
  const { isPrivate } = usePrivacyMode();

  useEffect(() => {
    noteRef.current = note;
    if (editorRef.current && note) {
      if (editorRef.current.innerHTML !== note.content) {
        editorRef.current.innerHTML = note.content || "";
      }
    } else if (editorRef.current && !note) {
      editorRef.current.innerHTML = "";
    }
  }, [note?.id, editorRef, note, noteRef]);

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
      id="notes"
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
        p-4
        `}
    >
      <div className="flex justify-between items-center pb-2">
        <div className="flex justify-between items-center border-b w-full pb-2">
          <h2 className="text-xl flex gap-2 font-bold">
            <StickyNote size={25} />
            Notas Rápidas
          </h2>
          <div className="flex items-center gap-1">
            {!isMinimized && (
              <>
                <button
                  title="Nueva nota"
                  className="p-2 rounded-full hover:bg-amber-400/50 transition-colors text-amber-900 cursor-pointer"
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
              className="p-2 rounded-full hover:bg-amber-400/50 transition-colors text-amber-900 cursor-pointer"
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
          {notes.length === 0 ? (
            <div className="w-full flex flex-col items-center text-center h-full p-4 resize-none outline-none bg-transparent text-amber-950 placeholder-amber-700/50 leading-relaxed scrollbar-thin  scrollbar-thumb-amber-400">
              <p>No tienes notas todavía.</p>
              <button
                onClick={handleAddNote}
                className="mt-4 px-4 py-2 bg-amber-400 rounded text-[12px] uppercase font-normal "
              >
                Crea tu primera nota
              </button>
            </div>
          ) : (
            <>
              <div
                ref={editorRef}
                contentEditable={!isPrivate}
                onInput={(e) => handleChange(e.currentTarget.innerHTML)}
                data-placeholder="Escribe tu nota..."
                className={`w-full p-2 outline-none bg-amber-100 min-h-[300px] text-slate-800
                  ${isPrivate ? "privacy-blur" : ""} 
                  empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400
                `}
              />
              <div className="absolute bottom-2 right-4 text-[10px] uppercase font-bold text-amber-700/60 tracking-widest">
                Auto-guardado
              </div>
            </>
          )}
        </div>
      )}

      {notes.length > 0 && !isMinimized && openList && (
        <NotesList
          openList={openList}
          notes={notes}
          setOpenList={setOpenList}
          handleFavoriteNote={(id: string) => {
            openToast({
              message: "¿Marcar/Desmarcar esta nota como favorita??",
              onConfirm: () => {
                favoriteNote(id);
                setTimeout(() => {
                  openToast({
                    message: "Nota marcada/desmarcada como favorita",
                  });
                }, 100);
                closeToast();
              },
              onCancel: closeToast,
            });
          }}
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
