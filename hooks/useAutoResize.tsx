// hooks/useAutoResize.ts
import { useEffect, RefObject } from "react";

export function useAutoResize(
  ref: RefObject<HTMLTextAreaElement | null>,
  value: string,
) {
  useEffect(() => {
    if (ref.current) {
      const textarea = ref.current;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value, ref]);
}
