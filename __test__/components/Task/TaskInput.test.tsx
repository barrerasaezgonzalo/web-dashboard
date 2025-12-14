import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskInput } from "@/components/Task/TaskInput";

describe("TaskInput", () => {
  let setTitleMock: jest.Mock;
  let onAddMock: jest.Mock;
  let onKeyDownMock: jest.Mock;

  beforeEach(() => {
    setTitleMock = jest.fn();
    onAddMock = jest.fn();
    onKeyDownMock = jest.fn();
  });

  test("renderiza input con valor inicial y botón", () => {
    render(
      <TaskInput
        title="Tarea inicial"
        setTitle={setTitleMock}
        onAdd={onAddMock}
        onKeyDown={onKeyDownMock}
      />,
    );

    const input = screen.getByPlaceholderText(
      "Agregar nueva tarea",
    ) as HTMLInputElement;
    expect(input.value).toBe("Tarea inicial");

    const button = screen.getByText("+");
    expect(button).toBeInTheDocument();
  });

  test("cambia el valor del input al escribir", () => {
    render(
      <TaskInput
        title=""
        setTitle={setTitleMock}
        onAdd={onAddMock}
        onKeyDown={onKeyDownMock}
      />,
    );

    const input = screen.getByPlaceholderText("Agregar nueva tarea");
    fireEvent.change(input, { target: { value: "Nueva tarea" } });

    expect(setTitleMock).toHaveBeenCalledWith("Nueva tarea");
  });

  test("dispara onAdd al hacer click en el botón", () => {
    render(
      <TaskInput
        title=""
        setTitle={setTitleMock}
        onAdd={onAddMock}
        onKeyDown={onKeyDownMock}
      />,
    );

    const button = screen.getByText("+");
    fireEvent.click(button);
    expect(onAddMock).toHaveBeenCalled();
  });

  test("dispara onKeyDown al presionar una tecla", () => {
    render(
      <TaskInput
        title=""
        setTitle={setTitleMock}
        onAdd={onAddMock}
        onKeyDown={onKeyDownMock}
      />,
    );

    const input = screen.getByPlaceholderText("Agregar nueva tarea");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onKeyDownMock).toHaveBeenCalled();
  });
});
