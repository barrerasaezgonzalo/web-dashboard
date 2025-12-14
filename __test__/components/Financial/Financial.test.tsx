import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Financial from "@/components/Financial/Financial";
import { useFinancial } from "@/hooks/useFinancial";

// Mock de useFinancial
jest.mock("@/hooks/useFinancial", () => ({
  useFinancial: jest.fn(),
}));

const mockFinancial = {
  financial: {
    current: { dolar: 1000, utm: 50000, btc: 2000000, eth: 100000 },
    history: [
      {
        created_at: "2025-01-01",
        dolar: 1000,
        utm: 50000,
        btc: 2000000,
        eth: 100000,
      },
      {
        created_at: "2025-01-02",
        dolar: 1010,
        utm: 50500,
        btc: 2100000,
        eth: 105000,
      },
    ],
  },
};

describe("Financial Component", () => {
  beforeEach(() => {
    (useFinancial as jest.Mock).mockReturnValue(mockFinancial);
  });

  test("debe renderizar el título 'Indicadores Financieros'", () => {
    render(<Financial />);
    expect(screen.getByText("Indicadores Financieros")).toBeInTheDocument();
  });

  test("renderiza todos los indicadores financieros", () => {
    render(<Financial />);
    const labels = ["Dólar", "UTM", "BTC", "ETH"];
    labels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  test("renderiza SparklineChart por cada indicador", async () => {
    render(<Financial />);

    const sparklineKeys = ["dolar", "utm", "btc", "eth"];
    for (const key of sparklineKeys) {
      const chart = await screen.findByTestId(`sparkline-${key}`);
      expect(chart).toBeInTheDocument();
    }
  });
});
