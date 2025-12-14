import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { ActionButtons } from "@/components/Prompt/ActionButtons";

describe("ActionButtons", () => {
  const onAddMock = jest.fn();
  const onCopyMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza los botones correctamente", () => {
    render(
      <ActionButtons loading={false} onAdd={onAddMock} onCopy={onCopyMock} />,
    );

    expect(screen.getByText("Mejorar")).toBeInTheDocument();
    expect(screen.getByText("Copiar")).toBeInTheDocument();
  });

  test("llama a onAdd al hacer click en 'Mejorar'", () => {
    render(
      <ActionButtons loading={false} onAdd={onAddMock} onCopy={onCopyMock} />,
    );

    fireEvent.click(screen.getByText("Mejorar"));
    expect(onAddMock).toHaveBeenCalled();
  });

  test("llama a onCopy al hacer click en 'Copiar'", () => {
    render(
      <ActionButtons loading={false} onAdd={onAddMock} onCopy={onCopyMock} />,
    );

    fireEvent.click(screen.getByText("Copiar"));
    expect(onCopyMock).toHaveBeenCalled();
  });

  test("deshabilita el botón 'Mejorar' y muestra texto 'Mejorando...' cuando loading es true", () => {
    render(
      <ActionButtons loading={true} onAdd={onAddMock} onCopy={onCopyMock} />,
    );

    const mejorarBtn = screen.getByText("Mejorando...");
    expect(mejorarBtn).toBeDisabled();
  });
});
