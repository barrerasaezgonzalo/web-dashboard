import { useEffect } from "react";

export const useHashHighlight = () => {
  useEffect(() => {
    const run = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;

      const el = document.getElementById(id);
      if (!el) return;

      el.classList.remove("hash-highlight");
      void el.offsetWidth; // reset animación
      el.classList.add("hash-highlight");
    };

    run();
    window.addEventListener("hashchange", run);
    return () => window.removeEventListener("hashchange", run);
  }, []);
};
