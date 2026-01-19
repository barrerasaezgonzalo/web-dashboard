import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Escuchar el scroll para mostrar/ocultar el botón
  useEffect(() => {
    const toggleVisibility = () => {
      // Si bajamos más de 300px, mostramos el botón
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`fixed bottom-8 right-8 z-[1000] transition-all duration-500 ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-10 scale-50 pointer-events-none"
      }`}
    >
      <button
        onClick={scrollToTop}
        aria-label="Volver arriba"
        className="group relative p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all active:scale-90"
      >
        {/* Efecto de resplandor animado de fondo */}
        <div className="absolute inset-0 rounded-full bg-blue-400 blur-md opacity-0 group-hover:opacity-40 transition-opacity" />

        <ArrowUp
          size={24}
          className="relative z-10 group-hover:-translate-y-1 transition-transform duration-300"
        />
      </button>
    </div>
  );
};
