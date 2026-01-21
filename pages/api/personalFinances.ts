import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";
import { createClient } from "@supabase/supabase-js";
import * as Sentry from "@sentry/nextjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { id } = req.query;
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
      return res
        .status(401)
        .json({ error: "Token inválido o sesión expirada" });
    }

    const userId = user.id;

    switch (req.method) {
      case "GET": {
        const { data, error } = await supabase
          .from("movements")
          .select("*")
          .eq("auth_data", userId)
          .order("date", { ascending: false });

        if (error) throw error;
        return res.status(200).json(data || []);
      }

      case "POST": {
        const { newMovement } = req.body;
        if (!newMovement)
          return res.status(400).json({ error: "newMovement es requerido" });

        const { type, date, value, category, description } = newMovement;
        if (!type || !date || !value || !category) {
          return res.status(400).json({ error: "Campos incompletos" });
        }

        const { data, error } = await supabase
          .from("movements")
          .insert([
            { type, date, value, category, description, auth_data: userId },
          ])
          .select();

        if (error) throw error;
        return res.status(201).json(data || []);
      }

      case "PATCH": {
        const { updatedMovement } = req.body;
        if (!updatedMovement?.id)
          return res.status(400).json({ error: "ID requerido" });

        const { id: movementId, ...updates } = updatedMovement;
        delete updates.auth_data;

        const { data, error } = await supabase
          .from("movements")
          .update(updates)
          .eq("auth_data", userId)
          .eq("id", movementId)
          .select();

        if (error) throw error;
        return res.status(200).json(data || []);
      }

      case "DELETE": {
        if (!id) return res.status(400).json({ error: "ID requerido" });

        const { error: deleteError } = await supabase
          .from("movements")
          .delete()
          .eq("id", id)
          .eq("auth_data", userId);

        if (deleteError) throw deleteError;
        return res.status(200).json({ success: true });
      }

      default:
        return res.status(405).json({ error: "Método no permitido" });
    }
  } catch (error: unknown) {
    Sentry.captureException(error, {
      tags: {
        endpoint: "/api/personalFinances",
        method: req.method,
      },
      extra: { query: req.query },
    });

    return res.status(500).json({ error: error });
  }
}
