import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { NotesComponent } from "@/components/Notes/Notes";
import { useData } from "@/hooks/useData";
import { handleTextChange } from "@/utils";

// Mock de useData
jest.mock("@/hooks/useData", () => ({
  useData: jest.fn(),
}));

// Mock de handleTextChange
jest.mock("@/utils", () => ({
  handleTextChange: jest.fn(),
}));

describe("NotesComponent", () => {
  const mockSetNote = jest.fn();
  const mockSaveNote = jest.fn();

  beforeEach(() => {
    (useData as jest.Mock).mockReturnValue({
      note: "Nota inicial",
      setNote: mockSetNote,
      saveNote: mockSaveNote,
    });
    (handleTextChange as jest.Mock).mockImplementation((e, set, save) => {
      set(e.target.value);
      save(e.target.value);
    });
  });

  test("renderiza título y textarea con valor del hook", () => {
    render(<NotesComponent />);
    expect(screen.getByText("Nota Rápida")).toBeInTheDocument();
    const textarea = screen.getByPlaceholderText(
      "Escribe tu nota...",
    ) as HTMLTextAreaElement;
    expect(textarea.value).toBe("Nota inicial");
  });

  test("llama handleTextChange al modificar el textarea", () => {
    render(<NotesComponent />);
    const textarea = screen.getByPlaceholderText(
      "Escribe tu nota...",
    ) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "Nueva nota" } });

    expect(handleTextChange).toHaveBeenCalled();
    expect(mockSetNote).toHaveBeenCalledWith("Nueva nota");
    expect(mockSaveNote).toHaveBeenCalledWith("Nueva nota");
  });
});
