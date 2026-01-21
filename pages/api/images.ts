import { put, list, del } from "@vercel/blob";
import type { NextApiRequest, NextApiResponse } from "next";
import * as Sentry from "@sentry/nextjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "GET") {
      const { blobs } = await list();
      return res.status(200).json(blobs);
    }

    if (req.method === "POST") {
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
    }

    if (req.method === "DELETE") {
      const { url } = req.query;
      const safeUrl = Array.isArray(url) ? url[0] : url;

      if (!safeUrl) {
        return res
          .status(400)
          .json({ error: "Se requiere la URL para borrar" });
      }

      await del(safeUrl);
      return res.status(200).json({ message: "Imagen eliminada con éxito" });
    }

    return res.status(405).json({ error: `Método ${req.method} no permitido` });
  } catch (error: any) {
    Sentry.captureException(error, {
      tags: {
        endpoint: "/api/blob",
        method: req.method,
      },
      extra: { query: req.query },
    });

    console.error(`[Blob Error] ${req.method}:`, error);

    return res.status(500).json({
      error:
        error.message || "Ocurrió un error inesperado en el almacenamiento",
    });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
