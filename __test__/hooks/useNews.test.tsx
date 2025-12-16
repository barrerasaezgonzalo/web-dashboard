import { render, renderHook } from "@testing-library/react";
import { useNews } from "@/hooks/useNews";
import { NewsProvider } from "@/context/NewsContext";

describe("useNews hook", () => {
  it("debe lanzar error si se usa fuera del NewsProvider", () => {
    expect(() => renderHook(() => useNews())).toThrow(
      "useNews debe ser usado dentro de un NewsProvider",
    );
  });

  test("devuelve el contexto correctamente dentro del NewsProvider", () => {
    let contextValue: any;

    const TestComponent = () => {
      contextValue = useNews();
      return null;
    };

    render(
      <NewsProvider>
        <TestComponent />
      </NewsProvider>,
    );

    expect(contextValue).toHaveProperty("news");
    expect(contextValue).toHaveProperty("newsLoading");
    expect(contextValue).toHaveProperty("getNews");
    expect(contextValue).toHaveProperty("bloquearNews12Horas");
  });
});
