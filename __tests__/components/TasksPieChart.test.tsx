import { render, screen } from "@testing-library/react";
import TasksPieChart from "@/components/Task/TasksPieChart";

const tasksMock = [
  { id: "1", title: "Task 1", in_dev: true, order: 0 },
  { id: "2", title: "Task 2", in_dev: false, order: 1 },
  { id: "3", title: "Task 3", in_dev: true, order: 2 },
];

describe("TasksPieChart Component", () => {
  it("renders title", () => {
    render(<TasksPieChart tasks={tasksMock} />);
    expect(screen.getByText(/Resumen de Tareas/i)).toBeInTheDocument();
  });

  it("calculates correct values for in_dev and pending", () => {
    const in_dev = tasksMock.filter((t) => t.in_dev).length;
    const pending = tasksMock.length - in_dev;

    expect(in_dev).toBe(2); // tareas en curso
    expect(pending).toBe(1); // pendientes
  });
});
