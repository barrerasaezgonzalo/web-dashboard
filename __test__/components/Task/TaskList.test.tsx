import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskList } from "@/components/Task/TaskList";
import { Task } from "@/types";
import { TaskItem } from "@/components/Task/TaskItem";

/* ======================================================
   MOCK Drag & Drop (CRÍTICO)
====================================================== */
jest.mock("@hello-pangea/dnd", () => ({
  DragDropContext: ({ children, onDragEnd }: any) => (
    <div
      data-testid="dnd-context"
      onClick={() =>
        onDragEnd({
          source: { index: 0 },
          destination: { index: 1 },
        })
      }
    >
      {children}
    </div>
  ),
  Droppable: ({ children }: any) =>
    children({
      droppableProps: {},
      innerRef: jest.fn(),
      placeholder: null,
    }),
  Draggable: ({ children }: any) =>
    children(
      {
        draggableProps: {},
        dragHandleProps: {},
        innerRef: jest.fn(),
      },
      { isDragging: true },
    ),
}));

/* ======================================================
   DATOS Y MOCKS BASE (ESTO FALTABA EN TU CASO)
====================================================== */
const mockTasks: Task[] = [
  { id: "1", title: "Tarea 1", in_dev: false, order: 0 },
  { id: "2", title: "Tarea 2", in_dev: true, order: 1 },
];

const toggleTaskInDevMock = jest.fn();
const editTaskMock = jest.fn();
const onTaskRequestRemoveMock = jest.fn();
const updateTasksOrderMock = jest.fn();

/* ======================================================
   TESTS
====================================================== */
describe("TaskList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza todas las tareas", () => {
    render(
      <TaskList
        tasks={mockTasks}
        toggleTaskInDev={toggleTaskInDevMock}
        editTask={editTaskMock}
        onTaskRequestRemove={onTaskRequestRemoveMock}
        updateTasksOrder={updateTasksOrderMock}
      />,
    );

    expect(screen.getByText("Tarea 1")).toBeInTheDocument();
    expect(screen.getByText("Tarea 2")).toBeInTheDocument();
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

    fireEvent.click(screen.getByLabelText("Tarea 1"));

    expect(toggleTaskInDevMock).toHaveBeenCalledWith("1");
  });

  test("dispara editTask al editar y guardar", () => {
    render(
      <TaskList
        tasks={mockTasks}
        toggleTaskInDev={toggleTaskInDevMock}
        editTask={editTaskMock}
        onTaskRequestRemove={onTaskRequestRemoveMock}
        updateTasksOrder={updateTasksOrderMock}
      />,
    );

    fireEvent.click(screen.getByLabelText("Editar Tarea 1"));

    const input = screen.getByLabelText("Editar Tarea 1");
    fireEvent.change(input, { target: { value: "Editada" } });

    fireEvent.click(screen.getByLabelText("Guardar Tarea 1"));

    expect(editTaskMock).toHaveBeenCalledWith("1", "Editada");
  });

  test("dispara onTaskRequestRemove al eliminar", () => {
    render(
      <TaskList
        tasks={mockTasks}
        toggleTaskInDev={toggleTaskInDevMock}
        editTask={editTaskMock}
        onTaskRequestRemove={onTaskRequestRemoveMock}
        updateTasksOrder={updateTasksOrderMock}
      />,
    );

    fireEvent.click(screen.getByLabelText("Eliminar Tarea 1"));

    expect(onTaskRequestRemoveMock).toHaveBeenCalledWith("1");
  });

  test("actualiza el orden cuando hay destination", () => {
    render(
      <TaskList
        tasks={mockTasks}
        toggleTaskInDev={toggleTaskInDevMock}
        editTask={editTaskMock}
        onTaskRequestRemove={onTaskRequestRemoveMock}
        updateTasksOrder={updateTasksOrderMock}
      />,
    );

    fireEvent.click(screen.getByTestId("dnd-context"));

    expect(updateTasksOrderMock).toHaveBeenCalledTimes(1);
    expect(updateTasksOrderMock.mock.calls[0][0]).toHaveLength(2);
  });

  test("NO actualiza el orden si destination es null", () => {
    const dnd = require("@hello-pangea/dnd");

    dnd.DragDropContext = ({ children, onDragEnd }: any) => (
      <div
        data-testid="dnd-context-null"
        onClick={() =>
          onDragEnd({
            source: { index: 0 },
            destination: null,
          })
        }
      >
        {children}
      </div>
    );

    render(
      <TaskList
        tasks={mockTasks}
        toggleTaskInDev={toggleTaskInDevMock}
        editTask={editTaskMock}
        onTaskRequestRemove={onTaskRequestRemoveMock}
        updateTasksOrder={updateTasksOrderMock}
      />,
    );

    fireEvent.click(screen.getByTestId("dnd-context-null"));

    expect(updateTasksOrderMock).not.toHaveBeenCalled();
  });

  it("sale del modo edición al presionar Enter con título vacío y no guarda", () => {
    const onTaskUpdate = jest.fn();

    render(
      <TaskItem
        task={{ id: "1", title: "Tarea original", in_dev: false, order: 0 }}
        index={0}
        onTaskToggle={jest.fn()}
        onTaskUpdate={onTaskUpdate}
        onTaskRequestRemove={jest.fn()}
      />,
    );

    // Entrar en edición
    fireEvent.click(screen.getByLabelText("Editar Tarea original"));

    const input = screen.getByRole("textbox");

    // Dejar título "vacío"
    fireEvent.change(input, { target: { value: "   " } });

    // Presionar Enter (ESTO es lo clave)
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    // No guarda
    expect(onTaskUpdate).not.toHaveBeenCalled();
  });
  it("no guarda ni sale del modo edición al presionar una tecla distinta de Enter", () => {
    const onTaskUpdate = jest.fn();

    render(
      <TaskItem
        task={{ id: "1", title: "Tarea original", in_dev: false, order: 0 }}
        index={0}
        onTaskToggle={jest.fn()}
        onTaskUpdate={onTaskUpdate}
        onTaskRequestRemove={jest.fn()}
      />,
    );

    // Entrar en edición
    fireEvent.click(screen.getByLabelText("Editar Tarea original"));

    const input = screen.getByRole("textbox");

    // Cambiar el texto a algo válido
    fireEvent.change(input, { target: { value: "Nuevo título" } });

    // Presionar una tecla cualquiera (NO Enter)
    fireEvent.keyDown(input, { key: "a", code: "KeyA" });

    // No guarda
    expect(onTaskUpdate).not.toHaveBeenCalled();

    // Sigue en modo edición
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("detiene la propagación al hacer click en el título", () => {
    const parentClick = jest.fn();

    render(
      <div onClick={parentClick}>
        <TaskItem
          task={{ id: "1", title: "Tarea original", in_dev: false, order: 0 }}
          index={0}
          onTaskToggle={jest.fn()}
          onTaskUpdate={jest.fn()}
          onTaskRequestRemove={jest.fn()}
        />
      </div>,
    );

    const title = screen.getByText("Tarea original");

    fireEvent.click(title);

    expect(parentClick).not.toHaveBeenCalled();
  });

  it("detiene la propagación al hacer mouseDown en el título", () => {
    const parentMouseDown = jest.fn();

    render(
      <div onMouseDown={parentMouseDown}>
        <TaskItem
          task={{ id: "1", title: "Tarea original", in_dev: false, order: 0 }}
          index={0}
          onTaskToggle={jest.fn()}
          onTaskUpdate={jest.fn()}
          onTaskRequestRemove={jest.fn()}
        />
      </div>,
    );

    const title = screen.getByText("Tarea original");

    fireEvent.mouseDown(title);

    expect(parentMouseDown).not.toHaveBeenCalled();
  });
  it("llama onTaskUpdate con id vacío cuando la tarea no tiene id", () => {
    const onTaskUpdate = jest.fn();

    render(
      <TaskItem
        task={{ title: "Tarea sin id", in_dev: false } as any}
        index={0}
        onTaskToggle={jest.fn()}
        onTaskUpdate={onTaskUpdate}
        onTaskRequestRemove={jest.fn()}
      />,
    );

    // Entrar en edición
    fireEvent.click(screen.getByLabelText("Editar Tarea sin id"));

    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "Nuevo título" } });

    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(onTaskUpdate).toHaveBeenCalledWith("", "Nuevo título");
  });
  it("llama onTaskRequestRemove con id vacío cuando la tarea no tiene id", () => {
    const onTaskRequestRemove = jest.fn();

    render(
      <TaskItem
        task={{ title: "Tarea sin id", in_dev: false } as any}
        index={0}
        onTaskToggle={jest.fn()}
        onTaskUpdate={jest.fn()}
        onTaskRequestRemove={onTaskRequestRemove}
      />,
    );

    fireEvent.click(screen.getByLabelText("Eliminar Tarea sin id"));

    expect(onTaskRequestRemove).toHaveBeenCalledWith("");
  });

  it("aplica la clase bg-blue-200 cuando la tarea está siendo arrastrada", () => {
    render(
      <TaskItem
        task={{ id: "1", title: "Tarea original", in_dev: false, order: 0 }}
        index={0}
        onTaskToggle={jest.fn()}
        onTaskUpdate={jest.fn()}
        onTaskRequestRemove={jest.fn()}
      />,
    );

    const listItem = screen.getByText("Tarea original").closest("li");

    expect(listItem).toHaveClass("bg-blue-200");
  });
});
