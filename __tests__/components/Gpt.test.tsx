import { render, screen, fireEvent } from "@testing-library/react";
import { Gpt } from "@/components/Gpt/Gpt";
import * as utils from "@/utils";

describe("Gpt Component", () => {
  it("renders title, textarea and button, and calls abrirGpt on click", () => {
    const abrirGptMock = jest.spyOn(utils, "abrirGpt").mockImplementation(jest.fn());

    render(<Gpt />);

    // Verificar elementos visibles
    expect(screen.getByText("Consulta a AI")).toBeInTheDocument();
    const textarea = screen.getByPlaceholderText("Escribe tu prompt...");
    expect(textarea).toBeInTheDocument();
    const button = screen.getByText("Enviar a GPT");
    expect(button).toBeInTheDocument();

    // Simular escritura
    fireEvent.change(textarea, { target: { value: "Hola GPT" } });
    expect(textarea).toHaveValue("Hola GPT");

    // Simular click
    fireEvent.click(button);
    expect(abrirGptMock).toHaveBeenCalledWith("Hola GPT", expect.any(Function));

    abrirGptMock.mockRestore();
  });
});
