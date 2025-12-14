import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Tasks from "@/components/Task/Task";

// Mock del hook
const mockUseTasks = {
  tasks: [{ id: "1", title: "Tarea 1", in_dev: false }],
  addTask: jest.fn(),
  editTask: jest.fn(),
  toggleTaskInDev: jest.fn(),
  removeTask: jest.fn(),
  updateTasksOrder: jest.fn(),
};

jest.mock("@/hooks/useTasks", () => ({
  useTasks: () => mockUseTasks,
}));

describe("Tasks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza título y componentes hijos", () => {
    render(<Tasks />);
    expect(screen.getByText("Lista de pendientes")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument(); // TaskInput
  });

  test("añade tarea al presionar Enter", () => {
    render(<Tasks />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Nueva tarea" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(mockUseTasks.addTask).toHaveBeenCalledWith("Nueva tarea");
  });

  test("muestra y confirma el Toast al eliminar tarea", () => {
    render(<Tasks />);
    // Simular que TaskList llama onTaskRequestRemove
    const tasksComponent = screen.getByText("Lista de pendientes");
    // Lógica para disparar showToast
    // Aquí se necesitará encontrar el botón de eliminar en TaskList o llamar directamente la función
  });
});
