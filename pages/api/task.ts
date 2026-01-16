import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { Task } from "@/types/";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    Task[] | Task | { error: string } | { success: boolean }
  >,
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
  if (error || !user) {
    console.log("Error Auth:", error?.message);
    return res.status(401).json({ error: "Token inválido o sesión expirada" });
  }

  const userId = user.id;

  const { id, title, date, in_dev } = req.body;

  // GET: obtener tasks de un usuario
  if (req.method === "GET") {
    if (!userId) return res.status(400).json({ error: "Faltan datos" });

    const { data, error } = await supabaseAdmin
      .from("tasks")
      .select("*")
      .eq("auth_data", userId)
      .order("in_dev", { ascending: false })
      .order("date", { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data || []);
  }

  // POST: agregar task
  if (req.method === "POST") {
    if (!userId || !title)
      return res.status(400).json({ error: "Faltan datos" });

    const { data, error } = await supabaseAdmin
      .from("tasks")
      .insert([{ title, in_dev: false, auth_data: userId, date }])
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data || []);
  }

  // PATCH: editar task
  if (req.method === "PATCH") {
    if (!id || !userId) return res.status(400).json({ error: "Faltan datos" });

    const updates: Partial<Task> = {};
    if (title !== undefined) updates.title = title;
    if (in_dev !== undefined) updates.in_dev = in_dev;
    if (date !== undefined) updates.date = date;

    const { data, error } = await supabaseAdmin
      .from("tasks")
      .update(updates)
      .eq("auth_data", userId)
      .eq("id", id)
      .select();

    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: "Task no encontrada" });

    return res.status(200).json(data[0]);
  }

  if (req.method === "DELETE") {
    const taskId = req.body.id || req.query.id;

    if (!taskId || !userId) {
      return res.status(400).json({ error: "Faltan IDs para borrar" });
    }
    const { error: deleteError, count } = await supabaseAdmin
      .from("tasks")
      .delete({ count: "exact" })
      .eq("id", taskId)
      .eq("auth_data", userId);

    if (deleteError) {
      return res.status(500).json({ error: deleteError.message });
    }

    if (count === 0) {
      return res
        .status(404)
        .json({ error: "No se encontró la tarea o no tienes permiso" });
    }

    return res.status(200).json({ success: true });
  }
  return res.status(405).json({ error: "Método no permitido" });
}
