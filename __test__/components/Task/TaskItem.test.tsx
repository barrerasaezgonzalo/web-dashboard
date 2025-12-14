import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskItem } from "@/components/Task/TaskItem";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { JSX } from "react";

const mockTask = {
  id: "1",
  title: "Tarea de prueba",
  in_dev: false,
  order: 0,
};

const renderWithDnd = (component: JSX.Element) => {
  return render(
    <DragDropContext onDragEnd={() => {}}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <ul ref={provided.innerRef} {...provided.droppableProps}>
            {component}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>,
  );
};

describe("TaskItem", () => {
  let onTaskToggleMock: jest.Mock;
  let onTaskUpdateMock: jest.Mock;
  let onTaskRequestRemoveMock: jest.Mock;

  beforeEach(() => {
    onTaskToggleMock = jest.fn();
    onTaskUpdateMock = jest.fn();
    onTaskRequestRemoveMock = jest.fn();
  });

  test("renderiza correctamente el título y checkbox", () => {
    renderWithDnd(
      <TaskItem
        task={mockTask}
        index={0}
        onTaskToggle={onTaskToggleMock}
        onTaskUpdate={onTaskUpdateMock}
        onTaskRequestRemove={onTaskRequestRemoveMock}
      />,
    );

    expect(screen.getByText("Tarea de prueba")).toBeInTheDocument();
    const checkbox = screen.getByRole("checkbox", { name: "Tarea de prueba" });
    expect(checkbox).not.toBeChecked();
  });

  test("dispara onTaskToggle al clickear el checkbox", () => {
    renderWithDnd(
      <TaskItem
        task={mockTask}
        index={0}
        onTaskToggle={onTaskToggleMock}
        onTaskUpdate={onTaskUpdateMock}
        onTaskRequestRemove={onTaskRequestRemoveMock}
      />,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Tarea de prueba" });
    fireEvent.click(checkbox);

    expect(onTaskToggleMock).toHaveBeenCalledWith("1");
  });

  test("entra en modo edición al clickear editar", () => {
    renderWithDnd(
      <TaskItem
        task={mockTask}
        index={0}
        onTaskToggle={onTaskToggleMock}
        onTaskUpdate={onTaskUpdateMock}
        onTaskRequestRemove={onTaskRequestRemoveMock}
      />,
    );

    const editButton = screen.getByLabelText("Editar Tarea de prueba");
    fireEvent.click(editButton);

    const input = screen.getByLabelText("Editar Tarea de prueba");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("Tarea de prueba");
  });

  test("guarda cambios al clickear guardar", () => {
    renderWithDnd(
      <TaskItem
        task={mockTask}
        index={0}
        onTaskToggle={onTaskToggleMock}
        onTaskUpdate={onTaskUpdateMock}
        onTaskRequestRemove={onTaskRequestRemoveMock}
      />,
    );

    fireEvent.click(screen.getByLabelText("Editar Tarea de prueba"));

    const input = screen.getByLabelText("Editar Tarea de prueba");
    fireEvent.change(input, { target: { value: "Nueva Tarea" } });

    const saveButton = screen.getByLabelText("Guardar Tarea de prueba");
    fireEvent.click(saveButton);

    expect(onTaskUpdateMock).toHaveBeenCalledWith("1", "Nueva Tarea");
  });

  test("dispara onTaskRequestRemove al clickear eliminar", () => {
    renderWithDnd(
      <TaskItem
        task={mockTask}
        index={0}
        onTaskToggle={onTaskToggleMock}
        onTaskUpdate={onTaskUpdateMock}
        onTaskRequestRemove={onTaskRequestRemoveMock}
      />,
    );

    const deleteButton = screen.getByLabelText("Eliminar Tarea de prueba");
    fireEvent.click(deleteButton);

    expect(onTaskRequestRemoveMock).toHaveBeenCalledWith("1");
  });

  test("guarda cambios al presionar Enter", () => {
    renderWithDnd(
      <TaskItem
        task={mockTask}
        index={0}
        onTaskToggle={onTaskToggleMock}
        onTaskUpdate={onTaskUpdateMock}
        onTaskRequestRemove={onTaskRequestRemoveMock}
      />,
    );

    fireEvent.click(screen.getByLabelText("Editar Tarea de prueba"));
    const input = screen.getByLabelText("Editar Tarea de prueba");
    fireEvent.change(input, { target: { value: "Tarea Enter" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onTaskUpdateMock).toHaveBeenCalledWith("1", "Tarea Enter");
  });
});
