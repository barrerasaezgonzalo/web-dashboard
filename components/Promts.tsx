"use client";

import { useState } from "react";
import { Toast } from "./Toast";
import { PromptsData } from "@/types";

export const Promts: React.FC<PromptsData> = ({ getPrompt }) => {
  const [input, setInput] = useState<string>("");
  const [parsedData, setParsedData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleAdd = async () => {
    if (!input) return;

    setLoading(true);

    try {
      const improved = await getPrompt(input);
      if (!improved) {
        setInput("Ocurrió un error");
        setParsedData(null);
        return;
      }

      let cleaned = improved
        .replace(/^\s*```+\s*/, "")
        .replace(/\s*```+\s*$/, "")
        .trim();

      if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
        cleaned = cleaned
          .slice(1, -1)
          .replace(/\\"/g, '"')
          .replace(/\\n/g, "\n");
      }

      const startIndex = cleaned.indexOf("{");
      const endIndex = cleaned.lastIndexOf("}");
      if (startIndex === -1 || endIndex === -1)
        throw new Error("JSON no encontrado");
      const jsonString = cleaned.slice(startIndex, endIndex + 1);

      const parsed = JSON.parse(jsonString);
      setParsedData(parsed);
    } catch (error) {
      console.error("Error procesando el prompt:", error);
      setInput("Ocurrió un error");
      setParsedData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!parsedData) return;

    const textOutput =
      "Título: " +
      parsedData.title?.trim() +
      "\n" +
      "Objetivo: " +
      parsedData.objective?.trim() +
      "\n" +
      "Instrucciones: " +
      parsedData.instructions?.trim() +
      "\n" +
      "Contexto: " +
      parsedData.context?.trim() +
      "\n" +
      "Ejemplos: " +
      parsedData.examples?.map((e: string) => e.trim()).join(", ") +
      "\n" +
      "Resultado esperado: " +
      parsedData.expected_output?.trim();

    navigator.clipboard.writeText(textOutput);
    setShowToast(true);
  };

  return (
    <div className="bg-amber-600 p-4 rounded shadow min-h-[100px] relative">
      <h2 className="text-xl font-bold mb-4 border-b">Mejora tu Prompt</h2>

      <textarea
        rows={4}
        className="w-full p-2 border border-gray-300 bg-white rounded focus:outline-none focus:ring-0 overflow-hidden resize-none"
        placeholder="Escribe tu prompt..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>

      <div className="flex gap-2 mt-2">
        <button
          onClick={handleAdd}
          className="w-1/2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
          disabled={loading}
        >
          {loading ? "Mejorando..." : "Mejorar"}
        </button>

        <button
          onClick={handleCopy}
          className="w-1/2 bg-[#4D677E] text-white p-2 rounded hover:bg-green-600 transition-colors"
        >
          Copiar
        </button>
      </div>

      {parsedData && (
        <div className="mt-4 bg-gray-50 p-3 rounded shadow whitespace-pre-line">
          <p>
            <strong>Título:</strong> {parsedData.title}
          </p>
          <p>
            <strong>Objetivo:</strong> {parsedData.objective}
          </p>
          <p>
            <strong>Instrucciones:</strong> {parsedData.instructions}
          </p>
          <p>
            <strong>Contexto:</strong> {parsedData.context}
          </p>
          <p>
            <strong>Ejemplos:</strong> {parsedData.examples.join(", ")}
          </p>
          <p>
            <strong>Resultado esperado:</strong> {parsedData.expected_output}
          </p>
        </div>
      )}

      {showToast && (
        <Toast
          message="¡Texto copiado al portapapeles!"
          onConfirm={() => setShowToast(false)}
        />
      )}
    </div>
  );
};
