import { ActionButtonsProps } from "@/types/";

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  loading,
  onAdd,
  onCopy,
}) => (
  <div className="flex gap-2 mt-2">
    <button
      onClick={onAdd}
      className="w-1/2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
      disabled={loading}
    >
      {loading ? "Mejorando..." : "Mejorar"}
    </button>
    <button
      onClick={onCopy}
      className="w-1/2 bg-slate-600 text-white p-2 rounded hover:bg-slate-700 transition-colors"
    >
      Copiar
    </button>
  </div>
);
