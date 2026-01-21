import { useAuth } from "@/context/AuthContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "./useToast";
import { VercelBlob } from "@/types";
import { trackError } from "@/utils/logger";
import { authFetch } from "./authFetch";

export const useImages = () => {
  const { userId } = useAuth();
  const [images, setImages] = useState<VercelBlob[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [, setBlobUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState<VercelBlob | null>(null);
  const { openToast, closeToast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right" | "start") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 200;

      if (direction === "start") {
        current.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        current.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const resetForm = () => {
    setImage(null);
    setShowModal(false);
  };

  const fetchImages = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await authFetch("/api/images");
      if (!response.ok) throw new Error("fetchImages: api Error");
      const data = await response.json();
      setImages(data);
    } catch (error) {
      trackError(error, "fetchImages");
      openToast({
        message: "Error obteniendo las imágenes, intenta nuevamente",
      });
    }
  }, [userId, openToast]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (!image) {
      return;
    }
    if (image.size > 4 * 1024 * 1024) {
      openToast({ message: "La imagen es demasiado grande (máx 4MB)" });
      return;
    }

    setUploading(true);

    try {
      const uniqueName = `${Date.now()}-${image.name}`;
      const response = await authFetch(`/api/images?filename=${uniqueName}`, {
        method: "POST",
        body: image,
      });
      if (!response.ok) throw new Error("handleSubmitImages: api Error");
      const newBlob = await response.json();

      if (newBlob.url) {
        setBlobUrl(newBlob.url);
        openToast({ message: `Imagen subida correctamente` });
        resetForm();
        setShowModal(false);
        fetchImages();
        setSelectedImage(newBlob);
        scroll("start");
      }
    } catch (error) {
      trackError(error, "handleSubmitImages");
      openToast({ message: "Error subiendo imagen" });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (img: string) => {
    openToast({
      message: "¿Estas seguro que deseas eliminar esta imagen?",
      onConfirm: async () => {
        try {
          const response = await authFetch(`/api/images?url=${img}`, {
            method: "DELETE",
          });
          if (!response.ok) throw new Error("handleDeleteImagen: api Error");
          if (selectedImage?.url === img) {
            setSelectedImage(null);
          }
          closeToast();
          setTimeout(() => {
            openToast({
              message: "imagen eliminada correctamente",
            });
          }, 100);
          fetchImages();
        } catch (error) {
          trackError(error, "handleDeleteImagen");
        }
      },
      onCancel: closeToast,
    });
  };
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return {
    images,
    handleOpenModal,
    showModal,
    image,
    setImage,
    resetForm,
    uploading,
    handleSubmit,
    handleDelete,
    selectedImage,
    setSelectedImage,
    scrollRef,
    scroll,
  };
};
