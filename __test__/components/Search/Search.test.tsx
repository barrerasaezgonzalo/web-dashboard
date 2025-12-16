import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Search } from "@/components/Search/Search";
import * as utils from "@/utils";

describe("Search", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza título e input", () => {
    render(<Search />);
    expect(screen.getByText("Búsqueda")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search on Google")).toBeInTheDocument();
  });

  test("actualiza el valor del input al escribir", () => {
    render(<Search />);
    const input = screen.getByPlaceholderText(
      "Search on Google",
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "React" } });
    expect(input.value).toBe("React");
  });

  test("llama a abrir Google al presionar Enter con texto", () => {
    const abrirGoogleMock = jest
      .spyOn(utils, "abrirGoogle")
      .mockImplementation(() => {});
    render(<Search />);
    const input = screen.getByPlaceholderText(
      "Search on Google",
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "React" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(abrirGoogleMock).toHaveBeenCalledWith("React", expect.any(Function));
  });

  test("no llama a abrirGoogle al presionar Enter con input vacío", () => {
    const abrirGoogleMock = jest
      .spyOn(utils, "abrirGoogle")
      .mockImplementation(() => {});
    render(<Search />);
    const input = screen.getByPlaceholderText(
      "Search on Google",
    ) as HTMLInputElement;

    fireEvent.keyDown(input, { key: "Enter" });
    expect(abrirGoogleMock).not.toHaveBeenCalled();
  });

  test("llama a abrirGoogle al hacer click en el botón", () => {
    const abrirGoogleMock = jest
      .spyOn(utils, "abrirGoogle")
      .mockImplementation(() => {});
    render(<Search />);
    const input = screen.getByPlaceholderText(
      "Search on Google",
    ) as HTMLInputElement;
    const button = screen.getByText("Enviar a Google");

    fireEvent.change(input, { target: { value: "React" } });
    fireEvent.click(button);
    expect(abrirGoogleMock).toHaveBeenCalledWith("React", expect.any(Function));
  });

  test("el input está enfocado al renderizar", () => {
    render(<Search />);
    const input = screen.getByPlaceholderText("Search on Google");
    expect(document.activeElement).toBe(input);
  });
});
