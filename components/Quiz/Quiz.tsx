"use client";

import { useData } from "@/hooks/useData";
import React, { useState } from "react";

export const Quiz: React.FC = () => {
  const { question, answer, generateQuestion, submitAnswer } = useData();
  const [mode, setMode] = useState<"generate" | "answer">("generate");
  const [inputValue, setInputValue] = useState("");

  const handleClick = async () => {
    if (mode === "generate") {
      await generateQuestion(inputValue);
      setMode("answer");
      setInputValue("");
    } else {
      if (!inputValue.trim()) return;
      await submitAnswer(inputValue);
      setMode("generate");
      setInputValue("");
    }
  };

  return (
    <div className="bg-amber-600 p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4 border-b pb-2">React Quiz</h2>

      <textarea
        rows={6}
        placeholder={
          mode === "generate"
            ? "Hace click en Generar Pregunta"
            : "Escribe tu respuesta aquí"
        }
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        readOnly={mode === "generate"}
        className="w-full p-2 border border-gray-300 bg-white rounded focus:outline-none focus:ring-0 overflow-hidden resize-none"
      />

      <button
        onClick={handleClick}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors"
      >
        {mode === "generate" ? "Generar pregunta" : "Responder"}
      </button>

      {question && mode === "answer" && (
        <div className="mt-2 p-2 bg-gray-100 rounded">
          <strong>Pregunta:</strong> {question?.question}
        </div>
      )}

      {answer && (
        <div className="mt-2 p-2 bg-green-100 rounded">
          <strong>Respuesta:</strong> {answer}
        </div>
      )}
    </div>
  );
};
