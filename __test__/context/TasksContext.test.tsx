import "@testing-library/jest-dom";
// __tests__/TasksContext.test.tsx
import React, { useContext } from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Task } from "@/types";
import { TaskProvider, TasksContext } from "@/context/TasksContext";

// Componente consumidor de prueba
const Consumer: React.FC = () => {
  const ctx = useContext(TasksContext);
  if (!ctx) return null;

  return (
    <div>
      <button onClick={() => ctx.addTask("Tarea de prueba")}>Add</button>
      <button onClick={() => ctx.editTask("1", "Tarea editada")}>Edit</button>
      <button onClick={() => ctx.toggleTaskInDev("1")}>Toggle</button>
      <button onClick={() => ctx.removeTask("1")}>Remove</button>
      <ul>
        {ctx.tasks.map((t) => (
          <li key={t.id}>
            {t.title} - {t.in_dev ? "InDev" : "Pending"}
          </li>
        ))}
      </ul>
    </div>
  );
};

beforeEach(() => {
  jest.restoreAllMocks();

  // Mock de localStorage para authData
  Storage.prototype.getItem = jest.fn(() => "auth123");
  Storage.prototype.setItem = jest.fn();

  // Mock global fetch
  global.fetch = jest.fn(async (url, options) => {
    if (url?.includes("/api/tasks/add")) {
      return {
        ok: true,
        json: async () => [
          {
            id: "1",
            title: JSON.parse(options!.body!.toString()).title,
            in_dev: false,
            order: 0,
          },
        ],
      };
    }
    if (url?.includes("/api/tasks/edit")) {
      return {
        ok: true,
        json: async () => ({
          id: "1",
          title: JSON.parse(options!.body!.toString()).title,
          in_dev: false,
          order: 0,
        }),
      };
    }
    if (url?.includes("/api/tasks/reorder")) {
      return { ok: true, json: async () => [] };
    }
    if (url?.includes("/api/tasks/get")) {
      return { ok: true, json: async () => [] };
    }
    return { ok: true, json: async () => ({}) };
  }) as jest.Mock;
});

test("TasksContext agrega tarea", async () => {
  render(
    <TaskProvider>
      <Consumer />
    </TaskProvider>,
  );

  const button = screen.getByText("Add");

  await act(async () => {
    fireEvent.click(button);
  });

  expect(screen.getByText("Tarea de prueba - Pending")).toBeInTheDocument();
});

test("TasksContext edita tarea", async () => {
  render(
    <TaskProvider>
      <Consumer />
    </TaskProvider>,
  );

  // Agregar primero la tarea
  await act(async () => {
    fireEvent.click(screen.getByText("Add"));
  });

  await act(async () => {
    fireEvent.click(screen.getByText("Edit"));
  });

  expect(screen.getByText("Tarea editada - Pending")).toBeInTheDocument();
});

test("TasksContext toggle in_dev", async () => {
  render(
    <TaskProvider>
      <Consumer />
    </TaskProvider>,
  );

  await act(async () => {
    fireEvent.click(screen.getByText("Add"));
  });

  await act(async () => {
    fireEvent.click(screen.getByText("Toggle"));
  });

  expect(screen.getByText("Tarea de prueba - InDev")).toBeInTheDocument();
});

test("TasksContext remueve tarea", async () => {
  render(
    <TaskProvider>
      <Consumer />
    </TaskProvider>,
  );

  await act(async () => {
    fireEvent.click(screen.getByText("Add"));
  });

  await act(async () => {
    fireEvent.click(screen.getByText("Remove"));
  });

  expect(screen.queryByText("Tarea de prueba")).not.toBeInTheDocument();
});
