import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";
import { Task } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Task[] | { error: string } | { success: boolean }>,
) {
  if (req.method === "DELETE") {
    const { id } = req.body;

    // 1️⃣ Borrar el task
    await supabase.from("todos").delete().eq("id", id);

    // 2️⃣ Obtener todos los tasks restantes ordenados por order
    const { data: remainingTasks } = await supabase
      .from("todos")
      .select("*")
      .order("order", { ascending: true });

    // 3️⃣ Reasignar order secuencial
    if (remainingTasks) {
      const updates = remainingTasks.map((task, index) => ({
        id: task.id,
        order: index + 1, // 1, 2, 3...
      }));

      // 4️⃣ Hacer update en batch
      for (const t of updates) {
        await supabase.from("todos").update({ order: t.order }).eq("id", t.id);
      }
    }

    return res.status(200).json({ success: true });
  }
}
