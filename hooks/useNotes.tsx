import { useAuth } from "@/context/AuthContext";
import { Note } from "@/types/";
import { useCallback, useEffect, useRef, useState } from "react";
import { authFetch } from "./authFetch";

export const useNotes = () => {
  const { userId } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [note, setNote] = useState<Note | null>(null);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchNotes = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await authFetch(`/api/note`);
      const data: Note[] = await res.json();

      const validNotes = data.filter((n) => n.content?.trim() !== "");
      setNotes(validNotes);

      setNote(validNotes.length > 0 ? validNotes[0] : null);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  }, [userId]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;

      if (!note && value.trim() !== "") {
        const tempId = "temp-" + Date.now();
        const tempNote = { id: tempId, content: value, user_id: userId! };
        setNote(tempNote);

        createInitialNote(value);
        return;
      }

      if (note) {
        setNote({ ...note, content: value });

        if (saveTimeout.current) clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(async () => {
          if (!note.id.startsWith("temp-")) {
            await authFetch(`/api/note`, {
              method: "PUT",
              body: JSON.stringify({ content: value, noteId: note.id }),
            });
            setNotes((prev) =>
              prev.map((n) =>
                n.id === note.id ? { ...n, content: value } : n,
              ),
            );
          }
        }, 500);
      }
    },
    [note, userId],
  );

  const createInitialNote = async (initialContent: string) => {
    const res = await authFetch(`/api/note`, {
      method: "POST",
      body: JSON.stringify({ content: initialContent }),
    });
    const newNote = await res.json();
    setNote(newNote);
    setNotes((prev) => [newNote, ...prev]);
  };
  const createNote = useCallback(async () => {
    if (!userId) return;

    const res = await authFetch(`/api/note`, {
      method: "POST",
      body: JSON.stringify({ content: "" }),
    });

    if (!res.ok) return null;

    const newNote = await res.json();

    setNotes((prev) => [
      newNote,
      ...prev.filter((n) => n.content.trim() !== ""),
    ]);

    setNote(newNote);

    return newNote;
  }, [userId]);

  const deleteNote = useCallback(
    async (id: string) => {
      const updatedNotes = notes.filter((n) => n.id !== id);
      setNotes(updatedNotes);

      if (note?.id === id) {
        setNote(updatedNotes.length > 0 ? updatedNotes[0] : null);
      }

      authFetch(`/api/note?noteId=${id}`, { method: "DELETE" }).catch((err) => {
        console.error("Error al borrar:", err);
      });

      if (updatedNotes.length === 0) {
        createNote();
      }
    },
    [notes, note, createNote],
  );

  const selectNote = useCallback(
    async (nextNote: Note) => {
      if (note && note.content.trim() === "") {
        const currentId = note.id;
        authFetch(`/api/note?noteId=${currentId}`, { method: "DELETE" });

        setNotes((prev) => prev.filter((n) => n.id !== currentId));
      }

      setNote(nextNote);
    },
    [note, userId],
  );

  const favoriteNote = async (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;

    const nextFavorite = !note.favorite;

    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, favorite: nextFavorite } : n)),
    );
    try {
      await authFetch("/api/note", {
        method: "PATCH",
        body: JSON.stringify({ noteId: id, favorite: nextFavorite, userId }),
      });
    } catch (error) {
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
  };
};
