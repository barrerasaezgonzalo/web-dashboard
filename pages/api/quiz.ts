import type { NextApiRequest, NextApiResponse } from "next";
import Groq from "groq-sdk";

const groqClient = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY! });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "GET") {
      // Generar pregunta
      const chatCompletion = await groqClient.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: `
eres un programador React Senior y estas ayudando a un semi senior a llegar a senior, 
hazle una sola pregunta sobre los siguientes temas. 
Nunca pidas que se escriba o se revise código. 
Todas las respuestas deben ser de texto, 
`,
          },
        ],
        max_completion_tokens: 150,
      });

      const question =
        chatCompletion.choices[0]?.message.content?.trim() ||
        "No se pudo generar la pregunta.";

      return res.status(200).json({ question: { question } });
    }

    if (req.method === "POST") {
      const { question, answer } = req.body;

      if (!question || !answer) {
        return res
          .status(400)
          .json({ error: "Se requiere pregunta y respuesta" });
      }

      const systemPrompt = `
Usuario respondió a la siguiente pregunta de React nivel senior:
Pregunta: "${question}"
Respuesta: "${answer}"

Genera un **feedback breve** indicando si la respuesta es correcta, parcialmente correcta, o incorrecta, explica de forma concisa por qué y si no es correcta, dale la respuesta correcta.
Devuelve solo el texto del feedback, sin JSON ni explicaciones adicionales.
      `;

      const chatCompletion = await groqClient.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: systemPrompt }],
        max_completion_tokens: 200,
      });

      const feedback =
        chatCompletion.choices[0]?.message.content?.trim() ||
        "No se pudo generar feedback.";

      return res.status(200).json({ feedback });
    }

    return res.status(405).json({ error: "Método no permitido" });
  } catch (err) {
    console.error("Error en /api/quiz:", err);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}
