import { NotesListProps } from "@/types/";
import { Heart, Trash } from "lucide-react";
import { useState } from "react";

export const NotesList: React.FC<NotesListProps> = ({
  notes,
  handleDeleteNote,
  handleClickNote,
  handleFavoriteNote,
}) => {
  const [search, setSearch] = useState("");

  const filteredNotes = notes.filter((n) =>
    n.content.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="absolute inset-0 top-[60px] bg-amber-50/95 backdrop-blur-sm z-10 p-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-gray-900 text-sm">Notas Guardadas</span>
        <span className="text-[10px] bg-amber-200 px-2 py-0.5 rounded-full text-amber-800">
          {notes.length} notas
        </span>
      </div>

      <input
        type="text"
        placeholder="Buscar en el historial..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-4 rounded-lg border-2 border-amber-200 bg-white text-sm focus:outline-none focus:border-amber-400 transition-all"
      />

      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
        {filteredNotes.map((n) => (
          <div
            key={n.id}
            className="group flex justify-between items-center p-3 bg-white hover:bg-amber-100 rounded-lg border border-amber-200 shadow-sm transition-all"
          >
            <div
              className="flex-1 cursor-pointer overflow-hidden"
              onClick={() => handleClickNote(n)}
            >
              <p className="text-sm text-amber-900 truncate pr-2 font-medium">
                {n.content || "Nota vacía..."}
              </p>
              <p className="text-[10px] text-amber-600/70 mt-1">
                Haz clic para editar
              </p>
            </div>

            <button
              onClick={() => handleFavoriteNote(n.id)}
              className="group-hover:opacity-100 p-2 -mr-2.5 rounded-md hover:bg-red-50 hover:text-red-500 transition-all text-gray-400 cursor-pointer"
            >
              <Heart
                size={16}
                fill={` ${n.favorite ? "red" : "white"}`}
                strokeWidth={2}
              />
            </button>
            <button
              onClick={() => handleDeleteNote(n)}
              className="p-2 rounded-md hover:bg-red-50 hover:text-red-500 transition-all text-gray-400 cursor-pointer"
            >
              <Trash size={16} />
            </button>
          </div>
        ))}

        {filteredNotes.length === 0 && (
          <div className="text-center py-10">
            <p className="text-sm text-amber-700/50">No hay coincidencias</p>
          </div>
        )}
      </div>
    </div>
  );
};
