import { FinancialProps } from "@/types";
import { render, screen } from "@testing-library/react";
import Financial from "@/components/Financial";
import { DataProvider } from "@/context/DataContext";

const FinancialMocks = {
  current: {
    dolar: 1000,
    utm: 16000,
    btc: 900000000,
    eth: 150000,
  },
  history: [
    {  id: "1", created_at: '2025-12-07T00:00:00Z', dolar: 1000, utm: 16000, btc: 900000000, eth: 150000 },
    {  id: "2", created_at: '2025-12-07T01:00:00Z', dolar: 1100, utm: 15500, btc: 950000000, eth: 140000 }
  ],
};

const defaultProps: FinancialProps = {
  financial: FinancialMocks,
  financialLoading: false,
};

describe("Financial Component", () => {
  it("renders Skeleton when financialLoading is true", () => {
    render(
      <DataProvider>
        <Financial {...defaultProps} financialLoading={true} />
      </DataProvider>
    );

    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });

  it("renders current values correctly", () => {
    render(
      <DataProvider>
        <Financial {...defaultProps} />
      </DataProvider>
    );

    expect(
      screen.getByText((content) =>
        content.includes(FinancialMocks.current.dolar.toString())
      )
    ).toBeInTheDocument();    
  });

  it("getTrend returns correct directions", () => {
    render(
      <DataProvider>
        <Financial {...defaultProps} />
      </DataProvider>
    );
    
    const last = FinancialMocks.history[1];
    const prev = FinancialMocks.history[0];

    const trendDolar = last.dolar > prev.dolar ? "up" : last.dolar < prev.dolar ? "down" : "same";
    const trendUTM = last.utm > prev.utm ? "up" : last.utm < prev.utm ? "down" : "same";

    expect(trendDolar).toBe("up"); 
    expect(trendUTM).toBe("down"); 
  });

  it("getTrend returns null if no previous history", () => {
    const mockHistory = [
      {  id: "1", created_at: '2025-12-07T00:00:00Z', dolar: 1000, utm: 16000, btc: 900000000, eth: 150000 }
    ];

    const props: FinancialProps = {
      financial: { current: FinancialMocks.current, history: mockHistory },
      financialLoading: false
    };

    render(
      <DataProvider>
        <Financial {...props} />
      </DataProvider>
    );

    const prevHistory = props.financial.history[1];
    expect(prevHistory).toBeUndefined();
  });
});
