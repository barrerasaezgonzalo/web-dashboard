import { render, screen } from "@testing-library/react";
import PerformancePanel from "@/components/PerformancePanel/PerformancePanel";
import { usePerformance } from "@/context/PerformanceContext";
import { News, TopSite } from "@/types";

// Mock del hook usePerformance
jest.mock("@/context/PerformanceContext", () => ({
    usePerformance: jest.fn(),
}));

describe("PerformancePanel", () => {
    const mockUsePerformance = usePerformance as jest.Mock;

    const mockTasks = [{ id: "1", title: "Tarea 1", order: 0 }];
    const mockClima = "Soleado";
    const mockTopSites: TopSite[] = [
        {
            id: "1", titulo: "Google", url: "http://www.google.cl",
            hits: 0
        },
        {
            id: "2", titulo: "Gmail", url: "http://www.gmail.com",
            hits: 0
        }
    ];
    const mockFinancial = {
        current: {
            dolar: 1000,
            utm: 16000,
            btc: 900000000,
            eth: 150000,
        },
        history: [
            { id: "1", created_at: '2025-12-07T00:00:00Z', dolar: 1000, utm: 16000, btc: 900000000, eth: 150000 },
            { id: "2", created_at: '2025-12-07T01:00:00Z', dolar: 1100, utm: 15500, btc: 950000000, eth: 140000 }
        ],
    };
    const mockNews: News = {
      totalArticles: 2,
      articles: [
        {
          title: "Noticia 1",
          description: "Descripción 1",
          url: "http://example.com/1",
          image: "http://example.com/1.jpg",
          source: { 
            name: "Fuente 1",
            url: "http://fuente1.com"  // <-- obligatorio según tu tipo
          },
          publishedAt: "2025-12-07T10:00:00Z",
        },
        {
          title: "Noticia 2",
          description: "Descripción 2",
          url: "http://example.com/2",
          image: "http://example.com/2.jpg",
          source: { 
            name: "Fuente 2",
            url: "http://fuente2.com"  // <-- obligatorio
          },
          publishedAt: "2025-12-07T11:00:00Z",
        },
      ],
    };

    beforeEach(() => {
        // Mock de valores del hook
        mockUsePerformance.mockReturnValue({
            lcp: 150,
            ttfb: 300,
            fcp: 100,
            cls: 0.05,
        });
    });

    it("renders all metrics with correct labels", () => {
        render(
            <PerformancePanel
                tasks={mockTasks}
                clima={mockClima}
                topSites={mockTopSites}
                financial={mockFinancial}
                news={mockNews}
            />
        );

        // Labels de métricas
        expect(screen.getByText(/Tareas/i)).toBeInTheDocument();
        expect(screen.getByText(/Clima/i)).toBeInTheDocument();
        expect(screen.getByText(/Top Sites/i)).toBeInTheDocument();
        expect(screen.getByText(/Indicadores Financieros/i)).toBeInTheDocument();
        expect(screen.getByText(/Noticias/i)).toBeInTheDocument();
        expect(screen.getByText(/LCP/i)).toBeInTheDocument();
        expect(screen.getByText(/TTFB/i)).toBeInTheDocument();
        expect(screen.getByText(/FCP/i)).toBeInTheDocument();
        expect(screen.getByText(/CLS/i)).toBeInTheDocument();
    });

    it("displays performance values with correct color classes", () => {
        render(
            <PerformancePanel
                tasks={mockTasks}
                clima={mockClima}
                topSites={mockTopSites}
                financial={mockFinancial}
                news={mockNews}
            />
        );

        // Busca un div con el color correspondiente al valor
        const lcpDiv = screen.getByText(/LCP/i).nextSibling?.firstChild as HTMLElement;
        expect(lcpDiv).toHaveClass("bg-green-500"); // LCP = 150 ms -> verde

        const ttfbDiv = screen.getByText(/TTFB/i).nextSibling?.firstChild as HTMLElement;
        expect(ttfbDiv).toHaveClass("bg-yellow-500"); // TTFB = 300 ms -> amarillo

        const fcpDiv = screen.getByText(/FCP/i).nextSibling?.firstChild as HTMLElement;
        expect(fcpDiv).toHaveClass("bg-green-500"); // FCP = 100 ms -> verde

        const clsDiv = screen.getByText(/CLS/i).nextSibling?.firstChild as HTMLElement;
        expect(clsDiv).toHaveClass("bg-green-500"); // CLS = 0.05 -> verde
    });
});
