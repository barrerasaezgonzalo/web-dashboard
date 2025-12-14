import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { AutoTextarea } from "@/components/Prompt/AutoTextareaProps";

describe("AutoTextarea", () => {
  const onChangeMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza el textarea con valor inicial y placeholder", () => {
    render(<AutoTextarea value="Hola" onChange={onChangeMock} />);
    const textarea = screen.getByPlaceholderText(
      "Escribe tu prompt...",
    ) as HTMLTextAreaElement;
    expect(textarea).toBeInTheDocument();
    expect(textarea.value).toBe("Hola");
  });

  test("llama a onChange al escribir en el textarea", () => {
    render(<AutoTextarea value="" onChange={onChangeMock} />);
    const textarea = screen.getByPlaceholderText(
      "Escribe tu prompt...",
    ) as HTMLTextAreaElement;

    fireEvent.change(textarea, { target: { value: "Nuevo valor" } });
    expect(onChangeMock).toHaveBeenCalledWith("Nuevo valor");
  });
});
