import { PlusCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

export const ImageModal: React.FC<any> = ({
  onClose,
  setImage,
  onSave,
  isLoading,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setImage(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1e293b] text-slate-200 rounded-2xl shadow-2xl z-50 w-full max-w-md overflow-hidden border border-slate-700">
        <div className="p-6 border-b border-slate-700 bg-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
              <PlusCircle size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Subir Imagen</h3>
              <p className="text-xs text-slate-400">Completa los datos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Imagen
            </label>

            {preview && (
              <div className="mb-4">
                <img
                  src={preview}
                  alt="Vista previa"
                  className="w-full h-40 object-cover rounded-xl border border-slate-200"
                />
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={`w-full text-black bg-white border rounded-xl p-3 focus:outline-none focus:ring-2 transition-all appearance-none`}
            />
          </div>
        </div>

        <div className="p-6 bg-slate-800/80 border-t border-slate-700 flex gap-4">
          <button
            className="flex-1 cursor-pointer bg-slate-700 text-white px-4 py-3 rounded-xl font-bold hover:bg-slate-600 transition-all"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className={`flex-1  px-4 py-3 rounded-xl font-bold transition-all active:scale-95 
              ${
                isLoading
                  ? "bg-slate-700 text-slate-400 cursor-not-allowed opacity-70"
                  : "bg-blue-600 cursor-pointer text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20"
              }`}
            onClick={onSave}
          >
            Subir
          </button>
        </div>
      </div>
    </>
  );
};
