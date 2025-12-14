import { renderHook } from "@testing-library/react";
import { useNews } from "@/hooks/useNews";

describe("useNews hook", () => {
  it("debe lanzar error si se usa fuera del NewsProvider", () => {
    expect(() => renderHook(() => useNews())).toThrow(
      "useNews debe ser usado dentro de un NewsProvider",
    );
  });
});
