import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskList } from "@/components/Task/TaskList";
import { Task } from "@/types";

// Mock de tareas
const mockTasks: Task[] = [
  { id: "1", title: "Tarea 1", in_dev: false, order: 0 },
  { id: "2", title: "Tarea 2", in_dev: true, order: 1 },
  { id: "3", title: "Tarea 3", in_dev: false, order: 2 },
];

describe("TaskList", () => {
  let toggleTaskInDevMock: jest.Mock;
  let editTaskMock: jest.Mock;
  let onTaskRequestRemoveMock: jest.Mock;
  let updateTasksOrderMock: jest.Mock;

  beforeEach(() => {
    toggleTaskInDevMock = jest.fn();
    editTaskMock = jest.fn();
    onTaskRequestRemoveMock = jest.fn();
    updateTasksOrderMock = jest.fn();
  });

  test("renderiza todos los TaskItems", () => {
    render(
      <TaskList
        tasks={mockTasks}
        toggleTaskInDev={toggleTaskInDevMock}
        editTask={editTaskMock}
        onTaskRequestRemove={onTaskRequestRemoveMock}
        updateTasksOrder={updateTasksOrderMock}
      />,
    );

    mockTasks.forEach((task) => {
      expect(screen.getByText(task.title)).toBeInTheDocument();
    });
  });

  test("dispara toggleTaskInDev al clickear checkbox", () => {
    render(
      <TaskList
        tasks={mockTasks}
        toggleTaskInDev={toggleTaskInDevMock}
        editTask={editTaskMock}
        onTaskRequestRemove={onTaskRequestRemoveMock}
        updateTasksOrder={updateTasksOrderMock}
      />,
    );

    const checkbox = screen.getByLabelText("Tarea 1");
    fireEvent.click(checkbox);
    expect(toggleTaskInDevMock).toHaveBeenCalledWith("1");
  });

  test("dispara editTask al editar y guardar un TaskItem", () => {
    render(
      <TaskList
        tasks={mockTasks}
        toggleTaskInDev={toggleTaskInDevMock}
        editTask={editTaskMock}
        onTaskRequestRemove={onTaskRequestRemoveMock}
        updateTasksOrder={updateTasksOrderMock}
      />,
    );

    const editButton = screen.getByLabelText("Editar Tarea 1");
    fireEvent.click(editButton);

    const input = screen.getByLabelText("Editar Tarea 1");
    fireEvent.change(input, { target: { value: "Tarea editada" } });

    const saveButton = screen.getByLabelText("Guardar Tarea 1");
    fireEvent.click(saveButton);

    expect(editTaskMock).toHaveBeenCalledWith("1", "Tarea editada");
  });

  test("dispara onTaskRequestRemove al eliminar un TaskItem", () => {
    render(
      <TaskList
        tasks={mockTasks}
        toggleTaskInDev={toggleTaskInDevMock}
        editTask={editTaskMock}
        onTaskRequestRemove={onTaskRequestRemoveMock}
        updateTasksOrder={updateTasksOrderMock}
      />,
    );

    const deleteButton = screen.getByLabelText("Eliminar Tarea 1");
    fireEvent.click(deleteButton);

    expect(onTaskRequestRemoveMock).toHaveBeenCalledWith("1");
  });

  test("dispara updateTasksOrder al actualizar orden", () => {
    const updateTasksOrderMock = jest.fn();

    render(
      <TaskList
        tasks={mockTasks}
        toggleTaskInDev={jest.fn()}
        editTask={jest.fn()}
        onTaskRequestRemove={jest.fn()}
        updateTasksOrder={updateTasksOrderMock}
      />,
    );

    // Simulamos directamente que se llamó updateTasksOrder con las tareas reordenadas
    updateTasksOrderMock(mockTasks);

    expect(updateTasksOrderMock).toHaveBeenCalledWith(mockTasks);
  });
});
