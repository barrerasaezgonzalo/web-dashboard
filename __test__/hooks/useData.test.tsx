import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { useData } from "@/hooks/useData";
import { DataProvider } from "@/context/DataContext";

jest.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
    from: jest.fn(),
  },
}));

describe("useData hook", () => {
  test("lanza error cuando se usa fuera del DataProvider", () => {
    const TestComponent = () => {
      // Esto debería lanzar
      useData();
      return null;
    };

    expect(() => render(<TestComponent />)).toThrow(
      "useData debe ser usado dentro de un DataProvider",
    );
  });

  test("devuelve el contexto correctamente dentro del DataProvider", () => {
    let contextValue: any;

    const TestComponent = () => {
      contextValue = useData();
      return null;
    };

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>,
    );

    expect(contextValue).toHaveProperty("prompt");
    expect(contextValue).toHaveProperty("getPrompt");
    expect(contextValue).toHaveProperty("note");
    expect(contextValue).toHaveProperty("setNote");
    expect(contextValue).toHaveProperty("saveNote");
    expect(contextValue).toHaveProperty("setWheather");
    expect(contextValue).toHaveProperty("wheater");
  });
});
