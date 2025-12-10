import { formatCLP, abrirGpt, abrirGoogle } from "@/utils";

describe("formatCLP", () => {
  it("formats numbers correctly as CLP", () => {
    expect(formatCLP(1000)).toBe("$1.000");
    expect(formatCLP(123456789)).toBe("$123.456.789");
    expect(formatCLP("5000")).toBe("$5.000");
  });
});

describe("abrirGpt", () => {
  const mockSetPregunta = jest.fn();
  const originalOpen = window.open;

  beforeEach(() => {
    mockSetPregunta.mockReset();
    window.open = jest.fn();
  });

  afterAll(() => {
    window.open = originalOpen;
  });

  it("opens GPT URL and clears pregunta", () => {
    abrirGpt("Hola GPT", mockSetPregunta);

    expect(window.open).toHaveBeenCalledWith(
      " https://chatgpt.com/?prompt=Hola%20GPT",
      "_blank"
    );
    expect(mockSetPregunta).toHaveBeenCalledWith("");
  });

  it("does nothing if pregunta is empty", () => {
    abrirGpt("   ", mockSetPregunta);

    expect(window.open).not.toHaveBeenCalled();
    expect(mockSetPregunta).not.toHaveBeenCalled();
  });
});

describe("abrirGoogle", () => {
  const mockSetPregunta = jest.fn();
  const originalOpen = window.open;

  beforeEach(() => {
    mockSetPregunta.mockReset();
    window.open = jest.fn();
  });

  afterAll(() => {
    window.open = originalOpen;
  });

  it("opens Google search URL and clears pregunta", () => {
    abrirGoogle("busqueda test", mockSetPregunta);

    expect(window.open).toHaveBeenCalledWith(
      "https://www.google.com/search?q=busqueda%20test",
      "_blank"
    );
    expect(mockSetPregunta).toHaveBeenCalledWith("");
  });

  it("does nothing if pregunta is empty", () => {
    abrirGoogle("   ", mockSetPregunta);

    expect(window.open).not.toHaveBeenCalled();
    expect(mockSetPregunta).not.toHaveBeenCalled();
  });
});
