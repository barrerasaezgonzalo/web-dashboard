// pages/api/tasks/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";
import { Task } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Task[] | { error: string } | { success: boolean }>,
) {
  const { id } = req.query; 

  if (req.method === "DELETE") {
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "ID inválido" });
    }
    
    const { error: deleteError } = await supabase
      .from("todos")
      .delete()
      .eq("id", id);

    if (deleteError) return res.status(500).json({ error: deleteError.message });

    const { data: remainingTasks, error: selectError } = await supabase
      .from("todos")
      .select("*")
      .order("order", { ascending: true });

    if (selectError) return res.status(500).json({ error: selectError.message });

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

  res.status(405).json({ error: "Método no permitido" });
}
