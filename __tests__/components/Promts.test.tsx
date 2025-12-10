import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Promts } from "@/components/Prompt/Prompt";

// Mock de navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe("Promts Component", () => {
  const mockParsedData = {
    title: "Test Title",
    objective: "Test Objective",
    instructions: "Test Instructions",
    context: "Test Context",
    examples: ["Ex1", "Ex2"],
    expected_output: "Expected Result",
  };

  it("renders title, tip, textarea and buttons", () => {
    const getPromptMock = jest.fn();
    render(<Promts getPrompt={getPromptMock} />);

    expect(screen.getByText("Mejora tu Prompt")).toBeInTheDocument();
    expect(screen.getByText(/Este widget te ayuda a mejorar tus prompts/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Escribe tu prompt...")).toBeInTheDocument();
    expect(screen.getByText("Mejorar")).toBeInTheDocument();
    expect(screen.getByText("Copiar")).toBeInTheDocument();
  });

  it("updates input state when typing", () => {
    const getPromptMock = jest.fn();
    render(<Promts getPrompt={getPromptMock} />);

    const textarea = screen.getByPlaceholderText("Escribe tu prompt...");
    fireEvent.change(textarea, { target: { value: "Hola GPT" } });

    expect((textarea as HTMLTextAreaElement).value).toBe("Hola GPT");
  });

  it("calls getPrompt and renders parsedData on Mejorar click", async () => {
    const getPromptMock = jest.fn().mockResolvedValue(JSON.stringify(mockParsedData));

    render(<Promts getPrompt={getPromptMock} />);
    const textarea = screen.getByPlaceholderText("Escribe tu prompt...");
    fireEvent.change(textarea, { target: { value: "Hola GPT" } });

    fireEvent.click(screen.getByText("Mejorar"));

    await waitFor(() => {
      // Verifica que getPrompt haya sido llamado con el input
      expect(getPromptMock).toHaveBeenCalledWith("Hola GPT");

      // Verifica que los datos parseados se hayan renderizado
      expect(screen.getByText(mockParsedData.title)).toBeInTheDocument();
      expect(screen.getByText(mockParsedData.objective)).toBeInTheDocument();
      expect(screen.getByText(mockParsedData.instructions)).toBeInTheDocument();
      expect(screen.getByText(mockParsedData.context)).toBeInTheDocument();
      expect(screen.getByText("Ex1, Ex2")).toBeInTheDocument();
      expect(screen.getByText(mockParsedData.expected_output)).toBeInTheDocument();
    });
  });

  it("copies text to clipboard when Copiar button is clicked", async () => {
    const getPromptMock = jest.fn().mockResolvedValue(JSON.stringify(mockParsedData));

    render(<Promts getPrompt={getPromptMock} />);

    // Simula que parsedData ya está seteado
    const textarea = screen.getByPlaceholderText("Escribe tu prompt...");
    fireEvent.change(textarea, { target: { value: "Hola GPT" } });
    fireEvent.click(screen.getByText("Mejorar"));

    await waitFor(() => {
      expect(screen.getByText(mockParsedData.title)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Copiar"));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });
  });

  it("shows error message if JSON is invalid", async () => {
    const mockGetPrompt = jest.fn();

    mockGetPrompt.mockResolvedValue("Texto no JSON");

    render(<Promts getPrompt={mockGetPrompt} />);
    const textarea = screen.getByPlaceholderText("Escribe tu prompt...");
    fireEvent.change(textarea, { target: { value: "prompt" } });

    fireEvent.click(screen.getByText("Mejorar"));

    await waitFor(() => {
      expect(textarea).toHaveValue("Ocurrió un error");
    });
  });
});
