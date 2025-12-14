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
});
