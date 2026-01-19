import { put, list, del } from "@vercel/blob";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const { blobs } = await list();
      return res.status(200).json(blobs);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: "Ocurrió un error inesperado" });
    }
  }

  if (req.method === "POST") {
    try {
      const { filename } = req.query;
      const safeFilename = Array.isArray(filename) ? filename[0] : filename;
      if (!safeFilename) {
        return res
          .status(400)
          .json({ error: "El nombre del archivo es requerido" });
      }
      const blob = await put(safeFilename, req, {
        access: "public",
      });

      return res.status(200).json(blob);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: "Ocurrió un error inesperado" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { url } = req.query;
      if (!url) {
        return res
          .status(400)
          .json({ error: "Se requiere la URL para borrar" });
      }
      await del(url);
      return res.status(200).json({ message: "Imagen eliminada con éxito" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: "Ocurrió un error inesperado" });
    }
  }

  return res.status(405).json({ error: `Método ${req.method} no permitido` });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
