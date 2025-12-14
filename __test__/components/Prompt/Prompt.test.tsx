import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Prompt } from "@/components/Prompt/Prompt";
import { usePrompts } from "@/hooks/usePrompts";
import { abrirGpt } from "@/utils";

jest.mock("@/hooks/usePrompts");
jest.mock("@/utils", () => ({
  abrirGpt: jest.fn(),
}));

jest.mock("@/components/Prompt/AutoTextareaProps", () => ({
  AutoTextarea: ({ value, onChange }: any) => (
    <textarea
      data-testid="auto-textarea"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

jest.mock("@/components/Prompt/ActionButtons", () => ({
  ActionButtons: ({ loading, onAdd, onCopy }: any) => (
    <div>
      <button onClick={onAdd}>Add</button>
      <button onClick={onCopy}>Copy</button>
    </div>
  ),
}));

jest.mock("@/components/Prompt/ParsedData", () => ({
  ParsedDataView: ({ data, onEnviar }: any) => (
    <div>
      <span>{data?.title}</span>
      <button onClick={onEnviar}>Enviar</button>
    </div>
  ),
}));

describe("PromptComponent", () => {
  const setInputMock = jest.fn();
  const handleAddMock = jest.fn();
  const handleCopyMock = jest.fn();
  const getTextOutputMock = jest.fn();
  const setShowToastMock = jest.fn();

  beforeEach(() => {
    (usePrompts as jest.Mock).mockReturnValue({
      input: "Valor inicial",
      setInput: setInputMock,
      handleAdd: handleAddMock,
      loading: false,
      handleCopy: handleCopyMock,
      parsedData: { title: "Prueba" },
      getTextOutput: getTextOutputMock,
      showToast: false,
      setShowToast: setShowToastMock,
    });
  });

  test("renderiza el título y el textarea con valor inicial", () => {
    render(<Prompt />);
    expect(screen.getByText("Mejora tu Prompt")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Valor inicial")).toBeInTheDocument();
  });

  test("renderiza ParsedDataView solo si parsedData existe", () => {
    render(<Prompt />);
    expect(screen.getByText("Prueba")).toBeInTheDocument();
  });

  test("llama a abrirGpt al enviar", () => {
    getTextOutputMock.mockReturnValue("Texto generado");
    render(<Prompt />);

    // Simular handleEnviar llamando directamente
    const parsedDataComponent = screen.getByText("Prueba").closest("div");
    const handleEnviar = parsedDataComponent?.querySelector("button");

    if (handleEnviar) fireEvent.click(handleEnviar);

    expect(abrirGpt).toHaveBeenCalledWith("Texto generado", setInputMock);
  });

  test("renderiza Toast si showToast es true", () => {
    (usePrompts as jest.Mock).mockReturnValue({
      input: "Valor inicial",
      setInput: setInputMock,
      handleAdd: handleAddMock,
      loading: false,
      handleCopy: handleCopyMock,
      parsedData: null,
      getTextOutput: getTextOutputMock,
      showToast: true,
      setShowToast: setShowToastMock,
    });
    render(<Prompt />);
    expect(
      screen.getByText("¡Texto copiado al portapapeles!"),
    ).toBeInTheDocument();
  });
});
