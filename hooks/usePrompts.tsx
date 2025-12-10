import { parsePromptResponse } from "@/utils";
import { useState } from "react";
import { useData } from "./useData";

export const usePrompts = () => {
    const [input, setInput] = useState<string>("");
    const [parsedData, setParsedData] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const { getPrompt } = useData();

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

    const getTextOutput = (): string => {
        if (!parsedData) return "";

        return (
            "Título: " + parsedData.title?.trim() + "\n" +
            "Objetivo: " + parsedData.objective?.trim() + "\n" +
            "Instrucciones: " + parsedData.instructions?.trim() + "\n" +
            "Contexto: " + parsedData.context?.trim() + "\n" +
            "Ejemplos: " + parsedData.examples?.map((e: string) => e.trim()).join(", ") + "\n" +
            "Resultado esperado: " + parsedData.expected_output?.trim()
        );
    };

    const handleCopy = () => {
        if (!parsedData) return;

        navigator.clipboard.writeText(getTextOutput());
        setShowToast(true);
    };   

    return { 
        input,
        setInput,
        parsedData,
        loading,
        showToast,
        setShowToast,
        handleCopy,
        handleAdd,
        getTextOutput
     };
};
