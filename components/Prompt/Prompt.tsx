"use client";

import { Toast } from "../ui/Toast";
import { abrirGpt } from "@/utils";
import { usePrompts } from "@/hooks/usePrompts";

export const Prompt: React.FC = () => {
  const { input, setInput, handleAdd, loading, handleCopy, parsedData, getTextOutput, showToast, setShowToast } = usePrompts();

  return (
    <div className="bg-amber-600 p-4 rounded shadow min-h-[100px] relative">
      <h2 className="text-xl font-bold mb-4 border-b">Mejora tu Prompt</h2>

      <textarea
        rows={6}
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
          className="w-1/2 bg-slate-600 text-white p-2 rounded hover:bg-slate-700 transition-colors"
        >
          Copiar
        </button>
      </div>

      {parsedData && (
        <><div className="mt-4 bg-gray-50 p-3 rounded shadow whitespace-pre-line">
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
        </div><button
          className="w-1/2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors mt-4"
          onClick={() => abrirGpt(getTextOutput(), setInput)}
        >
            Enviar a GPT
          </button></>
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

export default Prompt