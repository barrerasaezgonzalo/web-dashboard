import "@testing-library/jest-dom";
import React, { useContext } from "react";
import { render } from "@testing-library/react";
import { useTasks } from "@/hooks/useTasks";
import { TaskProvider } from "@/context/TasksContext";

describe("useTasks hook", () => {
  test("lanza error cuando se usa fuera del TaskProvider", () => {
    const TestComponent = () => {
      // Esto debería lanzar
      useTasks();
      return null;
    };

    expect(() => render(<TestComponent />)).toThrow(
      "useTasks debe ser usado dentro de un TasksProvider",
    );
  });

  test("devuelve el contexto correctamente dentro del TaskProvider", () => {
    let contextValue: any;

    const TestComponent = () => {
      contextValue = useTasks();
      return null;
    };

    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>,
    );

    expect(contextValue).toHaveProperty("tasks");
    expect(contextValue).toHaveProperty("tasksLoading");
    expect(contextValue).toHaveProperty("getTasks");
    expect(contextValue).toHaveProperty("addTask");
    expect(contextValue).toHaveProperty("toggleTaskInDev");
    expect(contextValue).toHaveProperty("removeTask");
    expect(contextValue).toHaveProperty("editTask");
    expect(contextValue).toHaveProperty("updateTasksOrder");
  });
});
