import { useAutoResize } from "@/hooks/useAutoResize";
import { AutoTextareaProps } from "@/types";
import { useRef } from "react";

export const AutoTextarea: React.FC<AutoTextareaProps> = ({ value, onChange, rows = 6 }) => {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  useAutoResize(ref, value);

  return (
    <textarea
      ref={ref}
      rows={rows}
      className="w-full p-2 border border-gray-300 bg-white rounded focus:outline-none focus:ring-0 overflow-hidden resize-none"
      placeholder="Escribe tu prompt..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
