import { render, screen, fireEvent } from "@testing-library/react";
import { Notes } from "@/components/Notes/Notes";

// Creamos mocks afuera
const setNoteMock = jest.fn();
const getNoteMock = jest.fn();
const saveNoteMock = jest.fn();

jest.mock("@/hooks/useData", () => ({
  useData: () => ({
    note: "",
    setNote: setNoteMock,
    getNote: getNoteMock,
    saveNote: saveNoteMock,
  }),
}));

describe("Notes Component", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // limpia los mocks antes de cada test
  });

  it("renders title and textarea", () => {
    render(<Notes />);
    expect(screen.getByText("Nota Rápida")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Escribe tu nota...")).toBeInTheDocument();
  });

  it("calls getNote on mount", () => {
    render(<Notes />);
    expect(getNoteMock).toHaveBeenCalled();
  });

  it("updates note and calls setNote and saveNote on change", () => {
    render(<Notes />);
    const textarea = screen.getByPlaceholderText("Escribe tu nota...");
    fireEvent.change(textarea, { target: { value: "Nueva nota" } });

    expect(setNoteMock).toHaveBeenCalledWith("Nueva nota");
    expect(saveNoteMock).toHaveBeenCalledWith("Nueva nota");
  });
});
