import { renderHook, act } from "@testing-library/react";
import { usePrompts } from "@/hooks/usePrompts";
import { useData } from "@/hooks/useData";

// 1. Mock de dependencias
jest.mock("@/hooks/useData");

// Mock de las funciones de utilidad para aislar el hook usePrompts
jest.mock("@/utils", () => ({
  // parsePromptResponse devolverá un objeto simple para simular datos parseados
  parsePromptResponse: jest.fn((response) => ({ content: response })),
  // formatPromptOutput devolverá una cadena simple para simular el resultado final
  formatPromptOutput: jest.fn((data) => `Formatted: ${data.content}`),
}));

// Mock de la API del portapapeles para handleCopy
const mockClipboard = {
  writeText: jest.fn().mockResolvedValue(undefined),
};
Object.assign(navigator, {
  clipboard: mockClipboard,
});

describe("usePrompts hook", () => {
  // Configuración de mocks antes de cada test para asegurar la limpieza
  beforeEach(() => {
    (useData as jest.Mock).mockClear();
    mockClipboard.writeText.mockClear();
  });

  // ===================================================================
  // TEST EXISTENTE (Happy Path)
  // ===================================================================
  it("handleAdd llama a getPrompt y actualiza parsedData (Camino Feliz)", async () => {
    const getPromptMock = jest.fn().mockResolvedValue("mi prompt");
    (useData as jest.Mock).mockReturnValue({ getPrompt: getPromptMock });

    const { result } = renderHook(() => usePrompts());

    act(() => {
      result.current.setInput("mi prompt");
    });

    await act(async () => {
      await result.current.handleAdd();
    });

    expect(getPromptMock).toHaveBeenCalledWith("mi prompt");
    expect(result.current.loading).toBe(false);
    expect(result.current.parsedData).toEqual({ content: "mi prompt" });
  });

  // ===================================================================
  // TEST 1: Ramificación de Input Vacío (Línea 15: if (!input) return;)
  // ===================================================================
  it("handleAdd no hace nada si el input está vacío", async () => {
    const getPromptMock = jest.fn();
    (useData as jest.Mock).mockReturnValue({ getPrompt: getPromptMock });

    const { result } = renderHook(() => usePrompts());

    // El input está vacío por defecto.

    // handleAdd debería retornar inmediatamente, sin cambiar el estado de loading
    await act(async () => {
      await result.current.handleAdd();
    });

    expect(getPromptMock).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  // ===================================================================
  // TEST 2: Ramificación de Respuesta Falsy (Línea 21: if (!improved))
  // ===================================================================
  it("handleAdd maneja si getPrompt retorna un valor nulo/falsy", async () => {
    // Forzamos al mock a resolver con null para entrar en el if (!improved)
    const getPromptMock = jest.fn().mockResolvedValue(null);
    (useData as jest.Mock).mockReturnValue({ getPrompt: getPromptMock });

    const { result } = renderHook(() => usePrompts());

    act(() => {
      result.current.setInput("Test input");
    });

    await act(async () => {
      await result.current.handleAdd();
    });

    // Se verifica la lógica de manejo de respuesta nula
    expect(result.current.input).toBe("Ocurrió un error");
    expect(result.current.parsedData).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  // ===================================================================
  // TEST 3: Ramificación de Error (Línea 25: catch (error))
  // ===================================================================
  it("handleAdd maneja errores de getPrompt y actualiza el estado", async () => {
    const error = new Error("API failed");
    // Forzamos al mock a rechazar la promesa para entrar en el catch
    const getPromptMock = jest.fn().mockRejectedValue(error);
    (useData as jest.Mock).mockReturnValue({ getPrompt: getPromptMock });

    // Mockeamos console.error para evitar ruido en el output del test
    const consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { result } = renderHook(() => usePrompts());

    act(() => {
      result.current.setInput("Test input");
    });

    await act(async () => {
      await result.current.handleAdd();
    });

    // Se verifica la lógica del catch block
    expect(consoleErrorMock).toHaveBeenCalledWith(
      "Error procesando el prompt:",
      error,
    );
    expect(result.current.input).toBe("Ocurrió un error");
    expect(result.current.parsedData).toBeNull();
    expect(result.current.loading).toBe(false);

    consoleErrorMock.mockRestore();
  });

  // ===================================================================
  // TEST 4: handleCopy con y sin datos (Línea 36: if (!parsedData) return;)
  // ===================================================================
  it("handleCopy no copia si parsedData es nulo", () => {
    const { result } = renderHook(() => usePrompts());

    // parsedData es null por defecto

    act(() => {
      result.current.handleCopy();
    });

    // La rama de no copia fue cubierta
    expect(mockClipboard.writeText).not.toHaveBeenCalled();
    expect(result.current.showToast).toBe(false);
  });

  it("handleCopy copia el texto al portapapeles y muestra el toast", async () => {
    const getPromptMock = jest.fn().mockResolvedValue("test response");
    (useData as jest.Mock).mockReturnValue({ getPrompt: getPromptMock });
    const { result } = renderHook(() => usePrompts());

    // Pre-requisito: Ejecutar handleAdd para llenar parsedData
    act(() => {
      result.current.setInput("Test");
    });
    await act(async () => {
      await result.current.handleAdd();
    });

    // Ejecutar handleCopy
    act(() => {
      result.current.handleCopy();
    });

    // Se verifica que el clipboard fue llamado con el valor formateado mockeado
    expect(mockClipboard.writeText).toHaveBeenCalledWith(
      "Formatted: test response",
    );
    // Se verifica que la rama de setear el toast fue cubierta
    expect(result.current.showToast).toBe(true);
  });

  it("getTextOutput retorna una cadena vacía si parsedData es nulo", () => {
    // 1. Renderizar el hook
    const { result } = renderHook(() => usePrompts());

    // 2. parsedData está nulo por defecto (estado inicial)

    // 3. Llamar a la función
    const output = result.current.getTextOutput();

    // 4. Aserción: Debe retornar la cadena vacía ("")
    expect(output).toBe("");
  });
});
