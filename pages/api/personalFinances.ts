import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";
import { PersonalFinanceMovement } from "@/types/";
import { createClient } from "@supabase/supabase-js";

type ApiResponse =
  | PersonalFinanceMovement[]
  | { success: boolean }
  | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  const { id } = req.query;
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

  switch (req.method) {
    case "GET": {
      try {
        const { data, error } = await supabase
          .from("movements")
          .select("*")
          .eq("auth_data", userId)
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
          .insert([{ type, date, value, category, auth_data: userId }])
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
          .eq("auth_data", userId)
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
          .eq("id", id)
          .eq("auth_data", userId);

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
