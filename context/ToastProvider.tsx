"use client"; // Marcamos este archivo como cliente

import { createContext, useContext, useState, ReactNode } from "react";
import { Toast } from "@/components/ui/Toast";

interface ToastConfig {
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const ToastContext = createContext<
  | {
      openToast: (config: ToastConfig) => void;
      closeToast: () => void;
    }
  | undefined
>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<ToastConfig | null>(null);

  const openToast = (config: ToastConfig) => setToast(config);
  const closeToast = () => setToast(null);

  return (
    <ToastContext.Provider value={{ openToast, closeToast }}>
      {children}
      {/* El componente visual se renderiza aquí, en el árbol del cliente */}
      {toast && (
        <Toast
          message={toast.message}
          onConfirm={() => {
            toast.onConfirm?.();
            setToast(null);
          }}
          onCancel={
            toast.onCancel
              ? () => {
                  toast.onCancel?.();
                  setToast(null);
                }
              : undefined
          }
        />
      )}
    </ToastContext.Provider>
  );
};
