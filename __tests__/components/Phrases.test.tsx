import { render, screen } from "@testing-library/react";
import { Phrases } from "@/components/Phrases";

const mockPhrases = Array.from({ length: 10 }).map((_, i) => ({
  titulo: `Frase ${i + 1}`,
}));

describe("Phrases Component", () => {
  it("renders title and up to 8 phrases", () => {
    render(<Phrases pharses={mockPhrases} />);
    
    // Título
    expect(screen.getByText("Frases")).toBeInTheDocument();

    // Hasta 8 frases (aleatorio)
    const renderedPhrases = screen.getAllByRole("heading", { level: 3 });
    expect(renderedPhrases.length).toBeLessThanOrEqual(8);

    // Cada frase existe en las props
    renderedPhrases.forEach((el) => {
      expect(mockPhrases.map((p) => p.titulo)).toContain(el.textContent);
    });
  });
});
