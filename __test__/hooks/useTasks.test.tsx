import { renderHook } from "@testing-library/react";
import { useTasks } from "@/hooks/useTasks";
import { TasksProvider } from "@/context/TasksContext";

jest.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
    from: jest.fn(),
  },
}));

describe("useTasks hook", () => {
  it("lanza error si se usa fuera del TaskProvider", () => {
    expect(() => renderHook(() => useTasks())).toThrow(
      "useTasks debe ser usado dentro de un TasksProvider",
    );
  });

  it("puede ser usado dentro del TaskProvider", () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: ({ children }) => <TasksProvider>{children}</TasksProvider>,
    });

    // solo verificamos que devuelve un objeto con keys esperadas
    expect(result.current).toHaveProperty("tasks");
    expect(result.current).toHaveProperty("getTasks");
    expect(result.current).toHaveProperty("addTask");
  });
});
