import { useAuth } from "@/context/AuthContext";
import { Note } from "@/types/";
import { useCallback, useEffect, useRef, useState } from "react";
import { authFetch } from "./authFetch";
import { trackError } from "@/utils/logger";

export const useNotes = () => {
  const { userId } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [note, setNote] = useState<Note | null>(null);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const noteRef = useRef(note);
  const editorRef = useRef<HTMLDivElement>(null);

  const fetchNotes = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await authFetch(`/api/note`);
      if (!res.ok) throw new Error("fetchNotes: api Error");
      const data: Note[] = await res.json();

      const validNotes = data.filter((n) => n.content?.trim() !== "");
      setNotes(validNotes);

      setNote(validNotes.length > 0 ? validNotes[0] : null);
    } catch (error) {
      trackError(error, "fetchNotes");
    }
  }, [userId]);

  const createInitialNote = useCallback(async (initialContent: string) => {
    try {
      const res = await authFetch(`/api/note`, {
        method: "POST",
        body: JSON.stringify({ content: initialContent }),
      });
      if (!res.ok) throw new Error("createInitialNote: api Error");
      const newNote = await res.json();
      setNote(newNote);
      setNotes((prev) => [newNote, ...prev]);
    } catch (error) {
      trackError(error, "createInitialNote");
    }
  }, []);

  const handleChange = useCallback(
    (htmlContent: string) => {
      const currentNote = noteRef.current;

      if (!currentNote && htmlContent.trim() !== "" && htmlContent !== "<br>") {
        const tempId = "temp-" + Date.now();
        const tempNote = { id: tempId, content: htmlContent, user_id: userId! };
        setNote(tempNote);
        createInitialNote(htmlContent);
        return;
      }

      if (currentNote) {
        if (saveTimeout.current) clearTimeout(saveTimeout.current);

        saveTimeout.current = setTimeout(async () => {
          if (
            currentNote.id &&
            !currentNote.id.toString().startsWith("temp-")
          ) {
            try {
              const res = await authFetch(`/api/note`, {
                method: "PUT",
                body: JSON.stringify({
                  content: htmlContent,
                  noteId: currentNote.id,
                }),
              });
              if (!res.ok) throw new Error("handleChangeNote: api Error");
              setNotes((prev) =>
                prev.map((n) =>
                  n.id === currentNote.id ? { ...n, content: htmlContent } : n,
                ),
              );
            } catch (error) {
              trackError(error, "handleChangeNote");
            }
          }
        }, 500);
      }
    },
    [userId, setNotes, createInitialNote],
  );

  const createNote = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await authFetch(`/api/note`, {
        method: "POST",
        body: JSON.stringify({ content: "" }),
      });

      if (!res.ok) throw new Error("createNote: api Error");
      const newNote = await res.json();

      setNotes((prev) => [
        newNote,
        ...prev.filter((n) => n.content.trim() !== ""),
      ]);

      setNote(newNote);

      return newNote;
    } catch (error) {
      trackError(error, "createNote");
    }
  }, [userId]);

  const deleteNote = useCallback(
    async (id: string) => {
      const updatedNotes = notes.filter((n) => n.id !== id);
      setNotes(updatedNotes);

      if (note?.id === id) {
        setNote(updatedNotes.length > 0 ? updatedNotes[0] : null);
      }

      try {
        const res = await authFetch(`/api/note?noteId=${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("deleteNote: api Error");
      } catch (error) {
        trackError(error, "deleteNote");
      }

      if (updatedNotes.length === 0) {
        createNote();
      }
    },
    [notes, note, createNote],
  );

  const selectNote = useCallback(
    async (nextNote: Note) => {
      const currentContent = editorRef.current?.innerHTML || "";
      const isActuallyEmpty =
        currentContent.trim() === "" || currentContent === "<br>";

      if (note && note.content.trim() === "" && isActuallyEmpty) {
        const currentId = note.id;
        if (!currentId.toString().startsWith("temp-")) {
          try {
            const res = await authFetch(`/api/note?noteId=${currentId}`, {
              method: "DELETE",
            });
            if (!res.ok) throw new Error("deleteNote: api Error");
          } catch (error) {
            trackError(error, "deleteNote");
          }
        }
        setNotes((prev) => prev.filter((n) => n.id !== currentId));
      }
      setNote(nextNote);
    },
    [note],
  );

  const favoriteNote = async (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;

    const nextFavorite = !note.favorite;

    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, favorite: nextFavorite } : n)),
    );
    try {
      const res = await authFetch("/api/note", {
        method: "PATCH",
        body: JSON.stringify({ noteId: id, favorite: nextFavorite, userId }),
      });
      if (!res.ok) throw new Error("favoriteNote: api Error");
    } catch (error) {
      trackError(error, "favoriteNote");
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, favorite: note.favorite } : n)),
      );
    } finally {
      fetchNotes();
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return {
    note,
    setNote,
    notes,
    createNote,
    deleteNote,
    handleChange,
    selectNote,
    favoriteNote,
    noteRef,
    editorRef,
  };
};
