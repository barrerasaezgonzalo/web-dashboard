"use client";

import { useAutoResize } from "@/hooks/useAutoResize";
import { abrirGpt } from "@/utils";
import { Brain } from "lucide-react";
import { useRef, useState } from "react";

export const Gpt: React.FC = () => {
  const [pregunta, setPregunta] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  useAutoResize(textareaRef, pregunta);

  return (
    <div
      role="region"
      aria-labelledby="gpt-heading"
      className="bg-amber-600 text-black p-4 rounded shadow min-h-[300px]"
    >
      <h2
        id="gpt-heading"
        className="flex gap-2 text-xl font-bold mb-4 border-b"
      >
        <Brain size={25} /> Consulta a AI
      </h2>
      <label htmlFor="gpt-prompt" className="sr-only">
        Escribe tu pregunta para la AI
      </label>
      <textarea
        id="gpt-prompt"
        ref={textareaRef}
        rows={6}
        className="
            w-full                    
            p-2 
            border
            border-gray-300 
            rounded 
            focus:outline-none 
            focus:ring-0
            overflow-hidden
            resize-none
            bg-white
        "
        placeholder="Escribe tu prompt..."
        value={pregunta}
        onChange={(e) => setPregunta(e.target.value)}
      ></textarea>
      <button
        onClick={() => abrirGpt(pregunta, setPregunta)}
        className="
                mt-2 w-full 
                bg-blue-500
                text-white 
                p-2 
                rounded 
                hover:bg-blue-600 
                transition-colors
            "
      >
        Enviar a GPT
      </button>
    </div>
  );
};

export default Gpt;
