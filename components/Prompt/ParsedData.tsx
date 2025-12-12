import { ParsedDataViewProps } from "@/types";
import { memo } from "react";

export const ParsedDataViewComponent  : React.FC<ParsedDataViewProps> = ({ data, onEnviar }) => (
  <>
    <div className="mt-4 bg-gray-50 p-3 rounded shadow whitespace-pre-line">
      <p><strong>Título:</strong> {data.title}</p>
      <p><strong>Objetivo:</strong> {data.objective}</p>
      <p><strong>Instrucciones:</strong> {data.instructions}</p>
      <p><strong>Contexto:</strong> {data.context}</p>
      <p><strong>Ejemplos:</strong> {data.examples.join(", ")}</p>
      <p><strong>Resultado esperado:</strong> {data.expected_output}</p>
    </div>
    <button
      className="w-1/2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors mt-4"
      onClick={onEnviar}
    >
      Enviar a GPT
    </button>
  </>
);

export const ParsedDataView = memo(ParsedDataViewComponent);

