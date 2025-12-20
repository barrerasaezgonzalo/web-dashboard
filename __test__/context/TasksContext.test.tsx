import { render, waitFor, act } from "@testing-library/react";
import { useContext } from "react";
import {
  TasksProvider,
  TasksContext,
  TaskContextType,
} from "@/context/TasksContext";
import { Task } from "@/types";

jest.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
    from: jest.fn(),
  },
}));

global.fetch = jest.fn();

const mockInitialGetTasks = (tasks: Task[] = []) => {
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => tasks,
  });
};

jest.mock("@/context/UserContext", () => ({
  useUser: () => ({
    userId: "test-user-id",
    userName: "Test User",
  }),
}));

describe("TasksProvider", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const setup = () => {
    let contextValue: TaskContextType | undefined;

    const Wrapper = () => {
      contextValue = useContext(TasksContext);
      return null;
    };

    render(
      <TasksProvider>
        <Wrapper />
      </TasksProvider>,
    );

    return () => contextValue!;
  };

  test("estado inicial correcto", async () => {
    mockInitialGetTasks();

    const getContext = setup();

    await waitFor(() => {
      expect(getContext().tasks).toEqual([]);
      expect(getContext().tasksLoading).toBe(false);
    });
  });

  test("getTasks carga tareas", async () => {
    window.localStorage.setItem("authDashboard", "auth-token");

    const tasks = [{ id: "1", title: "A", in_dev: false, order: 0 }];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: "1", title: "A", in_dev: false, order: 0 }],
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
      expect(contextValue?.tasks).toEqual(tasks);
    });
  });

  test("addTask agrega tarea", async () => {
    mockInitialGetTasks([]);

    const newTask: Task = {
      id: "1",
      title: "Nueva",
      in_dev: false,
      order: 0,
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [newTask],
    });

    const getContext = setup();

    await act(async () => {
      await getContext().addTask("Nueva");
    });

    expect(getContext().tasks).toEqual([newTask]);
  });

  test("editTask solo modifica la tarea objetivo", async () => {
    const tasks: Task[] = [
      { id: "1", title: "A", in_dev: false, order: 0 },
      { id: "2", title: "B", in_dev: false, order: 0 },
    ];

    mockInitialGetTasks(tasks);

    const updatedTask = { id: "1", title: "A editada", in_dev: false };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => updatedTask,
    });

    const getContext = setup();

    await act(async () => {
      await getContext().editTask("1", "A editada");
    });

    expect(getContext().tasks).toEqual([updatedTask, tasks[1]]);
  });

  test("toggleTaskInDev revierte si falla", async () => {
    const task = { id: "1", title: "A", in_dev: false, order: 0 };

    mockInitialGetTasks([task]);

    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const getContext = setup();

    await act(async () => {
      await getContext().toggleTaskInDev("1");
    });

    expect(getContext().tasks).toEqual([task]);

    consoleSpy.mockRestore();
  });

  test("removeTask elimina tarea", async () => {
    const task = { id: "1", title: "A", in_dev: false, order: 0 };

    mockInitialGetTasks([task]);

    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    const getContext = setup();

    await act(async () => {
      await getContext().removeTask("1");
    });

    expect(getContext().tasks).toEqual([]);
  });
});
