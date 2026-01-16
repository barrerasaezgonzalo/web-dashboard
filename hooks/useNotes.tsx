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

      for (const n of data) {
        if (n.content.trim() === "") {
          await authFetch(`/api/note?noteId=${n.id}`, {
            method: "DELETE",
          });
        }
      }

      const filtered = data.filter((n) => (n.content ?? "").trim() !== "");
      setNotes(filtered);
      setNote(filtered.length > 0 ? filtered[0] : null);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  }, [userId]);

  const saveNote = useCallback(
    (content: string, noteId: string) => {
      if (!userId) return;
      if (saveTimeout.current) clearTimeout(saveTimeout.current);

      saveTimeout.current = setTimeout(async () => {
        await authFetch(`/api/note`, {
          method: "PUT",
          body: JSON.stringify({ content, noteId }),
        });

        setNotes((prev) =>
          prev.map((n) => (n.id === noteId ? { ...n, content } : n)),
        );
      }, 500);
    },
    [userId],
  );

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
      await authFetch(`/api/note?noteId=${id}`, {
        method: "DELETE",
      });

      setNotes((prev) => prev.filter((n) => n.id !== id));
      setNote((prev) => (prev?.id === id ? null : prev));
      createNote();
    },
    [userId],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;

      setNote((prev) => {
        if (!prev) return prev;
        saveNote(value, prev.id);
        return { ...prev, content: value };
      });
    },
    [saveNote],
  );

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
  };
};
