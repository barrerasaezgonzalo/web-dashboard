import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Tasks from "@/components/Task/Task";

// Mock del hook
const mockUseTasks = {
  tasks: [{ id: "1", title: "Tarea 1", in_dev: false, date: "2025-12-20" }],
  addTask: jest.fn(),
  editTask: jest.fn(),
  toggleTaskInDev: jest.fn(),
  removeTask: jest.fn(),
  updateTasksOrder: jest.fn(),
};

jest.mock("@/hooks/useTasks", () => ({
  useTasks: () => mockUseTasks,
}));

describe("Tasks - tests extendidos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("agrega tarea si el título no está vacío", async () => {
    render(<Tasks />);
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "Nueva tarea");
    fireEvent.keyDown(input, { key: "Enter", code: "Enter", keyCode: 13 });
    expect(mockUseTasks.addTask).toHaveBeenCalledWith("Nueva tarea", "");
  });

  test("edita tarea al presionar Editar", async () => {
    render(<Tasks />);
    const editButton = screen.getByRole("button", { name: /Editar Tarea/i });
    fireEvent.click(editButton);

    // El input debe llenarse con el título de la tarea
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("Tarea 1");

    // Cambiamos el valor y guardamos
    await userEvent.clear(input);
    await userEvent.type(input, "Tarea editada");
    fireEvent.keyDown(input, { key: "Enter", code: "Enter", keyCode: 13 });

    expect(mockUseTasks.editTask).toHaveBeenCalledWith(
      "1",
      "Tarea editada",
      "2025-12-20",
    );
  });

  test("toggle de tarea al presionar Comenzar Tarea", () => {
    render(<Tasks />);
    const startButton = screen.getByRole("button", { name: /Comenzar Tarea/i });
    fireEvent.click(startButton);
    expect(mockUseTasks.toggleTaskInDev).toHaveBeenCalledWith("1");
  });

  test("elimina tarea y confirma en Toast", () => {
    render(<Tasks />);
    const deleteButton = screen.getByRole("button", {
      name: /Eliminar Tarea/i,
    });
    fireEvent.click(deleteButton);

    expect(
      screen.getByText("¿Estás seguro que deseas eliminar la tarea?"),
    ).toBeInTheDocument();

    // Confirmamos
    const confirmBtn = screen.getByRole("button", { name: /Sí/i });
    fireEvent.click(confirmBtn);

    expect(mockUseTasks.removeTask).toHaveBeenCalledWith("1");
    expect(
      screen.queryByText("¿Estás seguro que deseas eliminar la tarea?"),
    ).not.toBeInTheDocument();
  });

  test("cierra el Toast al cancelar eliminación", () => {
    render(<Tasks />);
    const deleteButton = screen.getByRole("button", {
      name: /Eliminar Tarea/i,
    });
    fireEvent.click(deleteButton);

    const cancelBtn = screen.getByRole("button", { name: /No/i });
    fireEvent.click(cancelBtn);

    expect(mockUseTasks.removeTask).not.toHaveBeenCalled();
  });

  test("tooltip visible al hacer hover sobre los botones", async () => {
    render(<Tasks />);
    const startButton = screen.getByRole("button", { name: /Comenzar Tarea/i });

    // hover
    await userEvent.hover(startButton);

    // El tooltip debe aparecer
    expect(screen.getByText("Comenzar Tarea")).toBeInTheDocument();

    // unhover
    await userEvent.unhover(startButton);
  });
});
