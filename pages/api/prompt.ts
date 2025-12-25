import type { NextApiRequest, NextApiResponse } from "next";
import Groq from "groq-sdk";

const groqClient = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ data?: string; error?: string }>,
) {
  if (req.method === "POST") {
    const { input } = req.body;

    if (!input) {
      return res
        .status(400)
        .json({ error: "Se requiere el prompt de entrada" });
    }

    try {
      const systemPrompt = `
Toma el siguiente prompt de usuario y genera un prompt mejorado **en formato JSON** con estas claves:
"title", "objective", "instructions", "context", "examples", "expected_output".

Reglas:
- Mantén la intención original del usuario.
- Hazlo claro, útil y accionable.
- No agregues preguntas ni explicaciones adicionales.
- Cada sección debe ser breve y concreta.
- Devuelve **solo el JSON**, sin texto adicional ni explicaciones.

Prompt original: "${input}"
      `;

      const chatCompletion = await groqClient.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: systemPrompt }],
        max_completion_tokens: 512,
      });

      const improvedContent =
        chatCompletion.choices[0]?.message.content?.trim() ||
        "No se pudo generar el prompt mejorado.";

      return res.status(200).json({ data: improvedContent });
    } catch (error) {
      console.error("Error en Groq request:", error);
      return res
        .status(500)
        .json({ error: "Error al generar el prompt mejorado" });
    }
  } else {
    return res.status(405).json({ error: "Método no permitido" });
  }
}
