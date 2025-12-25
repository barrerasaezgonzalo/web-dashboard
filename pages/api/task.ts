// pages/api/tasks.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";
import { Task } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    Task[] | Task | { error: string } | { success: boolean }
  >,
) {
  const { id, userId, title, date, in_dev } = req.body;
  const queryId = req.query.id as string;

  // GET: obtener tasks de un usuario
  if (req.method === "GET") {
    const authData = req.query.authData as string;
    if (!authData) return res.status(400).json({ error: "Falta authData" });

    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("auth_data", authData)
      .order("date", { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data || []);
  }

  // POST: agregar task
  if (req.method === "POST") {
    if (!userId || !title)
      return res.status(400).json({ error: "Faltan datos" });

    const { data, error } = await supabase
      .from("todos")
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

    const { data, error } = await supabase
      .from("todos")
      .update(updates)
      .eq("auth_data", userId)
      .eq("id", id)
      .select();

    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: "Task no encontrada" });

    return res.status(200).json(data[0]);
  }

  // DELETE: eliminar task
  if (req.method === "DELETE") {
    const taskId = id || queryId;
    if (!taskId) return res.status(400).json({ error: "ID inválido" });

    const { error: deleteError } = await supabase
      .from("todos")
      .delete()
      .eq("id", taskId);

    if (deleteError)
      return res.status(500).json({ error: deleteError.message });

    // Reordenar tasks restantes
    const { data: remainingTasks, error: selectError } = await supabase
      .from("todos")
      .select("*")
      .order("date", { ascending: true });

    if (selectError)
      return res.status(500).json({ error: selectError.message });

    if (remainingTasks) {
      for (let index = 0; index < remainingTasks.length; index++) {
        await supabase
          .from("todos")
          .update({ order: index + 1 })
          .eq("id", remainingTasks[index].id);
      }
    }

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Método no permitido" });
}
