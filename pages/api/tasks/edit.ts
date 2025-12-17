import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";
import { Task } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Task | Task[] | { error: string }>,
) {
  if (req.method !== "PATCH")
    return res.status(405).json({ error: "Method not allowed" });
  if (req.method === "PATCH") {
    const { id, title, in_dev, date, userId } = req.body;

    const updates: Partial<Task> = {};
    if (title !== undefined) updates.title = title;
    if (in_dev !== undefined) updates.in_dev = in_dev;
    if (date !== undefined) updates.date = date || null;

    const { data, error } = await supabase
      .from("todos")
      .update(updates)
      .eq("auth_data", userId)
      .eq("id", id)
      .select();

    if (error) return res.status(500).json({ error: error.message });
    if (!data) {
      return res.status(404).json({ error: "Task no encontrada" });
    }
    return res.status(200).json(data[0]);
  }
}
