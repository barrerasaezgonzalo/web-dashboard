import type { ToastProps } from "@/types";

export const Toast: React.FC<ToastProps> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  const handleOk = () => {
    if (onConfirm) onConfirm();
  };

  return (
    <>      
      <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-40" data-testid="toast" />
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white p-6 rounded shadow-lg z-50">
        {message}
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
              onClick={handleOk}
            >
              OK
            </button>
          )}
        </div>
      </div>
    </>
  );
};
