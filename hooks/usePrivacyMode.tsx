// utils/usePrivacyMode.ts (o hooks/usePrivacyMode.ts)

import { useState, useEffect } from "react";

export function usePrivacyMode() {
  const [isPrivate, setIsPrivate] = useState(() => {
    const saved = localStorage.getItem("privacyMode");
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("privacyMode", String(isPrivate));
  }, [isPrivate]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "h") {
        const target = e.target as HTMLElement;

        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable
        ) {
          return;
        }

        e.preventDefault();
        setIsPrivate((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return { isPrivate, setIsPrivate };
}
