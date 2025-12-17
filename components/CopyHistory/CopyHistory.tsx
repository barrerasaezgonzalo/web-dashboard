// ClipboardHistoryWidget.tsx
import { useEffect, useState } from "react";
import { Toast } from "../ui/Toast";
import { useToast } from "@/hooks/useToast";

export default function CopyHistory() {
  const [history, setHistory] = useState<string[]>([]);
  const { toast, openToast, closeToast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem("clipboardHistory");
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  const addToHistory = async () => {
    const text = await navigator.clipboard.readText();
    if (text && !history.includes(text)) {
      const newHistory = [text, ...history].slice(0, 10); // últimos 10
      setHistory(newHistory);
      localStorage.setItem("clipboardHistory", JSON.stringify(newHistory));
    }
  };

  const copyAgain = (text: string) => {
    navigator.clipboard.writeText(text);
    openToast({
      message: text + " Copiado",
      onConfirm: closeToast,
    });
  };

  return (
    <div className="bg-slate-600 text-white p-4 rounded shadow w-full">
      {toast && (
        <Toast
          message={toast.message}
          onConfirm={() => {
            toast.onConfirm();
            closeToast();
          }}
          onCancel={
            toast.onCancel
              ? () => {
                  toast.onCancel?.();
                  closeToast();
                }
              : undefined
          }
        />
      )}

      <h2 className="text-xl font-bold mb-4 border-b pb-2">
        Historial Clipboard
      </h2>
      <button
        className="mb-2 px-2 py-1 bg-blue-500 rounded"
        onClick={addToHistory}
      >
        Actualizar contenido actual del portapapeles
      </button>
      <ul className="max-h-80 overflow-y-auto">
        {history.map((text, i) => (
          <li key={i} className="mb-2 flex justify-between items-center">
            <span className="truncate max-w-xs">{text}</span>
            <button
              className="mx-4 px-2 py-1 bg-amber-500 text-black rounded"
              onClick={() => copyAgain(text)}
            >
              Copiar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
