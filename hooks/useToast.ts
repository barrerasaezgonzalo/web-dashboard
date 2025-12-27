import { useState, useCallback } from "react";
import type { ToastConfig } from "@/types/";

export function useToast() {
  const [toast, setToast] = useState<ToastConfig | null>(null);

  const openToast = useCallback((config: ToastConfig) => {
    setToast(config);
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  const showToast = useCallback(
    (message: string) => {
      openToast({
        message,
        onConfirm: closeToast,
      });
    },
    [openToast, closeToast],
  );

  return {
    toast,
    openToast,
    closeToast,
    showToast,
  };
}
