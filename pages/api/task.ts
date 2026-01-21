import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { Task } from "@/types/";
import * as Sentry from "@sentry/nextjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const authHeader =
      req.headers["authorization"] || req.headers.authorization;
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
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: "Token inválido" });
    }

    const userId = user.id;
    const { id, title, date, in_dev, description } = req.body;

    if (req.method === "GET") {
      const { data, error } = await supabaseAdmin
        .from("tasks")
        .select("*")
        .eq("auth_data", userId)
        .order("date", { ascending: true })
        .order("in_dev", { ascending: false });

      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === "POST") {
      if (!title) return res.status(400).json({ error: "Título requerido" });

      const { data, error } = await supabaseAdmin
        .from("tasks")
        .insert([
          { title, in_dev: false, auth_data: userId, date, description },
        ])
        .select();

      if (error) throw error;
      return res.status(201).json(data || []);
    }

    if (req.method === "PATCH") {
      if (!id) return res.status(400).json({ error: "ID requerido" });

      const updates: Partial<Task> = {};
      if (title !== undefined) updates.title = title;
      if (in_dev !== undefined) updates.in_dev = in_dev;
      if (date !== undefined) updates.date = date;
      if (description !== undefined) updates.description = description;

      const { data, error } = await supabaseAdmin
        .from("tasks")
        .update(updates)
        .eq("auth_data", userId)
        .eq("id", id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0)
        return res.status(404).json({ error: "Task no encontrada" });

      return res.status(200).json(data[0]);
    }

    if (req.method === "DELETE") {
      const taskId = req.body.id || req.query.id;
      if (!taskId) return res.status(400).json({ error: "ID requerido" });

      const { error: deleteError, count } = await supabaseAdmin
        .from("tasks")
        .delete({ count: "exact" })
        .eq("id", taskId)
        .eq("auth_data", userId);

      if (deleteError) throw deleteError;
      if (count === 0) return res.status(404).json({ error: "No encontrada" });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Método no permitido" });
  } catch (error: unknown) {
    Sentry.captureException(error, {
      tags: { endpoint: "/api/task", method: req.method },
      extra: { payload: req.body },
    });

    return res.status(500).json({ error: error });
  }
}
