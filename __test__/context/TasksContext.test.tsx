// __tests__/context/TasksContext.test.tsx

import { render, waitFor, act } from "@testing-library/react";
import React, { useContext } from "react";
import {
  TasksProvider,
  TasksContext,
  TaskContextType,
} from "@/context/TasksContext";
import { Task } from "@/types";

// Mock global fetch
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

const tasksInitial = [
  { id: "1", title: "A", in_dev: false },
  { id: "2", title: "B", in_dev: false },
];
(fetch as jest.Mock).mockResolvedValueOnce({
  ok: true,
  json: async () => tasksInitial,
});

describe("TasksProvider", () => {
  afterEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  test("proporciona valores iniciales correctos", () => {
    let contextValue: TaskContextType | undefined;
    const TestComponent = () => {
      contextValue = useContext(TasksContext);
      return null;
    };

    render(
      <TasksProvider>
        <TestComponent />
      </TasksProvider>,
    );

    expect(contextValue?.tasks).toEqual([]);
    expect(typeof contextValue?.getTasks).toBe("function");
    expect(typeof contextValue?.addTask).toBe("function");
    expect(typeof contextValue?.toggleTaskInDev).toBe("function");
    expect(typeof contextValue?.removeTask).toBe("function");
    expect(typeof contextValue?.editTask).toBe("function");
    expect(typeof contextValue?.updateTasksOrder).toBe("function");
  });

  test("getTasks actualiza tasks correctamente", async () => {
    const mockTasks: Task[] = [
      { id: "1", title: "Task 1", in_dev: false, order: 0 },
      { id: "2", title: "Task 2", in_dev: true, order: 0 },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockTasks,
    });

    window.localStorage.setItem("authDashboard", "auth-token");

    let contextValue: TaskContextType | undefined;
    const TestComponent = () => {
      contextValue = useContext(TasksContext);
      return null;
    };

    render(
      <TasksProvider>
        <TestComponent />
      </TasksProvider>,
    );

    await waitFor(() => {
      expect(contextValue?.tasks).toEqual(mockTasks);
      expect(contextValue?.tasksLoading).toBe(false);
    });

    expect(fetch).toHaveBeenCalledWith("/api/tasks/get?authData=auth-token");
  });

  test("getTasks maneja error y limpia tasks", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));
    window.localStorage.setItem("authDashboard", "auth-token");

    let contextValue: TaskContextType | undefined;
    const TestComponent = () => {
      contextValue = useContext(TasksContext);
      return null;
    };

    render(
      <TasksProvider>
        <TestComponent />
      </TasksProvider>,
    );

    await waitFor(() => {
      expect(contextValue?.tasks).toEqual([]);
      expect(contextValue?.tasksLoading).toBe(false);
    });
  });

  test("getTasks hace fetch cuando authData no es null", async () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValueOnce(
      "some-auth-token",
    );

    let contextValue: TaskContextType | undefined;
    const TestComponent = () => {
      contextValue = useContext(TasksContext);
      return null;
    };

    render(
      <TasksProvider>
        <TestComponent />
      </TasksProvider>,
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/tasks/get?authData=some-auth-token",
      );
    });
  });

  test("addTask agrega nueva tarea correctamente", async () => {
    const newTask: Task = { id: "3", title: "Task 3", in_dev: false, order: 0 };
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [newTask],
    });

    window.localStorage.setItem("authDashboard", "auth-token");

    let contextValue: TaskContextType | undefined;
    const TestComponent = () => {
      contextValue = useContext(TasksContext);
      return null;
    };

    render(
      <TasksProvider>
        <TestComponent />
      </TasksProvider>,
    );

    await act(async () => {
      await contextValue?.addTask("Task 3");
    });

    expect(contextValue?.tasks).toContainEqual(newTask);
    expect(fetch).toHaveBeenCalledWith("/api/tasks/add", expect.any(Object));
  });

  test("addTask maneja error sin romper", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Fail"));

    window.localStorage.setItem("authDashboard", "auth-token");

    let contextValue: TaskContextType | undefined;
    const TestComponent = () => {
      contextValue = useContext(TasksContext);
      return null;
    };

    render(
      <TasksProvider>
        <TestComponent />
      </TasksProvider>,
    );

    await act(async () => {
      await contextValue?.addTask("Fail Task");
    });

    expect(contextValue?.tasks).toEqual([]);
  });

  test("editTask actualiza tarea correctamente", async () => {
    const oldTask: Task = { id: "1", title: "Old", in_dev: false, order: 0 };
    const updatedTask: Task = {
      id: "1",
      title: "New",
      in_dev: false,
      order: 0,
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [oldTask],
    });

    let contextValue: TaskContextType | undefined;
    const TestComponent = () => {
      contextValue = useContext(TasksContext);
      return null;
    };

    render(
      <TasksProvider>
        <TestComponent />
      </TasksProvider>,
    );

    await act(async () => {
      /* @ts-ignore */
      contextValue?.setTasks?.([oldTask] as any);
      await contextValue?.editTask("1", "New");
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => updatedTask,
    });

    await act(async () => {
      await contextValue?.editTask("1", "New");
    });

    expect(contextValue?.tasks.find((t) => t.id === "1")?.title).toBe("New");
  });

  test("removeTask elimina tarea correctamente", async () => {
    const task: Task = { id: "1", title: "Task", in_dev: false, order: 0 };

    let contextValue: TaskContextType | undefined;
    const TestComponent = () => {
      contextValue = useContext(TasksContext);
      return null;
    };

    render(
      <TasksProvider>
        <TestComponent />
      </TasksProvider>,
    );

    act(() => {
      /* @ts-ignore */
      contextValue?.setTasks?.([task] as any);
    });

    await act(async () => {
      await contextValue?.removeTask("1");
    });

    expect(contextValue?.tasks).toEqual([]);
  });

  test("addTask agrega nueva tarea a tasks existentes", async () => {
    const existingTask = { id: "0", title: "Existente", in_dev: false };
    const newTask = { id: "1", title: "Nueva tarea", in_dev: false };

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [existingTask],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [newTask],
      });

    let contextValue: TaskContextType | undefined;
    const Setup = () => {
      contextValue = useContext(TasksContext);
      return null;
    };

    render(
      <TasksProvider>
        <Setup />
      </TasksProvider>,
    );

    await waitFor(() => {
      expect(contextValue?.tasks).toEqual([existingTask]);
    });

    await act(async () => {
      await contextValue?.addTask("Nueva tarea");
    });

    expect(contextValue?.tasks).toEqual([existingTask, newTask]);
  });

  test("toggleTaskInDev invierte in_dev de la tarea y ejecuta setTasks callback", async () => {
    const existingTask = { id: "1", title: "Tarea", in_dev: false };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [existingTask],
    });

    let contextValue: TaskContextType | undefined;

    const Setup = () => {
      contextValue = useContext(TasksContext);
      return null;
    };

    render(
      <TasksProvider>
        <Setup />
      </TasksProvider>,
    );

    await waitFor(() => {
      expect(contextValue?.tasks).toEqual([existingTask]);
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...existingTask, in_dev: true }),
    });

    await act(async () => {
      await contextValue?.toggleTaskInDev("1");
    });

    expect(contextValue?.tasks).toEqual([{ ...existingTask, in_dev: true }]);

    expect(fetch).toHaveBeenCalledWith("/api/tasks/edit", expect.any(Object));
  });

  test("toggleTaskInDev no hace nada si el id no existe", async () => {
    const existingTask = { id: "1", title: "Tarea", in_dev: false };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [existingTask],
    });

    let contextValue: TaskContextType | undefined;

    const Setup = () => {
      contextValue = useContext(TasksContext);
      return null;
    };

    render(
      <TasksProvider>
        <Setup />
      </TasksProvider>,
    );

    await waitFor(() => {
      expect(contextValue?.tasks).toEqual([existingTask]);
    });

    await act(async () => {
      await contextValue?.toggleTaskInDev("999"); // id inexistente
    });

    expect(contextValue?.tasks).toEqual([existingTask]);

    expect(fetch).toHaveBeenCalledTimes(1); // solo el getTasks inicial
  });

  test("toggleTaskInDev revierte cambio y muestra error si fetch PATCH falla (coverage)", async () => {
    const task = { id: "1", title: "Tarea", in_dev: false };

    // Mock getTasks inicial
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [task],
    });

    let contextValue: TaskContextType | undefined;

    const Setup = () => {
      contextValue = useContext(TasksContext);
      return null;
    };

    render(
      <TasksProvider>
        <Setup />
      </TasksProvider>,
    );

    await waitFor(() => {
      expect(contextValue?.tasks).toEqual([task]);
    });

    // Mock fetch PATCH fallido
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Guardamos el state antes de toggle
    const oldState = [...(contextValue?.tasks || [])];

    await act(async () => {
      await contextValue?.toggleTaskInDev("1");
    });

    // Revert debe ejecutar setTasks con prev.map, aunque no cambie nada visual
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error en toggleTaskInDev:",
      expect.any(Error),
    );

    // Verificamos que el array siga igual que antes
    expect(contextValue?.tasks).toEqual(oldState);

    consoleSpy.mockRestore();
  });

  test("removeTask ejecuta catch si fetch DELETE falla", async () => {
    const existingTask = { id: "1", title: "Tarea", in_dev: false };

    // Mock fetch para getTasks inicial
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [existingTask],
    });

    let contextValue: TaskContextType | undefined;

    const Setup = () => {
      contextValue = useContext(TasksContext);
      return null;
    };

    render(
      <TasksProvider>
        <Setup />
      </TasksProvider>,
    );

    await waitFor(() => {
      expect(contextValue?.tasks).toEqual([existingTask]);
    });

    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await act(async () => {
      await contextValue?.removeTask("1");
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error al eliminar tarea:",
      expect.any(Error),
    );

    expect(contextValue?.tasks).toEqual([]);

    consoleSpy.mockRestore();
  });

  test("updateTasksOrder reordena tareas correctamente y revierte si PATCH falla", async () => {
    const tasksInitial = [
      { id: "1", title: "A", in_dev: false },
      { id: "2", title: "B", in_dev: false },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => tasksInitial,
    });

    let contextValue: TaskContextType | undefined;

    const Setup = () => {
      contextValue = useContext(TasksContext);
      return null;
    };

    render(
      <TasksProvider>
        <Setup />
      </TasksProvider>,
    );

    await waitFor(() => {
      expect(contextValue?.tasks).toEqual(tasksInitial);
    });

    const newOrder = [
      { id: "2", title: "B", in_dev: false, order: 0 },
      { id: "1", title: "A", in_dev: false, order: 0 },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    await act(async () => {
      await contextValue?.updateTasksOrder(newOrder);
    });

    expect(contextValue?.tasks).toEqual(newOrder);
    expect(fetch).toHaveBeenCalledWith(
      "/api/tasks/reorder",
      expect.any(Object),
    );

    const newOrderError = [
      { id: "1", title: "A", in_dev: false, order: 0 },
      { id: "2", title: "B", in_dev: false, order: 0 },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await act(async () => {
      await contextValue?.updateTasksOrder(newOrderError);
    });

    expect(contextValue?.tasks).toEqual(newOrder);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error en updateTasksOrder:",
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });

  test("editTask no modifica otras tareas", async () => {
    const tasksInitial = [
      { id: "1", title: "A", in_dev: false },
      { id: "2", title: "B", in_dev: false },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => tasksInitial,
    });

    let contextValue: TaskContextType | undefined;
    const Setup = () => {
      contextValue = useContext(TasksContext);
      return null;
    };

    render(
      <TasksProvider>
        <Setup />
      </TasksProvider>,
    );

    await waitFor(() => {
      expect(contextValue?.tasks).toEqual(tasksInitial);
    });

    const updatedTask = { id: "1", title: "A editada", in_dev: false };

    // Mock fetch PATCH para editTask
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => updatedTask,
    });

    await act(async () => {
      await contextValue?.editTask("1", "A editada");
    });

    // El id "2" no coincide, así se ejecuta el `: t` y cubre la rama
    expect(contextValue?.tasks.find((t) => t.id === "2")?.title).toBe("B");
  });

  test("toggleTaskInDev no modifica tareas que no coinciden con el id", async () => {
    const tasksInitial = [
      { id: "1", title: "A", in_dev: false },
      { id: "2", title: "B", in_dev: false },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => tasksInitial,
    });

    let contextValue: TaskContextType | undefined;
    const Setup = () => {
      contextValue = useContext(TasksContext);
      return null;
    };

    render(
      <TasksProvider>
        <Setup />
      </TasksProvider>,
    );

    await waitFor(() => expect(contextValue?.tasks).toEqual(tasksInitial));

    // Mock PATCH fallido para forzar revert
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    await act(async () => {
      await contextValue?.toggleTaskInDev("1");
    });

    // La tarea con id "2" nunca coincide, cubre `: task` en map
    expect(contextValue?.tasks.find((t) => t.id === "2")?.in_dev).toBe(false);
  });
});
