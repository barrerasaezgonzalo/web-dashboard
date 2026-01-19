import { useImages } from "@/hooks/useImages";
import {
  StickyNote,
  Plus,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Trash,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ImageModal } from "./ImageModal";

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
  } = useImages();
  const [isMinimized, setIsMinimized] = useState(false);
  const sorted = [...images].sort(
    (a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
  );

  useEffect(() => {
    if (sorted.length > 0 && !selectedImage) {
      setSelectedImage(sorted[0]);
    }
  }, [images]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 200;
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      id="images"
      className={`relative bg-[#1E293C] rounded shadow transition-all duration-500 ${isMinimized ? "min-h-0" : "min-h-[500px]"} flex flex-col p-4`}
    >
      <div className="flex justify-between items-center pb-2 text-white border-b border-slate-700 mb-4">
        <h2 className="text-xl flex gap-2 font-bold items-center">
          <StickyNote size={25} /> Imagenes
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
              <div className="relative w-full max-w-3xl h-[300px] mt-[-30px]  flex items-center justify-center">
                <a
                  href={selectedImage.url}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl transition-all"
                >
                  <div className="relative w-full max-w-3xl aspect-video overflow-hidden flex items-center justify-center rounded-xl">
                    <img
                      src={selectedImage.url}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </a>
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
                      <img
                        src={img.url}
                        className="w-full h-full object-cover pointer-events-none"
                        alt="thumb"
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
                No existen imagenes cargadas
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
          onSave={handleSubmit}
          isLoading={uploading}
        />
      )}
    </div>
  );
};
