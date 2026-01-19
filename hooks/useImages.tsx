import { useAuth } from "@/context/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "./useToast";
import { VercelBlob } from "@/types";

export const useImages = () => {
  const { userId } = useAuth();
  const [images, setImages] = useState<VercelBlob[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [blobUrl, setBlobUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState<VercelBlob | null>(null);
  const { openToast, closeToast } = useToast();

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
      const response = await fetch("/api/images");
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.log("Error al obtener las imagenes");
      openToast({
        message: "Error obteniendo las imagenes, intenta nuevamente",
      });
    }
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image) {
      openToast({ message: "Debe seleccionar una imagen" });
      return;
    }
    if (image.size > 4 * 1024 * 1024) {
      openToast({ message: "La imagen es demasiado grande (máx 4MB)" });
      return;
    }

    setUploading(true);

    try {
      const uniqueName = `${Date.now()}-${image.name}`;
      const response = await fetch(`/api/images?filename=${uniqueName}`, {
        method: "POST",
        body: image,
      });
      const newBlob = await response.json();

      if (newBlob.url) {
        setBlobUrl(newBlob.url);
        openToast({ message: `Imagen subida correctamente` });
        resetForm();
        setShowModal(false);
        fetchImages();
      }
    } catch (error) {
      console.error("Error al subir:", error);
      openToast({ message: "Error subiendo imagen" });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (img: string) => {
    openToast({
      message: "¿Estas seguro que deseas eliminar esta imagen?",
      onConfirm: async () => {
        const response = await fetch(`/api/images?url=${img}`, {
          method: "DELETE",
        });
        closeToast();
        setTimeout(() => {
          openToast({
            message: "imagen eliminada correctamente",
          });
        }, 100);
        fetchImages();
        if (selectedImage?.url === img) {
          setSelectedImage(null);
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
  };
};
