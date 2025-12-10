import { render, screen } from "@testing-library/react";
import User from "@/components/User/User";

const tasksMock = [
  { id: "1", title: "Task 1", in_dev: true, order: 0 },
  { id: "2", title: "Task 2", in_dev: false, order: 1 },
  { id: "3", title: "Task 3", in_dev: true, order: 2 },
];

describe("User Component", () => {
  it("renders greeting with username and task counts", () => {
    render(<User username="Gonza" tasks={tasksMock} />);

    // Saludo
    expect(screen.getByText(/Gonza/i)).toBeInTheDocument();

    // Encuentra el contenedor completo del texto de tareas
    const taskTextContainer = screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === "p" && 
             content.includes("tareas en curso") &&
             content.includes("pendientes");
    });

    expect(taskTextContainer).toBeInTheDocument();
    expect(taskTextContainer).toHaveTextContent("2"); // inDevTask
    expect(taskTextContainer).toHaveTextContent("1"); // pending
  });
});
