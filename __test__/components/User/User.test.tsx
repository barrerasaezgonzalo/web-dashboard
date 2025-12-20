import "@testing-library/jest-dom";
// __test__/components/User/User.test.tsx
import { render, screen } from "@testing-library/react";
import { User } from "@/components/User/User";

jest.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
    from: jest.fn(),
  },
}));

// Mocks de los hooks
jest.mock("@/hooks/useTasks", () => ({
  useTasks: jest.fn(),
}));

jest.mock("@/context/UserContext", () => ({
  useUser: jest.fn(),
}));

jest.mock("@/utils", () => ({
  getGreeting: jest.fn(),
}));

import { useTasks } from "@/hooks/useTasks";
import { getGreeting } from "@/utils";
import { useUser } from "@/context/UserContext";

describe("User Component", () => {
  it("renderiza saludo y conteo de tareas correctamente", () => {
    (useTasks as jest.Mock).mockReturnValue({
      tasks: [
        { id: "1", title: "Tarea 1", in_dev: true, order: 0 },
        { id: "2", title: "Tarea 2", in_dev: false, order: 1 },
      ],
    });

    (useUser as jest.Mock).mockReturnValue({
      userName: "Gonzalo",
    });

    (getGreeting as jest.Mock).mockReturnValue("Hola");

    render(<User />);

    // Saludo
    expect(screen.getByText(/Gonzalo!/)).toBeInTheDocument();

    // Conteo tareas
    expect(screen.getByText(/Tienes/)).toHaveTextContent(
      "Tienes 1 tareas en curso, 0 pendientes (aún a tiempo)",
    );
  });
});
