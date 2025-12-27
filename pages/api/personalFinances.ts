// pages/api/personalFinances.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";
import { PersonalFinanceMovement } from "@/types/";

type ApiResponse =
  | PersonalFinanceMovement[]
  | { success: boolean }
  | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  const { authData, id } = req.query;

  if (!authData || typeof authData !== "string") {
    return res.status(400).json({ error: "authData es requerido" });
  }

  switch (req.method) {
    case "GET": {
      try {
        const { data, error } = await supabase
          .from("movements")
          .select("*")
          .eq("auth_data", authData)
          .order("date", { ascending: false });

        if (error) throw error;
        return res.status(200).json(data || []);
      } catch (error: any) {
        console.error("Error al obtener personal finances:", error);
        return res.status(500).json({ error: error.message });
      }
    }

    case "POST": {
      const { newMovement } = req.body;
      if (!newMovement) {
        return res.status(400).json({ error: "newMovement es requerido" });
      }
      const { type, date, value, category } = newMovement;
      if (!type || !date || !value || !category) {
        return res
          .status(400)
          .json({ error: "Todos los campos son requeridos" });
      }

      try {
        const { data, error } = await supabase
          .from("movements")
          .insert([{ type, date, value, category, auth_data: authData }])
          .select();

        if (error) throw error;
        return res.status(201).json(data || []);
      } catch (error: any) {
        console.error("Error al crear personal finance:", error);
        return res.status(500).json({ error: error.message });
      }
    }

    case "PATCH": {
      const { updatedMovement } = req.body;
      if (!updatedMovement || !updatedMovement.id) {
        return res
          .status(400)
          .json({ error: "updatedMovement.id es requerido" });
      }

      const { id: movementId, type, value, category, date } = updatedMovement;
      const updates: Partial<PersonalFinanceMovement> = {};
      if (type !== undefined) updates.type = type;
      if (value !== undefined) updates.value = value;
      if (category !== undefined) updates.category = category;
      if (date !== undefined) updates.date = date;

      try {
        const { data, error } = await supabase
          .from("movements")
          .update(updates)
          .eq("auth_data", authData)
          .eq("id", movementId)
          .select();

        if (error) throw error;
        return res.status(200).json(data || []);
      } catch (error: any) {
        console.error("Error al actualizar personal finance:", error);
        return res.status(500).json({ error: error.message });
      }
    }

    case "DELETE": {
      if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "id es requerido para eliminar" });
      }

      try {
        const { error: deleteError } = await supabase
          .from("movements")
          .delete()
          .eq("id", id);

        if (deleteError) throw deleteError;
        return res.status(200).json({ success: true });
      } catch (error: any) {
        console.error("Error al eliminar personal finance:", error);
        return res.status(500).json({ error: error.message });
      }
    }

    default:
      return res.status(405).json({ error: "Método no permitido" });
  }
}
