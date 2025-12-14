import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { ParsedDataView } from "@/components/Prompt/ParsedData";
import { ParsedDataViewProps } from "@/types";

describe("ParsedDataViewComponent", () => {
  const mockData: ParsedDataViewProps["data"] = {
    title: "Título de prueba",
    objective: "Objetivo claro",
    instructions: "Instrucción 1. Instrucción 2.",
    context: "Contexto relevante.",
    examples: ["Ejemplo A", "Ejemplo B"],
    expected_output: "Salida esperada",
  };

  const onEnviarMock = jest.fn();

  test("renderiza correctamente todos los campos", () => {
    render(<ParsedDataView data={mockData} onEnviar={onEnviarMock} />);
    expect(screen.getByText(/Título:/).parentElement).toHaveTextContent(
      "Título de prueba",
    );
    expect(screen.getByText(/Objetivo:/).parentElement).toHaveTextContent(
      "Objetivo claro",
    );
    expect(screen.getByText(/Instrucciones:/).parentElement).toHaveTextContent(
      "Instrucción 1. Instrucción 2.",
    );
    expect(screen.getByText(/Contexto:/).parentElement).toHaveTextContent(
      "Contexto relevante.",
    );
    expect(screen.getByText(/Ejemplos:/).parentElement).toHaveTextContent(
      "Ejemplo A, Ejemplo B",
    );
    expect(
      screen.getByText(/Resultado esperado:/).parentElement,
    ).toHaveTextContent("Salida esperada");
  });

  test("llama a onEnviar al hacer clic en el botón", () => {
    render(<ParsedDataView data={mockData} onEnviar={onEnviarMock} />);
    fireEvent.click(screen.getByText("Enviar a GPT"));
    expect(onEnviarMock).toHaveBeenCalled();
  });

  test("maneja examples vacío sin fallar", () => {
    render(
      <ParsedDataView
        data={{ ...mockData, examples: [] }}
        onEnviar={onEnviarMock}
      />,
    );
    expect(screen.getByText(/Ejemplos:/).parentElement).toHaveTextContent(
      "Ejemplos:",
    );
  });
});
