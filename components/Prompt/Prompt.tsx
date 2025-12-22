"use client";

import { Toast } from "../ui/Toast";
import { abrirGpt } from "@/utils";
import { usePrompts } from "@/hooks/usePrompts";
import { useAutoResize } from "@/hooks/useAutoResize";
import { useCallback, useRef } from "react";
import { AutoTextarea } from "./AutoTextareaProps";
import { ActionButtons } from "./ActionButtons";
import { ParsedDataView } from "./ParsedData";
import { memo } from "react";
import { SquareTerminal } from "lucide-react";

export const PromptComponent: React.FC = () => {
  const {
    input,
    setInput,
    handleAdd,
    loading,
    handleCopy,
    parsedData,
    getTextOutput,
    showToast,
    setShowToast,
  } = usePrompts();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  useAutoResize(textareaRef, input);

  const handleEnviar = useCallback(() => {
    abrirGpt(getTextOutput(), setInput);
  }, [getTextOutput, setInput]);

  return (
    <div
      role="region"
      aria-labelledby="prompt-heading"
      className="bg-amber-600 text-black p-4 rounded shadow min-h-[300px]"
    >
      <h2
        id="prompt-heading"
        className="flex gap-2 text-xl font-bold mb-4 border-b"
      >
        <SquareTerminal size={25} /> Mejora tu Prompt
      </h2>

      <AutoTextarea value={input} onChange={setInput} />

      <ActionButtons loading={loading} onAdd={handleAdd} onCopy={handleCopy} />

      {parsedData && (
        <ParsedDataView data={parsedData} onEnviar={handleEnviar} />
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

export const Prompt = memo(PromptComponent);
