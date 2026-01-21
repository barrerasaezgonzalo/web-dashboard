import { useImages } from "@/hooks/useImages";
import {
  Plus,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Trash,
  Camera,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ImageModal } from "./ImageModal";
import { usePrivacyMode } from "@/hooks/usePrivacyMode";
import Image from "next/image";

export const Images: React.FC = () => {
  const {
    images,
    handleOpenModal,
    showModal,
    setImage,
    resetForm,
    uploading,
    handleSubmit,
    handleDelete,
    selectedImage,
    setSelectedImage,
    scrollRef,
    scroll,
  } = useImages();
  const [isMinimized, setIsMinimized] = useState(false);
  const { isPrivate } = usePrivacyMode();
  const modalRef = useRef<HTMLDialogElement>(null);

  const openModal = () => {
    modalRef.current?.showModal();
  };

  const sorted = [...images].sort(
    (a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
  );

  useEffect(() => {
    if (sorted.length > 0 && !selectedImage) {
      setSelectedImage(sorted[0]);
    }
  }, [images, selectedImage, setSelectedImage, sorted]);

  return (
    <div
      id="images"
      className={`relative bg-[#1E293C] rounded shadow transition-all duration-500 ${isMinimized ? "min-h-0" : "min-h-[500px]"} flex flex-col p-4`}
    >
      <div className="flex justify-between items-center pb-2 text-white border-b mb-4">
        <h2 className="text-xl flex gap-2 font-bold items-center">
          <Camera size={25} /> Imágenes
        </h2>
        <div className="flex items-center gap-1">
          {!isMinimized && (
            <button
              onClick={handleOpenModal}
              className="p-2 hover:bg-blue-500 rounded text-white transition-colors"
            >
              <Plus size={20} />
            </button>
          )}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-slate-700 rounded-full transition-colors"
          >
            {isMinimized ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex-1 flex flex-col w-full max-w-full overflow-visible">
          <div className="w-full flex justify-center">
            {selectedImage ? (
              <div
                className={`relative w-full max-w-3xl h-[300px] mt-[-30px]  flex items-center justify-center ${isPrivate ? "privacy-blur" : ""}`}
              >
                <div className="relative w-full max-w-3xl aspect-video overflow-hidden flex items-center justify-center rounded-xl">
                  <Image
                    alt=""
                    fill
                    onClick={openModal}
                    src={selectedImage.url}
                    className="max-w-full max-h-full object-contain cursor-pointer"
                  />
                  <dialog
                    ref={modalRef}
                    onClick={() => modalRef.current?.close()}
                    className="bg-transparent p-0 outline-none backdrop:bg-black/90 backdrop:backdrop-blur-sm 
             fixed inset-0 w-full h-full max-w-full max-h-full"
                  >
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                      onClick={() => modalRef.current?.close()}
                    >
                      <div className="relative max-w-[95vw] max-h-[90vh] flex items-center justify-center">
                        <Image
                          src={selectedImage.url}
                          alt="Vista previa"
                          width={1200}
                          height={800}
                          className="rounded-lg shadow-2xl object-contain w-auto h-auto max-w-full max-h-[90vh]"
                          onClick={(e) => e.stopPropagation()}
                          priority
                          unoptimized
                        />

                        <button
                          onClick={() => modalRef.current?.close()}
                          className="absolute -top-10 -right-2 text-white hover:text-gray-300 p-2"
                        >
                          <Plus
                            size={30}
                            className="rotate-45 cursor-pointer"
                          />
                        </button>
                      </div>
                    </div>
                  </dialog>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-3xl h-[300px] mb-4 border-2 border-dashed border-slate-700 rounded-3xl flex items-center justify-center text-slate-500">
                Sin selección
              </div>
            )}
          </div>

          {sorted.length > 0 ? (
            <div className="relative w-full max-w-3xl mx-auto group">
              {sorted.length > 3 && (
                <button
                  onClick={() => scroll("left")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-blue-500 p-2 rounded-full text-white shadow-lg hover:bg-blue-700 transition-all opacity-80"
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              <div
                ref={scrollRef}
                className="flex gap-4 overflow-hidden pb-4 scrollbar-hide scroll-smooth"
                style={{ scrollSnapType: "x mandatory" }}
              >
                {sorted.map((img) => (
                  <div key={img.url} className="relative shrink-0 group">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(img.url);
                      }}
                      className="absolute top-0 right-0 z-300 bg-red-500 text-white rounded-full p-1 shadow-md 
                 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 scale-90 hover:scale-100"
                    >
                      <Trash size={16} className="text-white cursor-pointer" />
                    </button>

                    <button
                      onClick={() => setSelectedImage(img)}
                      className={`w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage?.url === img.url
                          ? "border-blue-500 scale-105 shadow-lg"
                          : "border-slate-700 opacity-50 hover:opacity-100"
                      }`}
                      style={{ scrollSnapAlign: "start" }}
                    >
                      <Image
                        src={img.url}
                        alt="thumb"
                        fill
                        className={`w-auto h-auto object-cover pointer-events-none ${isPrivate ? "privacy-blur" : ""}`}
                        unoptimized
                      />
                    </button>
                  </div>
                ))}
              </div>

              {sorted.length > 3 && (
                <button
                  onClick={() => scroll("right")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-blue-500 p-2 rounded-full text-white shadow-lg hover:bg-blue-700 transition-all opacity-80"
                >
                  <ChevronRight size={24} />
                </button>
              )}
            </div>
          ) : (
            <>
              <p className="text-slate-500 text-center ">
                No existen imágenes cargadas
              </p>
              <button
                onClick={handleOpenModal}
                className="mt-4 px-4 py-2 bg-blue-400 w-[60%] mx-auto rounded text-[12px] uppercase font-normal "
              >
                Sube tu primera imagen
              </button>
            </>
          )}
        </div>
      )}

      {showModal && (
        <ImageModal
          onClose={resetForm}
          setImage={setImage}
          onSave={(e) => handleSubmit(e as React.SyntheticEvent)}
          isLoading={uploading}
        />
      )}
    </div>
  );
};
