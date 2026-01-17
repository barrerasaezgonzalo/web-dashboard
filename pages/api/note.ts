// pages/api/note.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";
import { createClient } from "@supabase/supabase-js";

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
  const { content, noteId } = body || {};
  const userId = user.id;

  if (!userId) {
    return res.status(401).json({ error: "No autorizado" });
  }

  try {
    if (method === "GET") {
      // traer todas las notas del usuario
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("auth_data", userId)
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
      let { noteId } = query;
      if (!noteId || !userId)
        return res.status(400).json({ error: "id y authData son requeridos" });

      const { data, error } = await supabase
        .from("notes")
        .delete()
        .eq("id", noteId)
        .eq("auth_data", userId);

      if (error) return res.status(500).json({ error: error.message });

      return res.status(200).json({ success: false });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json({ error: err });
  }
}
