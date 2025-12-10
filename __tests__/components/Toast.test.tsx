import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Toast } from "@/components/Toast";

describe("Toast component", () => {
  it("renders message and OK button when only message is provided", () => {
    render(<Toast message="Prueba OK" />);

    expect(screen.getByText("Prueba OK")).toBeInTheDocument();
    expect(screen.getByText("OK")).toBeInTheDocument();
  });

  it("calls handleOk when OK button is clicked", () => {
    const onConfirm = jest.fn();
    render(<Toast message="Prueba OK" onConfirm={onConfirm} />);

    const okButton = screen.getByText("OK");
    fireEvent.click(okButton);

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("renders Sí and No buttons when onConfirm and onCancel are provided", () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();

    render(
      <Toast
        message="Confirmar acción"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    const yesButton = screen.getByText("Sí");
    const noButton = screen.getByText("No");

    expect(yesButton).toBeInTheDocument();
    expect(noButton).toBeInTheDocument();

    fireEvent.click(yesButton);
    fireEvent.click(noButton);

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("renders overlay with correct test id", () => {
    render(<Toast message="Overlay test" />);
    expect(screen.getByTestId("toast")).toBeInTheDocument();
  });
});
