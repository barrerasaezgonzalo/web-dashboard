import type { ToastProps } from "@/types/";
import { Info } from "lucide-react";
import { memo, useEffect, useRef } from "react";

export const ToastConponet: React.FC<ToastProps> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Poner foco al modal cuando aparezca
  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  return (
    <>
      {/* Fondo semitransparente */}
      <div className="fixed inset-0 bg-black/50 z-40" aria-hidden="true" />

      {/* Modal */}
      <div
        ref={modalRef}
        role={onCancel ? "alertdialog" : "alert"}
        aria-modal="true"
        tabIndex={-1} // para poder focusear
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#3E4661] text-white p-12 rounded-xl shadow-lg z-50"
        aria-labelledby="toast-heading"
        aria-describedby="toast-description"
      >
        {/* Heading oculto para lectores de pantalla */}
        <h2 id="toast-heading" className="sr-only">
          Confirmación
        </h2>
        {/* Mensaje principal */}
        <p id="toast-description" className="mb-6 flex gap-2">
          <Info size={25} />
          {message}
        </p>

        {/* Botones */}
        <div className="flex flex-row-reverse gap-6">
          <button
            className="flex-1 bg-black text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors active:scale-95"
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
          >
            {onCancel ? "Confirmar" : "Entendido"}
          </button>

          {onCancel && (
            <button
              className="flex-1 bg-gray-50 text-gray-500 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
              onClick={onCancel}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export const Toast = memo(ToastConponet);
