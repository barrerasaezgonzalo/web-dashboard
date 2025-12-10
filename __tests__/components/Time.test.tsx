import { render, screen } from "@testing-library/react";
import Time from "@/components/Wheater/Wheater";

describe("Time Component", () => {
  it("renders the provided clima", () => {
    render(<Time clima="Soleado" />);
    expect(screen.getByText("Soleado")).toBeInTheDocument();
  });

  it("renders elements for fecha and hora", () => {
    render(<Time clima="Nublado" />);
    // Busca los elementos <p> que contengan algo
    const ps = screen.getAllByText((content, element) => {
      return element?.tagName === "P" && content.length > 0;
    });
    expect(ps.length).toBeGreaterThanOrEqual(3); // clima + fecha + hora
  });
});
