import "@testing-library/jest-dom";
import React, { useContext, useEffect } from "react";
import { render, waitFor } from "@testing-library/react";
import { DataProvider, DataContext } from "@/context/DataContext";

describe("DataContext", () => {
  let fetchMock: jest.Mock;

  beforeAll(() => {
    fetchMock = jest.fn().mockImplementation((url) => {
      if (url === "/api/prompt") {
        return Promise.resolve({
          json: () => Promise.resolve({ data: "Respuesta de prueba" }),
        });
      }
      if (url.startsWith("/api/note")) {
        return Promise.resolve({
          json: () => Promise.resolve({ content: "Nota inicial" }),
        });
      }
      if (url === "/api/weather") {
        return Promise.resolve({
          json: () => Promise.resolve({ temperatura: 20 }),
        });
      }
      return Promise.resolve({ json: () => Promise.resolve({}) });
    });
    (global as any).fetch = fetchMock;
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  test("getPrompt actualiza prompt y devuelve data", async () => {
    let contextValue: any;

    const TestComponent = () => {
      contextValue = useContext(DataContext);
      return null;
    };

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>,
    );

    // Llamamos a getPrompt después de montar
    const result = await contextValue.getPrompt("input de prueba");
    expect(result).toBe("Respuesta de prueba");

    await waitFor(() => {
      expect(contextValue.prompt).toBe("Respuesta de prueba");
    });
  });

  test("getPrompt retorna null si no recibe input", async () => {
    let contextValue: any;

    const TestComponent = () => {
      contextValue = useContext(DataContext);
      return null;
    };

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>,
    );

    const result = await contextValue.getPrompt();

    expect(result).toBeNull();
  });

  test("getNote actualiza el estado de note", async () => {
    let contextValue: any;

    const TestComponent = () => {
      contextValue = useContext(DataContext);
      return null;
    };

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>,
    );

    await contextValue.getNote();

    await waitFor(() => {
      expect(contextValue.note).toBe("Nota inicial");
    });
  });

  test("saveNote llama al endpoint PUT", async () => {
    let contextValue: any;

    const TestComponent = () => {
      contextValue = useContext(DataContext);
      return null;
    };

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>,
    );

    jest.useFakeTimers();
    contextValue.saveNote("Nueva nota");
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/note", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "Nueva nota" }),
      });
    });
    jest.useRealTimers();
  });

  test("fetchWheater carga el clima en el estado", async () => {
    let contextValue: any;

    const TestComponent = () => {
      contextValue = useContext(DataContext);
      return null;
    };

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>,
    );

    await waitFor(() => {
      expect(contextValue.wheater).toEqual({ temperatura: 20 });
    });
  });

  test("getPrompt retorna null y no actualiza prompt si la API no devuelve data (Cubre 'else')", async () => {
    // Espiamos el console.error para confirmar que la rama de error fue alcanzada
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // 1. MOCK: Respuesta del useEffect (getNote) -> Éxito
    fetchMock.mockResolvedValueOnce({
      json: () => Promise.resolve({ content: "Nota inicial" }),
    });
    // 2. MOCK: Respuesta del useEffect (fetchWheater) -> Éxito
    fetchMock.mockResolvedValueOnce({
      json: () => Promise.resolve({ temperatura: 20 }),
    });
    // 3. MOCK: Respuesta de getPrompt (Simulando el fallo 'else': respuesta OK pero sin campo 'data')
    fetchMock.mockResolvedValueOnce({
      json: () => Promise.resolve({ error: "Faltan datos" }),
    });

    let contextValue: any;
    const TestComponent = () => {
      contextValue = useContext(DataContext);
      return null;
    };

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>,
    );

    // Esperar a que los useEffect iniciales terminen (consumen los 2 primeros mocks)
    await waitFor(() => {
      expect(contextValue.note).toBe("Nota inicial");
    });

    const initialPrompt = contextValue.prompt; // Debería ser ""

    // Llamamos a getPrompt (consume el 3er mock)
    const result = await contextValue.getPrompt("input que fallará");

    // Aserciones
    expect(result).toBeNull();

    // 1. Cubre el 'else' y el console.error
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "No se recibió data del endpoint",
      { error: "Faltan datos" },
    );

    // 2. El estado del prompt no debe haber cambiado
    await waitFor(() => {
      expect(contextValue.prompt).toBe(initialPrompt);
    });

    consoleErrorSpy.mockRestore();
  });

  test("getPrompt retorna null en caso de error de fetch (Cubre 'catch')", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    fetchMock.mockResolvedValueOnce({
      json: () => Promise.resolve({ content: "Nota inicial" }),
    });
    fetchMock.mockResolvedValueOnce({
      json: () => Promise.resolve({ temperatura: 20 }),
    });
    fetchMock.mockRejectedValueOnce(new Error("Network Failure"));

    let contextValue: any;
    const TestComponent = () => {
      contextValue = useContext(DataContext);
      return null;
    };

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>,
    );

    await waitFor(() => {
      expect(contextValue.note).toBe("Nota inicial");
    });

    const initialPrompt = contextValue.prompt;
    const result = await contextValue.getPrompt("input que fallará");

    expect(result).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error al generar prompt:",
      expect.any(Error),
    );
    expect(contextValue.prompt).toBe(initialPrompt);

    consoleErrorSpy.mockRestore();
  });

  test("saveNote maneja errores de fetch correctamente (Cubre 'catch')", async () => {
    fetchMock.mockResolvedValueOnce({
      json: () => Promise.resolve({ content: "Nota inicial" }),
    });
    fetchMock.mockResolvedValueOnce({
      json: () => Promise.resolve({ temperatura: 20 }),
    });
    fetchMock.mockRejectedValueOnce(new Error("Save Note Network Failure"));

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    let contextValue: any;

    const TestComponent = () => {
      contextValue = useContext(DataContext);
      return null;
    };

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>,
    );

    await waitFor(() => {
      expect(contextValue.note).toBe("Nota inicial");
    });

    jest.useFakeTimers();
    contextValue.saveNote("Nota con error");

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error saving note:",
        expect.any(Error),
      );
    });

    consoleErrorSpy.mockRestore();
    jest.useRealTimers();
  });

  test("getNote establece la nota como cadena vacía si la API no devuelve contenido (Cubre || '')", async () => {
    fetchMock.mockResolvedValueOnce({
      json: () => Promise.resolve({ user_id: 123 }),
    });

    fetchMock.mockResolvedValueOnce({
      json: () => Promise.resolve({ temperatura: 20 }),
    });

    let contextValue: any;
    const TestComponent = () => {
      contextValue = useContext(DataContext);
      return null;
    };

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>,
    );

    await waitFor(() => {
      expect(contextValue.note).toBe("");
    });

    await waitFor(() => {
      expect(contextValue.wheater).toEqual({ temperatura: 20 });
    });
  });
});
