import { Note, NotesListProps } from "@/types";
import { Trash } from "lucide-react";

export const NotesList: React.FC<NotesListProps> = ({
  openList,
  search,
  setSearch,
  notes,
  setNote,
  setOpenList,
  openToast,
  deleteNote,
  closeToast,
}) => {
  return (
    <>
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
            .filter((n: Note) =>
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
    </>
  );
};
