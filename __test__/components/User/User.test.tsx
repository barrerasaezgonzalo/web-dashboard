import "@testing-library/jest-dom";
// __test__/components/User/User.test.tsx
import { render, screen } from "@testing-library/react";
import { User } from "@/components/User/User";

// Mocks de los hooks
jest.mock("@/hooks/useTasks", () => ({
  useTasks: jest.fn(),
}));

jest.mock("@/hooks/useData", () => ({
  useData: jest.fn(),
}));

jest.mock("@/utils", () => ({
  getGreeting: jest.fn(),
}));

import { useTasks } from "@/hooks/useTasks";
import { useData } from "@/hooks/useData";
import { getGreeting } from "@/utils";

describe("User Component", () => {
  it("renderiza saludo y conteo de tareas correctamente", () => {
    (useTasks as jest.Mock).mockReturnValue({
      tasks: [
        { id: "1", title: "Tarea 1", in_dev: true, order: 0 },
        { id: "2", title: "Tarea 2", in_dev: false, order: 1 },
      ],
    });

    (useData as jest.Mock).mockReturnValue({
      user: "Gonza",
    });

    (getGreeting as jest.Mock).mockReturnValue("Hola");

    render(<User />);

    // Saludo
    expect(screen.getByText(/Hola, Gonza!/)).toBeInTheDocument();

    // Conteo tareas
    expect(screen.getByText(/Tienes/)).toHaveTextContent(
      "Tienes 1 tareas en curso y 1 pendientes.",
    );
  });
});
