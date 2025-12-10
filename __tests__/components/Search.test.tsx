import { render, screen, fireEvent } from "@testing-library/react";
import { Search } from "@/components/Search/Search";
import * as utils from "@/utils";

describe("Search Component", () => {
  it("renders title, input and button", () => {
    render(<Search />);
    expect(screen.getByText("Búsqueda")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search on Google")).toBeInTheDocument();
    expect(screen.getByText("Enviar a Google")).toBeInTheDocument();
  });

  it("updates input state when typing", () => {
    render(<Search />);
    const input = screen.getByPlaceholderText("Search on Google");
    fireEvent.change(input, { target: { value: "React Testing" } });
    expect((input as HTMLInputElement).value).toBe("React Testing");
  });

  it("calls abrirGoogle on Enter key press", () => {
    const abrirGoogleMock = jest.spyOn(utils, "abrirGoogle").mockImplementation(jest.fn());
    render(<Search />);
    const input = screen.getByPlaceholderText("Search on Google");
    fireEvent.change(input, { target: { value: "GPT" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(abrirGoogleMock).toHaveBeenCalledWith("GPT", expect.any(Function));
    abrirGoogleMock.mockRestore();
  });

  it("calls abrirGoogle on button click", () => {
    const abrirGoogleMock = jest.spyOn(utils, "abrirGoogle").mockImplementation(jest.fn());
    render(<Search />);
    const input = screen.getByPlaceholderText("Search on Google");
    fireEvent.change(input, { target: { value: "GPT" } });
    fireEvent.click(screen.getByText("Enviar a Google"));
    expect(abrirGoogleMock).toHaveBeenCalledWith("GPT", expect.any(Function));
    abrirGoogleMock.mockRestore();
  });
});
