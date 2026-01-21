// pages/api/note.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";
import { createClient } from "@supabase/supabase-js";
import { Note } from "@/types";
import * as Sentry from "@sentry/nextjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const authHeader = req.headers["authorization"] || req.headers.authorization;
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  if (!authHeader) {
    return res.status(401).json({ error: "No autorizado. Falta token." });
  }
  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: "Token inválido" });

  const { body, query, method } = req;
  const { content, noteId, favorite } = body || {};
  const userId = user.id;

  if (!userId) {
    return res.status(401).json({ error: "No autorizado" });
  }

  try {
    if (method === "GET") {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("auth_data", userId)
        .order("favorite", { ascending: false })
        .order("updated_at", { ascending: false });

      if (error) return res.status(500).json({ error: error.message });

      return res.status(200).json(data || []);
    }

    if (method === "POST") {
      // crear nueva nota en blanco o con contenido
      const { data, error } = await supabase
        .from("notes")
        .insert([{ content: content || "", auth_data: userId }])
        .select()
        .single();

      if (error) return res.status(500).json({ error: error.message });

      return res.status(200).json(data);
    }

    if (method === "PUT") {
      if (!noteId)
        return res.status(400).json({ error: "noteId es requerido" });

      const { data, error } = await supabase
        .from("notes")
        .update({ content })
        .eq("id", noteId)
        .eq("auth_data", userId)
        .select()
        .single();

      if (error) return res.status(500).json({ error: error.message });

      return res.status(200).json(data);
    }

    if (method === "DELETE") {
      const { noteId } = query;
      if (!noteId || !userId)
        return res.status(400).json({ error: "id y authData son requeridos" });

      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", noteId)
        .eq("auth_data", userId);

      if (error) return res.status(500).json({ error: error.message });

      return res.status(200).json({ success: false });
    }

    if (req.method === "PATCH") {
      if (!noteId || !userId)
        return res.status(400).json({ error: "userId y NoteId datos" });

      const updates: Partial<Note> = {};
      if (favorite !== undefined) updates.favorite = favorite;
      if (content !== undefined) updates.content = content;

      const { data, error } = await supabaseAdmin
        .from("notes")
        .update(updates)
        .eq("auth_data", userId)
        .eq("id", noteId)
        .select();

      if (error) return res.status(500).json({ error: error.message });
      if (!data) return res.status(404).json({ error: "Task no encontrada" });

      return res.status(200).json(data[0]);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        endpoint: "/api/note",
        method: req.method,
      },
    });
    return res.status(500).json({ error: error });
  }
}
