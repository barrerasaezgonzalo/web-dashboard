import { formatPromptOutput, parsePromptResponse } from "@/utils";
import { useState } from "react";
import { useData } from "./useData";
import { PromptData } from "@/types/";
import { useToast } from "./useToast";

export const usePrompts = () => {
  const [input, setInput] = useState<string>("");
  const [parsedData, setParsedData] = useState<PromptData | null>(null);
  const [loading, setLoading] = useState(false);
  const { getPrompt } = useData();
  const { toast, showToast } = useToast();

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

      const parsed = parsePromptResponse(improved);
      setParsedData(parsed);
    } catch (error) {
      console.error("Error procesando el prompt:", error);
      setInput("Ocurrió un error");
      setParsedData(null);
    } finally {
      setLoading(false);
    }
  };

  const getTextOutput = () =>
    parsedData ? formatPromptOutput(parsedData) : "";

  const handleCopy = () => {
    if (!parsedData) return;

    navigator.clipboard.writeText(getTextOutput());
    showToast("Texto copiado al portapapeles");
  };

  return {
    input,
    setInput,
    parsedData,
    loading,
    showToast,
    handleCopy,
    handleAdd,
    getTextOutput,
  };
};
