import type { ToastProps } from "../types";

export const Toast: React.FC<ToastProps> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  const handleOk = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <div className="fixed top-8 right-8 bg-[#4D677E]  text-white pt-8 pb-4 pl-8 pr-8 rounded shadow z-50">
      {message}
      <div className="flex justify-end gap-2 mt-4">
        {onConfirm && onCancel ? (
          <>
            <button
              className="bg-white text-black px-2 py-1 rounded hover:bg-gray-200"
              onClick={onConfirm}
            >
              Sí
            </button>
            <button
              className="bg-white text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
              onClick={onCancel}
            >
              No
            </button>
          </>
        ) : (
          <button
            className="bg-white text-black px-2 py-1 rounded hover:bg-gray-200"
            onClick={handleOk}
          >
            OK
          </button>
        )}
      </div>
    </div>
  );
};
