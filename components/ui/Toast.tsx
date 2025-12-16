import type { ToastProps } from "@/types";
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
        role={onConfirm && onCancel ? "alertdialog" : "alert"}
        aria-modal="true"
        tabIndex={-1} // para poder focusear
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white p-6 rounded shadow-lg z-50"
        aria-labelledby="toast-heading"
        aria-describedby="toast-description"
      >
        {/* Heading oculto para lectores de pantalla */}
        <h2 id="toast-heading" className="sr-only">
          Confirmación
        </h2>
        {/* Mensaje principal */}
        <p id="toast-description">{message}</p>

        {/* Botones */}
        <div className="flex justify-end gap-2 mt-4">
          {onConfirm && onCancel ? (
            <>
              <button
                className="bg-white text-black px-3 py-1 rounded hover:bg-gray-200"
                onClick={onConfirm}
              >
                Sí
              </button>
              <button
                className="bg-white text-gray-700 px-3 py-1 rounded hover:bg-gray-200"
                onClick={onCancel}
              >
                No
              </button>
            </>
          ) : (
            <button
              className="bg-white text-black px-3 py-1 rounded hover:bg-gray-200"
              onClick={onConfirm}
            >
              OK
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export const Toast = memo(ToastConponet);
