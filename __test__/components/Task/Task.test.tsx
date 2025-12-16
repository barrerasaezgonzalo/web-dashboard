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

jest.mock("@/components/Task/TaskList", () => ({
  TaskList: ({ onTaskRequestRemove }: any) => (
    <button onClick={() => onTaskRequestRemove("1")}>Eliminar</button>
  ),
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

    // 1. Abrir el Toast (mock de TaskList)
    fireEvent.click(screen.getByText("Eliminar"));

    // 2. Toast visible
    expect(
      screen.getByText("¿Estás seguro que deseas eliminar la tarea?"),
    ).toBeInTheDocument();

    // 3. Confirmar (botón real del Toast)
    fireEvent.click(screen.getByRole("button", { name: "Sí" }));

    // 4. removeTask ejecutado
    expect(mockUseTasks.removeTask).toHaveBeenCalledWith("1");

    // 5. Toast cerrado
    expect(
      screen.queryByText("¿Estás seguro que deseas eliminar la tarea?"),
    ).not.toBeInTheDocument();
  });

  test("cierra el Toast al cancelar eliminación", () => {
    render(<Tasks />);

    fireEvent.click(screen.getByText("Eliminar"));

    fireEvent.click(screen.getByRole("button", { name: "No" }));

    expect(mockUseTasks.removeTask).not.toHaveBeenCalled();
  });

  test("NO añade tarea si el título está vacío o solo tiene espacios", () => {
    render(<Tasks />);

    const addButton = screen.getByRole("button", { name: "Agregar tarea" });

    // Caso 1: input vacío
    fireEvent.click(addButton);
    expect(mockUseTasks.addTask).not.toHaveBeenCalled();

    // Caso 2: input solo con espacios
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.click(addButton);

    expect(mockUseTasks.addTask).not.toHaveBeenCalled();
  });

  test("no agrega tarea si el título está vacío", () => {
    render(<Tasks />);

    // Cambiar el valor del input a una cadena vacía
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "" } });

    // Simular la acción de presionar Enter
    fireEvent.keyDown(input, { key: "Enter" });

    // Verificar que addTask NO haya sido llamado
    expect(mockUseTasks.addTask).not.toHaveBeenCalled();
  });

  test("agrega tarea si el título no está vacío", () => {
    render(<Tasks />);

    const input = screen.getByRole("textbox");

    // Cambiar el valor del input a algo no vacío
    fireEvent.change(input, { target: { value: "Nueva tarea" } });

    // Simular la acción de presionar Enter
    fireEvent.keyDown(input, { key: "Enter" });

    // Verificar que addTask haya sido llamado con el valor correcto
    expect(mockUseTasks.addTask).toHaveBeenCalledWith("Nueva tarea");
  });
});
